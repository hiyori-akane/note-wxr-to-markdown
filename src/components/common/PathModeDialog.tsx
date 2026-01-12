import { useEffect } from 'react';
import type { PathMode } from '../../types';
import { Button } from './Button';

interface PathModeDialogProps {
  onSelect: (mode: PathMode) => void;
  onClose: () => void;
}

export function PathModeDialog({ onSelect, onClose }: PathModeDialogProps) {
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

  const handleSelect = (mode: PathMode) => {
    onSelect(mode);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="path-mode-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="path-mode-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Select Path Mode
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Choose how image and asset paths should be handled in the converted Markdown files.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <button
              onClick={() => handleSelect('relative')}
              className="w-full p-4 text-left border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              role="radio"
              aria-checked="true"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1" aria-hidden="true">
                  <div className="w-5 h-5 border-2 border-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    Relative Path Mode (Recommended)
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Keep original relative paths from WXR as-is (e.g., <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">/assets/...</code>).
                    Use this if you plan to host the images yourself.
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSelect('absolute')}
              className="w-full p-4 text-left border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              role="radio"
              aria-checked="false"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1" aria-hidden="true">
                  <div className="w-5 h-5 border-2 border-gray-400 dark:border-gray-500 rounded-full"></div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    Absolute Path Mode
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Convert paths to Note's absolute URLs (e.g., <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">https://assets.st-note.com/...</code>).
                    Images will link directly to Note's CDN.
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
