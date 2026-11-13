import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Scoreboard } from './components/Scoreboard';
import { DualWorkspace } from './components/DualWorkspace';
import { DistributionManager } from './components/DistributionManager';
import { DocumentationModal } from './components/DocumentationModal';
import { SAMPLE_DOCUMENTS } from './data/sampleTexts';
import {
  analyzeFullText,
  replaceSentenceInText,
  convertAllPassivesToActive,
} from './utils/passiveVoiceEngine';
import { PassiveSentenceMatch, TextAnalysisResult } from './types/voice';
import { Sparkles, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export function App() {
  // Theme state: Golden Hour (Day) vs Amber Sunset (Dark)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('activevoice-theme');
      if (saved) return saved === 'dark';
      return true; // default to Amber Sunset
    }
    return true;
  });

  // Active view tab in header
  const [activeView, setActiveView] = useState<'workspace' | 'engine' | 'metrics'>('workspace');

  // Input draft text - initialized with a rich sample document
  const [text, setText] = useState<string>(SAMPLE_DOCUMENTS[0].text);

  // History stack for Undo
  const [history, setHistory] = useState<string[]>([SAMPLE_DOCUMENTS[0].text]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Auto-scan toggle (real-time analysis on typing)
  const [autoScan, setAutoScan] = useState<boolean>(true);

  // Active highlighted passive sentence ID
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);

  // Documentation modal
  const [isDocOpen, setIsDocOpen] = useState<boolean>(false);

  // Sync theme with <html> class and localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('activevoice-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('activevoice-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Live client-side parsing and metrics computation
  const analysis: TextAnalysisResult = useMemo(() => {
    return analyzeFullText(text);
  }, [text]);

  // Keep activeMatchId in sync if text changed and previous match no longer exists
  useEffect(() => {
    if (activeMatchId && !analysis.matches.some((m) => m.id === activeMatchId)) {
      // Pick first remaining match or clear
      if (analysis.matches.length > 0) {
        setActiveMatchId(analysis.matches[0].id);
      } else {
        setActiveMatchId(null);
      }
    }
  }, [analysis.matches, activeMatchId]);

  // Push new text to history
  const updateTextWithHistory = useCallback((newText: string) => {
    setText(newText);
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newText];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Handle direct textarea changes
  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  // Quick Apply single passive sentence revision
  const handleApplyRevision = (match: PassiveSentenceMatch, selectedText?: string) => {
    const replacement = selectedText || match.activeRevision;
    const updated = replaceSentenceInText(text, match, replacement);
    updateTextWithHistory(updated);
  };

  // Quick Apply All passive sentence revisions
  const handleApplyAllRevisions = () => {
    const updated = convertAllPassivesToActive(text, analysis.matches);
    updateTextWithHistory(updated);
    setActiveMatchId(null);
  };

  // Explicit scan button trigger
  const handleManualScan = () => {
    // Re-evaluates and focuses first match if any
    if (analysis.matches.length > 0) {
      setActiveMatchId(analysis.matches[0].id);
    }
  };

  // Sample document loader
  const handleSelectSample = (sampleText: string) => {
    updateTextWithHistory(sampleText);
    const result = analyzeFullText(sampleText);
    if (result.matches.length > 0) {
      setActiveMatchId(result.matches[0].id);
    } else {
      setActiveMatchId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-[#FAF6EE] dark:bg-[#121316] text-stone-900 dark:text-stone-100">
      {/* 1. Header (Top Bar Contract: 3 Zones, Brand wordmark, 4 clean text links, Theme switch) */}
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onSelectSample={handleSelectSample}
        onOpenDoc={() => setIsDocOpen(true)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Editorial Sub-Header & Sample Quick Pills */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-amber-900/10 dark:border-amber-500/15">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <span>Dynamic Real-Time Text Processor</span>
              <span aria-hidden="true">·</span>
              <span>Client-Side SVO Linguistic Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
              Passive-to-Active Voice Converter
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
              Identify passive voice constructions instantly. Click any highlighted phrase to preview recommended active voice conversions, view grammatical explanations, and apply one-click replacements.
            </p>
          </div>

          {/* Quick sample buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 mr-1">
              Quick Samples:
            </span>
            {SAMPLE_DOCUMENTS.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleSelectSample(doc.text)}
                className="text-xs font-medium px-2.5 py-1 rounded-md border border-amber-800/20 dark:border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 text-stone-800 dark:text-stone-200 hover:bg-amber-500/25 transition-colors cursor-pointer"
              >
                {doc.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </section>

        {/* 2. Dual-Workspace Interactive Component (Left: Input Canvas, Right: Active Output Workspace) */}
        <DualWorkspace
          text={text}
          onChangeText={handleTextChange}
          analysis={analysis}
          onScan={handleManualScan}
          onApplyRevision={handleApplyRevision}
          onApplyAllRevisions={handleApplyAllRevisions}
          autoScan={autoScan}
          onToggleAutoScan={setAutoScan}
          activeMatchId={activeMatchId}
          onSelectMatch={setActiveMatchId}
        />

        {/* 3. Analytics & Readability Scoreboard */}
        <Scoreboard metrics={analysis.metrics} />

        {/* 4. One-Click Distribution Manager */}
        <DistributionManager originalText={text} analysis={analysis} />

        {/* Contextual Deep Dive Tabs for Engine and Metrics views if selected */}
        {activeView === 'engine' && (
          <section className="rounded-xl border bg-[#FDFBF7] dark:bg-[#1A1A20] border-amber-900/10 dark:border-amber-500/20 p-6 space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Linguistic Detection Architecture
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              ActiveVoice AI uses an in-memory client-side deterministic pipeline combining regular expression tokenization, auxiliary verb classification, irregular verb conjugation lemmatization, and agent preposition extraction.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block mb-1">
                  1. Auxiliary Detection
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Matches forms of "to be" (<code className="font-mono text-amber-600">was, were, is, are, has been, had been, is being, can be</code>) preceding a past participle.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block mb-1">
                  2. SVO Transposition
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Inverts recipient and agent roles, adapting pronouns (<code className="font-mono text-amber-600">by him → he</code>) and conjugating verbs to the matching active tense.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block mb-1">
                  3. Predicate Adjective Filter
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Excludes false positives such as <code className="font-mono text-amber-600">interested, excited, located, based</code> unless followed by an explicit agent clause.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeView === 'metrics' && (
          <section className="rounded-xl border bg-[#FDFBF7] dark:bg-[#1A1A20] border-amber-900/10 dark:border-amber-500/20 p-6 space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Readability Scoring Methodology
            </h3>
            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              <p>
                <strong>Flesch Reading Ease Formula:</strong> <code className="font-mono bg-amber-500/10 px-1 py-0.5 rounded text-amber-700 dark:text-amber-400">206.835 - 1.015 × (Words / Sentences) - 84.6 × (Syllables / Words)</code>. Scores above 60 indicate plain English accessible to general readers.
              </p>
              <p>
                <strong>Active Clarity Index:</strong> A normalized 0–100 composite index penalizing excessive passive density (over 10%) and overly dense sentence structures (&gt; 20 words per sentence).
              </p>
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-amber-900/10 dark:border-amber-500/15 py-6 bg-[#FBF7EF] dark:bg-[#121316] text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800 dark:text-stone-200">ActiveVoice AI</span>
            <span>·</span>
            <span>Golden & Amber Sunset Editorial Architecture</span>
          </div>
          <div>
            <span>Targeting &lt; 10% passive voice for punchy, accountable editorial copy.</span>
          </div>
        </div>
      </footer>

      {/* Documentation Modal */}
      <DocumentationModal isOpen={isDocOpen} onClose={() => setIsDocOpen(false)} />
    </div>
  );
}

export default App;
