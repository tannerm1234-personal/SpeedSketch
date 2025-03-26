-- Create sketches table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.sketches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object_name TEXT NOT NULL,
  image_url TEXT,
  time_seconds NUMERIC(10, 2) NOT NULL,
  confidence NUMERIC(10, 2) NOT NULL,
  rating INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.sketches ENABLE ROW LEVEL SECURITY;

-- Create policy for public access to sketches
DROP POLICY IF EXISTS "Public sketches are viewable by everyone" ON public.sketches;
CREATE POLICY "Public sketches are viewable by everyone"
ON public.sketches FOR SELECT
USING (true);

-- Create policy for authenticated users to insert sketches
DROP POLICY IF EXISTS "Authenticated users can insert sketches" ON public.sketches;
CREATE POLICY "Authenticated users can insert sketches"
ON public.sketches FOR INSERT
WITH CHECK (true);

-- Enable realtime for sketches table
alter publication supabase_realtime add table sketches;