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

const exa = new Exa(EXA_API_KEY);

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

async function generateSearchQueries(query: string, n: number) {
    const userPrompt = `I'm writing a searching for people with query ${query} on a search engine and need help coming up with diverse search queries.
Please generate a list of ${n} search queries that would be useful finding such people. These queries can be in various formats, from simple keywords to more complex phrases. Do not add any formatting or numbering to the queries.`;

    const completion = await getLLMResponse({
        system: "The user will ask you to help generate some search queries. Respond with only the suggested queries in plain text with no extra formatting, each on its own line.",
        user: userPrompt,
        temperature: 1,
    });
    return completion?.split("\n")
        .filter((s) => s.trim().length > 0)
        .slice(0, n) ?? [];
}

async function getSearchResults(queries: string[], linksPerQuery = 10) {
    let results = [];
    for (const query of queries) {
        const searchResponse = await exa.searchAndContents(query, {
            numResults: linksPerQuery,
            useAutoprompt: false,
            summary: true,
            category: "linkedin profile"
        });
        results.push(...searchResponse.results);
    }
    return results;
}

def 

export async function findPeople(query: string) {
    const searchQueries = await generateSearchQueries(query, 2);
    console.log("searchQueries", searchQueries);
    const searchResults = await getSearchResults([query, ...searchQueries]);
    console.log("searchResult ->", searchResults);
    return searchResults;
}