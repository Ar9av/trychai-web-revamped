import crypto from 'crypto';
import prisma from '@/lib/prisma';

export interface ExaSearchPayload {
  topic: string;
  startDate?: string;
}

export interface ExaSearchResult {
  title: string;
  url: string;
  content: string;
  domain: string;
  published_date: string;
}

export async function getCachedExaSearch(payload: ExaSearchPayload) {
  const payloadMd5 = generatePayloadHash(payload);

  try {
    const cached = await prisma.exa_responses.findUnique({
      where: { payload_md5: payloadMd5 }
    });

    if (cached && Array.isArray(cached.response_json)) {
        return cached.response_json as unknown as ExaSearchResult[];
    }

    return null;
  } catch (error) {
    console.error('Error retrieving cached Exa search:', error);
    return null;
  }
}

export async function cacheExaSearch(payload: ExaSearchPayload, results: ExaSearchResult[]) {
  const payloadMd5 = generatePayloadHash(payload);

  try {
    await prisma.exa_responses.create({
      data: {
        payload_md5: payloadMd5,
        payload_json: JSON.parse(JSON.stringify(payload)), // Convert to a plain JSON object
        response_json: JSON.parse(JSON.stringify(results))
      }
    });
  } catch (error) {
    console.error('Error caching Exa search:', error);
  }
}

function generatePayloadHash(payload: ExaSearchPayload): string {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(payload))
    .digest('hex');
}