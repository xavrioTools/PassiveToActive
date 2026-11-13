import React from 'react';
import { Sun, Moon, Sparkles, BookOpen } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/sampleTexts';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onSelectSample: (text: string) => void;
  onOpenDoc: () => void;
  activeView: 'workspace' | 'engine' | 'metrics';
  onViewChange: (view: 'workspace' | 'engine' | 'metrics') => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onSelectSample,
  onOpenDoc,
  activeView,
  onViewChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-200 bg-[#FBF7EF]/90 dark:bg-[#121316]/90 border-amber-900/10 dark:border-amber-500/20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element, no pill badges) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm shadow-amber-500/30">
            <Sparkles className="w-5 h-5 text-amber-100" />
          </div>
          <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap">
            ActiveVoice<span className="text-amber-600 dark:text-amber-400"> AI</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line text links) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 dark:text-stone-300">
          <button
            onClick={() => onViewChange('workspace')}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
              activeView === 'workspace'
                ? 'text-amber-700 dark:text-amber-400 border-amber-600 dark:border-amber-400 font-semibold'
                : 'border-transparent hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Workspace Canvas
          </button>
          <button
            onClick={() => onViewChange('engine')}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
              activeView === 'engine'
                ? 'text-amber-700 dark:text-amber-400 border-amber-600 dark:border-amber-400 font-semibold'
                : 'border-transparent hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Detection Logic
          </button>
          <button
            onClick={() => onViewChange('metrics')}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
              activeView === 'metrics'
                ? 'text-amber-700 dark:text-amber-400 border-amber-600 dark:border-amber-400 font-semibold'
                : 'border-transparent hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Readability Index
          </button>
          <button
            onClick={onOpenDoc}
            className="flex items-center gap-1.5 hover:text-amber-700 dark:hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Grammar Guide</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Sample loader selector */}
          <div className="relative group">
            <select
              aria-label="Load Sample Document"
              onChange={(e) => {
                if (e.target.value) {
                  const sample = SAMPLE_DOCUMENTS.find((d) => d.id === e.target.value);
                  if (sample) onSelectSample(sample.text);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="text-xs font-medium py-1.5 px-3 rounded-lg border border-amber-800/20 dark:border-amber-500/30 bg-amber-500/10 text-stone-800 dark:text-stone-200 hover:bg-amber-500/20 transition-colors cursor-pointer appearance-none pr-7 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="" disabled className="bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200">
                Load Sample Text...
              </option>
              {SAMPLE_DOCUMENTS.map((doc) => (
                <option key={doc.id} value={doc.id} className="bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200">
                  {doc.title} ({doc.category})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-600 dark:text-stone-400">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Golden Hour / Amber Sunset Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to Golden Hour Day Mode' : 'Switch to Amber Sunset Dark Mode'}
            title={isDark ? 'Golden Hour Day Mode' : 'Amber Sunset Dark Mode'}
            className="p-2 rounded-lg border border-amber-800/20 dark:border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all duration-200 cursor-pointer shadow-xs"
          >
            {isDark ? (
              <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
