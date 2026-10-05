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
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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

  try {
    // Parse body if not automatically parsed by runtime
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON request body.' });
      }
    }

    const { crop, cropStage, location, symptoms, images, language } = body || {};

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        error: 'At least one plant photograph is required for analysis.',
      });
    }

    // Initialize GoogleGenerativeAI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    // Prepare image parts for the multimodal model
    const imageParts = images.map((img: { base64: string; mimeType?: string; label?: string }) => {
      const cleanBase64 = img.base64.includes(',') ? img.base64.split(',')[1] : img.base64;
      return {
        inlineData: {
          data: cleanBase64,
          mimeType: img.mimeType || 'image/jpeg',
        },
      };
    });

    const langName =
      language === 'lg' ? 'Luganda (Oluganda)' : language === 'sw' ? 'Kiswahili' : 'English';

    const promptText = `
You are Agrifarm AI, an expert agricultural pathologist, agronomist, and entomologist decision-support system.
Analyze the provided plant photograph(s) for crop health, visible diseases (fungal, bacterial, viral), pest infestations, nutrient deficiencies, physiological disorders, or environmental stresses.

CROP CONTEXT PROVIDED BY FARMER:
- Crop Type / Specie: ${crop || 'Not specified (identify from image)'}
- Crop Growth Stage: ${cropStage || 'Not specified'}
- Farm Location / Region: ${location || 'Not specified'}
- Farmer's Observed Symptoms & Notes: ${symptoms || 'None reported'}

LANGUAGE REQUIREMENT:
The farmer's chosen interface language is "${langName}" (code: "${language || 'en'}").
${
  language === 'lg'
    ? 'Provide all text values (crop name, issue, symptoms, cause, nextSteps, prevention, imageQualityFeedback) in natural Luganda (Oluganda).'
    : language === 'sw'
    ? 'Provide all text values (crop name, issue, symptoms, cause, nextSteps, prevention, imageQualityFeedback) in fluent, natural Kiswahili.'
    : 'Provide all text values in clear, farmer-accessible English.'
}

DIAGNOSIS REQUIREMENTS:
1. Return ONLY a valid JSON object matching the following structure exactly:
{
  "crop": "Common crop name",
  "cropScientificName": "Botanical / scientific name",
  "healthStatus": "One of: Healthy | Attention Needed | Disease Detected | Pest Infestation | Nutrient Deficiency | Environmental Stress",
  "possibleIssue": "Primary identified diagnosis name",
  "confidence": 85,
  "severity": "Low | Medium | High | Critical",
  "observedSymptoms": ["Visual sign 1", "Visual sign 2"],
  "possibleCauses": ["Primary pathogen or environmental trigger"],
  "otherPossibilities": ["Alternative differential diagnosis"],
  "recommendedNextSteps": ["Immediate action 1", "Immediate action 2"],
  "prevention": ["Preventative field practice 1", "Preventative field practice 2"],
  "organicManagement": ["Organic bio-control or cultural remedy"],
  "chemicalManagement": ["GAP chemical guidance if severe"],
  "additionalInfoNeeded": "Follow-up photos or checks if uncertain",
  "imageQualityFeedback": "Lighting or focus feedback",
  "sources": [
    {
      "organization": "FAO / CABI Plantwise / NARO Uganda",
      "title": "Reference factsheet or manual",
      "snippet": "Agronomic finding"
    }
  ],
  "disclaimer": "Agrifarm AI is an automated advisory tool. Severe infestations should be verified with an agricultural extension officer."
}

2. Only diagnose what is visually verified in the photos.
3. Realistic confidence percentage (typically 60-95%, never 100%).
4. Cite recognized agricultural bodies (FAO, CABI Plantwise, CGIAR/IITA, NARO Uganda).
`;

    const result = await model.generateContent([promptText, ...imageParts]);
    const response = await result.response;
    const responseText = response.text() || '{}';

    let parsedData: any = {};
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Fallback cleanup if markdown blocks leaked
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    if (!parsedData.disclaimer) {
      parsedData.disclaimer =
        'Agrifarm AI is an automated advisory tool. Severe crop issues should be verified with an agricultural extension officer.';
    }

    return res.status(200).json({
      success: true,
      analysis: parsedData,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error in /api/scan-plant serverless handler:', err);
    return res.status(500).json({
      error: 'Failed to analyze plant photograph: ' + (err.message || 'Internal error'),
    });
  }
}
