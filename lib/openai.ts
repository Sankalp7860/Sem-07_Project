import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export interface JobFraudResult {
  result: 'Safe' | 'Possibly Fake' | 'Likely Fake';
  scamScore: number;
  redFlags: string[];
  recommendations: string[];
  explanation: string;
}

const FRAUD_DETECTION_PROMPT = `Analyze the following job posting text for signs of being a scam or fraudulent.

Job Posting Text: "{job_description}"

First, determine if you have enough information (like a company name, a clear job description, and responsibilities) to make a reasonable analysis.

Look for red flags such as:
- Vague or generic job descriptions without specific responsibilities
- Unprofessional language, grammar, or spelling errors
- Pressure to act quickly or limited-time offers
- Requests for personal financial information, upfront fees, or payment for training
- Unrealistically high salary for the role described or vague compensation
- No verifiable company information or contact details
- Work-from-home schemes with unrealistic promises
- Requests to use personal accounts, equipment, or handle money
- Missing job location or suspicious remote-only postings
- Generic company names or suspicious email domains
- Too-good-to-be-true benefits or promises
- Investment or training fee requirements

Provide your analysis as a JSON object with these exact keys:
{
    "result": "Safe", "Possibly Fake", or "Likely Fake",
    "scamScore": <number from 0 to 100>,
    "redFlags": [],
    "recommendations": [],
    "explanation": ""
}

Be thorough and specific. Only respond with valid JSON, no other text.`;

export async function analyzeJobPosting(
  jobDescription: string
): Promise<JobFraudResult> {
  try {
    const systemPrompt = 'You are an expert fraud detection analyst specializing in identifying fake job postings. Always respond with valid JSON.';
    const userPrompt = FRAUD_DETECTION_PROMPT.replace(
      '{job_description}',
      jobDescription
    );

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (remove markdown code blocks if present)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
    const jsonText = jsonMatch[1].trim();
    
    const parsedResult: JobFraudResult = JSON.parse(jsonText);

    if (!parsedResult.result || parsedResult.scamScore === undefined) {
      throw new Error('Invalid response format');
    }

    return parsedResult;
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse AI response');
    }
    throw new Error(error.message || 'Failed to analyze job posting');
  }
}
