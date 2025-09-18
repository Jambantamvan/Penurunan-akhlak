# Survey Akhlak Remaja - Next.js Application

Aplikasi survey komprehensif untuk menganalisis penurunan akhlak remaja dengan dashboard analytics real-time.

## 🚀 Features

### Survey Features
- **10 Pertanyaan Terstruktur**: Gender, usia, perundungan, ujaran kasar, ghibah, konten pornografi, media sosial, komunikasi keluarga, dampak sosial, dan solusi
- **Progressive Disclosure**: Step-by-step survey flow yang user-friendly
- **Random Respondent Codes**: Generate kode unik untuk setiap responden (A32, B90, dll)
- **Real-time Validation**: Form validation dengan feedback visual
- **Anonymous Data Collection**: Privacy-first approach

### Analytics Dashboard
- **Overview Cards**: Total responden, completion rate, demographics breakdown
- **Question Analytics**: Charts per pertanyaan dengan bar chart dan pie chart
- **Demographics Analysis**: Distribusi gender dan usia dengan cross-analysis
- **Individual Response Viewer**: Table dengan search dan filter by respondent code
- **Export Functionality**: CSV, JSON, dan text report generation
- **Real-time Updates**: Live data updates menggunakan Supabase subscriptions

### Design & UX
- **Dark Theme**: Modern dark theme dengan accent colors
- **Glassmorphism**: Background blur dan transparansi effects
- **Gradient Colors**: Beautiful gradients untuk primary, secondary, dan accent
- **Micro-animations**: Smooth transitions dan hover effects
- **Mobile Responsive**: Mobile-first design approach
- **Accessibility**: ARIA labels dan keyboard navigation

## 🛠 Tech Stack

- **Frontend**: Next.js 13+ (App Router) + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Deployment**: Vercel Ready

## 📋 Prerequisites

- Node.js 18+ dan npm/yarn
- Supabase account dan project
- Git

## ⚡ Quick Start

### 1. Environment Setup
Buat file `.env.local` di root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pdffpypmzgxadzwfvsud.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZmZweXBtemd4YWR6d2Z2c3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzM5OTMsImV4cCI6MjA3MzcwOTk5M30.BKPWXq7uO-I2JIn6jrQ4NlpsNypdJOY8ZRdd62XwZSM

# App Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### A. Setup Tables di Supabase SQL Editor
Copy dan jalankan script dari `database/schema.sql`:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table surveys
CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    respondent_code TEXT UNIQUE NOT NULL,
    session_id TEXT NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table survey_responses  
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    respondent_code TEXT NOT NULL,
    question_id TEXT NOT NULL,
    question_text TEXT NOT NULL,
    answer_value TEXT NOT NULL,
    answer_label TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Function untuk generate random respondent code
CREATE OR REPLACE FUNCTION generate_respondent_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    nums TEXT := '0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    -- Generate format: Letter + 2-3 digits (A32, B156, dll)
    result := substr(chars, floor(random() * length(chars))::int + 1, 1);
    
    FOR i IN 1..2 LOOP
        result := result || substr(nums, floor(random() * length(nums))::int + 1, 1);
    END LOOP;
    
    -- Check if code already exists, if so regenerate
    WHILE EXISTS(SELECT 1 FROM surveys WHERE respondent_code = result) LOOP
        result := substr(chars, floor(random() * length(chars))::int + 1, 1);
        FOR i IN 1..2 LOOP
            result := result || substr(nums, floor(random() * length(nums))::int + 1, 1);
        END LOOP;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Views untuk analytics
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
    question_id,
    question_text,
    answer_label,
    COUNT(*) as response_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY question_id), 2) as percentage
FROM survey_responses
GROUP BY question_id, question_text, answer_label
ORDER BY question_id, response_count DESC;

-- Function untuk insert survey dengan responses
CREATE OR REPLACE FUNCTION insert_survey_with_responses(
    session_id_param TEXT,
    responses_data JSONB
)
RETURNS JSON AS $$
DECLARE
    new_survey_id UUID;
    new_respondent_code TEXT;
    response_item JSONB;
    result JSON;
BEGIN
    -- Generate unique respondent code
    new_respondent_code := generate_respondent_code();
    
    -- Insert survey
    INSERT INTO surveys (respondent_code, session_id)
    VALUES (new_respondent_code, session_id_param)
    RETURNING id INTO new_survey_id;
    
    -- Insert responses
    FOR response_item IN SELECT * FROM jsonb_array_elements(responses_data)
    LOOP
        INSERT INTO survey_responses (
            survey_id,
            respondent_code,
            question_id,
            question_text,
            answer_value,
            answer_label,
            question_order
        ) VALUES (
            new_survey_id,
            new_respondent_code,
            response_item->>'question_id',
            response_item->>'question_text',
            response_item->>'answer_value',
            response_item->>'answer_label',
            (response_item->>'question_order')::INTEGER
        );
    END LOOP;
    
    -- Return result
    SELECT json_build_object(
        'survey_id', new_survey_id,
        'respondent_code', new_respondent_code,
        'success', true
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous survey creation" ON surveys FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous response creation" ON survey_responses FOR INSERT WITH CHECK (true);

-- Allow public read access
CREATE POLICY "Allow public read surveys" ON surveys FOR SELECT USING (true);
CREATE POLICY "Allow public read responses" ON survey_responses FOR SELECT USING (true);
```

### 4. Run Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📱 Usage

### Survey Flow
1. **Landing Page**: `http://localhost:3000`
   - Welcome screen dengan statistik survey
   - Tombol "Mulai Survey"

2. **Question Flow**: 10 pertanyaan dengan progress bar
   - Demographics: Gender dan Usia
   - Core Questions: 8 pertanyaan utama
   - Navigation: Back/Next buttons dengan validation

3. **Completion**: Thank you screen dengan respondent code

### Analytics Dashboard
1. **Admin Dashboard**: `http://localhost:3000/admin`
   - Overview: Total responses, completion rate, demographics
   - Question Analytics: Charts per pertanyaan
   - Demographics: Gender dan age group analysis
   - Individual Responses: Search dan view detailed responses

2. **Export Features**:
   - CSV export untuk spreadsheet analysis
   - JSON export untuk data processing
   - Text report untuk dokumentasi

## 🗂 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Analytics dashboard
│   ├── globals.css           # Tailwind CSS + custom styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main survey page
├── components/
│   ├── admin/               # Admin dashboard components
│   │   ├── OverviewCards.tsx
│   │   ├── QuestionAnalytics.tsx
│   │   ├── DemographicsChart.tsx
│   │   ├── IndividualResponsesTable.tsx
│   │   └── ExportButtons.tsx
│   ├── BackgroundAnimation.tsx
│   ├── Navigation.tsx
│   ├── ProgressBar.tsx
│   ├── QuestionCard.tsx
│   ├── SurveyFlow.tsx
│   ├── ThankYouScreen.tsx
│   └── WelcomeScreen.tsx
├── lib/
│   ├── api.ts              # Supabase API functions
│   ├── supabase.ts         # Supabase client & types
│   └── survey-data.ts      # Survey questions data
└── store/
    └── survey-store.ts     # Zustand state management
```

## 🚀 Deployment

### Vercel Deployment
1. Push ke GitHub repository
2. Connect repository di Vercel
3. Add environment variables
4. Deploy automatically

### Environment Variables untuk Production
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check environment variables
   - Verify Supabase URL dan API key
   - Ensure RLS policies are setup

2. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run build`

3. **Charts Not Rendering**
   - Ensure data is properly formatted
   - Check console untuk errors
   - Verify Recharts components props

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**
