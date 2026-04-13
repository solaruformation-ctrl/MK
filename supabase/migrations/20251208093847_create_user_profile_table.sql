/*
  # Create User Profile Table for Onboarding

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid) - Reference to auth user
      - `age` (integer) - User age
      - `gender` (text) - User gender (homme/femme/autre)
      - `biorhythm` (text) - Preferred time (matin/apres-midi/soir)
      - `energy_level` (integer) - Energy level 1-5
      
      - `activity_level` (text) - Activity level (debutant/intermediaire/confirme)
      - `weekly_frequency` (integer) - Number of training sessions per week
      - `practice_location` (text) - Training location (salle/maison/exterieur/coach/collectif)
      
      - `goals` (text[]) - Array of goals
      - `training_environment` (text) - Training environment (maison/salle)
      - `available_equipment` (text[]) - Array of available equipment
      - `stress_level` (integer) - Stress level 1-5
      
      - `main_motivations` (text[]) - Array of motivations
      - `main_obstacles` (text[]) - Array of obstacles
      - `hobbies` (text) - User hobbies
      - `lifestyle_habits` (text) - Lifestyle habits
      - `lifestyle_mode` (text) - Lifestyle mode (actif/modere/sedentaire)
      
      - `nutrition_goals` (text[]) - Array of nutrition goals
      - `eating_habits` (text) - Eating habits description
      - `sleep_quality` (integer) - Sleep quality 1-5
      - `restrictions_allergies` (text) - Food restrictions/allergies
      
      - `onboarding_completed` (boolean) - Whether onboarding is completed
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on user_profiles table
    - Add policies for authenticated users to manage their own profile
    - Temporary public access for testing

  3. Indexes
    - Index on user_id for fast queries
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  
  age integer,
  gender text,
  biorhythm text,
  energy_level integer DEFAULT 3,
  
  activity_level text,
  weekly_frequency integer,
  practice_location text,
  
  goals text[] DEFAULT '{}',
  training_environment text,
  available_equipment text[] DEFAULT '{}',
  stress_level integer DEFAULT 3,
  
  main_motivations text[] DEFAULT '{}',
  main_obstacles text[] DEFAULT '{}',
  hobbies text,
  lifestyle_habits text,
  lifestyle_mode text,
  
  nutrition_goals text[] DEFAULT '{}',
  eating_habits text,
  sleep_quality integer DEFAULT 3,
  restrictions_allergies text,
  
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can view profiles temporarily"
  ON user_profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can manage profiles temporarily"
  ON user_profiles
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS user_profiles_user_id_idx ON user_profiles(user_id);
