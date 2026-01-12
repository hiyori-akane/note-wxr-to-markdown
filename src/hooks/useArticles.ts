import { useState } from 'react';
import { parseWXR } from '../lib/wxrParser';
import { convertToMarkdown } from '../lib/markdownConverter';
import type { ConvertedArticle } from '../types';

export function useArticles() {
  const [articles, setArticles] = useState<ConvertedArticle[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const loadArticles = (xmlContent: string) => {
    try {
      setError(null);
      const parsedArticles = parseWXR(xmlContent);
      const convertedArticles = parsedArticles.map((article) => convertToMarkdown(article));
      setArticles(convertedArticles);
      setSelectedArticles(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse WXR file');
      setArticles([]);
      setSelectedArticles(new Set());
    }
  };

  const toggleArticle = (filename: string) => {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(filename)) {
      newSelected.delete(filename);
    } else {
      newSelected.add(filename);
    }
    setSelectedArticles(newSelected);
  };

  const toggleAll = () => {
    if (selectedArticles.size === articles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(articles.map((a) => a.filename)));
    }
  };

  const getSelectedArticles = (): ConvertedArticle[] => {
    return articles.filter((a) => selectedArticles.has(a.filename));
  };

  return {
    articles,
    selectedArticles,
    error,
    loadArticles,
    toggleArticle,
    toggleAll,
    getSelectedArticles,
  };
}
