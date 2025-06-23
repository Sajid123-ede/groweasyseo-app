export async function analyzeSeo(url) {
  if (!url) {
    return { error: "URL is required." };
  }

  try {
    // Using a proxy to bypass CORS issues for fetching external content
    // In a production environment, you would typically have your own backend proxy
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const contents = data.contents;

    const parser = new DOMParser();
    const doc = parser.parseFromString(contents, 'text/html');

    const metaTags = {};

    metaTags.title = doc.querySelector('title')?.innerText || 'N/A';
    metaTags.description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || 'N/A';
    metaTags.canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || 'N/A';
    metaTags.ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || 'N/A';
    metaTags.ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || 'N/A';
    metaTags.ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || 'N/A';
    metaTags.h1 = doc.querySelector('h1')?.innerText || 'N/A';
    metaTags.robots = doc.querySelector('meta[name="robots"]')?.getAttribute('content') || 'N/A';

    return { success: true, metaTags };

  } catch (error) {
    console.error("Error analyzing SEO:", error);
    return { error: error.message };
  }
}