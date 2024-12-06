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
    const outline_json = JSON.parse(outline);
    const systemPrompt = `You are an expert market research analyst. Return the result in markdown format (Dont return any other text). Make sure to create using the data from the sources.
    Also make sure you cite the sources in markdown format.
    ${outline_json.instruction ? `Instruction:\n${outline_json.instruction}` : ''}
    ${outline_json.topic ? `Topic:\n${outline_json.topic}` : ''}
    ${outline_json.sources ? `Sources:\n${JSON.stringify(outline_json.sources)}` : ''}
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
          content: `Topic: ${topic}`,
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

export async function generateSummaryFromAzure(topic: string) {
  try {
    const response = await openai.chat.completions.create({
      model: deployment || "",
      messages: [
        {
          role: "system",
          content: `You are an expert market research analyst. Return the result in markdown format (Dont return any other text). Make sure to create using the data from the sources. Topic: ${topic}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}