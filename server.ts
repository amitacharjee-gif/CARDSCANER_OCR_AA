import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Health and capability check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Card scanning & OCR endpoint with Gemini 2.5 Flash
app.post('/api/scan-card', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 data' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY not configured',
        fallback: true
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Clean up base64 prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const prompt = `Analyze this scanned card image (business card, ID badge, membership card, credit/corporate card, or certificate).
Extract the following optical and semantic information with high precision:
- name: Full name of the person or cardholder
- title: Job title or role (e.g., "Chief Technology Officer", "Senior Lead Architect")
- company: Organization or company name
- phone: Direct contact phone number
- email: Email address
- website: Clean website URL
- address: Physical mailing or street address
- category: One of "business", "id_badge", "membership", "finance", "medical", "other"
- cardNumber: Any unique card ID, member ID, or visible badge number
- expiryDate: Expiration or valid-thru date if present (e.g., "12/28", "2027-06")
- department: Department or division (e.g. "Platform Engineering", "Global Operations")
- notes: Any additional tagline, slogan, or accreditation visible on the card
- rawText: Verbatim transcription of all text detected on the card separated by newlines
- confidence: Overall OCR confidence score from 85 to 99
- fieldConfidences: Object mapping field names to confidence percentage (e.g. {"name": 98, "email": 99})

Respond ONLY with valid, raw JSON matching this structure. Do not use markdown fences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || 'image/jpeg',
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Clean possible fences
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      card: parsedData,
    });
  } catch (error: any) {
    console.error('OCR Card Scan error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze card image',
      fallback: true
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CardScan Server] running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
