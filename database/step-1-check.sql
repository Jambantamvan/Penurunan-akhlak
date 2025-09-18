-- ==========================================
-- STEP-BY-STEP SQL COMMANDS
-- File: step-by-step.sql
-- Copy dan paste satu per satu ke Supabase SQL Editor
-- ==========================================

-- LANGKAH 1: Lihat data sebelum cleanup
-- Copy dan jalankan query ini dulu untuk melihat seberapa banyak duplikasi
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