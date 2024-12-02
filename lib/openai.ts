import { AzureOpenAI } from 'openai';
const deployment = process.env.AZURE_OPENAI_MODEL;
const openai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_API_BASE,
  apiVersion: process.env.AZURE_API_VERSION,
  deployment: deployment || "",
});

export async function generateResearchReport(topic: string, outline: string = "", persona: string = "") {
  try {
    const systemPrompt = `You are an expert market research analyst. Generate a detailed market research report.
    ${outline ? `Follow this outline:\n${outline}` : ''}
    ${persona ? `Target audience persona:\n${persona}` : ''}`;

    const response = await openai.chat.completions.create({
      model: deployment || "",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Generate a comprehensive market research report about: ${topic}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating research report:', error);
    throw error;
  }
}