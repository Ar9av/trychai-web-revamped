'use client';

import { useState } from 'react';
import { findPeople } from '@/lib/people-search';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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

export default function PeopleSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const { final_results: searchResults } = await findPeople(query);
      // Fix the type error by filtering out undefined values
      const validResults = searchResults.filter((result): result is SearchResult => result !== undefined);
      setResults(validResults.sort((a, b) => ((b.score ?? 0) - (a.score ?? 0))));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">People Search</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search query..."
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="text-center">
          <p>Searching...</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((result, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => window.open(result.url ?? '', '_blank')}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                {result.image ? (
                  <img
                    src={result.image}
                    alt={result.title ?? ''}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/avatar.png';
                    }}
                  />
                ) : (
                  <img
                    src="/avatar.png"
                    alt="Placeholder"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <CardTitle className="text-lg">
                    {result.author ?? 'Untitled'}
                  </CardTitle>
                  {result.title && (
                    <CardDescription className="text-sm">
                      {result.title}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {result.summary && (
                <p className="text-sm text-gray-600 mb-2">{result.summary}</p>
              )}
              {/* <p className="text-xs text-gray-400 truncate">{result.url}</p> */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 