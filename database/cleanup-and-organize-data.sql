-- ==========================================
-- SQL SCRIPT UNTUK REORGANISASI DATA SURVEY
-- File: cleanup-and-organize-data.sql
-- Dibuat: September 2025
-- ==========================================

-- 1. BUAT BACKUP TABLE TERLEBIH DAHULU (OPSIONAL)
CREATE TABLE IF NOT EXISTS survey_responses_backup AS 
SELECT * FROM survey_responses;

-- 2. HAPUS DUPLICATE ENTRIES BERDASARKAN SESSION_ID
-- Ini akan menghapus entri duplikat, hanya menyimpan yang pertama
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY survey_id 
           ORDER BY created_at ASC
         ) as rn
  FROM survey_responses
)
DELETE FROM survey_responses 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- 3. BUAT VIEW UNTUK ANALYTICS YANG LEBIH CLEAN
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
  sr.question_id,
  sr.question_text,
  sr.answer_value,
  sr.answer_label,
  COUNT(*) as response_count,
  ROUND(
    (COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY sr.question_id)), 
    2
  ) as percentage
FROM survey_responses sr
WHERE sr.survey_id IS NOT NULL
GROUP BY sr.question_id, sr.question_text, sr.answer_value, sr.answer_label
ORDER BY sr.question_order, response_count DESC;

-- 4. BUAT VIEW UNTUK DEMOGRAPHICS ANALYSIS
CREATE OR REPLACE VIEW demographics_analysis AS
SELECT 
  'gender' as demographic_type,
  sr.answer_label as category,
  COUNT(*) as count,
  ROUND(
    (COUNT(*) * 100.0 / (SELECT COUNT(DISTINCT survey_id) FROM survey_responses)), 
    2
  ) as percentage
FROM survey_responses sr
WHERE sr.question_id = 'gender'
GROUP BY sr.answer_label

UNION ALL

SELECT 
  'age' as demographic_type,
  sr.answer_label as category,
  COUNT(*) as count,
  ROUND(
    (COUNT(*) * 100.0 / (SELECT COUNT(DISTINCT survey_id) FROM survey_responses)), 
    2
  ) as percentage
FROM survey_responses sr
WHERE sr.question_id = 'age'
GROUP BY sr.answer_label

ORDER BY demographic_type, count DESC;

-- 5. BUAT VIEW UNTUK INDIVIDUAL RESPONSES
CREATE OR REPLACE VIEW individual_responses AS
SELECT 
  s.survey_id,
  s.respondent_code,
  s.created_at as survey_date,
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
LEFT JOIN survey_responses sr ON s.survey_id = sr.survey_id
GROUP BY s.survey_id, s.respondent_code, s.created_at
ORDER BY s.created_at DESC;

-- 6. BUAT INDEX UNTUK PERFORMA YANG LEBIH BAIK
CREATE INDEX IF NOT EXISTS idx_survey_responses_question_id ON survey_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_surveys_respondent_code ON surveys(respondent_code);

-- 7. UPDATE STATISTICS TABLE (JIKA ADA)
CREATE OR REPLACE VIEW survey_statistics AS
SELECT 
  (SELECT COUNT(DISTINCT survey_id) FROM survey_responses) as total_responses,
  (SELECT COUNT(DISTINCT question_id) FROM survey_responses) as total_questions,
  (SELECT COUNT(*) FROM survey_responses) as total_answer_entries,
  (SELECT 
     ROUND(AVG(question_count), 2) 
   FROM (
     SELECT COUNT(*) as question_count 
     FROM survey_responses 
     GROUP BY survey_id
   ) sub
  ) as avg_questions_per_response,
  (SELECT 
     EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) / 60 
   FROM surveys
  ) as total_duration_minutes;

-- 8. CLEANUP ORPHANED RECORDS
-- Hapus survey_responses yang tidak memiliki survey parent
DELETE FROM survey_responses 
WHERE survey_id NOT IN (SELECT survey_id FROM surveys);

-- 9. VERIFY DATA INTEGRITY
-- Query untuk mengecek hasil cleanup
SELECT 
  'Total Surveys' as metric,
  COUNT(*) as value
FROM surveys
UNION ALL
SELECT 
  'Total Survey Responses' as metric,
  COUNT(*) as value
FROM survey_responses
UNION ALL
SELECT 
  'Unique Survey IDs' as metric,
  COUNT(DISTINCT survey_id) as value
FROM survey_responses
UNION ALL
SELECT 
  'Questions with Responses' as metric,
  COUNT(DISTINCT question_id) as value
FROM survey_responses;

-- 10. CONTOH QUERY UNTUK ANALYTICS
-- Query untuk mendapatkan data analytics yang clean:

-- Analytics Summary (untuk chart)
SELECT * FROM analytics_summary 
WHERE question_id = 'gender' 
ORDER BY response_count DESC;

-- Demographics Analysis
SELECT * FROM demographics_analysis 
ORDER BY demographic_type, count DESC;

-- Individual Responses (untuk tabel detail)
SELECT 
  survey_id,
  respondent_code,
  survey_date,
  jsonb_array_length(responses::jsonb) as total_questions
FROM individual_responses 
ORDER BY survey_date DESC 
LIMIT 10;

-- Quick Stats
SELECT * FROM survey_statistics;

-- ==========================================
-- NOTES:
-- 1. Jalankan script ini secara bertahap
-- 2. Backup data terlebih dahulu jika perlu
-- 3. Views akan memudahkan query analytics
-- 4. Index akan mempercepat performa query
-- ==========================================