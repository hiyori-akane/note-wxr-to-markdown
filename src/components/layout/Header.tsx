import { ThemeToggle } from '../common/ThemeToggle';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({ isDark, onToggleTheme }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              WXR to Markdown Converter
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Convert Note WXR exports to Markdown files
            </p>
          </div>
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
