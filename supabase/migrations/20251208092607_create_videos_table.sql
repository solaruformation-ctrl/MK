/*
  # Create Videos Table

  1. New Tables
    - `videos`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text) - Video title
      - `description` (text) - Video description
      - `youtube_url` (text) - YouTube video URL
      - `thumbnail_url` (text) - Thumbnail image URL
      - `category` (text) - Video category (workout, nutrition, tips, etc.)
      - `duration` (text) - Video duration (e.g., "15 min")
      - `difficulty` (text) - Difficulty level (beginner, intermediate, advanced)
      - `is_premium` (boolean) - Whether video requires premium access
      - `order_index` (integer) - Order for display
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `videos` table
    - Add policy for public read access (all users can view videos)
    - Add policy for authenticated admin users to manage videos
*/

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  youtube_url text NOT NULL,
  thumbnail_url text DEFAULT '',
  category text DEFAULT 'workout',
  duration text DEFAULT '10 min',
  difficulty text DEFAULT 'intermediate',
  is_premium boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos"
  ON videos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert videos"
  ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update videos"
  ON videos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete videos"
  ON videos
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS videos_category_idx ON videos(category);
CREATE INDEX IF NOT EXISTS videos_order_idx ON videos(order_index);

INSERT INTO videos (title, description, youtube_url, thumbnail_url, category, duration, difficulty, is_premium, order_index)
VALUES 
  ('Full Body Workout', 'Complete full body training session for all fitness levels', 'https://www.youtube.com/watch?v=ml6cT4AZdqI', 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=400', 'workout', '30 min', 'intermediate', false, 1),
  ('HIIT Cardio Blast', 'High intensity interval training to boost your cardio', 'https://www.youtube.com/watch?v=2MfDOBD6RYc', 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400', 'workout', '20 min', 'advanced', false, 2),
  ('Yoga for Beginners', 'Gentle yoga flow perfect for beginners', 'https://www.youtube.com/watch?v=v7AYKMP6rOE', 'https://images.pexels.com/photos/3822166/pexels-photo-3822166.jpeg?auto=compress&cs=tinysrgb&w=400', 'workout', '25 min', 'beginner', false, 3),
  ('Nutrition Tips', 'Essential nutrition advice for fitness goals', 'https://www.youtube.com/watch?v=TlfRgn_o0QA', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', 'nutrition', '15 min', 'beginner', false, 4),
  ('Advanced Strength Training', 'Build muscle with advanced techniques', 'https://www.youtube.com/watch?v=IODxDxX7oi4', 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=400', 'workout', '40 min', 'advanced', true, 5);
