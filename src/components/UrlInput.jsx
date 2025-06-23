import React, { useState } from 'react';
import { analyzeSeo } from '../utils/seoAnalyser'; // Import the new function

function UrlInput() {
  const [url, setUrl] = useState('');
  const [seoResults, setSeoResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSeoResults(null);

    try {
      const result = await analyzeSeo(url);

      if (result.error) {
        setError(result.error);
      } else {
        setSeoResults(result.metaTags);
      }
    } catch (err) {
      setError("An unexpected error occurred during analysis.");
      console.error("Analysis failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <input
        type="url"
        placeholder="Enter URL to analyze (e.g., https://example.com)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </button>

      {isLoading && <p className="mt-4 text-center text-blue-600">Analyzing SEO data...</p>}
      {error && <p className="mt-4 text-center text-red-500">Error: {error}</p>}
      {seoResults && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200 w-full">
          <h3 className="text-lg font-semibold mb-2">SEO Analysis Results:</h3>
          <ul className="list-disc list-inside text-sm">
            <li><strong>Title:</strong> {seoResults.title}</li>
            <li><strong>Description:</strong> {seoResults.description}</li>
            <li><strong>Canonical URL:</strong> {seoResults.canonical}</li>
            <li><strong>Open Graph Title:</strong> {seoResults.ogTitle}</li>
            <li><strong>Open Graph Description:</strong> {seoResults.ogDescription}</li>
            <li><strong>Open Graph Image:</strong> {seoResults.ogImage}</li>
            <li><strong>H1 Tag:</strong> {seoResults.h1}</li>
            <li><strong>Robots:</strong> {seoResults.robots}</li>
          </ul>
        </div>
      )}
    </form>
  );
}

export default UrlInput;