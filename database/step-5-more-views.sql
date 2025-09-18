-- ==========================================
-- LANGKAH 5: Buat view demographics dan individual
-- Copy dan jalankan query ini untuk view tambahan
-- ==========================================

-- View untuk demographics
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

-- View untuk individual responses
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
ORDER BY s.created_at DESC;