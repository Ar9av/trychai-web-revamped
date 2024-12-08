'use client';

import { useState } from 'react';
import { findPeople } from '@/lib/people-search';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; 
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Loader from '@/components/ui/loader';

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

  const placeholders = [
    "Founders in Bay Area working on AI",
    "Ex Meta founders in SF",
    "Data Engineers in India",
    "People with React and Go experience",
    "HRBP people in Bangalore"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const { final_results } = await findPeople(query);
      console.log("final_results", final_results);
      const validResults = final_results.filter((result): result is SearchResult => result !== undefined);
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
      
      <div className="flex flex-col items-start w-full px-4 py-10">
        {/* <h2 className="mb-10 sm:mb-10 text-xl sm:text-5xl dark:text-white text-black">
          People Search
        </h2> */}
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={handleSearch}
        />
      </div>

      {/* <hr className="my-8 border-t border-gray-300" /> */}
      {isLoading && (
        <div className="flex justify-center py-5">
          <Loader />
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