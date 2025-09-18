-- ==========================================
-- LANGKAH 6: Lihat hasil setelah cleanup
-- Copy dan jalankan query ini untuk verifikasi hasil
-- ==========================================

-- Lihat summary data setelah cleanup
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

-- Cek integritas data (setiap survey harus punya 10 pertanyaan)
SELECT 
  sr.survey_id,
  s.respondent_code,
  COUNT(DISTINCT sr.question_id) as questions_answered
FROM survey_responses sr
JOIN surveys s ON sr.survey_id = s.id
GROUP BY sr.survey_id, s.respondent_code
HAVING COUNT(DISTINCT sr.question_id) != 10
ORDER BY questions_answered;

-- Test view analytics
SELECT question_id, COUNT(*) as options
FROM clean_analytics 
GROUP BY question_id 
ORDER BY question_id;

-- Test view demographics
SELECT * FROM clean_demographics;

-- Sample data
SELECT 
  s.respondent_code,
  s.created_at,
  COUNT(sr.id) as total_responses
FROM surveys s
LEFT JOIN survey_responses sr ON s.id = sr.survey_id
GROUP BY s.id, s.respondent_code, s.created_at
ORDER BY s.created_at DESC
LIMIT 5;