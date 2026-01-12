import { useTheme } from './hooks/useTheme';
import { useArticles } from './hooks/useArticles';
import { SkipLink } from './components/layout/SkipLink';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FileUploader } from './components/upload/FileUploader';
import { ArticleList } from './components/articles/ArticleList';
import { Alert } from './components/common/Alert';
import { PathModeDialog } from './components/common/PathModeDialog';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const {
    articles,
    selectedArticles,
    error,
    showPathModeDialog,
    loadArticles,
    selectPathMode,
    closePathModeDialog,
    toggleArticle,
    toggleAll,
  } = useArticles();

  return (
    <>
      <SkipLink />
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header isDark={isDark} onToggleTheme={toggleTheme} />

        <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {error && (
              <Alert type="error" onClose={() => loadArticles('')}>
                <strong>Error:</strong> {error}
              </Alert>
            )}

            {articles.length === 0 && !error && (
              <div className="space-y-4">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Get Started
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload your WXR file exported from Note to convert it to Markdown
                  </p>
                </div>
                <FileUploader onFileLoaded={loadArticles} />
              </div>
            )}

            {articles.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Articles ({articles.length})
                  </h2>
                  <button
                    onClick={() => {
                      loadArticles('');
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Upload another file
                  </button>
                </div>

                <ArticleList
                  articles={articles}
                  selectedArticles={selectedArticles}
                  onToggleArticle={toggleArticle}
                  onToggleAll={toggleAll}
                />
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {showPathModeDialog && (
        <PathModeDialog
          onSelect={selectPathMode}
          onClose={closePathModeDialog}
        />
      )}
    </>
  );
}

export default App;
