import { NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';

const deployment = process.env.AZURE_OPENAI_MODEL;
const openai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_API_BASE,
  apiVersion: process.env.AZURE_API_VERSION,
  deployment: deployment || "",
});

export async function POST(req: Request) {
  try {
    const { topic, sources } = await req.json();

    const prompt = `Based on the following sources about "${topic}", generate a detailed outline for a market research report.
    
Sources:
${sources.map((s: any) => `Title: ${s.title}\nContent: ${s.content}\n`).join('\n')}

Generate a structured outline with main sections and subsections. Focus on key insights, trends, and analysis points from the sources.`;

    const response = await openai.chat.completions.create({
      model: deployment || "",
      messages: [
        {
          role: "system",
          content: "You are an expert market research analyst. Generate a detailed outline for a market research report based on the provided sources.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return NextResponse.json({ outline: response.choices[0].message.content });
  } catch (error) {
    console.error('Error generating outline:', error);
    return NextResponse.json(
      { error: 'Failed to generate outline' },
      { status: 500 }
    );
  }
}