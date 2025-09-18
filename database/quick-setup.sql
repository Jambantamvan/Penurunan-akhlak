-- ========================================
-- SURVEY AKHLAK REMAJA - QUICK DATABASE SETUP
-- ========================================
-- Jalankan script ini di Supabase SQL Editor

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Surveys Table
CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    respondent_code TEXT UNIQUE NOT NULL,
    session_id TEXT NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create Survey Responses Table
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

-- 4. Create Random Respondent Code Generator Function
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

-- 5. Create Function for Survey Submission
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
        'success', true,
        'message', 'Survey berhasil disimpan'
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies for Anonymous Access
-- Policy untuk surveys table
CREATE POLICY "Allow anonymous survey creation" ON surveys 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read surveys" ON surveys 
FOR SELECT USING (true);

-- Policy untuk survey_responses table
CREATE POLICY "Allow anonymous response creation" ON survey_responses 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read responses" ON survey_responses 
FOR SELECT USING (true);

-- 8. Grant Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- 9. Create Analytics Views
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

-- 10. Create Demographics Analysis View
CREATE OR REPLACE VIEW demographics_analysis AS
SELECT 
    CASE 
        WHEN sr_gender.answer_value = 'male' THEN 'Laki-laki'
        WHEN sr_gender.answer_value = 'female' THEN 'Perempuan'
        ELSE 'Tidak Diketahui'
    END as gender,
    CASE 
        WHEN sr_age.answer_value = 'teen_early' THEN '13-15 tahun'
        WHEN sr_age.answer_value = 'teen_mid' THEN '16-18 tahun'
        WHEN sr_age.answer_value = 'teen_late' THEN '19-21 tahun'
        ELSE 'Tidak Diketahui'
    END as age_group,
    COUNT(*) as count
FROM surveys s
LEFT JOIN survey_responses sr_gender ON s.id = sr_gender.survey_id AND sr_gender.question_id = 'gender'
LEFT JOIN survey_responses sr_age ON s.id = sr_age.survey_id AND sr_age.question_id = 'age'
GROUP BY sr_gender.answer_value, sr_age.answer_value
ORDER BY count DESC;

-- 11. Create Individual Responses View
CREATE OR REPLACE VIEW individual_responses AS
SELECT 
    s.respondent_code,
    s.completed_at,
    COALESCE(
        json_agg(
            json_build_object(
                'question_id', sr.question_id,
                'question_text', sr.question_text,
                'answer_value', sr.answer_value,
                'answer_label', sr.answer_label,
                'question_order', sr.question_order
            ) ORDER BY sr.question_order
        ) FILTER (WHERE sr.id IS NOT NULL), 
        '[]'::json
    ) as responses
FROM surveys s
LEFT JOIN survey_responses sr ON s.id = sr.survey_id
GROUP BY s.id, s.respondent_code, s.completed_at
ORDER BY s.completed_at DESC;

-- Final verification
SELECT 'Database setup completed successfully! Tables, functions, and views created.' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('surveys', 'survey_responses');
SELECT 'Test respondent code: ' || generate_respondent_code() as test_function;