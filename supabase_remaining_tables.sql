-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  lga VARCHAR(255),
  technical_manager_name VARCHAR(255),
  phone_number VARCHAR(50),
  centre_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'revoked', 'active')),
  is_online BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create centres table
CREATE TABLE IF NOT EXISTS centres (
  id SERIAL PRIMARY KEY,
  centre_name VARCHAR(255) NOT NULL,
  lga VARCHAR(255),
  technical_manager_name VARCHAR(255),
  technical_manager_email VARCHAR(255),
  contact_number VARCHAR(50),
  declared_capacity INTEGER,
  usable_capacity INTEGER,
  computers_present INTEGER,
  computers_functional INTEGER,
  power_available BOOLEAN,
  power_condition VARCHAR(100),
  internet_available BOOLEAN,
  fans_present INTEGER,
  air_condition_present INTEGER,
  fans_functional INTEGER,
  air_condition_functional INTEGER,
  lighting_available BOOLEAN,
  windows_condition VARCHAR(100),
  water_functional BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create weekly_reports table
CREATE TABLE IF NOT EXISTS weekly_reports (
  id SERIAL PRIMARY KEY,
  centre_name VARCHAR(255),
  technical_manager_name VARCHAR(255),
  week_number INTEGER,
  year INTEGER,
  comments TEXT,
  trainees_enrolled INTEGER,
  trainees_completed INTEGER,
  trainees_dropped INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create me_reports table
CREATE TABLE IF NOT EXISTS me_reports (
  id SERIAL PRIMARY KEY,
  centre_name VARCHAR(255),
  technical_manager_name VARCHAR(255),
  month INTEGER,
  year INTEGER,
  comments TEXT,
  total_enrollment INTEGER,
  total_completion INTEGER,
  total_dropout INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE me_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON instructors FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON centres FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON announcements FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON weekly_reports FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON me_reports FOR SELECT USING (true);

-- Create policies for insert/update
CREATE POLICY "Allow insert access" ON instructors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access" ON instructors FOR UPDATE USING (true);
CREATE POLICY "Allow insert access" ON centres FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access" ON centres FOR UPDATE USING (true);
CREATE POLICY "Allow insert access" ON announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access" ON announcements FOR UPDATE USING (true);
CREATE POLICY "Allow insert access" ON weekly_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access" ON weekly_reports FOR UPDATE USING (true);
CREATE POLICY "Allow insert access" ON me_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access" ON me_reports FOR UPDATE USING (true);
