"use client";
import { useState } from 'react';
import { researchTopic } from '@/lib/research-service';
import { MuiMarkdown } from 'mui-markdown';
import Loader from '@/components/ui/loader';

export default function AISearchPage() {
  const [topic, setTopic] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');

  const handleResearch = async () => {
    if (!topic) return;
    
    setLoading(true);
    try {
      const result = await researchTopic(topic);
      setReport(result || 'No results found');
    } catch (error) {
      console.error('Research error:', error);
      setReport('An error occurred while researching the topic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI Research</h1>
      
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter research topic..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleResearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Researching...' : 'Research'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <Loader />
        </div>
      ) : report ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Research Report</h2>
          {/* <div className={`whitespace-pre-wrap p-6 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}> */}
            <MuiMarkdown>
              {report}
            </MuiMarkdown>
          {/* </div> */}
        </div>
      ) : null}
    </div>
  );
}