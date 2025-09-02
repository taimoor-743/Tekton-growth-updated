-- Create requests table with project_name field
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  business_details TEXT NOT NULL,
  website_structure TEXT NOT NULL,
  output_link TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'error', 'saved')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_updated_at ON requests(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_project_name ON requests(project_name);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);

-- Enable Row Level Security
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations" ON requests FOR ALL USING (true);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_requests_updated_at 
  BEFORE UPDATE ON requests 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
