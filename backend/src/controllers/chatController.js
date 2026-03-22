import genAI from '../lib/gemini.js';

// In-memory conversation history per user (resets on server restart)
const conversationHistory = new Map();

// Keep instruction concise to reduce prompt processing time.
const SYSTEM_INSTRUCTION = `You are Myth.ai, a reverent mythology scholar.
Answer only mythology/epic/folklore questions across world traditions.
Use concise markdown (short headers, bullets, **names**) and no emojis.
If unrelated to mythology, politely decline in one line.`;

// Fail-fast model strategy: one primary, one fallback.
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash-001'];
const MAX_ATTEMPTS_PER_MODEL = 2;
const MODEL_TIMEOUT_MS = 12000;
const MODEL_COOLDOWN_MS = 2 * 60 * 1000;
const MAX_HISTORY_ITEMS = 24; // 12 exchanges
const CONTEXT_HISTORY_ITEMS = 16; // 8 exchanges sent to model
const modelCooldownUntil = new Map();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function wantsBriefAnswer(text) {
  if (!text) return false;
  return /\b(brief|briefly|short|in short|summar(y|ise|ize)|tl;dr|few lines|concise|one line|2 lines|3 lines)\b/i.test(text);
}

function buildModelMessage(userMessage) {
  if (!wantsBriefAnswer(userMessage)) return userMessage;

  return [
    userMessage,
    '',
    'Additional instruction: respond briefly in 3-5 lines only.',
  ].join('\n');
}

function isQuotaError(err) {
  const msg = err?.message || '';
  return msg.includes('429') || msg.toLowerCase().includes('quota');
}

function getActiveModels() {
  const now = Date.now();
  const active = MODELS.filter((name) => (modelCooldownUntil.get(name) || 0) <= now);
  // If all models are on cooldown, still try in normal order.
  return active.length ? active : MODELS;
}

function putModelOnCooldown(modelName) {
  modelCooldownUntil.set(modelName, Date.now() + MODEL_COOLDOWN_MS);
}

async function withTimeout(promise, ms, label) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
}

async function getReply(message, history) {
  let lastError;
  const activeModels = getActiveModels();
  
  for (const modelName of activeModels) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
      try {
        console.log(`Trying model: ${modelName} (Attempt ${attempt})`);
        const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: SYSTEM_INSTRUCTION });
        const chatSession = model.startChat({ history });
        const result = await withTimeout(
          chatSession.sendMessage(message),
          MODEL_TIMEOUT_MS,
          `Model ${modelName}`,
        );
        modelCooldownUntil.delete(modelName);
        return { reply: result.response.text(), modelUsed: modelName };
      } catch (err) {
        lastError = err;
        const isQuota = isQuotaError(err);
        
        if (isQuota && attempt < MAX_ATTEMPTS_PER_MODEL) {
          console.warn(`Rate limited on ${modelName}. Retrying in ${attempt * 2}s...`);
          await delay(attempt * 2000);
          continue;
        }

        putModelOnCooldown(modelName);
        
        console.error(`Model ${modelName} failed:`, err.message);
        break;
      }
    }
  }
  throw lastError;
}

async function getReplyStream(message, history, onChunk) {
  let lastError;
  const activeModels = getActiveModels();

  for (const modelName of activeModels) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
      let startedStreaming = false;
      const streamStartedAt = Date.now();
      let firstChunkMs = null;

      try {
        console.log(`Streaming with model: ${modelName} (Attempt ${attempt})`);
        const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: SYSTEM_INSTRUCTION });
        const chatSession = model.startChat({ history });
        const result = await withTimeout(
          chatSession.sendMessageStream(message),
          MODEL_TIMEOUT_MS,
          `Streaming start ${modelName}`,
        );

        let fullReply = '';
        for await (const chunk of result.stream) {
          const text = chunk?.text?.() || '';
          if (!text) continue;

          startedStreaming = true;
          if (firstChunkMs === null) {
            firstChunkMs = Date.now() - streamStartedAt;
          }
          fullReply += text;
          onChunk(text);
        }

        modelCooldownUntil.delete(modelName);
        return { reply: fullReply, modelUsed: modelName, firstChunkMs };
      } catch (err) {
        lastError = err;
        const isQuota = isQuotaError(err);

        if (!startedStreaming && isQuota && attempt < MAX_ATTEMPTS_PER_MODEL) {
          console.warn(`Rate limited on ${modelName}. Retrying in ${attempt * 2}s...`);
          await delay(attempt * 2000);
          continue;
        }

        putModelOnCooldown(modelName);

        console.error(`Streaming model ${modelName} failed:`, err.message);

        // If streaming already started, we should not silently retry and mix partial outputs.
        if (startedStreaming) {
          throw err;
        }

        break;
      }
    }
  }

  throw lastError;
}

function writeNdjson(res, payload) {
  if (res.writableEnded || res.destroyed) return;
  res.write(`${JSON.stringify(payload)}\n`);
}

export async function chat(req, res, next) {
  try {
    const requestStartedAt = Date.now();
    const { message } = req.body;
    const userId = req.user?.id;
    const modelMessage = buildModelMessage(message);
    const stream = req.query?.stream === '1';

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!conversationHistory.has(userId)) {
      conversationHistory.set(userId, []);
    }

    const history = conversationHistory.get(userId);
    const modelHistory = history.slice(-CONTEXT_HISTORY_ITEMS);

    if (stream) {
      res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      if (typeof res.flushHeaders === 'function') {
        res.flushHeaders();
      }

      const { reply, modelUsed, firstChunkMs } = await getReplyStream(modelMessage, modelHistory, (textChunk) => {
        if (res.writableEnded || res.destroyed) return;
        // Push partial output immediately for fastest perceived response.
        writeNdjson(res, { type: 'chunk', text: textChunk });
      });

      history.push(
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: reply }] },
      );

      if (history.length > MAX_HISTORY_ITEMS) {
        conversationHistory.set(userId, history.slice(-MAX_HISTORY_ITEMS));
      }

      console.log('[chat.latency]', {
        userId,
        stream: true,
        model: modelUsed,
        first_chunk_ms: firstChunkMs,
        total_ms: Date.now() - requestStartedAt,
      });

      if (!res.writableEnded && !res.destroyed) {
        writeNdjson(res, { type: 'done', reply });
        res.end();
      }
      return;
    }

    const { reply, modelUsed } = await getReply(modelMessage, modelHistory);

    // Save the exchange in history
    history.push(
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: reply }] },
    );

    if (history.length > MAX_HISTORY_ITEMS) {
      conversationHistory.set(userId, history.slice(-MAX_HISTORY_ITEMS));
    }

    console.log('[chat.latency]', {
      userId,
      stream: false,
      model: modelUsed,
      total_ms: Date.now() - requestStartedAt,
    });

    return res.json({ reply });
  } catch (error) {
    console.error('All Gemini models failed:', error);
    const isQuota = error?.message?.includes('429') || error?.message?.includes('quota');

    if (req.query?.stream === '1') {
      if (!res.headersSent) {
        res.status(isQuota ? 429 : 500);
        res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
      }
      writeNdjson(res, {
        type: 'error',
        message: isQuota
          ? 'Myth.ai is overwhelmed right now. Please wait a moment.'
          : 'Failed to answer. Please try again.',
      });
      return res.end();
    }

    return res.status(isQuota ? 429 : 500).json({ 
      message: isQuota 
        ? 'Myth.ai is overwhelmed right now. Please wait a moment.' 
        : 'Failed to answer. Please try again.' 
    });
  }
}

export async function clearHistory(req, res) {
  const userId = req.user?.id;
  conversationHistory.delete(userId);
  return res.json({ message: 'Conversation history cleared' });
}
