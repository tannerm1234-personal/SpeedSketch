-- Add rating column to sketches table
ALTER TABLE sketches ADD COLUMN IF NOT EXISTS rating INTEGER;

-- Enable realtime for the updated table
alter publication supabase_realtime add table sketches;
