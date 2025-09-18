-- ==========================================
-- QUICK FIX SQL - JALANKAN DI SUPABASE SQL EDITOR
-- File: quick-fix.sql
-- ==========================================

-- 1. HAPUS DUPLIKASI DATA (HANYA SIMPAN 1 SURVEY PER SESSION)
WITH duplicate_surveys AS (
  SELECT survey_id,
         ROW_NUMBER() OVER (
           PARTITION BY respondent_code 
           ORDER BY created_at ASC
         ) as rn
  FROM surveys
)
DELETE FROM survey_responses 
WHERE survey_id IN (
  SELECT survey_id FROM duplicate_surveys WHERE rn > 1
);

DELETE FROM surveys 
WHERE survey_id IN (
  SELECT survey_id FROM (
    SELECT survey_id,
           ROW_NUMBER() OVER (
             PARTITION BY respondent_code 
             ORDER BY created_at ASC
           ) as rn
    FROM surveys
  ) ranked WHERE rn > 1
);

-- 2. BUAT VIEW ANALYTICS YANG SIMPLE
CREATE OR REPLACE VIEW analytics_summary AS
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
GROUP BY sr.question_id, sr.question_text, sr.answer_value, sr.answer_label, sr.question_order
ORDER BY sr.question_order, response_count DESC;

-- 3. CEK HASIL
SELECT 
  'Total Unique Surveys' as info,
  COUNT(*) as count
FROM surveys
UNION ALL
SELECT 
  'Total Survey Responses' as info,
  COUNT(*) as count
FROM survey_responses;

-- 4. LIHAT DATA ANALYTICS
SELECT * FROM analytics_summary LIMIT 20;