-- ==========================================
-- SUPABASE FUNCTION UNTUK ANALYTICS API
-- File: analytics-functions.sql
-- ==========================================

-- 1. FUNCTION UNTUK ANALYTICS SUMMARY
CREATE OR REPLACE FUNCTION get_analytics_summary()
RETURNS TABLE (
  question_id TEXT,
  question_text TEXT,
  answer_value TEXT,
  answer_label TEXT,
  response_count BIGINT,
  percentage NUMERIC
) 
LANGUAGE SQL
AS $$
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
$$;

-- 2. FUNCTION UNTUK DEMOGRAPHICS ANALYSIS  
CREATE OR REPLACE FUNCTION get_demographics_analysis()
RETURNS TABLE (
  demographic_type TEXT,
  category TEXT,
  count BIGINT,
  percentage NUMERIC
)
LANGUAGE SQL
AS $$
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
$$;

-- 3. FUNCTION UNTUK INDIVIDUAL RESPONSES
CREATE OR REPLACE FUNCTION get_individual_responses()
RETURNS TABLE (
  survey_id UUID,
  respondent_code TEXT,
  survey_date TIMESTAMPTZ,
  total_questions BIGINT,
  responses JSONB
)
LANGUAGE SQL
AS $$
  SELECT 
    s.survey_id,
    s.respondent_code,
    s.created_at as survey_date,
    COUNT(sr.id) as total_questions,
    jsonb_agg(
      jsonb_build_object(
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
$$;

-- 4. FUNCTION UNTUK TOTAL RESPONSES COUNT
CREATE OR REPLACE FUNCTION get_total_responses()
RETURNS BIGINT
LANGUAGE SQL
AS $$
  SELECT COUNT(DISTINCT survey_id) FROM survey_responses;
$$;

-- 5. FUNCTION UNTUK SURVEY STATISTICS
CREATE OR REPLACE FUNCTION get_survey_statistics()
RETURNS TABLE (
  total_responses BIGINT,
  total_questions BIGINT,
  total_answer_entries BIGINT,
  avg_questions_per_response NUMERIC,
  completion_rate NUMERIC
)
LANGUAGE SQL
AS $$
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
       ROUND(
         (COUNT(DISTINCT survey_id) * 100.0 / GREATEST(COUNT(DISTINCT survey_id), 1)), 
         2
       ) 
     FROM survey_responses
    ) as completion_rate;
$$;

-- 6. FUNCTION UNTUK QUESTION SPECIFIC ANALYTICS
CREATE OR REPLACE FUNCTION get_question_analytics(question_filter TEXT DEFAULT NULL)
RETURNS TABLE (
  question_id TEXT,
  question_text TEXT,
  answer_value TEXT,
  answer_label TEXT,
  response_count BIGINT,
  percentage NUMERIC
)
LANGUAGE SQL
AS $$
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
    AND (question_filter IS NULL OR sr.question_id = question_filter)
  GROUP BY sr.question_id, sr.question_text, sr.answer_value, sr.answer_label
  ORDER BY sr.question_order, response_count DESC;
$$;

-- 7. GRANT PERMISSIONS (ADJUST SESUAI KEBUTUHAN)
-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_analytics_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION get_demographics_analysis() TO authenticated;
GRANT EXECUTE ON FUNCTION get_individual_responses() TO authenticated;
GRANT EXECUTE ON FUNCTION get_total_responses() TO authenticated;
GRANT EXECUTE ON FUNCTION get_survey_statistics() TO authenticated;
GRANT EXECUTE ON FUNCTION get_question_analytics(TEXT) TO authenticated;

-- Grant execute permission to anon users (jika diperlukan untuk public access)
GRANT EXECUTE ON FUNCTION get_analytics_summary() TO anon;
GRANT EXECUTE ON FUNCTION get_demographics_analysis() TO anon;
GRANT EXECUTE ON FUNCTION get_individual_responses() TO anon;
GRANT EXECUTE ON FUNCTION get_total_responses() TO anon;
GRANT EXECUTE ON FUNCTION get_survey_statistics() TO anon;
GRANT EXECUTE ON FUNCTION get_question_analytics(TEXT) TO anon;

-- ==========================================
-- CONTOH PENGGUNAAN:
-- ==========================================

-- Mendapatkan analytics untuk semua pertanyaan:
-- SELECT * FROM get_analytics_summary();

-- Mendapatkan analytics untuk pertanyaan tertentu:
-- SELECT * FROM get_question_analytics('gender');

-- Mendapatkan demographics analysis:
-- SELECT * FROM get_demographics_analysis();

-- Mendapatkan individual responses:
-- SELECT * FROM get_individual_responses() LIMIT 10;

-- Mendapatkan total responses:
-- SELECT get_total_responses();

-- Mendapatkan survey statistics:
-- SELECT * FROM get_survey_statistics();