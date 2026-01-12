import TurndownService from 'turndown';
import type { Article, ConvertedArticle, PathMode } from '../types';

// Image conversion constants
const NOTE_IMAGE_BASE_URL = 'https://assets.st-note.com/img';
const NOTE_IMAGE_WIDTH = 2000;
const NOTE_IMAGE_HEIGHT = 2000;
const NOTE_IMAGE_FIT = 'bounds';
const NOTE_IMAGE_QUALITY = 85;

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
});

// Preserve iframes and other embeds
turndownService.addRule('iframe', {
  filter: 'iframe',
  replacement: (_content, node) => {
    const element = node as HTMLElement;
    return `<iframe src="${element.getAttribute('src') || ''}" width="${element.getAttribute('width') || ''}" height="${element.getAttribute('height') || ''}"></iframe>`;
  },
});

// Handle code blocks with language
turndownService.addRule('codeBlock', {
  filter: (node) => {
    return node.nodeName === 'PRE' && node.firstChild?.nodeName === 'CODE';
  },
  replacement: (content, node) => {
    const codeElement = node.firstChild as HTMLElement;
    const className = codeElement?.className || '';
    const languageMatch = className.match(/language-(\w+)/);
    const language = languageMatch ? languageMatch[1] : '';
    
    return '\n```' + language + '\n' + (codeElement?.textContent || content) + '\n```\n';
  },
});

// Helper function to convert protocol-relative URLs to https
function convertProtocolRelativeUrls(content: string): string {
  return content.replace(/src="\/\//g, 'src="https://');
}

export function convertToMarkdown(article: Article, pathMode: PathMode = 'relative'): ConvertedArticle {
  let processedContent = convertProtocolRelativeUrls(article.content);
  
  if (pathMode === 'absolute') {
    // Convert /assets/ image URLs to Note's direct image links
    processedContent = processedContent.replace(
      /src="\/assets\/[^_]+_([^"]+)"/g,
      (_match, imageFile) => {
        // imageFile contains something like "1767620412-ZvgjStEu8PTrA9eWaYbRc5dQ.png"
        const queryParams = `width=${NOTE_IMAGE_WIDTH}&height=${NOTE_IMAGE_HEIGHT}&fit=${NOTE_IMAGE_FIT}&quality=${NOTE_IMAGE_QUALITY}`;
        return `src="${NOTE_IMAGE_BASE_URL}/${imageFile}?${queryParams}"`;
      }
    );
    
    processedContent = processedContent.replace(
      /src="\/([^"]+)"/g,
      'src="https://note.com/$1"'
    );
  }
  // For relative mode: paths are already kept as-is after protocol-relative conversion

  // Convert HTML to Markdown
  const markdown = turndownService.turndown(processedContent);

  // Generate frontmatter
  const frontmatter = generateFrontmatter(article);

  // Generate filename
  const filename = generateFilename(article);

  return {
    ...article,
    markdown,
    frontmatter,
    filename,
    pathMode,
  };
}

function generateFrontmatter(article: Article): string {
  const draft = article.status === 'draft';
  
  return `---
title: "${escapeYaml(article.title)}"
pubDate: "${article.pubDate}"
modifiedDate: "${article.modifiedDate}"
guid: "${article.guid}"
link: "${article.link}"
creator: "${escapeYaml(article.creator)}"
status: "${article.status}"
draft: ${draft}
description: "${escapeYaml(article.description)}"
---`;
}

function generateFilename(article: Article): string {
  // Format: yyyyMMddHHmmss_guid.md
  const date = new Date(article.pubDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  const dateStr = `${year}${month}${day}${hours}${minutes}${seconds}`;
  const guid = article.guid.replace(/[^a-z0-9]/gi, '');
  
  return `${dateStr}_${guid}.md`;
}

function escapeYaml(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
}

export function getFullMarkdown(article: ConvertedArticle): string {
  return `${article.frontmatter}\n\n${article.markdown}`;
}

export function getMarkdownWithoutFrontmatter(article: ConvertedArticle): string {
  return article.markdown;
}
