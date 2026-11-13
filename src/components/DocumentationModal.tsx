import React from 'react';
import { X, Check, AlertTriangle, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border bg-[#FDFBF7] dark:bg-[#1C1C24] border-amber-500/30 shadow-2xl p-6 space-y-6 text-stone-800 dark:text-stone-200">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-amber-900/10 dark:border-amber-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                The Active Voice Editorial Standard
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Client-side grammatical heuristics, sentence mechanics, and readability formulas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Principles */}
        <div className="space-y-4 text-xs leading-relaxed">
          <div>
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
              What Is Passive Voice?
            </h3>
            <p className="text-stone-600 dark:text-stone-300">
              In an active sentence, the grammatical subject <strong>performs</strong> the action (<code className="font-mono text-amber-700 dark:text-amber-400">Subject + Verb + Object</code>).
              In a passive sentence, the subject <strong>receives</strong> the action, while the real actor is relegated to an optional prepositional phrase or omitted entirely.
            </p>
          </div>

          {/* Side-by-side comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-orange-700 dark:text-orange-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Passive Phrasing</span>
              </div>
              <p className="text-stone-700 dark:text-stone-300 italic">
                "The blog was written by the AI."
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Indirect, delayed subject, extra auxiliary verbs, slower pacing.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                <Check className="w-4 h-4" />
                <span>Active Phrasing</span>
              </div>
              <p className="text-stone-700 dark:text-stone-300 font-medium">
                "The AI wrote the blog."
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Immediate agency, brisk cadence, fewer syllables, unambiguous accountability.
              </p>
            </div>
          </div>

          {/* The Detection Pipeline */}
          <div className="space-y-2 pt-2 border-t border-amber-900/10 dark:border-amber-500/15">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              How ActiveVoice AI Detects Passive Formations
            </h3>
            <ul className="space-y-1.5 text-stone-600 dark:text-stone-300 list-disc list-inside">
              <li>
                <strong>Auxiliary Be-Verbs:</strong> Identifies <code className="font-mono text-amber-700 dark:text-amber-400">is, are, was, were, been, being, be</code> and modals like <code className="font-mono text-amber-700 dark:text-amber-400">will be, can be, has been</code>.
              </li>
              <li>
                <strong>Past Participles:</strong> Matches against an exhaustive regular and irregular verb lexicon (<code className="font-mono text-amber-700 dark:text-amber-400">driven, written, analyzed, executed</code>).
              </li>
              <li>
                <strong>Agent Extraction:</strong> Detects prepositional <code className="font-mono text-amber-700 dark:text-amber-400">by [agent]</code> clauses and inverts them into the active grammatical subject.
              </li>
              <li>
                <strong>Adjective Exclusion Filter:</strong> Distinguishes true passive verbs from predicate adjectives (<code className="font-mono text-amber-700 dark:text-amber-400">was interested, is located</code>).
              </li>
            </ul>
          </div>

          {/* The 10% Benchmark */}
          <div className="p-3.5 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100">
                The &lt; 10% Publishing Standard
              </h4>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">
                Top editorial institutions recommend keeping passive voice under 10% of total sentences. Occasional passive constructions are acceptable when the object is the true focal point, but excessive passive voice creates sluggish, evasive prose.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-amber-900/10 dark:border-amber-500/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg cursor-pointer transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
