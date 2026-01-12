import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { ConvertedArticle } from '../types';
import { getFullMarkdown } from './markdownConverter';

export async function downloadAsZip(articles: ConvertedArticle[], filename: string = 'articles.zip'): Promise<void> {
  const zip = new JSZip();

  articles.forEach((article) => {
    const content = getFullMarkdown(article);
    zip.file(article.filename, content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, filename);
}

export function downloadSingleMarkdown(article: ConvertedArticle): void {
  const content = getFullMarkdown(article);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, article.filename);
}
