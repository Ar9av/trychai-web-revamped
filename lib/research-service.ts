import OpenAI from 'openai';
import Exa from 'exa-js';
import {AzureOpenAI} from 'openai';

const deployment = process.env.NEXT_PUBLIC_AZURE_OPENAI_MODEL;
const openai = new AzureOpenAI({
  apiKey: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY,
  endpoint: process.env.NEXT_PUBLIC_AZURE_API_BASE,
  apiVersion: process.env.NEXT_PUBLIC_AZURE_API_VERSION,
  deployment: deployment || "",
  dangerouslyAllowBrowser: true,
});


const EXA_API_KEY = process.env.NEXT_PUBLIC_EXA_API_KEY;
// const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const exa = new Exa(EXA_API_KEY);
// const openai = new OpenAI({ apiKey: OPENAI_API_KEY , dangerouslyAllowBrowser: true});

async function getLLMResponse({
    system = "You are a helpful assistant.",
    user = "",
    temperature = 1,
    model = deployment || "",
}) {
    const completion = await openai.chat.completions.create({
        model,
        temperature,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
    });
    return completion.choices[0].message.content;
}

async function generateSearchQueries(topic: string, n: number) {
    const userPrompt = `I'm writing a research report on ${topic} and need help coming up with diverse search queries.
Please generate a list of ${n} search queries that would be useful for writing a research report on ${topic}. These queries can be in various formats, from simple keywords to more complex phrases. Do not add any formatting or numbering to the queries.`;

    const completion = await getLLMResponse({
        system: "The user will ask you to help generate some search queries. Respond with only the suggested queries in plain text with no extra formatting, each on its own line.",
        user: userPrompt,
        temperature: 1,
    });
    return completion
        .split("\n")
        .filter((s) => s.trim().length > 0)
        .slice(0, n);
}

async function getSearchResults(queries: string[], linksPerQuery = 4) {
    let results = [];
    for (const query of queries) {
        const searchResponse = await exa.searchAndContents(query, {
            numResults: linksPerQuery,
            useAutoprompt: false,
        });
        results.push(...searchResponse.results);
    }
    return results;
}

async function synthesizeReport(topic: string, searchContents: any[], contentSlice = 750) {
    const inputData = searchContents
        .map(
            (item) =>
                `--START ITEM--\nURL: ${item.url}\nCONTENT: ${item.text.slice(0, contentSlice)}\n--END ITEM--\n`,
        )
        .join("");
    return await getLLMResponse({
        system: "You are a helpful research assistant. Write a report according to the user's instructions.",
        user:
            "Input Data:\n" +
            inputData +
            `Write a two paragraph research report about ${topic} based on the provided information. Include as many sources as possible. Provide citations in the text using footnote notation ([#]). First provide the report, followed by a single "References" section that lists all the URLs used, in the format [#] <url>.`,
    });
}

export async function researchTopic(topic: string) {
    const searchQueries = await generateSearchQueries(topic, 5);
    console.log("searchQueries", searchQueries);
    const searchResults = await getSearchResults(searchQueries);
    console.log("searchResults", searchResults);
    const report = await synthesizeReport(topic, searchResults);
    return report;
}