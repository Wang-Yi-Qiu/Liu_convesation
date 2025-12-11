export type Role = 'user' | 'model';

export type Emotion = 'neutral' | 'happy' | 'empathetic' | 'excited' | 'pensive' | 'warm';

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  emotion?: Emotion; // Only for model messages
}

export interface Memory {
  id: string;
  content: string;
  date: string;
}

export interface PersonalityConfig {
  name: string;
  trait: 'Gentle' | 'Rational' | 'Energetic';
  voice: string;
}

// Response structure expected from the AI
export interface AIResponse {
  reply: string;
  currentMood: Emotion;
  newMemories: string[]; // Facts extracted from the conversation
}
