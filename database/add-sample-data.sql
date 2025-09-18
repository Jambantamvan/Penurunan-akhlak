-- ==========================================
-- TAMBAH SAMPLE DATA LENGKAP
-- File: add-sample-data.sql
-- Jalankan ini untuk menambah data sample lengkap
-- ==========================================

-- Daftar semua pertanyaan survey
INSERT INTO survey_responses (survey_id, respondent_code, question_id, question_text, answer_value, answer_label, question_order) VALUES

-- Survey Sample 1 (Responden A01)
('a5185127-e106-4bbe-b8f7-1957f62b4401', 'A01', 'age', 'Umur Anda berapa?', '13-15', '13-15 tahun', 1),
('a5185127-e106-4bbe-b8f7-1957f62b4401', 'A01', 'gender', 'Jenis Kelamin', 'male', 'Laki-laki', 2),
('a5185127-e106-4bbe-b8f7-1957f62b4401', 'A01', 'social_media', 'Seberapa sering Anda melihat konten negatif di media sosial?', 'often', 'Sering', 3),
('a5185127-e106-4bbe-b8f7-1957f62b4401', 'A01', 'pornography', 'Seberapa mudah akses konten pornografi menurut Anda?', 'very_easy', 'Sangat Mudah', 4),
('a5185127-e106-4bbe-b8f7-1957f62b4401', 'A01', 'bullying', 'Seberapa sering Anda melihat perilaku perundungan di sekitar?', 'sometimes', 'Kadang-kadang', 5),
('a5185127-e106-4bbe-b8f7-1957f62b4401', 'A01', 'hate_speech', 'Bagaimana dampak ujaran kasar terhadap moral?', 'severe_impact', 'Dampak Sangat Besar', 6),
('a5185127-e106-4bbe-b8f7-1957f62b4401', 'A01', 'family_communication', 'Bagaimana kondisi komunikasi dalam keluarga?', 'good', 'Baik', 7),
('a5185127-e106-4bbe-b8f7-1957f62b4401', 'A01', 'social_impact', 'Bagaimana pengaruh perilaku negatif terhadap lingkungan?', 'high_influence', 'Sangat Berpengaruh', 8),
('a5185127-e106-4bbe-b8f7-1957f62b4401', 'A01', 'solution', 'Menurut Anda, apa solusi paling efektif untuk mengatasi masalah akhlak?', 'education', 'Pendidikan Moral', 9),
('a5185127-e106-4bbe-b8f7-1957f62b4401', 'A01', 'gossip', 'Seberapa sering Anda mendengar atau menyebarkan gossip?', 'rarely', 'Jarang', 10),

-- Survey Sample 2 (Responden B02)
('b5185127-e106-4bbe-b8f7-1957f62b4401', 'B02', 'age', 'Umur Anda berapa?', '16-18', '16-18 tahun', 1),
('b5185127-e106-4bbe-b8f7-1957f62b4401', 'B02', 'gender', 'Jenis Kelamin', 'female', 'Perempuan', 2),
('b5185127-e106-4bbe-b8f7-1957f62b4401', 'B02', 'social_media', 'Seberapa sering Anda melihat konten negatif di media sosial?', 'very_often', 'Sangat Sering', 3),
('b5185127-e106-4bbe-b8f7-1957f62b4401', 'B02', 'pornography', 'Seberapa mudah akses konten pornografi menurut Anda?', 'easy', 'Mudah', 4),
('b5185127-e106-4bbe-b8f7-1957f62b4401', 'B02', 'bullying', 'Seberapa sering Anda melihat perilaku perundungan di sekitar?', 'often', 'Sering', 5),
('b5185127-e106-4bbe-b8f7-1957f62b4401', 'B02', 'hate_speech', 'Bagaimana dampak ujaran kasar terhadap moral?', 'moderate_impact', 'Dampak Sedang', 6),
('b5185127-e106-4bbe-b8f7-1957f62b4401', 'B02', 'family_communication', 'Bagaimana kondisi komunikasi dalam keluarga?', 'poor', 'Kurang Baik', 7),
('b5185127-e106-4bbe-b8f7-1957f62b4401', 'B02', 'social_impact', 'Bagaimana pengaruh perilaku negatif terhadap lingkungan?', 'moderate_influence', 'Cukup Berpengaruh', 8),
('b5185127-e106-4bbe-b8f7-1957f62b4401', 'B02', 'solution', 'Menurut Anda, apa solusi paling efektif untuk mengatasi masalah akhlak?', 'family_guidance', 'Bimbingan Keluarga', 9),
('b5185127-e106-4bbe-b8f7-1957f62b4401', 'B02', 'gossip', 'Seberapa sering Anda mendengar atau menyebarkan gossip?', 'often', 'Sering', 10),

-- Survey Sample 3 (Responden C03)
('c5185127-e106-4bbe-b8f7-1957f62b4401', 'C03', 'age', 'Umur Anda berapa?', '19-21', '19-21 tahun', 1),
('c5185127-e106-4bbe-b8f7-1957f62b4401', 'C03', 'gender', 'Jenis Kelamin', 'male', 'Laki-laki', 2),
('c5185127-e106-4bbe-b8f7-1957f62b4401', 'C03', 'social_media', 'Seberapa sering Anda melihat konten negatif di media sosial?', 'sometimes', 'Kadang-kadang', 3),
('c5185127-e106-4bbe-b8f7-1957f62b4401', 'C03', 'pornography', 'Seberapa mudah akses konten pornografi menurut Anda?', 'moderate', 'Sedang', 4),
('c5185127-e106-4bbe-b8f7-1957f62b4401', 'C03', 'bullying', 'Seberapa sering Anda melihat perilaku perundungan di sekitar?', 'rarely', 'Jarang', 5),
('c5185127-e106-4bbe-b8f7-1957f62b4401', 'C03', 'hate_speech', 'Bagaimana dampak ujaran kasar terhadap moral?', 'severe_impact', 'Dampak Sangat Besar', 6),
('c5185127-e106-4bbe-b8f7-1957f62b4401', 'C03', 'family_communication', 'Bagaimana kondisi komunikasi dalam keluarga?', 'very_good', 'Sangat Baik', 7),
('c5185127-e106-4bbe-b8f7-1957f62b4401', 'C03', 'social_impact', 'Bagaimana pengaruh perilaku negatif terhadap lingkungan?', 'destructive', 'Merusak', 8),
('c5185127-e106-4bbe-b8f7-1957f62b4401', 'C03', 'solution', 'Menurut Anda, apa solusi paling efektif untuk mengatasi masalah akhlak?', 'religion_approach', 'Pendekatan Agama', 9),
('c5185127-e106-4bbe-b8f7-1957f62b4401', 'C03', 'gossip', 'Seberapa sering Anda mendengar atau menyebarkan gossip?', 'never', 'Tidak Pernah', 10),

-- Survey Sample 4 (Responden D04)
('d5185127-e106-4bbe-b8f7-1957f62b4401', 'D04', 'age', 'Umur Anda berapa?', '16-18', '16-18 tahun', 1),
('d5185127-e106-4bbe-b8f7-1957f62b4401', 'D04', 'gender', 'Jenis Kelamin', 'female', 'Perempuan', 2),
('d5185127-e106-4bbe-b8f7-1957f62b4401', 'D04', 'social_media', 'Seberapa sering Anda melihat konten negatif di media sosial?', 'rarely', 'Jarang', 3),
('d5185127-e106-4bbe-b8f7-1957f62b4401', 'D04', 'pornography', 'Seberapa mudah akses konten pornografi menurut Anda?', 'difficult', 'Sulit', 4),
('d5185127-e106-4bbe-b8f7-1957f62b4401', 'D04', 'bullying', 'Seberapa sering Anda melihat perilaku perundungan di sekitar?', 'never', 'Tidak Pernah', 5),
('d5185127-e106-4bbe-b8f7-1957f62b4401', 'D04', 'hate_speech', 'Bagaimana dampak ujaran kasar terhadap moral?', 'mild_impact', 'Dampak Ringan', 6),
('d5185127-e106-4bbe-b8f7-1957f62b4401', 'D04', 'family_communication', 'Bagaimana kondisi komunikasi dalam keluarga?', 'good', 'Baik', 7),
('d5185127-e106-4bbe-b8f7-1957f62b4401', 'D04', 'social_impact', 'Bagaimana pengaruh perilaku negatif terhadap lingkungan?', 'low_influence', 'Kurang Berpengaruh', 8),
('d5185127-e106-4bbe-b8f7-1957f62b4401', 'D04', 'solution', 'Menurut Anda, apa solusi paling efektif untuk mengatasi masalah akhlak?', 'technology_control', 'Kontrol Teknologi', 9),
('d5185127-e106-4bbe-b8f7-1957f62b4401', 'D04', 'gossip', 'Seberapa sering Anda mendengar atau menyebarkan gossip?', 'sometimes', 'Kadang-kadang', 10),

-- Survey Sample 5 (Responden E05)
('e5185127-e106-4bbe-b8f7-1957f62b4401', 'E05', 'age', 'Umur Anda berapa?', '13-15', '13-15 tahun', 1),
('e5185127-e106-4bbe-b8f7-1957f62b4401', 'E05', 'gender', 'Jenis Kelamin', 'male', 'Laki-laki', 2),
('e5185127-e106-4bbe-b8f7-1957f62b4401', 'E05', 'social_media', 'Seberapa sering Anda melihat konten negatif di media sosial?', 'often', 'Sering', 3),
('e5185127-e106-4bbe-b8f7-1957f62b4401', 'E05', 'pornography', 'Seberapa mudah akses konten pornografi menurut Anda?', 'very_easy', 'Sangat Mudah', 4),
('e5185127-e106-4bbe-b8f7-1957f62b4401', 'E05', 'bullying', 'Seberapa sering Anda melihat perilaku perundungan di sekitar?', 'very_often', 'Sangat Sering', 5),
('e5185127-e106-4bbe-b8f7-1957f62b4401', 'E05', 'hate_speech', 'Bagaimana dampak ujaran kasar terhadap moral?', 'severe_impact', 'Dampak Sangat Besar', 6),
('e5185127-e106-4bbe-b8f7-1957f62b4401', 'E05', 'family_communication', 'Bagaimana kondisi komunikasi dalam keluarga?', 'very_poor', 'Sangat Buruk', 7),
('e5185127-e106-4bbe-b8f7-1957f62b4401', 'E05', 'social_impact', 'Bagaimana pengaruh perilaku negatif terhadap lingkungan?', 'destructive', 'Merusak', 8),
('e5185127-e106-4bbe-b8f7-1957f62b4401', 'E05', 'solution', 'Menurut Anda, apa solusi paling efektif untuk mengatasi masalah akhlak?', 'holistic_approach', 'Pendekatan Holistik', 9),
('e5185127-e106-4bbe-b8f7-1957f62b4401', 'E05', 'gossip', 'Seberapa sering Anda mendengar atau menyebarkan gossip?', 'very_often', 'Sangat Sering', 10);

-- Tambahkan juga record di tabel surveys
INSERT INTO surveys (id, respondent_code, session_id) VALUES
('a5185127-e106-4bbe-b8f7-1957f62b4401', 'A01', 'session-sample-001'),
('b5185127-e106-4bbe-b8f7-1957f62b4401', 'B02', 'session-sample-002'),
('c5185127-e106-4bbe-b8f7-1957f62b4401', 'C03', 'session-sample-003'),
('d5185127-e106-4bbe-b8f7-1957f62b4401', 'D04', 'session-sample-004'),
('e5185127-e106-4bbe-b8f7-1957f62b4401', 'E05', 'session-sample-005')
ON CONFLICT (id) DO NOTHING;

-- Cek hasil
SELECT 
  'Total Surveys' as type,
  COUNT(*) as count
FROM surveys
UNION ALL
SELECT 
  'Total Survey Responses' as type,
  COUNT(*) as count
FROM survey_responses
UNION ALL
SELECT 
  'Unique Questions' as type,
  COUNT(DISTINCT question_id) as count
FROM survey_responses;

-- Cek data per pertanyaan
SELECT 
  question_id,
  question_text,
  COUNT(*) as total_responses
FROM survey_responses
GROUP BY question_id, question_text
ORDER BY question_id;