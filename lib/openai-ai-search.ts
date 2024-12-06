import { z } from "zod"
import { AzureOpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

const deployment = process.env.AZURE_OPENAI_MODEL;
const openai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_API_BASE,
  apiVersion: process.env.AZURE_API_VERSION,
  deployment: deployment || "",
});


const searchParametersSchema = z.object({
    topic: z.string(),
    category: z.enum(["news", "research paper", "pdf", "All"]),
    startPublishedDate: z.date().optional()
});

export async function getSearchParameters(topic: string, data: string) {
    try {
      const response = await openai.chat.completions.create({
        model: deployment || "",
        messages: [
          {
            role: "system",
            content: `You are an expert market research analyst. Based on the information provided and to generate the report if the data is sufficient return topic as "NONE" else what would be the best topic to search for on google. Given the following topic: ${topic}, return the search parameters in the format required. `,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: zodResponseFormat(searchParametersSchema, "searchParameters"),
      });
  
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

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