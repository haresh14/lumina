export type Mood = 1 | 2 | 3 | 4 | 5;

export interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  mood: Mood;
  sleep_hours: number;
  energy_level: number;
  symptoms: string[];
  interventions: string[];
  notes?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface CorrelationData {
  factor: string;
  correlation: number;
  impact: 'positive' | 'negative' | 'neutral';
}
