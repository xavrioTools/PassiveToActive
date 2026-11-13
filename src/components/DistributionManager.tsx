import React, { useState } from 'react';
import { TextAnalysisResult } from '../types/voice';
import { Copy, Check, Download, FileText, Share2, FileCode } from 'lucide-react';

interface DistributionManagerProps {
  originalText: string;
  analysis: TextAnalysisResult;
}

export const DistributionManager: React.FC<DistributionManagerProps> = ({
  originalText,
  analysis,
}) => {
  const [copiedState, setCopiedState] = useState(false);

  // Derive optimized copy
  const getOptimizedCopy = () => {
    let result = originalText;
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

  const handleCopyOptimized = () => {
    const copy = getOptimizedCopy();
    navigator.clipboard.writeText(copy);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2200);
  };

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const copy = getOptimizedCopy();
    const markdownContent = `# ActiveVoice Optimized Document

> Converted via ActiveVoice AI · Passive Voice Ratio: ${analysis.metrics.passivePercentage}% (Target: < 10%) · Readability: ${analysis.metrics.fleschReadingEase} (Flesch)

${copy}
`;
    downloadFile('active_voice_optimized.md', markdownContent, 'text/markdown;charset=utf-8;');
  };

  const handleDownloadPlainText = () => {
    const copy = getOptimizedCopy();
    downloadFile('active_voice_optimized.txt', copy, 'text/plain;charset=utf-8;');
  };

  const handleDownloadAuditReport = () => {
    const copy = getOptimizedCopy();
    const dateStr = new Date().toISOString().split('T')[0];
    const reportContent = `# ActiveVoice AI Editorial Audit Report
Generated: ${dateStr}

## 1. Document Readability & Voice Scoreboard
- Total Words: ${analysis.metrics.totalWords}
- Total Sentences: ${analysis.metrics.totalSentences}
- Passive Sentences Count: ${analysis.metrics.passiveSentencesCount}
- Active Sentences Count: ${analysis.metrics.activeSentencesCount}
- Passive Sentence Percentage: ${analysis.metrics.passivePercentage}% (Recommended: < 10%)
- Reading Pace Alert: ${analysis.metrics.readingPace}
- Average Words per Sentence: ${analysis.metrics.averageWordsPerSentence}
- Flesch Reading Ease Score: ${analysis.metrics.fleschReadingEase} / 100
- Active Clarity Index: ${analysis.metrics.clarityIndex} / 100

## 2. Transformations Applied (${analysis.matches.length} sentences)
${analysis.matches.map((m, idx) => `
### Sentence ${idx + 1}
- **Original Passive**: "${m.originalSentence}"
- **Passive Indicator**: \`${m.passiveIndicator}\`
- **Active Revision**: "${m.activeRevision}"
- **Linguistic Role**: ${m.isAgentless ? 'Agentless passive' : `Agent: ${m.agent}`}
- **Rationale**: ${m.explanation}
`).join('\n')}

---

## 3. Final Active Text Output
${copy}
`;
    downloadFile('editorial_audit_report.md', reportContent, 'text/markdown;charset=utf-8;');
  };

  return (
    <div className="w-full rounded-xl border transition-colors duration-200 bg-[#FDFBF7] dark:bg-[#1A1A20] border-amber-900/10 dark:border-amber-500/20 shadow-xs p-5 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">
            One-Click Distribution Manager
          </span>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
            Deploy Optimized Active Voice Copy
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Export directly to CMS, markdown pipelines, or distribution workflows with full voice audit trails.
          </p>
        </div>

        {/* Action Button Cluster */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Prominent Copy Button with animated check */}
          <button
            onClick={handleCopyOptimized}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-98 ${
              copiedState
                ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-600/30'
            }`}
          >
            {copiedState ? (
              <>
                <Check className="w-4 h-4 animate-in zoom-in" />
                <span>Optimized Copy Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Optimized Copy</span>
              </>
            )}
          </button>

          {/* Download Clean Markdown */}
          <button
            onClick={handleDownloadMarkdown}
            title="Download Clean Markdown (.md)"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold border border-amber-800/20 dark:border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>Download .MD</span>
          </button>

          {/* Download Plain Text */}
          <button
            onClick={handleDownloadPlainText}
            title="Download Plain Text (.txt)"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold border border-amber-800/20 dark:border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>Download .TXT</span>
          </button>

          {/* Download Audit Report */}
          <button
            onClick={handleDownloadAuditReport}
            title="Download Full Editorial Audit Report"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold border border-amber-800/20 dark:border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>Audit Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
