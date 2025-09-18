-- ==========================================
-- LANGKAH 3: Hapus survey duplikat dan orphan responses
-- Copy dan jalankan query ini untuk cleanup surveys
-- ==========================================

-- Hapus survey responses yang tidak memiliki parent survey
DELETE FROM survey_responses 
WHERE survey_id NOT IN (SELECT id FROM surveys);

-- Hapus survey duplikat berdasarkan respondent_code
DELETE FROM surveys 
WHERE id NOT IN (
    SELECT DISTINCT ON (respondent_code) id
    FROM surveys
    ORDER BY respondent_code, created_at ASC
);