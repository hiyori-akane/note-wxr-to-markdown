import type { Article } from '../types';

// Minimum valid GUID length for Note articles (e.g., "nfca4a1660e06" is 13 characters)
// Set to 10 to allow for some variation while filtering out invalid/empty strings
const MIN_GUID_LENGTH = 10;

// Timeout for API requests in milliseconds (5 seconds)
const API_TIMEOUT_MS = 5000;

/**
 * Fetches eyecatch image URL from Note's unofficial API
 * @param guid - The note's GUID (e.g., "nfca4a1660e06")
 * @returns The eyecatch image URL or undefined if not available
 */
async function fetchEyecatch(guid: string): Promise<string | undefined> {
  if (!guid || guid.length < MIN_GUID_LENGTH) {
    return undefined;
  }

  try {
    const apiUrl = `https://note.com/api/v3/notes/${guid}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Failed to fetch eyecatch for guid ${guid}: ${response.status}`);
      return undefined;
    }

    const data = await response.json();
    const eyecatchUrl = data?.data?.eyecatch;
    
    // Validate that the eyecatch URL is from Note's CDN
    if (eyecatchUrl && typeof eyecatchUrl === 'string' && eyecatchUrl.startsWith('https://assets.st-note.com/')) {
      return eyecatchUrl;
    }
    
    return undefined;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`Timeout fetching eyecatch for guid ${guid}`);
    } else {
      console.warn(`Error fetching eyecatch for guid ${guid}:`, error);
    }
    return undefined;
  }
}

export async function parseWXR(xmlContent: string): Promise<Article[]> {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
  
  // Check for parsing errors
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Invalid XML format');
  }

  const items = xmlDoc.querySelectorAll('item');
  const articles: Article[] = [];

  // Collect promises that will fetch eyecatch for each article
  const articlePromises: Promise<Article>[] = [];

  items.forEach((item) => {
    const postType = getElementText(item, 'wp\\:post_type') || getElementText(item, 'post_type');
    
    // Only process 'post' type items
    if (postType !== 'post') {
      return;
    }

    const status = (getElementText(item, 'wp\\:status') || getElementText(item, 'status') || 'publish') as 'publish' | 'draft';
    
    // Process both publish and draft posts
    if (status !== 'publish' && status !== 'draft') {
      return;
    }

    const title = getElementText(item, 'title') || 'Untitled';
    const link = getElementText(item, 'link') || '';
    const creator = getElementText(item, 'dc\\:creator') || getElementText(item, 'creator') || 'Unknown';
    const guid = getElementText(item, 'guid') || '';
    const content = getElementText(item, 'content\\:encoded') || getElementText(item, 'encoded') || '';
    const pubDate = getElementText(item, 'pubDate') || new Date().toISOString();
    const modifiedDate = getElementText(item, 'wp\\:post_modified') || getElementText(item, 'post_modified') || pubDate;
    const description = getElementText(item, 'description') || '';

    const extractedGuid = extractGuidFromUrl(guid, link);
    const noteIdForApi = extractNoteIdForApi(guid, link);

    // Create a promise that resolves to an article with eyecatch
    const articlePromise = fetchEyecatch(noteIdForApi).then((eyecatch) => ({
      title,
      pubDate: normalizeDate(pubDate),
      modifiedDate: normalizeDate(modifiedDate),
      guid: extractedGuid,
      link,
      creator,
      status,
      content,
      description,
      eyecatch,
    }));

    articlePromises.push(articlePromise);
  });

  // Wait for all eyecatch fetches to complete
  const articlesWithEyecatch = await Promise.all(articlePromises);
  articles.push(...articlesWithEyecatch);

  return articles;
}

function getElementText(parent: Element, tagName: string): string {
  // Try with namespace
  let element = parent.querySelector(tagName);
  
  // If not found, try without namespace (just the tag name after colon)
  if (!element && tagName.includes(':')) {
    const simpleName = tagName.split(':')[1];
    element = parent.querySelector(simpleName);
  }
  
  return element?.textContent?.trim() || '';
}

function normalizeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function extractGuidFromUrl(guid: string, link: string): string {
  // Try to extract guid from the guid field first
  if (guid) {
    const match = guid.match(/n([a-z0-9]+)$/);
    if (match) {
      return match[1];
    }
  }
  
  // Try to extract from link
  if (link) {
    const match = link.match(/n([a-z0-9]+)$/);
    if (match) {
      return match[1];
    }
  }
  
  // Return the full guid or generate a random one
  return guid || Math.random().toString(36).substring(2, 15);
}

/**
 * Extracts the full note ID (with 'n' prefix) from guid or link for API calls
 * @param guid - The GUID from WXR (e.g., "https://note.com/xxx/n/nfca4a1660e06")
 * @param link - The link from WXR
 * @returns The full note ID with 'n' prefix (e.g., "nfca4a1660e06") or empty string
 */
function extractNoteIdForApi(guid: string, link: string): string {
  // Try to extract from guid field first
  if (guid) {
    const match = guid.match(/(n[a-z0-9]+)$/);
    if (match) {
      return match[1];
    }
  }
  
  // Try to extract from link
  if (link) {
    const match = link.match(/(n[a-z0-9]+)$/);
    if (match) {
      return match[1];
    }
  }
  
  return '';
}
