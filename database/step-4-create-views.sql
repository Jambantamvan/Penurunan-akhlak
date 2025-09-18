-- ==========================================
-- LANGKAH 4: Hapus view lama dan buat view bersih
-- Copy dan jalankan query ini untuk membuat view analytics baru
-- ==========================================

-- Hapus view lama yang bermasalah
DROP VIEW IF EXISTS analytics_summary;
DROP VIEW IF EXISTS survey_analytics_new;
DROP VIEW IF EXISTS simple_analytics;
DROP VIEW IF EXISTS demographics_analysis;
DROP VIEW IF EXISTS individual_responses;

-- Buat view analytics yang bersih
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