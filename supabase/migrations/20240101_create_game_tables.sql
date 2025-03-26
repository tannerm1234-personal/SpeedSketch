-- Create game_prompts table
CREATE TABLE IF NOT EXISTS game_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT NOT NULL,
  category TEXT,
  difficulty INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Create user_games table to track game history
CREATE TABLE IF NOT EXISTS user_games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID REFERENCES game_prompts(id),
  word TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  time_remaining DECIMAL(5,2),
  confidence_level DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sketch_data JSONB
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  fastest_time DECIMAL(5,2),
  average_time DECIMAL(5,2),
  last_played_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id UUID REFERENCES game_prompts(id),
  challenge_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  u.id,
  u.name,
  us.games_played,
  us.games_won,
  us.current_streak,
  us.best_streak,
  us.fastest_time,
  us.average_time,
  ROW_NUMBER() OVER (ORDER BY us.best_streak DESC, us.fastest_time ASC) as rank
FROM 
  users u
JOIN 
  user_stats us ON u.id = us.user_id
WHERE 
  us.games_played > 0;

-- Create daily_leaderboard view
CREATE OR REPLACE VIEW daily_leaderboard AS
SELECT 
  u.id,
  u.name,
  ug.word,
  ug.time_remaining,
  ug.created_at,
  ROW_NUMBER() OVER (PARTITION BY DATE(ug.created_at) ORDER BY ug.time_remaining DESC) as daily_rank
FROM 
  users u
JOIN 
  user_games ug ON u.id = ug.user_id
WHERE 
  ug.success = TRUE
ORDER BY 
  ug.created_at DESC, ug.time_remaining DESC;

-- Enable realtime for these tables
alter publication supabase_realtime add table user_games;
alter publication supabase_realtime add table user_stats;
alter publication supabase_realtime add table daily_challenges;

-- Insert some sample prompts
INSERT INTO game_prompts (word, category, difficulty) VALUES
('cat', 'animals', 1),
('dog', 'animals', 1),
('house', 'objects', 1),
('tree', 'nature', 1),
('car', 'vehicles', 1),
('sun', 'nature', 1),
('fish', 'animals', 1),
('bird', 'animals', 1),
('flower', 'nature', 1),
('book', 'objects', 1),
('chair', 'furniture', 2),
('table', 'furniture', 2),
('bicycle', 'vehicles', 2),
('airplane', 'vehicles', 2),
('mountain', 'nature', 2),
('river', 'nature', 2),
('pizza', 'food', 2),
('apple', 'food', 1),
('banana', 'food', 1),
('guitar', 'music', 2);