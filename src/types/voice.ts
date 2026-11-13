export interface PassiveSentenceMatch {
  id: string;
  originalSentence: string;
  startIndex: number;
  endIndex: number;
  paragraphIndex: number;
  sentenceIndexInDoc: number;
  passiveIndicator: string; // e.g. "was created by", "is being driven", "has been analyzed"
  auxiliary: string;        // e.g. "was", "has been", "is being"
  participle: string;       // e.g. "created", "driven", "analyzed"
  agent?: string;           // e.g. "the AI", "Sarah", "the engineering team"
  patient?: string;         // recipient of action, e.g. "The blog", "The car"
  activeRevision: string;   // e.g. "The AI created the blog."
  alternativeRevisions?: string[]; // for agentless passives
  explanation: string;      // linguistic rationale
  confidence: number;       // 0 to 1
  isAgentless: boolean;
}

export interface VoiceMetrics {
  totalWords: number;
  totalCharacters: number;
  totalSentences: number;
  passiveSentencesCount: number;
  activeSentencesCount: number;
  passivePercentage: number; // 0 to 100
  readingTimeMinutes: number;
  averageWordsPerSentence: number;
  fleschReadingEase: number; // 0 to 100
  clarityIndex: number;      // 0 to 100
  readingPace: 'Direct & Punchy' | 'Moderate & Balanced' | 'Sluggish & Indirect';
  readingPaceDescription: string;
}

export interface TextAnalysisResult {
  rawText: string;
  sentences: {
    text: string;
    startIndex: number;
    endIndex: number;
    isPassive: boolean;
    match?: PassiveSentenceMatch;
  }[];
  matches: PassiveSentenceMatch[];
  metrics: VoiceMetrics;
}

export interface SampleDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  text: string;
}
