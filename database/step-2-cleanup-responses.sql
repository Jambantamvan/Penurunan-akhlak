-- ==========================================
-- LANGKAH 2: Hapus duplikasi survey_responses
-- Copy dan jalankan query ini untuk menghapus duplikasi
-- ==========================================

DELETE FROM survey_responses 
WHERE id NOT IN (
    SELECT DISTINCT ON (survey_id, question_id) id
    FROM survey_responses
    ORDER BY survey_id, question_id, created_at ASC
);