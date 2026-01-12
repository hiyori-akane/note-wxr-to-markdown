import type { ConvertedArticle } from '../../types';
import { Checkbox } from '../common/Checkbox';
import { downloadSingleMarkdown } from '../../lib/zipDownloader';

interface ArticleRowProps {
  article: ConvertedArticle;
  isSelected: boolean;
  onToggle: () => void;
  onPreview: () => void;
}

export function ArticleRow({ article, isSelected, onToggle, onPreview }: ArticleRowProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadSingleMarkdown(article);
  };

  const date = new Date(article.pubDate);
  const formattedDate = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div
      className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
      role="row"
    >
      <div className="flex-shrink-0">
        <Checkbox
          id={`article-${article.filename}`}
          checked={isSelected}
          onChange={onToggle}
          label=""
        />
      </div>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={onPreview}>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
          {article.title}
        </h3>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{article.creator}</span>
          {article.status === 'draft' && (
            <>
              <span>•</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                Draft
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 flex gap-2">
        <button
          onClick={onPreview}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Preview ${article.title}`}
        >
          Preview
        </button>
        <button
          onClick={handleDownload}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label={`Download ${article.title}`}
        >
          Download
        </button>
      </div>
    </div>
  );
}
