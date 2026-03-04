import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log('API Key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');

const MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash-8b'
];

async function test() {
  for (const modelName of MODELS) {
    try {
      console.log(`\nTesting ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Hi');
      console.log(`✅ SUCCESS: ${modelName}`);
      console.log(result.response.text());
      return;
    } catch (error) {
      console.log(`❌ FAILED: ${modelName} - ${error.message.split('generateContent:')[1] || error.message}`);
    }
  }
}

test();
