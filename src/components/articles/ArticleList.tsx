import { useState } from 'react';
import type { ConvertedArticle } from '../../types';
import { ArticleRow } from './ArticleRow';
import { Button } from '../common/Button';
import { Checkbox } from '../common/Checkbox';
import { downloadAsZip } from '../../lib/zipDownloader';
import { MarkdownPreview } from '../preview/MarkdownPreview';

interface ArticleListProps {
  articles: ConvertedArticle[];
  selectedArticles: Set<string>;
  onToggleArticle: (filename: string) => void;
  onToggleAll: () => void;
}

export function ArticleList({
  articles,
  selectedArticles,
  onToggleArticle,
  onToggleAll,
}: ArticleListProps) {
  const [previewArticle, setPreviewArticle] = useState<ConvertedArticle | null>(null);

  const handleDownloadSelected = async () => {
    const selected = articles.filter((a) => selectedArticles.has(a.filename));
    if (selected.length === 0) {
      alert('Please select at least one article');
      return;
    }
    await downloadAsZip(selected, 'selected-articles.zip');
  };

  const handleDownloadAll = async () => {
    await downloadAsZip(articles, 'all-articles.zip');
  };

  if (articles.length === 0) {
    return null;
  }

  const allSelected = selectedArticles.size === articles.length;
  const someSelected = selectedArticles.size > 0;

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-4">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onChange={onToggleAll}
              label={`Select All (${articles.length} articles)`}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadSelected}
              disabled={!someSelected}
            >
              Download Selected ({selectedArticles.size})
            </Button>
            <Button variant="primary" size="sm" onClick={handleDownloadAll}>
              Download All
            </Button>
          </div>
        </div>

        <div className="space-y-3" role="list">
          {articles.map((article) => (
            <ArticleRow
              key={article.filename}
              article={article}
              isSelected={selectedArticles.has(article.filename)}
              onToggle={() => onToggleArticle(article.filename)}
              onPreview={() => setPreviewArticle(article)}
            />
          ))}
        </div>
      </div>

      {previewArticle && (
        <MarkdownPreview
          article={previewArticle}
          onClose={() => setPreviewArticle(null)}
        />
      )}
    </>
  );
}
