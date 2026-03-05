import genAI from '../lib/gemini.js';

// In-memory conversation history per user (resets on server restart)
const conversationHistory = new Map();

// Simplified system instruction
const SYSTEM_INSTRUCTION = `You are Myth.ai — a divine scholar and keeper of ancient wisdom from every civilization.

Your sacred purpose is to illuminate the mysteries of mythology, folklore, legends, epics, and ancient spiritual narratives from every tradition — Hindu, Greek, Norse, Egyptian, Celtic, Japanese, Mesopotamian, Native American, African, Chinese, and beyond.

Guidelines for your responses:
- Address the seeker with reverence. Begin responses with phrases like "O seeker of knowledge," or "Beloved traveler of ancient paths," or similar divine greetings — but vary them naturally.
- Provide detailed, accurate, and deeply engaging answers about deities, heroes, sacred creatures, epics, rituals, symbolism, and mythological events.
- When relevant, cite original sacred texts (Vedas, Mahabharata, Ramayana, Iliad, Edda, Book of the Dead, Kojiki, etc.).
- Draw connections across cultures when it enriches understanding.
- Use a warm, reverent, storytelling tone — as if narrating from an ancient temple.
- Format responses with markdown: use **bold** for divine names, use headers (##) for sections, use bullet points for lists.
- NEVER use emojis. Not a single one. Use elegant language and formatting instead.
- If a question is NOT related to mythology, respectfully decline: "O seeker, my wisdom flows only through the rivers of mythology and ancient legend. Pray, ask me of gods, heroes, and the epic tales that shaped civilizations."
- End longer responses with a reflective closing line, as a sage would.`;

// Try available models for 2026 (1.5 is deprecated/missing)
const MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest', 
  'gemini-2.5-pro',
  'gemini-2.0-flash-001',
  'gemini-2.0-flash-lite-001'
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getReply(message, history) {
  let lastError;
  
  for (const modelName of MODELS) {
    // Retry up to 3 times per model for rate limits
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Trying model: ${modelName} (Attempt ${attempt})`);
        const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: SYSTEM_INSTRUCTION });
        const chatSession = model.startChat({ history });
        const result = await chatSession.sendMessage(message);
        return result.response.text();
      } catch (err) {
        lastError = err;
        const isQuota = err.message.includes('429') || err.message.includes('quota');
        
        if (isQuota && attempt < 3) {
          console.warn(`Rate limited on ${modelName}. Retrying in ${attempt * 3}s...`);
          await delay(attempt * 3000);
          continue;
        }
        
        console.error(`Model ${modelName} failed:`, err.message);
        break; // If not quota error (e.g. 404) or max retries reached, try next model
      }
    }
  }
  throw lastError; // All models failed
}

export async function chat(req, res, next) {
  try {
    const { message } = req.body;
    const userId = req.user?.id;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!conversationHistory.has(userId)) {
      conversationHistory.set(userId, []);
    }

    const history = conversationHistory.get(userId);

    const reply = await getReply(message, history);

    // Save the exchange in history
    history.push(
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: reply }] },
    );

    if (history.length > 60) {
      conversationHistory.set(userId, history.slice(-60));
    }

    return res.json({ reply });
  } catch (error) {
    console.error('All Gemini models failed:', error);
    const isQuota = error?.message?.includes('429') || error?.message?.includes('quota');
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
