export interface MissionWord {
  id: string;
  word: string;
  arabic: string;
  phonics: string[];
  exampleSentence: string;
  emoji: string;
  color: string;
}

export interface GrammarVisualCard {
  label: string;
  arabicLabel: string;
  sentence: string;
  emoji: string;
  color: string;
}

export interface GrammarPractice {
  id: string;
  prompt: string;
  prefix?: string;
  suffix?: string;
  options: string[];
  correctAnswer: string;
  emoji: string;
}

export interface GrammarRule {
  title: string;
  arabicTitle: string;
  formula: string;
  explanation: string;
  arabicExplanation: string;
  visualCards: GrammarVisualCard[];
  practice: GrammarPractice[];
}

export interface StoryLine {
  id: number;
  speaker?: string;
  text: string;
  arabic: string;
  emoji?: string;
}

export interface StoryData {
  title: string;
  arabicTitle: string;
  tagline: string;
  sceneIllustration: 'family' | 'colors' | 'body' | 'park' | 'revision' | 'counting' | 'breakfast' | 'shop' | 'healthy' | 'school';
  lines: StoryLine[];
}

export interface ActivityQuestion {
  id: string;
  type: 'listen-choose' | 'fill-gap' | 'balloon-pop' | 'memory-match';
  instruction: string;
  arabicInstruction: string;
  targetAudioWord?: string;
  options: {
    id: string;
    text: string;
    emoji: string;
    isCorrect?: boolean;
    color?: string;
  }[];
  correctAnswerId: string;
  encouragement: string;
}

export interface Mission {
  id: number;
  missionNumber: number;
  title: string;
  subtitle: string;
  arabicTitle: string;
  badgeEmoji: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    light: string;
    gradient: string;
  };
  words: MissionWord[];
  grammar: GrammarRule;
  story: StoryData;
  activities: ActivityQuestion[];
}

export interface StudentProfile {
  name: string;
  email: string;
  avatar: string;
  stars: number;
  completedWords: string[];
  completedActivities: string[];
  registeredAt: string;
}
