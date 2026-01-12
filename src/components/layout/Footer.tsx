export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            WXR to Markdown Converter |{' '}
            <a
              href="https://github.com/hiyori-akane/note-wxr-to-markdown"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
