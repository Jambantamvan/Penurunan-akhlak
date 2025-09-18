-- SOLUSI PALING SIMPLE - TANPA VIEW
-- Jalankan di Supabase SQL Editor

-- 1. HAPUS SEMUA VIEW YANG BERMASALAH
DROP VIEW IF EXISTS analytics_summary;
DROP VIEW IF EXISTS survey_analytics_new;
DROP VIEW IF EXISTS simple_analytics;

-- 2. CEK DATA YANG ADA
SELECT 
  question_id,
  COUNT(*) as total_responses
FROM survey_responses 
GROUP BY question_id 
ORDER BY question_id;

-- 3. HAPUS DUPLIKASI SEDERHANA
DELETE FROM survey_responses a
WHERE a.id > (
  SELECT MIN(b.id) 
  FROM survey_responses b 
  WHERE b.survey_id = a.survey_id 
  AND b.question_id = a.question_id
);

-- 4. CEK HASIL CLEANUP
SELECT 
  'Total Survey Responses' as info,
  COUNT(*) as count
FROM survey_responses
UNION ALL
SELECT 
  'Unique Survey IDs' as info,
  COUNT(DISTINCT survey_id) as count
FROM survey_responses;

-- 5. TEST QUERY ANALYTICS MANUAL (TIDAK PERLU VIEW)
SELECT 
  question_id,
  question_text,
  answer_value,
  answer_label,
  COUNT(*) as response_count
FROM survey_responses
WHERE survey_id IS NOT NULL
GROUP BY question_id, question_text, answer_value, answer_label
ORDER BY question_id, response_count DESC;