-- ============================-- STEP 4: HAPUS SURVEY RESPONSES YANG TIDAK MEMILIKI PARENT SURVEY
DELETE FROM survey_responses 
WHERE survey_id NOT IN (SELECT id FROM surveys);=-- STEP 5: HAPUS DUPLIKASI SURVEYS
-- Hapus survey duplikat berdasarkan respondent_code (keep yang pertama)
DELETE FROM surveys 
WHERE id NOT IN (
    SELECT DISTINCT ON (respondent_code) id
    FROM surveys
    ORDER BY respondent_code, created_at ASC
);=-- STEP 6: UPDATE SURVEY_RESPONSES AGAR KONSISTEN DENGAN SURVEYS
-- Pastikan respondent_code di survey_responses sama dengan di surveys
UPDATE survey_responses 
SET respondent_code = s.respondent_code
FROM surveys s
WHERE survey_responses.survey_id = s.id
AND survey_responses.respondent_code != s.respondent_code;ATABASE CLEANUP & REORGANIZATION
-- File: cleanup-data-- STEP 10: BUAT VIEW INDIVIDUAL RESPONSES
CREATE OR REPLACE VIEW clean_individual_responses AS
SELECT 
  s.id as survey_id,
  s.respondent_code,
  s.created_at,
  COUNT(sr.id) as total_questions,
  json_agg(
    json_build_object(
      'question_id', sr.question_id,
      'question_text', sr.question_text,
      'answer_value', sr.answer_value,
      'answer_label', sr.answer_label
    ) ORDER BY sr.question_id
  ) as responses
FROM surveys s
LEFT JOIN survey_responses sr ON s.id = sr.survey_id
GROUP BY s.id, s.respondent_code, s.created_at
ORDER BY s.created_at DESC;an step by step di Supabase SQL Edi-- STEP 13: VERIFY DATA INTEGRITY
-- Cek apakah setiap survey memiliki 10 pertanyaan
SELECT 
  sr.survey_id,
  s.respondent_code,
  COUNT(DISTINCT sr.question_id) as questions_answered
FROM survey_responses sr
JOIN surveys s ON sr.survey_id = s.id
GROUP BY sr.survey_id, s.respondent_code
HAVING COUNT(DISTINCT sr.question_id) != 10
ORDER BY questions_answered;=-- STEP 14: SAMPLE DATA CHECK
-- Lihat sample data setelah cleanup
SELECT 
  s.respondent_code,
  s.created_at,
  COUNT(sr.id) as total_responses
FROM surveys s
LEFT JOIN survey_responses sr ON s.id = sr.survey_id
GROUP BY s.id, s.respondent_code, s.created_at
ORDER BY s.created_at DESC
LIMIT 10;===========================

-- STEP 1: LIHAT DATA SEBELUM CLEANUP
SELECT 
  'Before Cleanup - Total Responses' as status,
  COUNT(*) as count
FROM survey_responses
UNION ALL
SELECT 
  'Before Cleanup - Unique Surveys' as status,
  COUNT(DISTINCT survey_id) as count
FROM survey_responses
UNION ALL
SELECT 
  'Before Cleanup - Total Surveys' as status,
  COUNT(*) as count
FROM surveys;

-- STEP 2: HAPUS DUPLIKASI SURVEY_RESPONSES
-- Hapus duplikasi berdasarkan survey_id + question_id (keep yang pertama)
DELETE FROM survey_responses 
WHERE id NOT IN (
    SELECT DISTINCT ON (survey_id, question_id) id
    FROM survey_responses
    ORDER BY survey_id, question_id, created_at ASC
);

-- STEP 3: HAPUS SURVEY RESPONSES YANG TIDAK MEMILIKI PARENT SURVEY
DELETE FROM survey_responses 
WHERE survey_id NOT IN (SELECT survey_id FROM surveys);

-- STEP 4: HAPUS DUPLIKASI SURVEYS
-- Hapus survey duplikat berdasarkan respondent_code (keep yang pertama)
DELETE FROM surveys 
WHERE survey_id NOT IN (
    SELECT DISTINCT ON (respondent_code) survey_id
    FROM surveys
    ORDER BY respondent_code, created_at ASC
);

-- STEP 5: UPDATE SURVEY_RESPONSES AGAR KONSISTEN DENGAN SURVEYS
-- Pastikan respondent_code di survey_responses sama dengan di surveys
UPDATE survey_responses 
SET respondent_code = s.respondent_code
FROM surveys s
WHERE survey_responses.survey_id = s.survey_id
AND survey_responses.respondent_code != s.respondent_code;

-- STEP 6: HAPUS VIEW LAMA YANG BERMASALAH
DROP VIEW IF EXISTS analytics_summary;
DROP VIEW IF EXISTS survey_analytics_new;
DROP VIEW IF EXISTS simple_analytics;
DROP VIEW IF EXISTS demographics_analysis;
DROP VIEW IF EXISTS individual_responses;

-- STEP 7: BUAT VIEW ANALYTICS YANG BERSIH
CREATE OR REPLACE VIEW clean_analytics AS
SELECT 
  sr.question_id,
  sr.question_text,
  sr.answer_value,
  sr.answer_label,
  COUNT(*) as response_count,
  ROUND(
    (COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY sr.question_id)), 
    1
  ) as percentage
FROM survey_responses sr
WHERE sr.survey_id IS NOT NULL
GROUP BY sr.question_id, sr.question_text, sr.answer_value, sr.answer_label
ORDER BY sr.question_id, response_count DESC;

-- STEP 8: BUAT VIEW DEMOGRAPHICS
CREATE OR REPLACE VIEW clean_demographics AS
SELECT 
  'gender' as category,
  sr.answer_label as value,
  COUNT(*) as count,
  ROUND(
    (COUNT(*) * 100.0 / (SELECT COUNT(DISTINCT survey_id) FROM survey_responses WHERE question_id = 'gender')), 
    1
  ) as percentage
FROM survey_responses sr
WHERE sr.question_id = 'gender'
GROUP BY sr.answer_label

UNION ALL

SELECT 
  'age' as category,
  sr.answer_label as value,
  COUNT(*) as count,
  ROUND(
    (COUNT(*) * 100.0 / (SELECT COUNT(DISTINCT survey_id) FROM survey_responses WHERE question_id = 'age')), 
    1
  ) as percentage
FROM survey_responses sr
WHERE sr.question_id = 'age'
GROUP BY sr.answer_label

ORDER BY category, count DESC;

-- STEP 9: BUAT VIEW INDIVIDUAL RESPONSES
CREATE OR REPLACE VIEW clean_individual_responses AS
SELECT 
  s.survey_id,
  s.respondent_code,
  s.created_at,
  COUNT(sr.id) as total_questions,
  json_agg(
    json_build_object(
      'question_id', sr.question_id,
      'question_text', sr.question_text,
      'answer_value', sr.answer_value,
      'answer_label', sr.answer_label
    ) ORDER BY sr.question_id
  ) as responses
FROM surveys s
LEFT JOIN survey_responses sr ON s.survey_id = sr.survey_id
GROUP BY s.survey_id, s.respondent_code, s.created_at
ORDER BY s.created_at DESC;

-- STEP 10: BUAT INDEX UNTUK PERFORMA
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_question 
ON survey_responses(survey_id, question_id);

CREATE INDEX IF NOT EXISTS idx_survey_responses_question_id 
ON survey_responses(question_id);

CREATE INDEX IF NOT EXISTS idx_surveys_respondent_code 
ON surveys(respondent_code);

CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at 
ON survey_responses(created_at);

-- STEP 11: LIHAT HASIL SETELAH CLEANUP
SELECT 
  'After Cleanup - Total Responses' as status,
  COUNT(*) as count
FROM survey_responses
UNION ALL
SELECT 
  'After Cleanup - Unique Surveys' as status,
  COUNT(DISTINCT survey_id) as count
FROM survey_responses
UNION ALL
SELECT 
  'After Cleanup - Total Surveys' as status,
  COUNT(*) as count
FROM surveys
UNION ALL
SELECT 
  'After Cleanup - Questions' as status,
  COUNT(DISTINCT question_id) as count
FROM survey_responses;

-- STEP 12: VERIFY DATA INTEGRITY
-- Cek apakah setiap survey memiliki 10 pertanyaan
SELECT 
  survey_id,
  respondent_code,
  COUNT(DISTINCT question_id) as questions_answered
FROM survey_responses sr
JOIN surveys s USING(survey_id)
GROUP BY survey_id, respondent_code
HAVING COUNT(DISTINCT question_id) != 10
ORDER BY questions_answered;

-- STEP 13: SAMPLE DATA CHECK
-- Lihat sample data setelah cleanup
SELECT 
  s.respondent_code,
  s.created_at,
  COUNT(sr.id) as total_responses
FROM surveys s
LEFT JOIN survey_responses sr ON s.survey_id = sr.survey_id
GROUP BY s.survey_id, s.respondent_code, s.created_at
ORDER BY s.created_at DESC
LIMIT 10;

-- STEP 14: TEST VIEWS
-- Test analytics view
SELECT question_id, COUNT(*) as options
FROM clean_analytics 
GROUP BY question_id 
ORDER BY question_id;

-- Test demographics view
SELECT * FROM clean_demographics;

-- STEP 15: FINAL SUMMARY
SELECT 
  (SELECT COUNT(*) FROM surveys) as total_surveys,
  (SELECT COUNT(*) FROM survey_responses) as total_responses,
  (SELECT COUNT(DISTINCT question_id) FROM survey_responses) as unique_questions,
  (SELECT AVG(question_count) FROM (
    SELECT COUNT(*) as question_count 
    FROM survey_responses 
    GROUP BY survey_id
  ) sub) as avg_questions_per_survey;

-- ==========================================
-- SELESAI! DATA SEKARANG SUDAH BERSIH
-- ==========================================