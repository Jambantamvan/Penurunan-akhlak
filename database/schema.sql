-- Survey Database Schema for Supabase
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table surveys dengan random identifier
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

-- View for analytics summary
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

-- View for individual responses
CREATE OR REPLACE VIEW individual_responses AS
SELECT 
    sr.respondent_code,
    s.completed_at,
    sr.question_id,
    sr.question_text,
    sr.answer_label,
    sr.question_order
FROM survey_responses sr
JOIN surveys s ON sr.survey_id = s.id
ORDER BY sr.respondent_code, sr.question_order;

-- View for demographics analysis
CREATE OR REPLACE VIEW demographics_analysis AS
SELECT 
    gender.answer_label as gender,
    age.answer_label as age_group,
    COUNT(*) as respondent_count
FROM survey_responses gender
JOIN survey_responses age ON gender.survey_id = age.survey_id
WHERE gender.question_id = 'gender' AND age.question_id = 'age'
GROUP BY gender.answer_label, age.answer_label
ORDER BY respondent_count DESC;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_respondent_code ON survey_responses(respondent_code);
CREATE INDEX IF NOT EXISTS idx_survey_responses_question_id ON survey_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_surveys_respondent_code ON surveys(respondent_code);
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at);

-- Row Level Security (RLS) Policies
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for survey submissions
CREATE POLICY "Allow anonymous survey creation" ON surveys FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous response creation" ON survey_responses FOR INSERT WITH CHECK (true);

-- Allow public read access for analytics (you may want to restrict this)
CREATE POLICY "Allow public read surveys" ON surveys FOR SELECT USING (true);
CREATE POLICY "Allow public read responses" ON survey_responses FOR SELECT USING (true);

-- Function to insert survey with responses
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