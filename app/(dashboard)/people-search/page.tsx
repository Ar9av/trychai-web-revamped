'use client';

import { useState } from 'react';
import { findPeople } from '@/lib/people-search';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; 
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Loader from '@/components/ui/loader';
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  const { session } = useClerk();
  const userId = session?.user?.id;
  const [savedProfiles, setSavedProfiles] = useState<Set<string>>(new Set());

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
      loadSavedProfiles();
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Error",
        description: "Search failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedProfiles = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/saved-people?userId=${userId}`);
      const data = await response.json();
      setSavedProfiles(new Set(data.map((profile: any) => profile.url)));
    } catch (error) {
      console.error('Error loading saved profiles:', error);
    }
  };

  const handleSaveProfile = async (profile: SearchResult) => {
    if (!userId || !profile.url) return;

    try {
      const response = await fetch('/api/saved-people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          person: profile,
          tags: query
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      setSavedProfiles(prev => new Set([...Array.from(prev), profile.url!]));
      toast({
        title: "Success",
        description: "Profile saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">People Search</h1>
      
      <div className="flex flex-col items-start w-full px-4 py-10">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={handleSearch}
        />
      </div>

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
          >
            <CardHeader>
              <div className="flex items-center justify-between">
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveProfile(result);
                  }}
                  disabled={!result.url || savedProfiles.has(result.url)}
                  title={savedProfiles.has(result.url!) ? "Already saved" : "Save profile"}
                >
                  {savedProfiles.has(result.url!) ? (
                    <BookmarkCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {result.summary && (
                <p className="text-sm text-gray-600 mb-2">{result.summary}</p>
              )}
              <div className="flex justify-between items-center text-xs text-gray-400">
                {result.publishedDate && (
                  <span>
                    Published: {new Date(result.publishedDate).toLocaleDateString()}
                  </span>
                )}
                {result.url && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Profile
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}