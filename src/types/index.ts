export interface Article {
  title: string;
  pubDate: string; // ISO 8601 format
  modifiedDate: string; // ISO 8601 format
  guid: string;
  link: string;
  creator: string;
  status: 'publish' | 'draft';
  content: string; // HTML content
  description: string;
}

export interface ConvertedArticle extends Article {
  markdown: string;
  filename: string;
  frontmatter: string;
}
