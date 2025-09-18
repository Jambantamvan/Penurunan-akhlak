-- PASTI BERHASIL - SQL MINIMAL
-- Jalankan di Supabase SQL Editor satu per satu

-- 1. CEK DATA YANG ADA
SELECT COUNT(*) FROM survey_responses;

-- 2. LIHAT SAMPLE DATA  
SELECT * FROM survey_responses LIMIT 2;

-- 3. HAPUS DUPLIKASI (JIKA ADA)
-- Gunakan ID unik untuk menghapus duplikasi
WITH ranked_responses AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY survey_id, question_id 
      ORDER BY created_at
    ) as rn
  FROM survey_responses
)
DELETE FROM survey_responses 
WHERE id IN (
  SELECT id FROM ranked_responses WHERE rn > 1
);

-- 4. BUAT VIEW SEDERHANA UNTUK ANALYTICS
CREATE OR REPLACE VIEW simple_analytics AS
SELECT 
  question_id,
  answer_label,
  COUNT(*) as count
FROM survey_responses
GROUP BY question_id, answer_label;

-- 5. TEST VIEW
SELECT * FROM simple_analytics;

-- 6. CEK HASIL AKHIR
SELECT 
  question_id,
  COUNT(*) as total_responses
FROM survey_responses 
GROUP BY question_id;