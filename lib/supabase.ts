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

// =============================================
// TYPES
// =============================================

export type UserProfile = {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  age: number | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  fitness_level: 'debutant' | 'intermediaire' | 'confirme' | null;
  goals: string[];
  weekly_frequency: number;
  preferred_time: 'matin' | 'apres-midi' | 'soir' | null;
  practice_location: 'maison' | 'salle' | 'exterieur' | 'mixte' | null;
  available_equipment: string[];
  health_conditions: string[];
  dietary_restrictions: string[];
  sleep_quality: number | null;
  stress_level: number | null;
  is_premium: boolean;
  premium_until: string | null;
  onboarding_completed: boolean;
  xp_points: number;
  current_level: number;
  current_streak: number;
  best_streak: number;
  created_at: string;
  updated_at: string;
};

export type HealthData = {
  id: string;
  user_id: string;
  date: string;
  steps: number;
  distance_km: number;
  calories_burned: number;
  active_minutes: number;
  floors_climbed: number;
  heart_rate_avg: number | null;
  heart_rate_max: number | null;
  heart_rate_min: number | null;
  heart_rate_resting: number | null;
  sleep_hours: number | null;
  sleep_quality_score: number | null;
  sleep_deep_minutes: number | null;
  sleep_light_minutes: number | null;
  sleep_rem_minutes: number | null;
  weight_kg: number | null;
  body_fat_pct: number | null;
  spo2_avg: number | null;
  stress_score: number | null;
  source: string;
  created_at: string;
};

export type HealthGoals = {
  id: string;
  user_id: string;
  steps_daily: number;
  calories_daily: number;
  active_minutes_daily: number;
  sleep_hours_daily: number;
  water_liters_daily: number;
  weight_target_kg: number | null;
};

export type Program = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  duration_weeks: number;
  difficulty: string | null;
  focus: string[];
  is_active: boolean;
  weekly_plan: any;
  nutrition_plan: any;
  recovery_plan: any;
  created_at: string;
};

export type Workout = {
  id: string;
  user_id: string;
  program_id: string | null;
  title: string;
  type: string | null;
  date: string;
  exercises: any[];
  duration_minutes: number | null;
  calories_burned: number | null;
  avg_heart_rate: number | null;
  difficulty_felt: number | null;
  notes: string | null;
  status: 'planned' | 'in_progress' | 'completed' | 'skipped';
  completed_at: string | null;
  created_at: string;
};

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
};

export type Post = {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  post_type: string;
  workout_id: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_profiles?: UserProfile;
};

export type Challenge = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  target_type: string;
  target_value: number;
  xp_reward: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
};

export type Badge = {
  id: string;
  name: string;
  description: string | null;
  icon_name: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  xp_reward: number;
  is_premium: boolean;
};

export type ConnectedDevice = {
  id: string;
  user_id: string;
  device_type: string;
  device_name: string | null;
  is_primary: boolean;
  last_sync_at: string | null;
};

export type MaiaConversation = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type MaiaMessage = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};