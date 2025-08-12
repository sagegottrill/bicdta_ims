# Supabase Setup Guide

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy your **Project URL** and **anon/public key**

## Step 2: Create Environment File

Create a `.env` file in your project root with:

```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Database Tables

Create these tables in your Supabase database:

### Trainees Table
```sql
CREATE TABLE trainees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number INTEGER,
  id_number VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  gender VARCHAR(20),
  date_of_birth DATE,
  age INTEGER,
  educational_background VARCHAR(255),
  employment_status VARCHAR(100),
  centre_name VARCHAR(255),
  passed BOOLEAN DEFAULT FALSE,
  failed BOOLEAN DEFAULT FALSE,
  not_sat_for_exams BOOLEAN DEFAULT FALSE,
  dropout BOOLEAN DEFAULT FALSE,
  nin VARCHAR(50),
  phone_number VARCHAR(20),
  cohort_number INTEGER,
  learner_category VARCHAR(100),
  email VARCHAR(255),
  lga VARCHAR(100),
  people_with_special_needs BOOLEAN DEFAULT FALSE,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Announcements Table
```sql
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Enable Real-time for Announcements
```sql
-- Enable real-time for the announcements table
ALTER TABLE announcements REPLICA IDENTITY FULL;
```

### Instructors Table
```sql
CREATE TABLE instructors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lga VARCHAR(100) NOT NULL,
  technical_manager_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  centre_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'revoked', 'active')),
  is_online BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Centres Table
```sql
CREATE TABLE centres (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  centre_name VARCHAR(255) NOT NULL,
  lga VARCHAR(100) NOT NULL,
  technical_manager_name VARCHAR(255) NOT NULL,
  technical_manager_email VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  declared_capacity INTEGER DEFAULT 0,
  usable_capacity INTEGER DEFAULT 0,
  computers_present INTEGER DEFAULT 0,
  computers_functional INTEGER DEFAULT 0,
  power_available BOOLEAN DEFAULT FALSE,
  power_condition VARCHAR(100),
  internet_available BOOLEAN DEFAULT FALSE,
  fans_present INTEGER DEFAULT 0,
  air_condition_present INTEGER DEFAULT 0,
  fans_functional INTEGER DEFAULT 0,
  air_condition_functional INTEGER DEFAULT 0,
  lighting_available BOOLEAN DEFAULT FALSE,
  windows_condition VARCHAR(50),
  water_functional BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Weekly Reports Table
```sql
CREATE TABLE weekly_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  centre_name VARCHAR(255) NOT NULL,
  technical_manager_name VARCHAR(255) NOT NULL,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  comments TEXT,
  trainees_enrolled INTEGER DEFAULT 0,
  trainees_completed INTEGER DEFAULT 0,
  trainees_dropped INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### M&E Reports Table
```sql
CREATE TABLE me_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  centre_name VARCHAR(255) NOT NULL,
  technical_manager_name VARCHAR(255) NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  comments TEXT,
  total_enrollment INTEGER DEFAULT 0,
  total_completion INTEGER DEFAULT 0,
  total_dropout INTEGER DEFAULT 0,
  employment_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Instructor Authentication Table
```sql
CREATE TABLE instructor_auth (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID REFERENCES instructors(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Enable Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE trainees ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE me_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_auth ENABLE ROW LEVEL SECURITY;

-- Create policies for instructor access
CREATE POLICY "Instructors can view their own data" ON instructors
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Instructors can view trainees" ON trainees
  FOR SELECT USING (true);

CREATE POLICY "Instructors can insert trainees" ON trainees
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Instructors can view announcements" ON announcements
  FOR SELECT USING (true);

CREATE POLICY "Instructors can view centres" ON centres
  FOR SELECT USING (true);

CREATE POLICY "Instructors can manage their reports" ON weekly_reports
  FOR ALL USING (technical_manager_name = (
    SELECT technical_manager_name FROM instructors WHERE id = auth.uid()::uuid
  ));

CREATE POLICY "Instructors can manage their M&E reports" ON me_reports
  FOR ALL USING (technical_manager_name = (
    SELECT technical_manager_name FROM instructors WHERE id = auth.uid()::uuid
  ));
```

## Step 4: Upload Your Data

1. Export your Excel file as CSV
2. Go to Supabase Dashboard → Table Editor
3. Select the `trainees` table
4. Click "Import data" → "Upload CSV"
5. Map your columns correctly:
   - `serial_number` → S/N
   - `id_number` → ID NUMBER
   - `full_name` → FULL NAME
   - `gender` → GENDER
   - `date_of_birth` → DATE OF BIRTH
   - `age` → AGE (calculated from date of birth)
   - `educational_background` → EDUCATIONAL BACKGROUND
   - `employment_status` → EMPLOYMENT STATUS
   - `centre_name` → CENTER ENROLLED
   - `passed` → PASSED
   - `failed` → FAIL
   - `not_sat_for_exams` → NOT SAT FOR EXAMS
   - `dropout` → DROPOUT
   - `nin` → NIN
   - `phone_number` → PHONE NUMBER
   - `cohort_number` → COHORT
   - `learner_category` → LEARNERS CATEGORY
   - `email` → EMAIL
   - `lga` → LGA
   - `people_with_special_needs` → PEOPLE WITH SPECIAL NEEDS
   - `address` → ADDRESS (if available)

## Step 5: Run the Application

```bash
npm run dev
```

The app will now pull data from your Supabase database and display your trainee information with real-time announcements! 