import Exa from 'exa-js';
import {AzureOpenAI} from 'openai';

interface SearchResult {
    author?: string | null | undefined;
    id?: string | null;
    image?: string | null;
    publishedDate?: string | null;
    score?: number | null;
    summary?: string | null;
    title?: string | null;
    url?: string | null;
  }

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

async function generateSearchQueries(query: string, n: number, already_searched_queries: string[]) {
    const userPrompt = `I'm searching for people with query ${query} on a search engine and need help coming up with diverse search queries.
Please generate a list of ${n} search queries (keyword based) that would be useful finding such people. We have already searched for ${already_searched_queries.join(", ")}. These queries can be in various formats, from simple keywords to more complex phrases. Do not add any formatting or numbering to the queries.`;

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
            useAutoprompt: true,
            summary: true,
            category: "linkedin profile"
        });
        results.push(...searchResponse.results);
    }
    return results;
}

async function extractIndexes(text: string) {
    // Regular expression to extract the part of the string with the indexes
    const regex = /(\d+(?:,\s*\d+)*)/;
  
    // Extract indexes part from the text
    const match = text.match(regex);
  
    if (match) {
      // Split the extracted string by commas and map them to numbers
      return match[1].split(',').map(index => parseInt(index.trim(), 10));
    } else {
      return [];
    }
  }
  
  
async function filterResults(query: string, searchContents: any[]) {
    const inputData = searchContents
        .map((item, index) =>
            `--START ITEM ${index}--\nURL: ${item.url}\n--\nTitle : ${item.title}\nSummary of profile: ${item.summary}\n--END ITEM--\n`,
        )
        .join("");
    return await getLLMResponse({
        system: "You are a helpful filter assistant. Filter the linkedin profile results based on the user's instructions. Just return the indexes of the results that are relevant to the user's query.",
        user:
            "Input Data:\n" +
            `For the query: ${query}` +
            `\n\nresults:\n${inputData}`,
        temperature: 0,
    });
    
}


export async function findPeople(query: string) {
    let already_searched_queries = [];
    let final_results = [];
    let loopCount = 0; // Initialize a counter for the loop

    while (final_results.length < 8 && loopCount < 3) { // Add condition to stop after 3 iterations
        console.log("already_searched_queries", already_searched_queries);
        const searchQueries = await generateSearchQueries(query, 2, already_searched_queries);
        console.log("searchQueries", searchQueries);
        const searchResults = await getSearchResults([query, ...searchQueries]);
        const combinedResults: SearchResult[] = [...searchResults, ...final_results].filter((result): result is SearchResult => result !== undefined);
        const dedupedSearchResults = Array.from(new Set(combinedResults.map(result => result.url)))
            .map(url => combinedResults.find(result => result.url === url));
        console.log("searchResult ->", dedupedSearchResults);
        const filteredResults = await filterResults(query, dedupedSearchResults);
        console.log("filteredResults ->", filteredResults);
        const indexes = await extractIndexes(filteredResults ?? "");
        console.log("indexes ->", indexes);
        const filteredSearchResults = indexes.map((index) => dedupedSearchResults[index]);
        console.log("filteredSearchResults ->", filteredSearchResults);
        
        final_results.push(...filteredSearchResults);
        already_searched_queries.push(...searchQueries);
        loopCount++; // Increment the loop counter
    }
    
    return { final_results, already_searched_queries };
}