/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique, nullable)
      - `twitter_username` (text, unique, nullable)
      - `leetcode_username` (text, unique, nullable)
      - `github_username` (text, unique, nullable)
      - `test_tweet_used` (boolean)
      - `created_at` (timestamp)
    
    - `bots`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `name` (text)
      - `status` (text)
      - `access_token` (text)
      - `refresh_token` (text)
      - `created_at` (timestamp)
    
    - `tweets`
      - `id` (uuid, primary key)
      - `bot_id` (uuid, references bots)
      - `content` (text)
      - `schedule_time` (timestamp)
      - `status` (text)
      - `leetcode_contribution` (integer)
      - `github_contribution` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text UNIQUE,
  twitter_username text UNIQUE,
  leetcode_username text UNIQUE,
  github_username text UNIQUE,
  test_tweet_used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create bots table
CREATE TABLE IF NOT EXISTS bots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  access_token text,
  refresh_token text,
  created_at timestamptz DEFAULT now()
);

-- Create tweets table
CREATE TABLE IF NOT EXISTS tweets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id uuid REFERENCES bots(id) ON DELETE CASCADE,
  content text NOT NULL,
  schedule_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  leetcode_contribution integer DEFAULT -1,
  github_contribution integer DEFAULT -1,
  created_at timestamptz DEFAULT now()
);

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for bots table
CREATE POLICY "Users can read own bots"
  ON bots
  FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create own bots"
  ON bots
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id FROM users 
      WHERE id = auth.uid()
    )
  );

-- Create policies for tweets table
CREATE POLICY "Users can read own tweets"
  ON tweets
  FOR SELECT
  TO authenticated
  USING (
    bot_id IN (
      SELECT id FROM bots 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own tweets"
  ON tweets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bot_id IN (
      SELECT id FROM bots 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own tweets"
  ON tweets
  FOR UPDATE
  TO authenticated
  USING (
    bot_id IN (
      SELECT id FROM bots 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own tweets"
  ON tweets
  FOR DELETE
  TO authenticated
  USING (
    bot_id IN (
      SELECT id FROM bots 
      WHERE user_id = auth.uid()
    )
  );

  