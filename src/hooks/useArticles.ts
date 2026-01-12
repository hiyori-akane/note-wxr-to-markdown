import { useState } from 'react';
import { parseWXR } from '../lib/wxrParser';
import { convertToMarkdown } from '../lib/markdownConverter';
import type { ConvertedArticle, PathMode, Article } from '../types';

export function useArticles() {
  const [articles, setArticles] = useState<ConvertedArticle[]>([]);
  const [parsedArticles, setParsedArticles] = useState<Article[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [showPathModeDialog, setShowPathModeDialog] = useState(false);

  const loadArticles = (xmlContent: string) => {
    try {
      setError(null);
      if (xmlContent) {
        const parsed = parseWXR(xmlContent);
        setParsedArticles(parsed);
        setShowPathModeDialog(true);
      } else {
        // Reset state when empty content is passed (used for "Upload another file")
        setArticles([]);
        setParsedArticles([]);
        setSelectedArticles(new Set());
        setShowPathModeDialog(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse WXR file');
      setArticles([]);
      setParsedArticles([]);
      setSelectedArticles(new Set());
      setShowPathModeDialog(false);
    }
  };

  const selectPathMode = (pathMode: PathMode) => {
    const convertedArticles = parsedArticles.map((article) => convertToMarkdown(article, pathMode));
    setArticles(convertedArticles);
    setSelectedArticles(new Set());
    setShowPathModeDialog(false);
  };

  const closePathModeDialog = () => {
    // If dialog is closed without selection, default to relative mode
    if (parsedArticles.length > 0 && articles.length === 0) {
      selectPathMode('relative');
    } else {
      setShowPathModeDialog(false);
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
    showPathModeDialog,
    loadArticles,
    selectPathMode,
    closePathModeDialog,
    toggleArticle,
    toggleAll,
    getSelectedArticles,
  };
}
