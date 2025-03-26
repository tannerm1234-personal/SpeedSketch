-- Create sketches table
CREATE TABLE IF NOT EXISTS sketches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  object_name TEXT NOT NULL,
  time_seconds FLOAT NOT NULL,
  confidence FLOAT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS but make it public readable
ALTER TABLE sketches ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DROP POLICY IF EXISTS "Public read access" ON sketches;
CREATE POLICY "Public read access"
  ON sketches FOR SELECT
  USING (true);

-- Create policy for public insert access
DROP POLICY IF EXISTS "Public insert access" ON sketches;
CREATE POLICY "Public insert access"
  ON sketches FOR INSERT
  WITH CHECK (true);

-- Enable realtime
alter publication supabase_realtime add table sketches;
