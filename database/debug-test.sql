-- =====================================
-- DEBUG SCRIPT - Cek Struktur Tabel
-- =====================================
-- Jalankan ini di Supabase SQL Editor untuk debug

-- 1. Cek struktur tabel surveys
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'surveys' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Cek struktur tabel survey_responses  
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'survey_responses' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Cek sample data surveys (5 records)
SELECT * FROM surveys LIMIT 5;

-- 4. Cek sample data survey_responses (5 records)
SELECT * FROM survey_responses LIMIT 5;

-- 5. Cek total data sebelum cleanup
SELECT 
  'Total Surveys' as type,
  COUNT(*) as count
FROM surveys
UNION ALL
SELECT 
  'Total Survey Responses' as type,
  COUNT(*) as count
FROM survey_responses;

-- 4. Test manual insert (if function doesn't work)
DO $$
DECLARE
    test_survey_id UUID;
    test_code TEXT;
BEGIN
    -- Generate test code
    test_code := 'T99';
    
    -- Insert test survey
    INSERT INTO surveys (respondent_code, session_id)
    VALUES (test_code, 'test-debug-session')
    RETURNING id INTO test_survey_id;
    
    -- Insert test response
    INSERT INTO survey_responses (
        survey_id, 
        respondent_code, 
        question_id, 
        question_text, 
        answer_value, 
        answer_label, 
        question_order
    ) VALUES (
        test_survey_id, 
        test_code, 
        'test_question', 
        'Test Question', 
        'test_value', 
        'Test Answer', 
        1
    );
    
    RAISE NOTICE 'Test data inserted successfully with survey_id: % and code: %', test_survey_id, test_code;
END $$;

-- 5. Check if data was inserted
SELECT COUNT(*) as survey_count FROM surveys;
SELECT COUNT(*) as response_count FROM survey_responses;

-- 6. Show recent data
SELECT * FROM surveys ORDER BY created_at DESC LIMIT 3;
SELECT * FROM survey_responses ORDER BY created_at DESC LIMIT 3;