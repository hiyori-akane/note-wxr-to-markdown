import { useEffect, useState, useMemo } from 'react';
import type { ConvertedArticle } from '../../types';
import { getFullMarkdown } from '../../lib/markdownConverter';
import { Button } from '../common/Button';
import { downloadSingleMarkdown } from '../../lib/zipDownloader';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownPreviewProps {
  article: ConvertedArticle;
  onClose: () => void;
}

type PreviewMode = 'source' | 'rendered';

export function MarkdownPreview({ article, onClose }: MarkdownPreviewProps) {
  const fullMarkdown = getFullMarkdown(article);
  const [mode, setMode] = useState<PreviewMode>('source');

  // Memoize rendered and sanitized HTML to avoid re-computation on every render
  const renderedHtml = useMemo(() => {
    if (mode === 'rendered') {
      const rawHtml = marked.parse(fullMarkdown) as string;
      return DOMPurify.sanitize(rawHtml);
    }
    return '';
  }, [mode, fullMarkdown]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    downloadSingleMarkdown(article);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="preview-title" className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
            {article.title}
          </h2>
          <div className="flex gap-2 flex-shrink-0 ml-4">
            <Button variant="primary" size="sm" onClick={handleDownload}>
              Download
            </Button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Close preview"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview Mode:</span>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setMode('source')}
              className={`px-4 py-2 text-sm font-medium border ${
                mode === 'source'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              } rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Source
            </button>
            <button
              type="button"
              onClick={() => setMode('rendered')}
              className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${
                mode === 'rendered'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              } rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Rendered
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {mode === 'source' ? (
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
              {fullMarkdown}
            </pre>
          ) : (
            <div
              className="prose prose-slate dark:prose-invert max-w-none prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:text-gray-800 dark:prose-pre:text-gray-200"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
