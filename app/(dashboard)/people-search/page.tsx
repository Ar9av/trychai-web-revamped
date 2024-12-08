'use client';

import { useState } from 'react';
import { findPeople } from '@/lib/people-search';

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
      const { final_results: searchResults, already_searched_queries } = await findPeople(query);
      setResults(searchResults.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)));
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

      <div className="space-y-6">
        {results.map((result, index) => (
          <div key={index} className="border rounded p-4 cursor-pointer" onClick={() => window.open(result.url ?? '', '_blank')}>
            {result.image ? (
              <img
                src={result.image}
                alt={result.title ?? ''}
                className="mb-2 rounded"
                style={{ width: '100px', height: '100px' }}
                onError={(e) => {
                  e.currentTarget.src = '/avatar.png'; // Path to the general placeholder image
                }}
              />
            ) : (
              <img
                src="/avatar.png" // Path to the general placeholder image
                alt="Placeholder"
                className="mb-2 rounded"
                style={{ width: '100px', height: '100px' }}
              />
            )}
            <p className="text-sm text-gray-500">{result.author}</p>
            <h2 className="text-xl font-semibold mb-1">
              <a href={result.url ?? ''} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {result.title ?? ''}
              </a>
            </h2>
            <p className="text-sm text-gray-500">{result.summary ?? ''}</p>
            <p className="text-sm text-gray-500">{result.url ?? ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 