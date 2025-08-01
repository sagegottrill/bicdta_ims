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

## Step 3: Database Table

Create this table in your Supabase database:

### Trainees Table
```sql
CREATE TABLE trainees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  gender VARCHAR(20),
  date_of_birth DATE,
  age INTEGER,
  educational_background VARCHAR(255),
  employment_status VARCHAR(100),
  centre_name VARCHAR(255),
  cohort_number INTEGER,
  id_number VARCHAR(100),
  address TEXT,
  learner_category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Step 4: Upload Your Data

1. Export your Excel file as CSV
2. Go to Supabase Dashboard → Table Editor
3. Select the `trainees` table
4. Click "Import data" → "Upload CSV"
5. Map your columns correctly:
   - `full_name` → Full Name
   - `gender` → Gender
   - `date_of_birth` → Date of Birth
   - `age` → Age
   - `educational_background` → Educational Background
   - `employment_status` → Employment Status
   - `centre_name` → Centre Name
   - `cohort_number` → Cohort Number
   - `id_number` → ID Number
   - `address` → Address
   - `learner_category` → Learner Category

## Step 5: Run the Application

```bash
npm run dev
```

The app will now pull data from your Supabase database and display your trainee information! 