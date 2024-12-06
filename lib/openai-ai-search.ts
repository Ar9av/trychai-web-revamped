import { AzureOpenAI } from 'openai';
const deployment = process.env.AZURE_OPENAI_MODEL;
const openai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_API_BASE,
  apiVersion: process.env.AZURE_API_VERSION,
  deployment: deployment || "",
});

export async function generateRelevantIndexesFromAzure(topic: string, data: string) {
  try {
    const response = await openai.chat.completions.create({
      model: deployment || "",
      messages: [
        {
          role: "system",
          content: `You are an expert market research analyst. Given the following list of articles: ${data}, return a list of relevant indexes that match the topic: ${topic}. Return in javascript array format.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const result = response.choices[0].message.content;
    const regex = /\[.*?\]/g;
    const matches = result?.match(regex);
    return matches ? matches.map(match => JSON.parse(match)) : [];
  } catch (error) {
    console.error('Error generating relevant indexes:', error);
    throw error;
  }
}