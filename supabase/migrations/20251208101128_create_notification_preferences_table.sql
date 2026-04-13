/*
  # Create Notification Preferences Table

  1. New Tables
    - `notification_preferences`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid) - Reference to auth user (nullable for anonymous users)
      - `morning_enabled` (boolean) - Enable morning motivational notifications
      - `morning_time_hour` (integer) - Hour for morning notification (0-23)
      - `morning_time_minute` (integer) - Minute for morning notification (0-59)
      - `evening_enabled` (boolean) - Enable evening motivational notifications
      - `evening_time_hour` (integer) - Hour for evening notification (0-23)
      - `evening_time_minute` (integer) - Minute for evening notification (0-59)
      - `push_token` (text) - Expo push notification token
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on notification_preferences table
    - Add policies for authenticated users to manage their own preferences
    - Allow public access for anonymous users

  3. Indexes
    - Index on user_id for fast queries
*/

CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  
  morning_enabled boolean DEFAULT true,
  morning_time_hour integer DEFAULT 8,
  morning_time_minute integer DEFAULT 0,
  
  evening_enabled boolean DEFAULT true,
  evening_time_hour integer DEFAULT 21,
  evening_time_minute integer DEFAULT 0,
  
  push_token text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own notification preferences"
  ON notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can manage notification preferences temporarily"
  ON notification_preferences
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS notification_preferences_user_id_idx ON notification_preferences(user_id);
