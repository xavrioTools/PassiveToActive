import React, { useState, useRef, useEffect } from 'react';
import { TextAnalysisResult, PassiveSentenceMatch } from '../types/voice';
import { RevisionCard } from './RevisionCard';
import {
  Sparkles,
  RotateCcw,
  Trash2,
  CheckCheck,
  Eye,
  FileCheck2,
  SplitSquareVertical,
  Check,
  AlertCircle,
  Copy,
  SlidersHorizontal,
} from 'lucide-react';

interface DualWorkspaceProps {
  text: string;
  onChangeText: (newText: string) => void;
  analysis: TextAnalysisResult;
  onScan: () => void;
  onApplyRevision: (match: PassiveSentenceMatch, selectedText?: string) => void;
  onApplyAllRevisions: () => void;
  autoScan: boolean;
  onToggleAutoScan: (enabled: boolean) => void;
  activeMatchId: string | null;
  onSelectMatch: (id: string | null) => void;
}

export const DualWorkspace: React.FC<DualWorkspaceProps> = ({
  text,
  onChangeText,
  analysis,
  onScan,
  onApplyRevision,
  onApplyAllRevisions,
  autoScan,
  onToggleAutoScan,
  activeMatchId,
  onSelectMatch,
}) => {
  const [outputMode, setOutputMode] = useState<'interactive' | 'active-clean' | 'diff'>('interactive');
  const [isCopiedClean, setIsCopiedClean] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Find currently active match if any
  const activeMatchIndex = analysis.matches.findIndex((m) => m.id === activeMatchId);
  const activeMatch = activeMatchIndex !== -1 ? analysis.matches[activeMatchIndex] : null;

  // Handle navigate between matches in revision card
  const handleNavigateMatch = (direction: 'next' | 'prev') => {
    if (analysis.matches.length === 0) return;
    if (activeMatchIndex === -1) {
      onSelectMatch(analysis.matches[0].id);
      return;
    }
    const nextIdx = direction === 'next'
      ? Math.min(analysis.matches.length - 1, activeMatchIndex + 1)
      : Math.max(0, activeMatchIndex - 1);
    onSelectMatch(analysis.matches[nextIdx].id);
  };

  // Keyboard shortcut Ctrl/Cmd + Enter to trigger scan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        onScan();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onScan]);

  // Compute clean active text for the whole document
  const computeFullActiveText = () => {
    let result = text;
    const sorted = [...analysis.matches].sort((a, b) => b.startIndex - a.startIndex);
    for (const m of sorted) {
      const original = m.originalSentence;
      const exactSub = result.substring(m.startIndex, m.endIndex);
      if (exactSub === original) {
        result = result.substring(0, m.startIndex) + m.activeRevision + result.substring(m.endIndex);
      } else {
        result = result.replace(original, m.activeRevision);
      }
    }
    return result;
  };

  const fullActiveText = computeFullActiveText();

  const handleCopyCleanText = () => {
    navigator.clipboard.writeText(fullActiveText);
    setIsCopiedClean(true);
    setTimeout(() => setIsCopiedClean(false), 2000);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* ================= LEFT PANEL: INPUT CANVAS ================= */}
      <div className="flex flex-col rounded-xl border transition-colors duration-200 bg-[#FDFBF7] dark:bg-[#1A1A20] border-amber-900/10 dark:border-amber-500/20 shadow-xs overflow-hidden">
        {/* Panel Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-amber-500/5 dark:bg-amber-500/10 border-b border-amber-900/10 dark:border-amber-500/15">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Left Panel: Input Canvas
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              (Raw Draft)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-scan live toggle */}
            <label className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoScan}
                onChange={(e) => onToggleAutoScan(e.target.checked)}
                className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-[11px] font-medium">Real-Time Scan</span>
            </label>

            {/* Clear Button */}
            <button
              onClick={() => onChangeText('')}
              disabled={!text}
              title="Clear input text"
              className="p-1.5 text-stone-500 hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative p-4">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder="Paste your article, essay, or draft here. ActiveVoice AI will parse every sentence in real-time, highlight passive indicators, and provide instant active voice revisions..."
            className="w-full h-[430px] p-3 text-sm leading-relaxed text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 bg-transparent border-0 focus:outline-none focus:ring-0 resize-none font-sans"
            spellCheck="true"
          />
        </div>

        {/* Bottom Bar: Word Counter & Scan Trigger */}
        <div className="flex items-center justify-between px-4 py-3 bg-stone-50 dark:bg-stone-900/60 border-t border-amber-900/10 dark:border-amber-500/15">
          <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 font-mono tabular-nums">
            <span>{analysis.metrics.totalWords} words</span>
            <span>·</span>
            <span>{analysis.metrics.totalCharacters} chars</span>
            <span>·</span>
            <span>{analysis.metrics.totalSentences} sentences</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onScan}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg shadow-sm shadow-amber-600/30 hover:shadow-amber-600/40 transition-all duration-200 cursor-pointer active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Scan for Passive Voice</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-black/20 rounded text-amber-100">
                ⌘↵
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* ================= RIGHT PANEL: ACTIVE OUTPUT WORKSPACE ================= */}
      <div className="flex flex-col rounded-xl border transition-colors duration-200 bg-[#FDFBF7] dark:bg-[#1A1A20] border-amber-900/10 dark:border-amber-500/20 shadow-xs overflow-hidden">
        {/* Panel Toolbar & View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-amber-500/5 dark:bg-amber-500/10 border-b border-amber-900/10 dark:border-amber-500/15">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Right Panel: Active Output Workspace
            </span>
            {analysis.matches.length > 0 && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono tabular-nums">
                {analysis.matches.length} detected
              </span>
            )}
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-stone-200/60 dark:bg-stone-800">
            <button
              onClick={() => setOutputMode('interactive')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                outputMode === 'interactive'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Inspect</span>
            </button>
            <button
              onClick={() => setOutputMode('active-clean')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                outputMode === 'active-clean'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <FileCheck2 className="w-3 h-3" />
              <span>Active Text</span>
            </button>
            <button
              onClick={() => setOutputMode('diff')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                outputMode === 'diff'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <SplitSquareVertical className="w-3 h-3" />
              <span>Diff</span>
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="relative p-4 h-[430px] overflow-y-auto">
          {/* Active Contextual Revision Card (Slides open when a sentence is selected) */}
          {activeMatch && outputMode === 'interactive' && (
            <div className="mb-4">
              <RevisionCard
                match={activeMatch}
                currentIndex={activeMatchIndex}
                totalMatches={analysis.matches.length}
                onApplyRevision={onApplyRevision}
                onClose={() => onSelectMatch(null)}
                onNavigate={handleNavigateMatch}
              />
            </div>
          )}

          {/* Mode 1: Interactive Highlighting */}
          {outputMode === 'interactive' && (
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
              {!text.trim() ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-stone-400 dark:text-stone-500">
                  <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">Input canvas is empty.</p>
                  <p className="text-xs mt-1">Paste your text or choose a sample draft from the header to begin.</p>
                </div>
              ) : analysis.matches.length === 0 ? (
                <div className="p-6 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-center">
                  <CheckCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-emerald-950 dark:text-emerald-200">
                    Pure Active Voice Achieved!
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 max-w-md mx-auto">
                    Zero passive voice sentences detected. Every sentence in your document establishes direct agency and vigorous momentum.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 leading-relaxed text-sm text-stone-800 dark:text-stone-200">
                  {text.split(/\n\n+/).map((paragraph, pIdx) => (
                    <p key={pIdx}>
                      {analysis.sentences
                        .filter((s) => {
                          // Rough paragraph membership
                          const priorP = text.substring(0, s.startIndex).split(/\n\n+/).length - 1;
                          return priorP === pIdx;
                        })
                        .map((s, sIdx) => {
                          if (s.isPassive && s.match) {
                            const isSelected = activeMatchId === s.match.id;
                            return (
                              <mark
                                key={s.match.id}
                                onClick={() => onSelectMatch(s.match!.id)}
                                title="Click to view active voice conversion & explanation"
                                className={`cursor-pointer transition-all duration-200 px-1 py-0.5 rounded text-inherit inline ${
                                  isSelected
                                    ? 'bg-amber-400/50 dark:bg-amber-500/40 ring-2 ring-amber-500 ring-offset-1 dark:ring-offset-stone-900 font-medium'
                                    : 'bg-amber-300/30 dark:bg-amber-500/25 hover:bg-amber-400/40 dark:hover:bg-amber-500/35 border-b-2 border-amber-500'
                                }`}
                              >
                                {s.text}{' '}
                              </mark>
                            );
                          }
                          return <span key={sIdx}>{s.text} </span>;
                        })}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Clean Active Text Preview */}
          {outputMode === 'active-clean' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-900/10 dark:border-amber-500/15">
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  Full text converted with active voice revisions applied:
                </span>
                <button
                  onClick={handleCopyCleanText}
                  className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  {isCopiedClean ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All Active Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-stone-800 dark:text-stone-200 font-sans whitespace-pre-wrap">
                {fullActiveText || (
                  <p className="text-stone-400 text-xs italic">No text provided yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Mode 3: Side-by-Side Diff */}
          {outputMode === 'diff' && (
            <div className="space-y-3">
              <span className="text-xs text-stone-500 dark:text-stone-400 block pb-1 border-b border-amber-900/10 dark:border-amber-500/15">
                Side-by-side passive vs. active transformation breakdown:
              </span>

              {analysis.matches.length === 0 ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 italic pt-2">
                  No passive sentences to compare! The copy is 100% active.
                </p>
              ) : (
                <div className="space-y-3">
                  {analysis.matches.map((m, idx) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-lg border border-amber-900/10 dark:border-amber-500/20 bg-stone-50 dark:bg-stone-900/50 space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
                        <span>Sentence #{idx + 1}</span>
                        <button
                          onClick={() => onApplyRevision(m)}
                          className="text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                        >
                          Quick Apply This
                        </button>
                      </div>

                      {/* Before (Passive) */}
                      <div className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                        <span className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-700 dark:text-red-400 font-mono text-[10px] shrink-0">
                          PASSIVE
                        </span>
                        <p className="line-through opacity-80">{m.originalSentence}</p>
                      </div>

                      {/* After (Active) */}
                      <div className="flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] shrink-0">
                          ACTIVE
                        </span>
                        <p className="font-medium">{m.activeRevision}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Bar: Quick Bulk Action */}
        <div className="flex items-center justify-between px-4 py-3 bg-stone-50 dark:bg-stone-900/60 border-t border-amber-900/10 dark:border-amber-500/15">
          <div className="text-xs text-stone-500 dark:text-stone-400">
            {analysis.matches.length > 0 ? (
              <span>
                Tip: Click any <span className="font-medium text-amber-700 dark:text-amber-400">highlighted sentence</span> to slide open revision card.
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Document is fully active and ready for publishing.
              </span>
            )}
          </div>

          {analysis.matches.length > 0 && (
            <button
              onClick={onApplyAllRevisions}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 dark:text-stone-100 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Apply All Active Revisions ({analysis.matches.length})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
