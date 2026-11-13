import React from 'react';
import { VoiceMetrics } from '../types/voice';
import { Gauge, Zap, Clock, BookOpen, CheckCircle, AlertTriangle } from 'lucide-react';

interface ScoreboardProps {
  metrics: VoiceMetrics;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ metrics }) => {
  // SVG circular gauge math
  const size = 110;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Clamp passive percentage between 0 and 100
  const clampedPercent = Math.min(100, Math.max(0, metrics.passivePercentage));
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  // Pace badge styling and icon
  const getPaceDetails = () => {
    switch (metrics.readingPace) {
      case 'Direct & Punchy':
        return {
          textColor: 'text-emerald-700 dark:text-emerald-400',
          bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30',
          icon: <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
        };
      case 'Moderate & Balanced':
        return {
          textColor: 'text-amber-700 dark:text-amber-400',
          bgColor: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/30',
          icon: <Gauge className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
        };
      case 'Sluggish & Indirect':
      default:
        return {
          textColor: 'text-orange-700 dark:text-orange-400',
          bgColor: 'bg-orange-500/10 dark:bg-orange-500/15 border-orange-500/30',
          icon: <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />,
        };
    }
  };

  const paceDetails = getPaceDetails();

  return (
    <section aria-label="Readability and Voice Metrics" className="w-full">
      <div className="rounded-xl border transition-colors duration-200 bg-[#FDFBF7] dark:bg-[#1A1A20] border-amber-900/10 dark:border-amber-500/20 shadow-xs p-5 md:p-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          
          {/* Circular Percentage Ring + Target */}
          <div className="flex items-center gap-5 shrink-0 border-b lg:border-b-0 lg:border-r border-amber-900/10 dark:border-amber-500/15 pb-5 lg:pb-0 lg:pr-8">
            <div className="relative flex items-center justify-center">
              <svg width={size} height={size} className="transform -rotate-90">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  className="text-stone-200 dark:text-stone-800"
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="url(#sunsetGradient)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
                <defs>
                  <linearGradient id="sunsetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFB000" />
                    <stop offset="50%" stopColor="#FF8C00" />
                    <stop offset="100%" stopColor="#FF4500" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
                  {metrics.passivePercentage}%
                </span>
                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  Passive
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">
                Voice Ratio
              </span>
              <p className="text-sm font-medium text-stone-800 dark:text-stone-200 mt-0.5">
                Target: <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">&lt; 10%</span>
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-[170px]">
                {metrics.passivePercentage <= 10
                  ? 'Optimal target achieved for professional prose.'
                  : `${metrics.passiveSentencesCount} passive ${metrics.passiveSentencesCount === 1 ? 'sentence' : 'sentences'} to convert.`}
              </p>
            </div>
          </div>

          {/* Reading Pace Alert & Tone Score */}
          <div className="flex-1 flex flex-col justify-center space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${paceDetails.bgColor} ${paceDetails.textColor}`}>
                {paceDetails.icon}
                <span>Reading Pace: {metrics.readingPace}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300">
                <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Clarity Index: <strong className="font-mono tabular-nums text-stone-900 dark:text-stone-100">{metrics.clarityIndex}/100</strong></span>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300">
                <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Flesch Ease: <strong className="font-mono tabular-nums text-stone-900 dark:text-stone-100">{metrics.fleschReadingEase}</strong></span>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {metrics.readingPaceDescription}
            </p>
          </div>

          {/* Granular Numerals Strip (using tabular figures) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-amber-900/10 dark:border-amber-500/15">
            <div className="p-2.5 rounded-lg bg-amber-500/5 dark:bg-amber-500/10 border border-amber-800/10 dark:border-amber-500/15 text-center">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Sentences</span>
              <span className="text-base font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
                {metrics.totalSentences}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-500/5 dark:bg-amber-500/10 border border-amber-800/10 dark:border-amber-500/15 text-center">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Passive / Active</span>
              <span className="text-base font-bold font-mono tabular-nums text-amber-700 dark:text-amber-400">
                {metrics.passiveSentencesCount} <span className="text-stone-400 font-normal">/</span> {metrics.activeSentencesCount}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-500/5 dark:bg-amber-500/10 border border-amber-800/10 dark:border-amber-500/15 text-center">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Avg Words/Sent</span>
              <span className="text-base font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
                {metrics.averageWordsPerSentence}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-500/5 dark:bg-amber-500/10 border border-amber-800/10 dark:border-amber-500/15 text-center">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                Read Time
              </span>
              <span className="text-base font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
                {metrics.readingTimeMinutes}m
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
