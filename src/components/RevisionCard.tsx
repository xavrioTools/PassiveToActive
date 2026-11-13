import React, { useState } from 'react';
import { PassiveSentenceMatch } from '../types/voice';
import { Check, X, ChevronRight, ChevronLeft, ArrowRight, Lightbulb, Users } from 'lucide-react';

interface RevisionCardProps {
  match: PassiveSentenceMatch;
  currentIndex: number;
  totalMatches: number;
  onApplyRevision: (match: PassiveSentenceMatch, selectedText?: string) => void;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
}

export const RevisionCard: React.FC<RevisionCardProps> = ({
  match,
  currentIndex,
  totalMatches,
  onApplyRevision,
  onClose,
  onNavigate,
}) => {
  const [selectedRevision, setSelectedRevision] = useState<string>(match.activeRevision);
  const [isCopied, setIsCopied] = useState(false);

  // If match changes, reset selected revision to the primary active revision
  React.useEffect(() => {
    setSelectedRevision(match.activeRevision);
  }, [match]);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedRevision);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  // Helper to render original sentence with bolded passive indicator
  const renderOriginalSentenceWithHighlight = () => {
    const original = match.originalSentence;
    const indicator = match.passiveIndicator;
    const idx = original.toLowerCase().indexOf(indicator.toLowerCase());
    
    if (idx === -1) {
      return <span>{original}</span>;
    }

    const before = original.substring(0, idx);
    const highlighted = original.substring(idx, idx + indicator.length);
    const after = original.substring(idx + indicator.length);

    return (
      <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
        {before}
        <span className="font-bold underline decoration-orange-500 decoration-2 text-orange-950 dark:text-orange-200 bg-orange-500/20 px-1 py-0.5 rounded">
          {highlighted}
        </span>
        {after}
      </p>
    );
  };

  return (
    <div
      role="dialog"
      aria-labelledby="revision-title"
      className="rounded-xl border transition-all duration-300 bg-[#FDFBF7] dark:bg-[#1C1C24] border-amber-500/40 dark:border-amber-500/30 shadow-lg shadow-amber-900/10 dark:shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-bottom-2"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Passive Issue #{currentIndex + 1} of {totalMatches}
          </span>
          {match.isAgentless && (
            <span className="text-[11px] font-medium text-stone-600 dark:text-stone-300">
              · Agentless
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigate('prev')}
            disabled={currentIndex === 0}
            title="Previous Issue (Left Arrow)"
            className="p-1 rounded text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('next')}
            disabled={currentIndex === totalMatches - 1}
            title="Next Issue (Right Arrow)"
            className="p-1 rounded text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Close revision card"
            className="p-1 rounded text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* 1. The Original Error */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              1. Original Passive Phrasing
            </span>
            <span className="text-[11px] font-mono text-orange-600 dark:text-orange-400 font-medium">
              Marker: "{match.passiveIndicator}"
            </span>
          </div>
          <div className="p-3 rounded-lg bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20">
            {renderOriginalSentenceWithHighlight()}
          </div>
        </div>

        {/* 2. Recommended Active Voice Revision */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5" />
              2. Recommended Active Voice
            </span>
            <button
              onClick={handleCopy}
              className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
            >
              {isCopied ? 'Copied!' : 'Copy Active Text'}
            </button>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30">
            <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-200 leading-relaxed">
              {selectedRevision}
            </p>
          </div>
        </div>

        {/* Alternative Agents (if available for agentless passives) */}
        {match.alternativeRevisions && match.alternativeRevisions.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Alternative Subjects / Agents:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRevision(match.activeRevision)}
                className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                  selectedRevision === match.activeRevision
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-500'
                }`}
              >
                Primary ({match.activeRevision.split(' ')[0]})
              </button>
              {match.alternativeRevisions.map((alt, i) => {
                const agentWord = alt.split(' ')[0];
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedRevision(alt)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                      selectedRevision === alt
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-500'
                    }`}
                  >
                    {agentWord}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Linguistic Rationale */}
        <div className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400 p-2.5 rounded-lg bg-stone-500/5 dark:bg-stone-500/10">
          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p>{match.explanation}</p>
        </div>

        {/* Quick Apply Action Button */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-amber-900/10 dark:border-amber-500/15">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
          >
            Dismiss
          </button>
          <button
            onClick={() => onApplyRevision(match, selectedRevision)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 rounded-lg shadow-sm shadow-amber-600/30 hover:shadow-amber-600/40 transition-all duration-200 cursor-pointer active:scale-98"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Quick Apply Active Voice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
