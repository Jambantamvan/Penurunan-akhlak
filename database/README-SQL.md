## 📋 PANDUAN LENGKAP CLEANUP DATABASE SUPABASE

### 🎯 Tujuan
Merapikan data di tabel `survey_responses` dan `surveys` yang mengalami duplikasi, serta membuat view analytics yang bersih untuk dashboard.

### 📁 File SQL yang Tersedia

#### 1. **step-1-check.sql** 
```sql
-- Cek data sebelum cleanup
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
```

#### 2. **step-2-cleanup-responses.sql**
```sql
-- Hapus duplikasi survey_responses
DELETE FROM survey_responses 
WHERE id NOT IN (
    SELECT DISTINCT ON (survey_id, question_id) id
    FROM survey_responses
    ORDER BY survey_id, question_id, created_at ASC
);
```

#### 3. **step-3-cleanup-surveys.sql**
```sql
-- Cleanup surveys dan orphan responses
DELETE FROM survey_responses 
WHERE survey_id NOT IN (SELECT survey_id FROM surveys);

DELETE FROM surveys 
WHERE survey_id NOT IN (
    SELECT DISTINCT ON (respondent_code) survey_id
    FROM surveys
    ORDER BY respondent_code, created_at ASC
);
```

#### 4. **step-4-create-views.sql**
```sql
-- Buat view analytics bersih
DROP VIEW IF EXISTS analytics_summary;
DROP VIEW IF EXISTS survey_analytics_new;
DROP VIEW IF EXISTS simple_analytics;
DROP VIEW IF EXISTS demographics_analysis;
DROP VIEW IF EXISTS individual_responses;

CREATE OR REPLACE VIEW clean_analytics AS
SELECT 
  sr.question_id,
  sr.question_text,
  sr.answer_value,
  sr.answer_label,
  COUNT(*) as response_count,
  ROUND(
    (COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY sr.question_id)), 
    1
  ) as percentage
FROM survey_responses sr
WHERE sr.survey_id IS NOT NULL
GROUP BY sr.question_id, sr.question_text, sr.answer_value, sr.answer_label
ORDER BY sr.question_id, response_count DESC;
```

#### 5. **step-5-more-views.sql**
```sql
-- View demographics dan individual responses
CREATE OR REPLACE VIEW clean_demographics AS
SELECT 
  'gender' as category,
  sr.answer_label as value,
  COUNT(*) as count,
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(DISTINCT survey_id) FROM survey_responses WHERE question_id = 'gender')), 1) as percentage
FROM survey_responses sr
WHERE sr.question_id = 'gender'
GROUP BY sr.answer_label
UNION ALL
SELECT 
  'age' as category,
  sr.answer_label as value,
  COUNT(*) as count,
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(DISTINCT survey_id) FROM survey_responses WHERE question_id = 'age')), 1) as percentage
FROM survey_responses sr
WHERE sr.question_id = 'age'
GROUP BY sr.answer_label
ORDER BY category, count DESC;

CREATE OR REPLACE VIEW clean_individual_responses AS
SELECT 
  s.survey_id,
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
LEFT JOIN survey_responses sr ON s.survey_id = sr.survey_id
GROUP BY s.survey_id, s.respondent_code, s.created_at
ORDER BY s.created_at DESC;
```

#### 6. **step-6-verify.sql**
```sql
-- Verifikasi hasil cleanup
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

-- Test views
SELECT question_id, COUNT(*) as options FROM clean_analytics GROUP BY question_id ORDER BY question_id;
SELECT * FROM clean_demographics;
```

### 🔧 Cara Menjalankan

1. **Buka Supabase Dashboard** → SQL Editor
2. **Jalankan step 1-6 secara berurutan**
3. **Copy-paste satu file per satu**
4. **Tunggu setiap query selesai** sebelum lanjut

### ✅ Yang Sudah Diperbaiki di Code

1. **API lib** sudah diupdate untuk menggunakan `clean_analytics`, `clean_demographics`, dan `clean_individual_responses` view
2. **Chart components** sudah siap dengan Chart.js integration
3. **Fallback mechanism** sudah ada jika view tidak tersedia
4. **Colors** sudah konsisten dengan main page

### 🎯 Hasil yang Diharapkan

Setelah menjalankan semua SQL:
- ✅ **Tidak ada duplikasi data**
- ✅ **Chart akan muncul di analytics dashboard**  
- ✅ **Data lebih rapih dan terorganisir**
- ✅ **Performance lebih baik dengan index**

### 🚀 Test Dashboard

Setelah selesai SQL, buka: `http://localhost:3004/admin` untuk melihat chart analytics yang sudah berfungsi!