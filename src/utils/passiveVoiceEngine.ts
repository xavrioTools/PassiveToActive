import { PassiveSentenceMatch, TextAnalysisResult, VoiceMetrics } from '../types/voice';

// Comprehensive verb inflection dictionary for English irregulars & common passives
interface VerbForms {
  base: string;
  past: string;
  pres3: string;
  presPl: string;
  ing: string;
  participle: string;
}

const IRREGULAR_VERB_MAP: Record<string, VerbForms> = {
  written: { base: 'write', past: 'wrote', pres3: 'writes', presPl: 'write', ing: 'writing', participle: 'written' },
  driven: { base: 'drive', past: 'drove', pres3: 'drives', presPl: 'drive', ing: 'driving', participle: 'driven' },
  analyzed: { base: 'analyze', past: 'analyzed', pres3: 'analyzes', presPl: 'analyze', ing: 'analyzing', participle: 'analyzed' },
  analysed: { base: 'analyse', past: 'analysed', pres3: 'analyses', presPl: 'analyse', ing: 'analysing', participle: 'analysed' },
  created: { base: 'create', past: 'created', pres3: 'creates', presPl: 'create', ing: 'creating', participle: 'created' },
  built: { base: 'build', past: 'built', pres3: 'builds', presPl: 'build', ing: 'building', participle: 'built' },
  made: { base: 'make', past: 'made', pres3: 'makes', presPl: 'make', ing: 'making', participle: 'made' },
  found: { base: 'find', past: 'found', pres3: 'finds', presPl: 'find', ing: 'finding', participle: 'found' },
  seen: { base: 'see', past: 'saw', pres3: 'sees', presPl: 'see', ing: 'seeing', participle: 'seen' },
  given: { base: 'give', past: 'gave', pres3: 'gives', presPl: 'give', ing: 'giving', participle: 'given' },
  taken: { base: 'take', past: 'took', pres3: 'takes', presPl: 'take', ing: 'taking', participle: 'taken' },
  chosen: { base: 'choose', past: 'chose', pres3: 'chooses', presPl: 'choose', ing: 'choosing', participle: 'chosen' },
  developed: { base: 'develop', past: 'developed', pres3: 'develops', presPl: 'develop', ing: 'developing', participle: 'developed' },
  conducted: { base: 'conduct', past: 'conducted', pres3: 'conducts', presPl: 'conduct', ing: 'conducting', participle: 'conducted' },
  discovered: { base: 'discover', past: 'discovered', pres3: 'discovers', presPl: 'discover', ing: 'discovering', participle: 'discovered' },
  tested: { base: 'test', past: 'tested', pres3: 'tests', presPl: 'test', ing: 'testing', participle: 'tested' },
  launched: { base: 'launch', past: 'launched', pres3: 'launches', presPl: 'launch', ing: 'launching', participle: 'launched' },
  presented: { base: 'present', past: 'presented', pres3: 'presents', presPl: 'present', ing: 'presenting', participle: 'presented' },
  established: { base: 'establish', past: 'established', pres3: 'establishes', presPl: 'establish', ing: 'establishing', participle: 'established' },
  executed: { base: 'execute', past: 'executed', pres3: 'executes', presPl: 'execute', ing: 'executing', participle: 'executed' },
  shipped: { base: 'ship', past: 'shipped', pres3: 'ships', presPl: 'ship', ing: 'shipping', participle: 'shipped' },
  designed: { base: 'design', past: 'designed', pres3: 'designs', presPl: 'design', ing: 'designing', participle: 'designed' },
  published: { base: 'publish', past: 'published', pres3: 'publishes', presPl: 'publish', ing: 'publishing', participle: 'published' },
  solved: { base: 'solve', past: 'solved', pres3: 'solves', presPl: 'solve', ing: 'solving', participle: 'solved' },
  delayed: { base: 'delay', past: 'delayed', pres3: 'delays', presPl: 'delay', ing: 'delaying', participle: 'delayed' },
  authorized: { base: 'authorize', past: 'authorized', pres3: 'authorizes', presPl: 'authorize', ing: 'authorizing', participle: 'authorized' },
  reported: { base: 'report', past: 'reported', pres3: 'reports', presPl: 'report', ing: 'reporting', participle: 'reported' },
  observed: { base: 'observe', past: 'observed', pres3: 'observes', presPl: 'observe', ing: 'observing', participle: 'observed' },
  reviewed: { base: 'review', past: 'reviewed', pres3: 'reviews', presPl: 'review', ing: 'reviewing', participle: 'reviewed' },
  implemented: { base: 'implement', past: 'implemented', pres3: 'implements', presPl: 'implement', ing: 'implementing', participle: 'implemented' },
  delivered: { base: 'deliver', past: 'delivered', pres3: 'delivers', presPl: 'deliver', ing: 'delivering', participle: 'delivered' },
  approved: { base: 'approve', past: 'approved', pres3: 'approves', presPl: 'approve', ing: 'approving', participle: 'approved' },
  introduced: { base: 'introduce', past: 'introduced', pres3: 'introduces', presPl: 'introduce', ing: 'introducing', participle: 'introduced' },
  fixed: { base: 'fix', past: 'fixed', pres3: 'fixes', presPl: 'fix', ing: 'fixing', participle: 'fixed' },
  completed: { base: 'complete', past: 'completed', pres3: 'completes', presPl: 'complete', ing: 'completing', participle: 'completed' },
  upgraded: { base: 'upgrade', past: 'upgraded', pres3: 'upgrades', presPl: 'upgrade', ing: 'upgrading', participle: 'upgraded' },
  sent: { base: 'send', past: 'sent', pres3: 'sends', presPl: 'send', ing: 'sending', participle: 'sent' },
  told: { base: 'tell', past: 'told', pres3: 'tells', presPl: 'tell', ing: 'telling', participle: 'told' },
  known: { base: 'know', past: 'knew', pres3: 'knows', presPl: 'know', ing: 'knowing', participle: 'known' },
  understood: { base: 'understand', past: 'understood', pres3: 'understands', presPl: 'understand', ing: 'understanding', participle: 'understood' },
  held: { base: 'hold', past: 'held', pres3: 'holds', presPl: 'hold', ing: 'holding', participle: 'held' },
  brought: { base: 'bring', past: 'brought', pres3: 'brings', presPl: 'bring', ing: 'bringing', participle: 'brought' },
  bought: { base: 'buy', past: 'bought', pres3: 'buys', presPl: 'buy', ing: 'buying', participle: 'bought' },
  caught: { base: 'catch', past: 'caught', pres3: 'catches', presPl: 'catch', ing: 'catching', participle: 'caught' },
  taught: { base: 'teach', past: 'taught', pres3: 'teaches', presPl: 'teach', ing: 'teaching', participle: 'taught' },
  left: { base: 'leave', past: 'left', pres3: 'leaves', presPl: 'leave', ing: 'leaving', participle: 'left' },
  kept: { base: 'keep', past: 'kept', pres3: 'keeps', presPl: 'keep', ing: 'keeping', participle: 'kept' },
  met: { base: 'meet', past: 'met', pres3: 'meets', presPl: 'meet', ing: 'meeting', participle: 'met' },
  set: { base: 'set', past: 'set', pres3: 'sets', presPl: 'set', ing: 'setting', participle: 'set' },
  read: { base: 'read', past: 'read', pres3: 'reads', presPl: 'read', ing: 'reading', participle: 'read' },
  paid: { base: 'pay', past: 'paid', pres3: 'pays', presPl: 'pay', ing: 'paying', participle: 'paid' },
  spent: { base: 'spend', past: 'spent', pres3: 'spends', presPl: 'spend', ing: 'spending', participle: 'spent' },
  lost: { base: 'lose', past: 'lost', pres3: 'loses', presPl: 'lose', ing: 'losing', participle: 'lost' },
  sold: { base: 'sell', past: 'sold', pres3: 'sells', presPl: 'sell', ing: 'selling', participle: 'sold' },
  won: { base: 'win', past: 'won', pres3: 'wins', presPl: 'win', ing: 'winning', participle: 'won' },
  broken: { base: 'break', past: 'broke', pres3: 'breaks', presPl: 'break', ing: 'breaking', participle: 'broken' },
  spoken: { base: 'speak', past: 'spoke', pres3: 'speaks', presPl: 'speak', ing: 'speaking', participle: 'spoken' },
  stolen: { base: 'steal', past: 'stole', pres3: 'steals', presPl: 'steal', ing: 'stealing', participle: 'stolen' },
  shown: { base: 'show', past: 'showed', pres3: 'shows', presPl: 'show', ing: 'showing', participle: 'shown' },
  eaten: { base: 'eat', past: 'ate', pres3: 'eats', presPl: 'eat', ing: 'eating', participle: 'eaten' },
  done: { base: 'do', past: 'did', pres3: 'does', presPl: 'do', ing: 'doing', participle: 'done' },
  gone: { base: 'go', past: 'went', pres3: 'goes', presPl: 'go', ing: 'going', participle: 'gone' },
  prepared: { base: 'prepare', past: 'prepared', pres3: 'prepares', presPl: 'prepare', ing: 'preparing', participle: 'prepared' },
  processed: { base: 'process', past: 'processed', pres3: 'processes', presPl: 'process', ing: 'processing', participle: 'processed' },
  calculated: { base: 'calculate', past: 'calculated', pres3: 'calculates', presPl: 'calculate', ing: 'calculating', participle: 'calculated' },
  evaluated: { base: 'evaluate', past: 'evaluated', pres3: 'evaluates', presPl: 'evaluate', ing: 'evaluating', participle: 'evaluated' },
  identified: { base: 'identify', past: 'identified', pres3: 'identifies', presPl: 'identify', ing: 'identifying', participle: 'identified' },
  resolved: { base: 'resolve', past: 'resolved', pres3: 'resolves', presPl: 'resolve', ing: 'resolving', participle: 'resolved' },
  configured: { base: 'configure', past: 'configured', pres3: 'configures', presPl: 'configure', ing: 'configuring', participle: 'configured' },
  examined: { base: 'examine', past: 'examined', pres3: 'examines', presPl: 'examine', ing: 'examining', participle: 'examined' },
  managed: { base: 'manage', past: 'managed', pres3: 'manages', presPl: 'manage', ing: 'managing', participle: 'managed' },
  handled: { base: 'handle', past: 'handled', pres3: 'handles', presPl: 'handle', ing: 'handling', participle: 'handled' },
  engineered: { base: 'engineer', past: 'engineered', pres3: 'engineers', presPl: 'engineer', ing: 'engineering', participle: 'engineered' },
  validated: { base: 'validate', past: 'validated', pres3: 'validates', presPl: 'validate', ing: 'validating', participle: 'validated' },
};

// Words that end in -ed or resemble participles but are almost always predicate adjectives, not passive verbs
const PREDICATE_ADJECTIVES = new Set([
  'interested', 'tired', 'excited', 'bored', 'exhausted', 'located', 'situated',
  'based', 'born', 'married', 'closed', 'crowded', 'worried', 'confused', 'surprised',
  'pleased', 'delighted', 'disappointed', 'ashamed', 'scared', 'composed', 'dedicated',
  'united', 'relieved', 'skilled', 'talented', 'experienced', 'sophisticated'
]);

// Helper to inflect regular verb participle to other tenses
function getVerbForms(participle: string): VerbForms {
  const lower = participle.toLowerCase();
  if (IRREGULAR_VERB_MAP[lower]) {
    return IRREGULAR_VERB_MAP[lower];
  }

  // Derive regular verb forms from -ed
  if (lower.endsWith('ied')) {
    const stem = lower.slice(0, -3);
    const base = stem + 'y';
    return {
      base,
      past: lower,
      pres3: stem + 'ies',
      presPl: base,
      ing: stem + 'ying',
      participle: lower,
    };
  }

  if (lower.endsWith('ed')) {
    // e.g. "created" -> "create", "walked" -> "walk", "stopped" -> "stop"
    let base = lower.slice(0, -2);
    // Double consonant check (e.g., stopped -> stop)
    if (base.length > 3 && base[base.length - 1] === base[base.length - 2] && !['l', 's'].includes(base[base.length - 1])) {
      base = base.slice(0, -1);
    } else if (lower.endsWith('ted') || lower.endsWith('ded') || lower.endsWith('ced') || lower.endsWith('zed') || lower.endsWith('red') || lower.endsWith('sed')) {
      base = lower.slice(0, -1); // e.g. created -> create, analyzed -> analyze
    }

    return {
      base,
      past: lower,
      pres3: base.endsWith('e') ? base + 's' : base + 'es',
      presPl: base,
      ing: base.endsWith('e') ? base.slice(0, -1) + 'ing' : base + 'ing',
      participle: lower,
    };
  }

  return {
    base: lower,
    past: lower + 'ed',
    pres3: lower + 's',
    presPl: lower,
    ing: lower + 'ing',
    participle: lower,
  };
}

// Pronoun conversions
const OBJECTIVE_TO_SUBJECTIVE: Record<string, string> = {
  him: 'he',
  her: 'she',
  them: 'they',
  us: 'we',
  me: 'I',
  whom: 'who',
};

const SUBJECTIVE_TO_OBJECTIVE: Record<string, string> = {
  he: 'him',
  she: 'her',
  they: 'them',
  we: 'us',
  i: 'me',
  who: 'whom',
};

// Check if an agent is grammatically plural
function isPluralAgent(agent: string): boolean {
  const lower = agent.trim().toLowerCase();
  if (['they', 'we', 'people', 'researchers', 'engineers', 'developers', 'users', 'scientists', 'authors', 'writers', 'critics', 'students'].includes(lower)) {
    return true;
  }
  if (lower.includes(' and ') || lower.includes(' & ')) {
    return true;
  }
  if (lower.endsWith('s') && !lower.endsWith('ss') && !['news', 'series', 'species', 'analysis'].includes(lower)) {
    return true;
  }
  return false;
}

// Sentence segmentation supporting abbreviations and numbers
export function splitIntoSentences(text: string): { text: string; startIndex: number; endIndex: number }[] {
  if (!text || !text.trim()) return [];

  const sentences: { text: string; startIndex: number; endIndex: number }[] = [];
  
  // Regex to split on sentence terminals (. ! ? followed by space or newline or EOF)
  // while not splitting on common abbreviations
  const abbrRegex = /\b(e\.g\.|i\.e\.|dr\.|mr\.|mrs\.|ms\.|prof\.|vs\.|inc\.|ltd\.|co\.|u\.s\.|etc\.)\s*$/i;
  
  let currentStart = 0;
  let inQuote = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' || char === '“' || char === '”') {
      inQuote = !inQuote;
    }
    
    // Check for sentence terminator
    if ((char === '.' || char === '!' || char === '?') && !inQuote) {
      const nextChar = text[i + 1];
      const isEnd = i === text.length - 1 || /\s/.test(nextChar);
      
      if (isEnd) {
        const potentialSentence = text.substring(currentStart, i + 1);
        
        // Skip if this looks like an abbreviation
        if (abbrRegex.test(potentialSentence.trim())) {
          continue;
        }

        // Avoid splitting on decimals like 3.14
        if (char === '.' && /\d/.test(text[i - 1] || '') && /\d/.test(nextChar || '')) {
          continue;
        }

        // We have a sentence boundary
        const trimmed = potentialSentence.trim();
        if (trimmed.length > 0) {
          const leadingWhitespace = potentialSentence.match(/^\s*/)?.[0].length || 0;
          const sentenceStartIndex = currentStart + leadingWhitespace;
          const sentenceEndIndex = sentenceStartIndex + trimmed.length;
          
          sentences.push({
            text: trimmed,
            startIndex: sentenceStartIndex,
            endIndex: sentenceEndIndex,
          });
        }
        
        currentStart = i + 1;
      }
    }
  }

  // Trailing text without punctuation
  if (currentStart < text.length) {
    const remaining = text.substring(currentStart);
    const trimmed = remaining.trim();
    if (trimmed.length > 0) {
      const leadingWhitespace = remaining.match(/^\s*/)?.[0].length || 0;
      sentences.push({
        text: trimmed,
        startIndex: currentStart + leadingWhitespace,
        endIndex: currentStart + leadingWhitespace + trimmed.length,
      });
    }
  }

  return sentences;
}

// Syllable counter for Flesch Readability calculation
export function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// Linguistic Passive Voice Detector and Active Converter
export function analyzeSentenceForPassive(
  sentence: string,
  startIndex: number,
  endIndex: number,
  sentenceIndexInDoc: number,
  paragraphIndex: number
): PassiveSentenceMatch | null {
  // Pattern components:
  // Auxiliaries:
  // 1. Simple: is, am, are, was, were
  // 2. Progressive/Continuous: is being, are being, was being, were being
  // 3. Perfect: has been, have been, had been
  // 4. Modal: can be, could be, may be, might be, must be, should be, would be, will be, shall be
  // 5. Modal Perfect: will have been, should have been, could have been, must have been, might have been
  // 6. Get-passive: got, gets, getting + participle

  const passivePattern = /\b(?:(is|am|are|was|were)\s+being|(has|have|had)\s+been|(can|could|may|might|must|should|would|will|shall)\s+be|(will|should|could|must|might)\s+have\s+been|(is|am|are|was|were|got|gets))\s+(?:([a-z]+ly)\s+)?([a-z]+(?:ed|en|t|wn|ne|pt))\b/i;

  const match = sentence.match(passivePattern);
  if (!match) return null;

  const matchedPhrase = match[0];
  const adverb = match[6] || '';
  const participle = match[7].toLowerCase();

  // Filter out predicate adjectives unless followed by "by <agent>"
  const hasByAgent = /\bby\s+([A-Za-z0-9_\-'\s]{2,40})/i.test(sentence);
  if (PREDICATE_ADJECTIVES.has(participle) && !hasByAgent) {
    return null;
  }

  // Extract auxiliary
  const auxEndIndex = matchedPhrase.lastIndexOf(participle);
  const auxiliary = matchedPhrase.substring(0, auxEndIndex).trim();

  // Identify patient (the grammatical subject being acted upon)
  const matchIndex = sentence.indexOf(matchedPhrase);
  let patient = sentence.substring(0, matchIndex).trim();
  
  // Clean up leading conjunctions or punctuation
  patient = patient.replace(/^(although|however|meanwhile|furthermore|additionally|therefore|and|but|yet|so)\s*,?\s*/i, '');

  // Extract agent (if "by <agent>" exists)
  const afterVerb = sentence.substring(matchIndex + matchedPhrase.length);
  const byMatch = afterVerb.match(/\s+by\s+((?:the\s+|a\s+|an\s+|our\s+|their\s+|his\s+|her\s+|my\s+)?[A-Z]?[a-z0-9\-]+(?:\s+[a-z0-9\-]+){0,4})(?=[,.;:!?\s]|$)/i);

  let agent = '';
  let isAgentless = true;
  let remainingClause = afterVerb;

  if (byMatch) {
    agent = byMatch[1].trim();
    isAgentless = false;
    remainingClause = afterVerb.replace(byMatch[0], '');
  }

  // Build active revision
  const verbForms = getVerbForms(participle);
  const auxLower = auxiliary.toLowerCase();

  // Determine active verb phrase based on passive auxiliary and agent plurality
  let activeVerbPhrase = '';
  const isPlural = agent ? isPluralAgent(agent) : false;

  if (auxLower.includes('being')) {
    // Progressive: "is being driven" -> "is driving", "was being tested" -> "was testing"
    if (auxLower.startsWith('is') || auxLower.startsWith('are') || auxLower.startsWith('am')) {
      activeVerbPhrase = (isPlural ? 'are ' : 'is ') + (adverb ? adverb + ' ' : '') + verbForms.ing;
    } else {
      activeVerbPhrase = (isPlural ? 'were ' : 'was ') + (adverb ? adverb + ' ' : '') + verbForms.ing;
    }
  } else if (auxLower.includes('have been') || auxLower.includes('has been')) {
    // Present perfect: "has been analyzed" -> "has analyzed"
    const perfAux = isPlural ? 'have' : 'has';
    activeVerbPhrase = `${perfAux} ${adverb ? adverb + ' ' : ''}${verbForms.participle}`;
  } else if (auxLower.includes('had been')) {
    activeVerbPhrase = `had ${adverb ? adverb + ' ' : ''}${verbForms.participle}`;
  } else if (auxLower.includes('will be')) {
    activeVerbPhrase = `will ${adverb ? adverb + ' ' : ''}${verbForms.base}`;
  } else if (auxLower.includes('can be')) {
    activeVerbPhrase = `can ${adverb ? adverb + ' ' : ''}${verbForms.base}`;
  } else if (auxLower.includes('could be')) {
    activeVerbPhrase = `could ${adverb ? adverb + ' ' : ''}${verbForms.base}`;
  } else if (auxLower.includes('should be')) {
    activeVerbPhrase = `should ${adverb ? adverb + ' ' : ''}${verbForms.base}`;
  } else if (auxLower.includes('must be')) {
    activeVerbPhrase = `must ${adverb ? adverb + ' ' : ''}${verbForms.base}`;
  } else if (auxLower.includes('would be')) {
    activeVerbPhrase = `would ${adverb ? adverb + ' ' : ''}${verbForms.base}`;
  } else if (auxLower.includes('may be')) {
    activeVerbPhrase = `may ${adverb ? adverb + ' ' : ''}${verbForms.base}`;
  } else if (auxLower.includes('might be')) {
    activeVerbPhrase = `might ${adverb ? adverb + ' ' : ''}${verbForms.base}`;
  } else if (auxLower === 'was' || auxLower === 'were' || auxLower === 'got') {
    // Simple past: "was created" -> "created"
    activeVerbPhrase = `${adverb ? adverb + ' ' : ''}${verbForms.past}`;
  } else if (auxLower === 'is' || auxLower === 'are' || auxLower === 'am' || auxLower === 'gets') {
    // Simple present: "is created" -> "creates" / "create"
    const presVerb = isPlural ? verbForms.presPl : verbForms.pres3;
    activeVerbPhrase = `${adverb ? adverb + ' ' : ''}${presVerb}`;
  } else {
    // Fallback past
    activeVerbPhrase = `${adverb ? adverb + ' ' : ''}${verbForms.past}`;
  }

  // Adjust patient pronouns (e.g., "They were seen by Michael" -> "Michael saw them")
  let adjustedPatient = patient.trim();
  const lowerPatient = adjustedPatient.toLowerCase();
  if (SUBJECTIVE_TO_OBJECTIVE[lowerPatient]) {
    adjustedPatient = SUBJECTIVE_TO_OBJECTIVE[lowerPatient];
  } else if (adjustedPatient.length > 0) {
    // Lowercase first letter if it was capitalized purely because it was sentence-initial
    if (/^[A-Z][a-z]/.test(adjustedPatient) && !/^(I|God|America|Europe|Asia|London|New York)/.test(adjustedPatient)) {
      adjustedPatient = adjustedPatient[0].toLowerCase() + adjustedPatient.slice(1);
    }
  }

  // Construct active revision
  let activeRevision = '';
  const alternatives: string[] = [];

  const punctuationMatch = sentence.match(/[.!?]+$/);
  const punctuation = punctuationMatch ? punctuationMatch[0] : '.';
  const cleanRemaining = remainingClause.replace(/[.!?]+$/, '').trim();

  if (!isAgentless && agent) {
    // Transform pronoun if agent was e.g. "by him" -> "He"
    let subjectAgent = agent;
    const lowerAgent = agent.toLowerCase();
    if (OBJECTIVE_TO_SUBJECTIVE[lowerAgent]) {
      subjectAgent = OBJECTIVE_TO_SUBJECTIVE[lowerAgent];
    }
    // Capitalize agent
    subjectAgent = subjectAgent.charAt(0).toUpperCase() + subjectAgent.slice(1);

    if (adjustedPatient) {
      activeRevision = `${subjectAgent} ${activeVerbPhrase} ${adjustedPatient}${cleanRemaining ? ' ' + cleanRemaining : ''}${punctuation}`;
    } else {
      activeRevision = `${subjectAgent} ${activeVerbPhrase}${cleanRemaining ? ' ' + cleanRemaining : ''}${punctuation}`;
    }
  } else {
    // Agentless passive: generate contextually sound active voice with sensible defaults
    const defaultAgents = ['The team', 'We', 'Researchers', 'The author', 'The system'];
    
    // Choose most natural primary agent based on context
    let primaryAgent = 'The team';
    const sLower = sentence.toLowerCase();
    if (sLower.includes('study') || sLower.includes('experiment') || sLower.includes('data') || sLower.includes('observed') || sLower.includes('hypothesis')) {
      primaryAgent = 'Researchers';
    } else if (sLower.includes('code') || sLower.includes('software') || sLower.includes('server') || sLower.includes('feature') || sLower.includes('deploy')) {
      primaryAgent = 'The engineering team';
    } else if (sLower.includes('article') || sLower.includes('essay') || sLower.includes('blog') || sLower.includes('book')) {
      primaryAgent = 'The author';
    } else if (sLower.includes('mistakes were made')) {
      primaryAgent = 'We';
    } else if (sLower.includes('decision') || sLower.includes('budget') || sLower.includes('policy')) {
      primaryAgent = 'Leadership';
    }

    if (adjustedPatient) {
      activeRevision = `${primaryAgent} ${activeVerbPhrase} ${adjustedPatient}${cleanRemaining ? ' ' + cleanRemaining : ''}${punctuation}`;
    } else {
      activeRevision = `${primaryAgent} ${activeVerbPhrase}${cleanRemaining ? ' ' + cleanRemaining : ''}${punctuation}`;
    }

    // Build alternative options
    for (const alt of defaultAgents) {
      if (alt !== primaryAgent) {
        alternatives.push(`${alt} ${activeVerbPhrase} ${adjustedPatient || ''}${cleanRemaining ? ' ' + cleanRemaining : ''}${punctuation}`.replace(/\s+/g, ' ').trim());
      }
    }
  }

  // Explanation text
  let explanation = '';
  if (!isAgentless && agent) {
    explanation = `The subject "${patient || 'clause'}" passively receives the action. Make "${agent}" the active subject to state who performed the action directly.`;
  } else {
    explanation = `The sentence uses an agentless passive ("${matchedPhrase}"), concealing who or what is performing the action. Introducing a clear agent strengthens clarity and accountability.`;
  }

  const passiveIndicator = byMatch ? `${matchedPhrase} ${byMatch[0].trim()}` : matchedPhrase;

  return {
    id: `passive-${sentenceIndexInDoc}-${startIndex}`,
    originalSentence: sentence,
    startIndex,
    endIndex,
    paragraphIndex,
    sentenceIndexInDoc,
    passiveIndicator,
    auxiliary,
    participle,
    agent: agent || undefined,
    patient: patient || undefined,
    activeRevision,
    alternativeRevisions: alternatives.length > 0 ? alternatives : undefined,
    explanation,
    confidence: isAgentless ? 0.88 : 0.98,
    isAgentless,
  };
}

// Full text analyzer
export function analyzeFullText(text: string): TextAnalysisResult {
  if (!text || !text.trim()) {
    return {
      rawText: text,
      sentences: [],
      matches: [],
      metrics: {
        totalWords: 0,
        totalCharacters: 0,
        totalSentences: 0,
        passiveSentencesCount: 0,
        activeSentencesCount: 0,
        passivePercentage: 0,
        readingTimeMinutes: 0,
        averageWordsPerSentence: 0,
        fleschReadingEase: 100,
        clarityIndex: 100,
        readingPace: 'Direct & Punchy',
        readingPaceDescription: 'Add text to analyze sentence structure and reading momentum.',
      },
    };
  }

  const rawSentences = splitIntoSentences(text);
  const matches: PassiveSentenceMatch[] = [];

  const sentencesWithStatus = rawSentences.map((s, idx) => {
    // Estimate paragraph index by counting newlines prior to start
    const priorText = text.substring(0, s.startIndex);
    const paragraphIndex = (priorText.match(/\n\n+/g) || []).length;

    const match = analyzeSentenceForPassive(s.text, s.startIndex, s.endIndex, idx, paragraphIndex);
    if (match) {
      matches.push(match);
      return {
        text: s.text,
        startIndex: s.startIndex,
        endIndex: s.endIndex,
        isPassive: true,
        match,
      };
    }
    return {
      text: s.text,
      startIndex: s.startIndex,
      endIndex: s.endIndex,
      isPassive: false,
    };
  });

  // Calculate words and syllables
  const words = text.trim().match(/\b[A-Za-z0-9'-]+\b/g) || [];
  const totalWords = words.length;
  const totalCharacters = text.length;
  const totalSentences = rawSentences.length || 1;
  const passiveSentencesCount = matches.length;
  const activeSentencesCount = Math.max(0, totalSentences - passiveSentencesCount);
  const passivePercentage = Math.round((passiveSentencesCount / totalSentences) * 100);

  let totalSyllables = 0;
  for (const w of words) {
    totalSyllables += countSyllables(w);
  }

  // Average words per sentence
  const averageWordsPerSentence = totalWords > 0 ? Number((totalWords / totalSentences).toFixed(1)) : 0;

  // Flesch Reading Ease: 206.835 - (1.015 * ASL) - (84.6 * ASW)
  const asl = totalWords / totalSentences;
  const asw = totalWords > 0 ? totalSyllables / totalWords : 1;
  let flesch = 206.835 - 1.015 * asl - 84.6 * asw;
  flesch = Math.min(100, Math.max(0, Math.round(flesch)));

  // Clarity score: penalizes high passive ratio & overly complex sentences
  const passivePenalty = Math.min(50, passivePercentage * 1.5);
  const lengthPenalty = Math.max(0, (averageWordsPerSentence - 16) * 1.5);
  const clarityIndex = Math.min(100, Math.max(10, Math.round(100 - passivePenalty - lengthPenalty)));

  // Reading time (assume 200 words per minute)
  const readingTimeMinutes = Number((totalWords / 200).toFixed(1));

  // Reading Pace Alert
  let readingPace: 'Direct & Punchy' | 'Moderate & Balanced' | 'Sluggish & Indirect' = 'Direct & Punchy';
  let readingPaceDescription = '';

  if (passivePercentage <= 10 && averageWordsPerSentence <= 19) {
    readingPace = 'Direct & Punchy';
    readingPaceDescription = 'Strong dynamic rhythm with high agency and rapid momentum (< 10% passive voice).';
  } else if (passivePercentage <= 25 && averageWordsPerSentence <= 24) {
    readingPace = 'Moderate & Balanced';
    readingPaceDescription = 'Acceptable editorial clarity, but replacing remaining passive sentences will sharpen reader engagement.';
  } else {
    readingPace = 'Sluggish & Indirect';
    readingPaceDescription = 'High passive sentence density slows down comprehension and weakens personal authority.';
  }

  return {
    rawText: text,
    sentences: sentencesWithStatus,
    matches,
    metrics: {
      totalWords,
      totalCharacters,
      totalSentences,
      passiveSentencesCount,
      activeSentencesCount,
      passivePercentage,
      readingTimeMinutes,
      averageWordsPerSentence,
      fleschReadingEase: flesch,
      clarityIndex,
      readingPace,
      readingPaceDescription,
    },
  };
}

// One-click replace a single passive sentence in the document
export function replaceSentenceInText(
  originalText: string,
  match: PassiveSentenceMatch,
  newSentence: string
): string {
  // Use exact slice if indices still match, or fallback to exact string search
  const original = match.originalSentence;
  const exactSubstring = originalText.substring(match.startIndex, match.endIndex);
  
  if (exactSubstring === original) {
    return originalText.substring(0, match.startIndex) + newSentence + originalText.substring(match.endIndex);
  }

  // Fallback to replacing first occurrence
  return originalText.replace(original, newSentence);
}

// Convert all detected passive sentences to active
export function convertAllPassivesToActive(
  originalText: string,
  matches: PassiveSentenceMatch[]
): string {
  let updatedText = originalText;
  // Sort descending by startIndex to preserve offsets during surgical replacements
  const sorted = [...matches].sort((a, b) => b.startIndex - a.startIndex);
  
  for (const m of sorted) {
    updatedText = replaceSentenceInText(updatedText, m, m.activeRevision);
  }
  
  return updatedText;
}
