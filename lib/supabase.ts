import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Video = {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  thumbnail_url: string;
  category: string;
  duration: string;
  difficulty: string;
  is_premium: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type HealthData = {
  id: string;
  user_id?: string;
  date: string;
  steps: number;
  distance: number;
  calories: number;
  active_minutes: number;
  heart_rate_avg?: number;
  heart_rate_max?: number;
  heart_rate_min?: number;
  sleep_hours?: number;
  weight?: number;
  source: string;
  created_at: string;
  updated_at: string;
};

export type HealthGoals = {
  id: string;
  user_id?: string;
  steps_goal: number;
  calories_goal: number;
  active_minutes_goal: number;
  sleep_goal: number;
  created_at: string;
  updated_at: string;
};

export type UserProfile = {
  id: string;
  user_id?: string;
  age?: number;
  gender?: string;
  biorhythm?: string;
  energy_level?: number;
  activity_level?: string;
  weekly_frequency?: number;
  practice_location?: string;
  goals?: string[];
  training_environment?: string;
  available_equipment?: string[];
  stress_level?: number;
  main_motivations?: string[];
  main_obstacles?: string[];
  hobbies?: string;
  lifestyle_habits?: string;
  lifestyle_mode?: string;
  nutrition_goals?: string[];
  eating_habits?: string;
  sleep_quality?: number;
  restrictions_allergies?: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};