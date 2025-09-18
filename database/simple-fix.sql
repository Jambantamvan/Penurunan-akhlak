-- ==========================================
-- SIMPLE FIX - Perbaikan tanpa error  
-- File: simple-fix.sql - COPY PASTE SATU PER SATU
-- ==========================================

-- STEP 1: Hapus duplikasi survey_responses
DELETE FROM survey_responses 
WHERE id NOT IN (
    SELECT DISTINCT ON (survey_id, question_id) id
    FROM survey_responses
    ORDER BY survey_id, question_id, created_at ASC
);

-- STEP 2: Hapus view lama yang bermasalah
DROP VIEW IF EXISTS analytics_summary;
DROP VIEW IF EXISTS survey_analytics_new;
DROP VIEW IF EXISTS simple_analytics;
DROP VIEW IF EXISTS demographics_analysis;
DROP VIEW IF EXISTS individual_responses;

-- STEP 3: Buat view analytics bersih
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

-- STEP 4: Lihat hasil cleanup
SELECT 
  'Total Survey Responses After Cleanup' as status,
  COUNT(*) as count
FROM survey_responses;

-- STEP 5: Test view analytics baru
SELECT question_id, COUNT(*) as options
FROM clean_analytics 
GROUP BY question_id 
ORDER BY question_id;

-- ==========================================
-- SELESAI! Analytics view sudah siap
-- ==========================================
SELECT * FROM survey_responses LIMIT 3;

-- LANGKAH 3: HAPUS DUPLIKASI (SIMPLE)
DELETE FROM survey_responses 
WHERE ctid NOT IN (
  SELECT MIN(ctid)
  FROM survey_responses
  GROUP BY survey_id, question_id
);

-- LANGKAH 4: HAPUS VIEW LAMA YANG BERMASALAH
DROP VIEW IF EXISTS analytics_summary;

-- LANGKAH 5: BUAT VIEW ANALYTICS BARU DENGAN NAMA BERBEDA
CREATE OR REPLACE VIEW survey_analytics_new AS
SELECT 
  question_id,
  question_text,
  answer_value,
  answer_label,
  COUNT(*) as response_count,
  ROUND(
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY question_id), 
    1
  ) as percentage
FROM survey_responses
WHERE survey_id IS NOT NULL
GROUP BY question_id, question_text, answer_value, answer_label;

-- LANGKAH 6: TEST VIEW BARU
SELECT * FROM survey_analytics_new;

-- LANGKAH 7: CEK HASIL
SELECT 
  'Total Responses' as metric,
  COUNT(*) as count
FROM survey_responses
UNION ALL
SELECT 
  'Unique Surveys' as metric,
  COUNT(DISTINCT survey_id) as count
FROM survey_responses;