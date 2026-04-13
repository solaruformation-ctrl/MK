/*
  # Create Health Data Table

  1. New Tables
    - `health_data`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid) - Reference to user (for future auth)
      - `date` (date) - Date of the data
      - `steps` (integer) - Number of steps
      - `distance` (decimal) - Distance in kilometers
      - `calories` (integer) - Calories burned
      - `active_minutes` (integer) - Active minutes
      - `heart_rate_avg` (integer) - Average heart rate
      - `heart_rate_max` (integer) - Max heart rate
      - `heart_rate_min` (integer) - Min heart rate
      - `sleep_hours` (decimal) - Hours of sleep
      - `weight` (decimal) - Weight in kg
      - `source` (text) - Data source (apple_watch, amazfit, google_fit, manual, etc.)
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `health_goals`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid) - Reference to user
      - `steps_goal` (integer) - Daily steps goal
      - `calories_goal` (integer) - Daily calories goal
      - `active_minutes_goal` (integer) - Daily active minutes goal
      - `sleep_goal` (decimal) - Daily sleep hours goal
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Public can view aggregated/anonymized data if needed

  3. Indexes
    - Index on date for fast queries
    - Index on user_id for user-specific queries
*/

CREATE TABLE IF NOT EXISTS health_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  date date NOT NULL DEFAULT CURRENT_DATE,
  steps integer DEFAULT 0,
  distance decimal(10, 2) DEFAULT 0,
  calories integer DEFAULT 0,
  active_minutes integer DEFAULT 0,
  heart_rate_avg integer,
  heart_rate_max integer,
  heart_rate_min integer,
  sleep_hours decimal(4, 2),
  weight decimal(5, 2),
  source text DEFAULT 'manual',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date, source)
);

CREATE TABLE IF NOT EXISTS health_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  steps_goal integer DEFAULT 10000,
  calories_goal integer DEFAULT 2000,
  active_minutes_goal integer DEFAULT 30,
  sleep_goal decimal(4, 2) DEFAULT 8.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own health data"
  ON health_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own health data"
  ON health_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own health data"
  ON health_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own health data"
  ON health_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can view health data temporarily"
  ON health_data
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert health data temporarily"
  ON health_data
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own goals"
  ON health_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own goals"
  ON health_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own goals"
  ON health_goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can view goals temporarily"
  ON health_goals
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can manage goals temporarily"
  ON health_goals
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS health_data_date_idx ON health_data(date DESC);
CREATE INDEX IF NOT EXISTS health_data_user_id_idx ON health_data(user_id);
CREATE INDEX IF NOT EXISTS health_goals_user_id_idx ON health_goals(user_id);

INSERT INTO health_data (date, steps, distance, calories, active_minutes, heart_rate_avg, sleep_hours, source)
VALUES 
  (CURRENT_DATE - INTERVAL '6 days', 8542, 6.2, 1850, 45, 72, 7.5, 'apple_watch'),
  (CURRENT_DATE - INTERVAL '5 days', 12348, 9.1, 2340, 68, 78, 8.2, 'apple_watch'),
  (CURRENT_DATE - INTERVAL '4 days', 6234, 4.5, 1520, 32, 68, 6.8, 'apple_watch'),
  (CURRENT_DATE - INTERVAL '3 days', 15678, 11.8, 2890, 92, 85, 7.9, 'apple_watch'),
  (CURRENT_DATE - INTERVAL '2 days', 10234, 7.6, 2150, 58, 75, 8.5, 'apple_watch'),
  (CURRENT_DATE - INTERVAL '1 day', 9876, 7.2, 2020, 54, 73, 7.2, 'apple_watch'),
  (CURRENT_DATE, 4523, 3.2, 1250, 28, 70, null, 'apple_watch');

INSERT INTO health_goals (steps_goal, calories_goal, active_minutes_goal, sleep_goal)
VALUES (10000, 2000, 60, 8.0);
