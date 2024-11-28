import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateResearchReport(topic: string, outline: string = "", persona: string = "") {
  try {
    const systemPrompt = `You are an expert market research analyst. Generate a detailed market research report.
    ${outline ? `Follow this outline:\n${outline}` : ''}
    ${persona ? `Target audience persona:\n${persona}` : ''}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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