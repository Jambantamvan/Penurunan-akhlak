-- ================================================
-- SUPABASE DATABASE SETUP SCRIPT
-- Survey Akhlak Remaja - Complete Schema
-- ================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. CREATE TABLES
-- ================================================

-- Table: surveys (Main survey metadata)
CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    respondent_code TEXT UNIQUE NOT NULL,
    session_id TEXT NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table: survey_responses (Individual question responses)
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

-- ================================================
-- 2. CREATE INDEXES (for better performance)
-- ================================================

CREATE INDEX IF NOT EXISTS idx_surveys_respondent_code ON surveys(respondent_code);
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_respondent_code ON survey_responses(respondent_code);
CREATE INDEX IF NOT EXISTS idx_survey_responses_question_id ON survey_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at);

-- ================================================
-- 3. CREATE FUNCTIONS
-- ================================================

-- Function: Generate unique respondent code (A32, B90, etc.)
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

-- Function: Complete survey submission with atomic transaction
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

-- ================================================
-- 4. CREATE VIEWS (for analytics)
-- ================================================

-- View: Analytics summary per question
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

-- View: Demographics analysis 
CREATE OR REPLACE VIEW demographics_analysis AS
SELECT 
    gender.answer_label as gender,
    age.answer_label as age_group,
    COUNT(*) as count
FROM survey_responses gender
JOIN survey_responses age ON gender.respondent_code = age.respondent_code
WHERE gender.question_id = 'gender' AND age.question_id = 'age'
GROUP BY gender.answer_label, age.answer_label
ORDER BY gender.answer_label, age.answer_label;

-- View: Individual responses (complete survey per respondent)
CREATE OR REPLACE VIEW individual_responses AS
SELECT 
    s.respondent_code,
    s.session_id,
    s.completed_at,
    json_agg(
        json_build_object(
            'question_id', sr.question_id,
            'question_text', sr.question_text,
            'answer_value', sr.answer_value,
            'answer_label', sr.answer_label,
            'question_order', sr.question_order
        ) ORDER BY sr.question_order
    ) as responses
FROM surveys s
JOIN survey_responses sr ON s.id = sr.survey_id
GROUP BY s.respondent_code, s.session_id, s.completed_at
ORDER BY s.completed_at DESC;

-- ================================================
-- 5. SETUP ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS on tables
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous survey creation (INSERT)
CREATE POLICY "Allow anonymous survey creation" ON surveys 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous response creation" ON survey_responses 
FOR INSERT WITH CHECK (true);

-- Policy: Allow public read access for analytics (SELECT)
CREATE POLICY "Allow public read surveys" ON surveys 
FOR SELECT USING (true);

CREATE POLICY "Allow public read responses" ON survey_responses 
FOR SELECT USING (true);

-- ================================================
-- 6. INSERT SAMPLE DATA (Optional for testing)
-- ================================================

-- Sample survey for testing (uncomment if needed)
/*
DO $$
DECLARE
    sample_result JSON;
BEGIN
    SELECT insert_survey_with_responses(
        'sample-session-123',
        '[
            {"question_id": "gender", "question_text": "Jenis Kelamin", "answer_value": "male", "answer_label": "Laki-laki", "question_order": 1},
            {"question_id": "age", "question_text": "Usia", "answer_value": "17-19", "answer_label": "17-19 tahun", "question_order": 2}
        ]'::jsonb
    ) INTO sample_result;
    
    RAISE NOTICE 'Sample survey created: %', sample_result;
END $$;
*/

-- ================================================
-- 7. GRANTS (Ensure proper permissions)
-- ================================================

-- Grant necessary permissions for anonymous users
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT INSERT ON surveys, survey_responses TO anon;
GRANT EXECUTE ON FUNCTION generate_respondent_code() TO anon;
GRANT EXECUTE ON FUNCTION insert_survey_with_responses(TEXT, JSONB) TO anon;

-- ================================================
-- SETUP COMPLETE!
-- ================================================

-- To verify setup, run these queries:
-- SELECT * FROM surveys LIMIT 5;
-- SELECT * FROM analytics_summary LIMIT 10;
-- SELECT * FROM demographics_analysis;
-- SELECT COUNT(*) as total_responses FROM survey_responses;