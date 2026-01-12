import type { Article } from '../types';

export function parseWXR(xmlContent: string): Article[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
  
  // Check for parsing errors
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Invalid XML format');
  }

  const items = xmlDoc.querySelectorAll('item');
  const articles: Article[] = [];

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

    articles.push({
      title,
      pubDate: normalizeDate(pubDate),
      modifiedDate: normalizeDate(modifiedDate),
      guid: extractGuidFromUrl(guid, link),
      link,
      creator,
      status,
      content,
      description,
    });
  });

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
