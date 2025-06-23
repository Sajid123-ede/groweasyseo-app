// src/utils/seoAnalyser.js

// analyzeSeo is exported directly as an async function
export async function analyzeSeo(url) {
  if (!url) {
    return { error: "URL is required." };
  }

  try {
    const response = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const contents = data.contents;
    const parser = new DOMParser();
    const doc = parser.parseFromString(contents, 'text/html');

    const metaTags = {
      title: doc.querySelector('title')?.innerText || 'N/A',
      description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || 'N/A',
      canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || 'N/A',
      ogTitle: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || 'N/A',
      ogDescription: doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || 'N/A',
      ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || 'N/A',
      h1: doc.querySelector('h1')?.innerText || 'N/A',
      robots: doc.querySelector('meta[name="robots"]')?.getAttribute('content') || 'N/A',
    };

    return { success: true, metaTags, htmlContent: doc };
  } catch (error) {
    console.error("Error analyzing SEO:", error);
    return { error: error.message };
  }
}

// These functions are NOT exported here, they are listed in the collective export below
function getImageAltText(doc) {
  const images = doc.querySelectorAll('img');
  const imageAnalysis = [];
  images.forEach(img => {
    const src = img.src || 'N/A';
    const alt = img.alt;
    const hasAlt = !!alt;
    imageAnalysis.push({ src, alt, hasAlt, altStatus: hasAlt ? 'Present' : 'Missing' });
  });
  return imageAnalysis;
}

function getWordCount(doc) {
  const bodyText = doc.body ? doc.body.innerText : '';
  const words = bodyText.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

// ... (keep analyzeSeo, getImageAltText, getWordCount as they are)

// ... (keep analyzeSeo, getImageAltText, getWordCount as they are)

function getLinkAnalysis(doc, baseUrl) {
  const links = doc.querySelectorAll('a[href]');
  const internalLinks = [];
  const externalLinks = [];

  let baseHostname;
  try {
    // Parse the base URL to get its hostname
    baseHostname = new URL(baseUrl).hostname;
    console.log("Base URL for link analysis:", baseUrl);
    console.log("Base Hostname for comparison:", baseHostname);
  } catch (e) {
    console.warn(`Invalid base URL provided for link analysis: ${baseUrl}`, e);
    return { internalLinks: [], externalLinks: [] };
  }

  links.forEach(link => {
    const href = link.href;

    // Skip empty or mailto/tel/javascript links
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      return;
    }

    try {
      // Create a URL object for the current link's href.
      // Crucially, pass baseUrl as the second argument to correctly resolve relative paths.
      const url = new URL(href, baseUrl);
      const linkHostname = url.hostname;

      // Log for debugging:
      // console.log(`Processing link: ${href}`);
      // console.log(`  Resolved URL: ${url.toString()}`);
      // console.log(`  Link Hostname: ${linkHostname}`);

      // Normalize hostnames to remove "www." prefix for consistent comparison, if desired.
      // This step is often useful but can be omitted if you strictly differentiate www vs non-www.
      const normalizedBaseHostname = baseHostname.startsWith('www.') ? baseHostname.substring(4) : baseHostname;
      const normalizedLinkHostname = linkHostname.startsWith('www.') ? linkHostname.substring(4) : linkHostname;

      // Check if the link's hostname matches the base hostname exactly,
      // or if it's a subdomain of the base hostname.
      if (normalizedLinkHostname === normalizedBaseHostname || normalizedLinkHostname.endsWith(`.${normalizedBaseHostname}`)) {
        internalLinks.push(href);
      } else {
        externalLinks.push(href);
      }
    } catch (e) {
      // console.warn(`Could not parse URL from href: ${href} (on base ${baseUrl}), skipping. Error:`, e);
    }
  });

  console.log("Final Internal Links Found:", internalLinks);
  console.log("Final External Links Found:", externalLinks);
  return { internalLinks, externalLinks };
}

// Ensure the collective export statement is at the very bottom
export { getImageAltText, getWordCount, getLinkAnalysis };