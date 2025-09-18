-- ==========================================
-- GENERATE BANYAK SAMPLE DATA
-- File: generate-lots-data.sql
-- Menggunakan PostgreSQL untuk generate 50 responden
-- ==========================================

-- Function untuk generate random survey data
DO $$
DECLARE
    i INTEGER;
    survey_uuid UUID;
    resp_code TEXT;
    ages TEXT[] := ARRAY['13-15', '16-18', '19-21'];
    genders TEXT[] := ARRAY['male', 'female'];
    frequencies TEXT[] := ARRAY['never', 'rarely', 'sometimes', 'often', 'very_often'];
    difficulties TEXT[] := ARRAY['very_difficult', 'difficult', 'moderate', 'easy', 'very_easy'];
    impacts TEXT[] := ARRAY['no_impact', 'mild_impact', 'moderate_impact', 'severe_impact'];
    communications TEXT[] := ARRAY['very_poor', 'poor', 'fair', 'good', 'very_good'];
    influences TEXT[] := ARRAY['no_influence', 'low_influence', 'moderate_influence', 'high_influence', 'destructive'];
    solutions TEXT[] := ARRAY['education', 'family_guidance', 'religion_approach', 'technology_control', 'holistic_approach'];
BEGIN
    FOR i IN 1..50 LOOP
        -- Generate UUID and respondent code
        survey_uuid := gen_random_uuid();
        resp_code := 'R' || LPAD(i::text, 2, '0');
        
        -- Insert survey
        INSERT INTO surveys (id, respondent_code, session_id) 
        VALUES (survey_uuid, resp_code, 'generated-session-' || i)
        ON CONFLICT (id) DO NOTHING;
        
        -- Insert age
        INSERT INTO survey_responses (survey_id, respondent_code, question_id, question_text, answer_value, answer_label, question_order)
        VALUES (survey_uuid, resp_code, 'age', 'Umur Anda berapa?', 
                ages[1 + (random() * 2)::int], 
                ages[1 + (random() * 2)::int] || ' tahun', 1);
        
        -- Insert gender
        INSERT INTO survey_responses (survey_id, respondent_code, question_id, question_text, answer_value, answer_label, question_order)
        VALUES (survey_uuid, resp_code, 'gender', 'Jenis Kelamin', 
                genders[1 + (random() * 1)::int], 
                CASE WHEN genders[1 + (random() * 1)::int] = 'male' THEN 'Laki-laki' ELSE 'Perempuan' END, 2);
        
        -- Insert social_media
        INSERT INTO survey_responses (survey_id, respondent_code, question_id, question_text, answer_value, answer_label, question_order)
        VALUES (survey_uuid, resp_code, 'social_media', 'Seberapa sering Anda melihat konten negatif di media sosial?',
                frequencies[1 + (random() * 4)::int],
                CASE frequencies[1 + (random() * 4)::int]
                    WHEN 'never' THEN 'Tidak Pernah'
                    WHEN 'rarely' THEN 'Jarang'
                    WHEN 'sometimes' THEN 'Kadang-kadang'
                    WHEN 'often' THEN 'Sering'
                    WHEN 'very_often' THEN 'Sangat Sering'
                END, 3);
        
        -- Insert pornography
        INSERT INTO survey_responses (survey_id, respondent_code, question_id, question_text, answer_value, answer_label, question_order)
        VALUES (survey_uuid, resp_code, 'pornography', 'Seberapa mudah akses konten pornografi menurut Anda?',
                difficulties[1 + (random() * 4)::int],
                CASE difficulties[1 + (random() * 4)::int]
                    WHEN 'very_difficult' THEN 'Sangat Sulit'
                    WHEN 'difficult' THEN 'Sulit'
                    WHEN 'moderate' THEN 'Sedang'
                    WHEN 'easy' THEN 'Mudah'
                    WHEN 'very_easy' THEN 'Sangat Mudah'
                END, 4);
        
        -- Insert bullying
        INSERT INTO survey_responses (survey_id, respondent_code, question_id, question_text, answer_value, answer_label, question_order)
        VALUES (survey_uuid, resp_code, 'bullying', 'Seberapa sering Anda melihat perilaku perundungan di sekitar?',
                frequencies[1 + (random() * 4)::int],
                CASE frequencies[1 + (random() * 4)::int]
                    WHEN 'never' THEN 'Tidak Pernah'
                    WHEN 'rarely' THEN 'Jarang'
                    WHEN 'sometimes' THEN 'Kadang-kadang'
                    WHEN 'often' THEN 'Sering'
                    WHEN 'very_often' THEN 'Sangat Sering'
                END, 5);
        
        -- Insert hate_speech
        INSERT INTO survey_responses (survey_id, respondent_code, question_id, question_text, answer_value, answer_label, question_order)
        VALUES (survey_uuid, resp_code, 'hate_speech', 'Bagaimana dampak ujaran kasar terhadap moral?',
                impacts[1 + (random() * 3)::int],
                CASE impacts[1 + (random() * 3)::int]
                    WHEN 'no_impact' THEN 'Tidak Ada Dampak'
                    WHEN 'mild_impact' THEN 'Dampak Ringan'
                    WHEN 'moderate_impact' THEN 'Dampak Sedang'
                    WHEN 'severe_impact' THEN 'Dampak Sangat Besar'
                END, 6);
        
        -- Insert family_communication
        INSERT INTO survey_responses (survey_id, respondent_code, question_id, question_text, answer_value, answer_label, question_order)
        VALUES (survey_uuid, resp_code, 'family_communication', 'Bagaimana kondisi komunikasi dalam keluarga?',
                communications[1 + (random() * 4)::int],
                CASE communications[1 + (random() * 4)::int]
                    WHEN 'very_poor' THEN 'Sangat Buruk'
                    WHEN 'poor' THEN 'Kurang Baik'
                    WHEN 'fair' THEN 'Cukup'
                    WHEN 'good' THEN 'Baik'
                    WHEN 'very_good' THEN 'Sangat Baik'
                END, 7);
        
        -- Insert social_impact
        INSERT INTO survey_responses (survey_id, respondent_code, question_id, question_text, answer_value, answer_label, question_order)
        VALUES (survey_uuid, resp_code, 'social_impact', 'Bagaimana pengaruh perilaku negatif terhadap lingkungan?',
                influences[1 + (random() * 4)::int],
                CASE influences[1 + (random() * 4)::int]
                    WHEN 'no_influence' THEN 'Tidak Berpengaruh'
                    WHEN 'low_influence' THEN 'Kurang Berpengaruh'
                    WHEN 'moderate_influence' THEN 'Cukup Berpengaruh'
                    WHEN 'high_influence' THEN 'Sangat Berpengaruh'
                    WHEN 'destructive' THEN 'Merusak'
                END, 8);
        
        -- Insert solution
        INSERT INTO survey_responses (survey_id, respondent_code, question_id, question_text, answer_value, answer_label, question_order)
        VALUES (survey_uuid, resp_code, 'solution', 'Menurut Anda, apa solusi paling efektif untuk mengatasi masalah akhlak?',
                solutions[1 + (random() * 4)::int],
                CASE solutions[1 + (random() * 4)::int]
                    WHEN 'education' THEN 'Pendidikan Moral'
                    WHEN 'family_guidance' THEN 'Bimbingan Keluarga'
                    WHEN 'religion_approach' THEN 'Pendekatan Agama'
                    WHEN 'technology_control' THEN 'Kontrol Teknologi'
                    WHEN 'holistic_approach' THEN 'Pendekatan Holistik'
                END, 9);
        
        -- Insert gossip
        INSERT INTO survey_responses (survey_id, respondent_code, question_id, question_text, answer_value, answer_label, question_order)
        VALUES (survey_uuid, resp_code, 'gossip', 'Seberapa sering Anda mendengar atau menyebarkan gossip?',
                frequencies[1 + (random() * 4)::int],
                CASE frequencies[1 + (random() * 4)::int]
                    WHEN 'never' THEN 'Tidak Pernah'
                    WHEN 'rarely' THEN 'Jarang'
                    WHEN 'sometimes' THEN 'Kadang-kadang'
                    WHEN 'often' THEN 'Sering'
                    WHEN 'very_often' THEN 'Sangat Sering'
                END, 10);
        
        RAISE NOTICE 'Generated survey % with code %', i, resp_code;
    END LOOP;
END $$;

-- Cek hasil akhir
SELECT 
  'Total Surveys Generated' as type,
  COUNT(*) as count
FROM surveys
UNION ALL
SELECT 
  'Total Survey Responses Generated' as type,
  COUNT(*) as count
FROM survey_responses
UNION ALL
SELECT 
  'Questions Coverage' as type,
  COUNT(DISTINCT question_id) as count
FROM survey_responses;

-- Verifikasi semua pertanyaan ada data
SELECT 
  question_id,
  question_text,
  COUNT(*) as total_responses,
  COUNT(DISTINCT answer_value) as unique_answers
FROM survey_responses
GROUP BY question_id, question_text
ORDER BY question_id;