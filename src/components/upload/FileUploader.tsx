import { useFileUpload } from '../../hooks/useFileUpload';

interface FileUploaderProps {
  onFileLoaded: (content: string) => void;
}

export function FileUploader({ onFileLoaded }: FileUploaderProps) {
  const {
    isDragging,
    isLoading,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileSelect,
  } = useFileUpload(onFileLoaded);

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className="w-16 h-16 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {isLoading ? 'Loading...' : 'Drop your WXR file here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or click to browse
            </p>
          </div>

          <div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                Select File
              </span>
              <input
                id="file-upload"
                type="file"
                accept=".xml"
                onChange={handleFileSelect}
                className="sr-only"
                disabled={isLoading}
              />
            </label>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Supported format: XML (WXR)
          </p>
        </div>
      </div>
    </div>
  );
}
