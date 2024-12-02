import Exa from 'exa-js';
import { ExaSearchPayload, ExaSearchResult } from '../cache/exa-cache';

const exa = new Exa(process.env.NEXT_PUBLIC_EXA_API_KEY);

export async function performExaSearch(payload: ExaSearchPayload): Promise<ExaSearchResult[]> {
  try {
    const result = await exa.searchAndContents(
      payload.topic,
      {
        type: "auto",
        useAutoprompt: true,
        numResults: 20,
        summary: true,
        ...(payload.startDate && { startPublishedDate: payload.startDate })
      }
    );

    return result.results.map(item => ({
      title: item.title || "",
      url: item.url || "",
      content: item.summary || "",
      domain: new URL(item.url).hostname.replace('www.', '')
    }));
  } catch (error) {
    console.error('Error performing Exa search:', error);
    throw error;
  }
}