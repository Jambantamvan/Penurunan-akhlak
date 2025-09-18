'use client'

import { useState, useEffect } from 'react'
import { checkDatabaseSetup } from '@/lib/api'
import { Database, AlertTriangle, Copy, ExternalLink } from 'lucide-react'

export default function DatabaseSetupNotice() {
  const [isSetup, setIsSetup] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkSetup()
  }, [])

  const checkSetup = async () => {
    setIsChecking(true)
    const setupStatus = await checkDatabaseSetup()
    setIsSetup(setupStatus)
    setIsChecking(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('SQL script copied to clipboard!')
    })
  }

  if (isChecking) {
    return (
      <div className="admin-card" style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        borderRadius: '16px',
        marginBottom: '2rem'
      }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '3px solid rgba(102, 126, 234, 0.3)',
          borderTop: '3px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Checking database connection...</p>
      </div>
    )
  }

  if (isSetup) {
    return (
      <div className="admin-card" style={{ 
        padding: '1.5rem', 
        borderRadius: '16px',
        marginBottom: '2rem',
        background: 'rgba(34, 197, 94, 0.1)',
        border: '1px solid rgba(34, 197, 94, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Database style={{ color: '#22c55e', width: '1.25rem', height: '1.25rem' }} />
          <span style={{ color: '#22c55e', fontWeight: '500' }}>
            Database connected and ready!
          </span>
          <button 
            onClick={checkSetup}
            style={{
              marginLeft: 'auto',
              padding: '0.25rem 0.75rem',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '6px',
              color: '#22c55e',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-card" style={{ 
      padding: '2rem', 
      borderRadius: '16px',
      marginBottom: '2rem',
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <AlertTriangle style={{ color: '#ef4444', width: '1.5rem', height: '1.5rem', marginTop: '0.25rem' }} />
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            color: '#ef4444', 
            fontWeight: '600', 
            fontSize: '1.125rem',
            marginBottom: '0.75rem'
          }}>
            Database Setup Required
          </h3>
          
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Anda perlu setup database Supabase terlebih dahulu sebelum bisa menggunakan survey ini.
          </p>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ 
              color: 'var(--text-primary)', 
              fontWeight: '500',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>📝</span>
              Langkah Setup:
            </h4>
            
            <ol style={{ 
              color: 'var(--text-secondary)',
              paddingLeft: '1.25rem',
              lineHeight: '1.8'
            }}>
              <li>Buka <strong>Supabase Dashboard</strong> di browser</li>
              <li>Masuk ke <strong>SQL Editor</strong></li>
              <li>Copy script SQL di bawah ini</li>
              <li>Paste dan jalankan script tersebut</li>
              <li>Refresh halaman ini</li>
            </ol>
          </div>

          <div style={{
            background: '#1f2937',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            maxHeight: '200px',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => copyToClipboard(`-- Copy isi file: database/complete-setup.sql
-- Atau gunakan script singkat berikut:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    respondent_code TEXT UNIQUE NOT NULL,
    session_id TEXT NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    respondent_code TEXT NOT NULL,
    question_id TEXT NOT NULL,
    question_text TEXT NOT NULL,
    answer_value TEXT NOT NULL,
    answer_label TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Function untuk generate respondent code
CREATE OR REPLACE FUNCTION generate_respondent_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    nums TEXT := '0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    result := substr(chars, floor(random() * length(chars))::int + 1, 1);
    FOR i IN 1..2 LOOP
        result := result || substr(nums, floor(random() * length(nums))::int + 1, 1);
    END LOOP;
    WHILE EXISTS(SELECT 1 FROM surveys WHERE respondent_code = result) LOOP
        result := substr(chars, floor(random() * length(chars))::int + 1, 1);
        FOR i IN 1..2 LOOP
            result := result || substr(nums, floor(random() * length(nums))::int + 1, 1);
        END LOOP;
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function untuk submit survey
CREATE OR REPLACE FUNCTION insert_survey_with_responses(
    session_id_param TEXT,
    responses_data JSONB
)
RETURNS JSON AS $$
DECLARE
    new_survey_id UUID;
    new_respondent_code TEXT;
    response_item JSONB;
    result JSON;
BEGIN
    new_respondent_code := generate_respondent_code();
    INSERT INTO surveys (respondent_code, session_id)
    VALUES (new_respondent_code, session_id_param)
    RETURNING id INTO new_survey_id;
    
    FOR response_item IN SELECT * FROM jsonb_array_elements(responses_data)
    LOOP
        INSERT INTO survey_responses (
            survey_id, respondent_code, question_id, question_text,
            answer_value, answer_label, question_order
        ) VALUES (
            new_survey_id, new_respondent_code,
            response_item->>'question_id', response_item->>'question_text',
            response_item->>'answer_value', response_item->>'answer_label',
            (response_item->>'question_order')::INTEGER
        );
    END LOOP;
    
    SELECT json_build_object(
        'survey_id', new_survey_id,
        'respondent_code', new_respondent_code,
        'success', true
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Analytics views
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
    question_id, question_text, answer_label,
    COUNT(*) as response_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY question_id), 2) as percentage
FROM survey_responses
GROUP BY question_id, question_text, answer_label
ORDER BY question_id, response_count DESC;

-- Enable RLS
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous survey creation" ON surveys FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous response creation" ON survey_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read surveys" ON surveys FOR SELECT USING (true);
CREATE POLICY "Allow public read responses" ON survey_responses FOR SELECT USING (true);`)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'rgba(102, 126, 234, 0.2)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '6px',
                padding: '0.25rem 0.5rem',
                color: '#667eea',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Copy style={{ width: '0.875rem', height: '0.875rem' }} />
              Copy
            </button>
            <pre style={{ 
              color: '#e5e7eb',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
{`-- Script SQL untuk setup database
-- Copy dan jalankan di Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    respondent_code TEXT UNIQUE NOT NULL,
    session_id TEXT NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Dan seterusnya... (klik Copy untuk script lengkap)`}
            </pre>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              onClick={checkSetup}
              className="btn"
              style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}
            >
              Check Again
            </button>
            
            <a 
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50px',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <ExternalLink style={{ width: '1rem', height: '1rem' }} />
              Open Supabase
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}