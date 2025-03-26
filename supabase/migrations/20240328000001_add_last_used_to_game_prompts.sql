-- Add last_used column to game_prompts table
ALTER TABLE game_prompts ADD COLUMN IF NOT EXISTS last_used TIMESTAMP WITH TIME ZONE;

-- Enable realtime for game_prompts table
alter publication supabase_realtime add table game_prompts;
