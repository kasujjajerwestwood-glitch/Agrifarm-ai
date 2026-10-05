import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface VercelReq extends IncomingMessage {
  body?: any;
  query?: Record<string, string | string[]>;
  method?: string;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelRes extends ServerResponse {
  status: (code: number) => VercelRes;
  json: (data: any) => void;
  setHeader: (name: string, value: string | string[]) => this;
}

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured in Vercel environment variables.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON request body.' });
    }
  }

  const { message, history = [], attachedImage, farmContext, language } = body || {};

  if (!message && !attachedImage) {
    return res.status(400).json({ error: 'Message or image is required.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `You are Agrifarm AI, an expert agricultural consultant, pathologist, and agronomist for smallholder and commercial farmers. Provide actionable, practical advice for tropical crops (maize, beans, tomatoes, coffee, bananas, cassava). Farmer Language: ${language || 'en'}. Format responses with clear bullet points.`,
    });

    const parts: any[] = [];
    if (attachedImage?.base64) {
      const cleanBase64 = attachedImage.base64.includes(',')
        ? attachedImage.base64.split(',')[1]
        : attachedImage.base64;
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: attachedImage.mimeType || 'image/jpeg',
        },
      });
    }

    const contextPrefix = farmContext
      ? `[FARM CONTEXT: ${farmContext.farmName || ''}, Location: ${farmContext.location || ''}, Crops: ${farmContext.crops || ''}]\n`
      : '';

    parts.push({ text: `${contextPrefix}${message || 'Please analyze this crop photograph.'}` });

    const result = await model.generateContent(parts);
    const response = await result.response;

    return res.status(200).json({
      reply: response.text() || 'Unable to generate advice at this moment.',
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({
      error: 'Failed to process chat consultation: ' + (err.message || 'Internal error'),
    });
  }
}
