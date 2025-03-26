-- Create storage bucket for sketches
INSERT INTO storage.buckets (id, name, public)
VALUES ('sketches', 'sketches', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy for public read access
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'sketches');

-- Set up storage policy for public upload access
CREATE POLICY "Public Upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'sketches');
