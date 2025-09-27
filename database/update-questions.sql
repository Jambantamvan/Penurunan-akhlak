-- Update Survey Questions - Cleanup existing data and prepare for new questions
-- Run this in Supabase SQL Editor

-- 1. BACKUP existing data (optional - uncomment if you want to keep old data)
-- CREATE TABLE surveys_backup AS SELECT * FROM surveys;
-- CREATE TABLE survey_responses_backup AS SELECT * FROM survey_responses;

-- 2. CLEAN existing data (remove if you want to keep old responses)
DELETE FROM survey_responses;
DELETE FROM surveys;

-- 3. Reset auto-increment sequences if any
-- (No sequences to reset as we use UUID)

-- 4. Verify cleanup
SELECT 'Surveys count:' as table_name, COUNT(*) as record_count FROM surveys
UNION ALL
SELECT 'Survey responses count:' as table_name, COUNT(*) as record_count FROM survey_responses;

-- 5. Test insert with new question structure
-- This will be handled by the application, but we can verify schema compatibility

SELECT 
  'Schema ready for new questions' as status,
  'gender, negative_behavior, improvement_activities, peer_free_socialization, social_media_influence, violence_occurrence, substance_accessibility, supervision_importance' as new_question_ids;