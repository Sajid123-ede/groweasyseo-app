import React, { useState } from 'react';
import {
  analyzeSeo,
  getImageAltText,
  getWordCount,
  getLinkAnalysis,
} from '../utils/seoAnalyser.js'; // This path must be EXACTLY correct

function UrlInput() {
  const [url, setUrl] = useState('');
  const [seoResults, setSeoResults] = useState(null);
  const [seoScore, setSeoScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSeoResults(null);
    setSeoScore(null);

    try {
      const analysisOutput = await analyzeSeo(url);

      if (analysisOutput.error) {
        setError(analysisOutput.error);
        setIsLoading(false);
        return;
      }

      const { metaTags, htmlContent } = analysisOutput;

      // Call other analysis functions here AND store their results
      const images = getImageAltText(htmlContent);
      const wordCount = getWordCount(htmlContent);
      const { internalLinks, externalLinks } = getLinkAnalysis(htmlContent, url);

      const allResults = {
        metaTags,
        images, // Make sure these are included in allResults
        wordCount, // Make sure these are included in allResults
        links: { internalLinks, externalLinks }, // Make sure these are included in allResults
      };

      setSeoResults(allResults);
      setSeoScore(calculateSeoScore(allResults));

    } catch (err) {
      setError("An unexpected error occurred during analysis: " + err.message);
      console.error("Analysis failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
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
      </div>

      {isLoading && <p className="mt-4 text-center text-blue-600">Analyzing SEO data...</p>}
      {error && <p className="mt-4 text-center text-red-500">Error: {error}</p>}

      {seoResults && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200 w-full">
          <h3 className="text-xl font-bold mb-4 text-blue-700">SEO Analysis Report</h3>

          {seoScore && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-lg font-semibold text-blue-800">SEO Score: {seoScore.score}/100</h4>
              {seoScore.recommendations.length > 0 ? (
                <>
                  <p className="text-blue-700 mt-2">Recommendations:</p>
                  <ul className="list-disc list-inside text-sm text-blue-600">
                    {seoScore.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-blue-700 mt-2">Looks good! No specific recommendations at this time.</p>
              )}
            </div>
          )}

          <div className="mb-6 p-4 bg-white rounded-md shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold mb-2 text-gray-700">Meta Tags:</h4>
            <ul className="list-disc list-inside text-sm text-gray-800">
              <li><strong>Title:</strong> {seoResults.metaTags.title}</li>
              <li><strong>Description:</strong> {seoResults.metaTags.description}</li>
              <li><strong>Canonical URL:</strong> {seoResults.metaTags.canonical}</li>
              <li><strong>Open Graph Title:</strong> {seoResults.metaTags.ogTitle}</li>
              <li><strong>Open Graph Description:</strong> {seoResults.metaTags.ogDescription}</li>
              <li><strong>Open Graph Image:</strong> {seoResults.metaTags.ogImage}</li>
              <li><strong>H1 Tag:</strong> {seoResults.metaTags.h1}</li>
              <li><strong>Robots:</strong> {seoResults.metaTags.robots}</li>
            </ul>
          </div>

          <div className="mb-6 p-4 bg-white rounded-md shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold mb-2 text-gray-700">Content Analysis:</h4>
            <p className="text-sm text-gray-800"><strong>Word Count:</strong> {seoResults.wordCount} words</p>
          </div>

          <div className="mb-6 p-4 bg-white rounded-md shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold mb-2 text-gray-700">Image Alt Text Analysis:</h4>
            {seoResults.images && seoResults.images.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image Source</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alt Text Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-sm">
                    {seoResults.images.map((img, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{img.src}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{img.altStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-800">No images found or analyzed.</p>
            )}
          </div>

          <div className="p-4 bg-white rounded-md shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold mb-2 text-gray-700">Link Analysis:</h4>
            <p className="text-sm text-gray-800"><strong>Internal Links:</strong> {seoResults.links.internalLinks.length}</p>
            <p className="text-sm text-gray-800"><strong>External Links:</strong> {seoResults.links.externalLinks.length}</p>

            {seoResults.links.internalLinks.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600 hover:underline text-sm">Show Internal Links</summary>
                <ul className="list-disc list-inside text-xs text-gray-700 mt-1 max-h-40 overflow-y-auto">
                  {seoResults.links.internalLinks.map((link, index) => (
                    <li key={`int-${index}`} className="truncate">{link}</li>
                  ))}
                </ul>
              </details>
            )}

            {seoResults.links.externalLinks.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600 hover:underline text-sm">Show External Links</summary>
                <ul className="list-disc list-inside text-xs text-gray-700 mt-1 max-h-40 overflow-y-auto">
                  {seoResults.links.externalLinks.map((link, index) => (
                    <li key={`ext-${index}`} className="truncate">{link}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </div>
      )}
    </form>
  );
}

function calculateSeoScore(results) {
  let score = 0;
  const recommendations = [];

  const titleLength = results.metaTags.title ? results.metaTags.title.length : 0;
  if (titleLength >= 10 && titleLength <= 70) {
    score += 20;
  } else {
    recommendations.push(`Adjust title length. Current: ${titleLength} chars (Recommended: 10-70).`);
  }

  const descriptionLength = results.metaTags.description ? results.metaTags.description.length : 0;
  if (descriptionLength >= 50 && descriptionLength <= 160) {
    score += 20;
  } else {
    recommendations.push(`Adjust description length. Current: ${descriptionLength} chars (Recommended: 50-160).`);
  }

  if (results.metaTags.h1 && results.metaTags.h1 !== 'N/A') {
    score += 15;
  } else {
    recommendations.push('Ensure an H1 tag is present on the page.');
  }

  if (results.images && results.images.length > 0) {
    const imagesWithAlt = results.images.filter(img => img.hasAlt).length;
    const altTextPercentage = (imagesWithAlt / results.images.length) * 100;
    if (altTextPercentage >= 75) {
      score += 15;
    } else {
      recommendations.push(`Improve image alt text. Only ${altTextPercentage.toFixed(0)}% of images have valid alt text (Recommended: >=75%).`);
    }
  } else {
      score += 15; // If no images, it's not a penalty
  }

  if (results.wordCount >= 300) {
    score += 15;
  } else {
    recommendations.push(`Increase word count. Current: ${results.wordCount} words (Recommended: >=300).`);
  }

  if (results.metaTags.canonical && results.metaTags.canonical !== 'N/A') {
    score += 5;
  } else {
    recommendations.push('Consider adding a canonical URL to avoid duplicate content issues.');
  }

  if (results.metaTags.ogTitle !== 'N/A' && results.metaTags.ogDescription !== 'N/A' && results.metaTags.ogImage !== 'N/A') {
    score += 5;
  } else {
    recommendations.push('Add or complete Open Graph meta tags for better social sharing.');
  }

  return { score, recommendations };
}

export default UrlInput;