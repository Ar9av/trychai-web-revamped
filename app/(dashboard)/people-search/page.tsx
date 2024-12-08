'use client';

import { useState } from 'react';
import { findPeople } from '@/lib/people-search';

interface SearchResult {
  url: string;
  title: string;
  text: string;
  highlights: {
    text: string[];
  };
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
      const searchResults = await findPeople(query);
      setResults(searchResults);
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
          <div key={index} className="border rounded p-4">
            <h2 className="text-xl font-semibold mb-2">
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {result.title}
              </a>
            </h2>
            {result.highlights?.text.map((highlight, i) => (
              <p key={i} className="text-gray-600 mb-2">
                ...{highlight}...
              </p>
            ))}
            <p className="text-sm text-gray-500">{result.url}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 