// Script untuk mengecek dan mengupdate database Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Environment variables tidak ditemukan!');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Ada' : '❌ Tidak ada');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Ada' : '❌ Tidak ada');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Mengecek database Supabase...\n');
  
  try {
    // 1. Cek koneksi database
    console.log('1. Testing koneksi database...');
    const { data: testData, error: testError } = await supabase
      .from('surveys')
      .select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.log('❌ Error koneksi:', testError.message);
      return;
    }
    console.log('✅ Koneksi database berhasil');
    
    // 2. Cek jumlah data survey
    console.log('\n2. Mengecek data survey...');
    const { data: surveys, error: surveyError } = await supabase
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (surveyError) {
      console.log('❌ Error mengambil data survey:', surveyError.message);
      return;
    }
    
    console.log(`📊 Total surveys: ${surveys.length}`);
    
    if (surveys.length > 0) {
      console.log('📝 Survey terbaru:');
      const latest = surveys[0];
      console.log(`   - ID: ${latest.id}`);
      console.log(`   - Tanggal: ${latest.created_at}`);
      console.log(`   - Data: ${JSON.stringify(latest.survey_data || {}).substring(0, 100)}...`);
      
      // Cek apakah menggunakan question ID baru
      const surveyData = latest.survey_data || {};
      const hasNewQuestions = surveyData.gender || surveyData.negative_behavior || surveyData.improvement_activities;
      
      if (hasNewQuestions) {
        console.log('✅ Database sudah menggunakan struktur pertanyaan baru');
      } else {
        console.log('⚠️  Database masih menggunakan struktur pertanyaan lama');
        console.log('💡 Perlu menjalankan script cleanup untuk menghapus data lama');
      }
    } else {
      console.log('✅ Database kosong, siap untuk pertanyaan baru');
    }
    
    // 3. Cek jumlah responses
    console.log('\n3. Mengecek survey responses...');
    const { data: responses, error: responseError } = await supabase
      .from('survey_responses')
      .select('count', { count: 'exact', head: true });
    
    if (responseError) {
      console.log('❌ Error mengambil data responses:', responseError.message);
      return;
    }
    
    const responseCount = responses && responses.length ? responses.length : 0;
    console.log(`📊 Total responses: ${responseCount}`);
    
    console.log('\n🎉 Database check selesai!');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function cleanupDatabase() {
  console.log('🧹 Membersihkan database untuk pertanyaan baru...\n');
  
  try {
    // Hapus survey responses
    console.log('1. Menghapus survey responses...');
    const { error: responseError } = await supabase
      .from('survey_responses')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except impossible ID
    
    if (responseError) {
      console.log('❌ Error menghapus responses:', responseError.message);
      return;
    }
    console.log('✅ Survey responses dibersihkan');
    
    // Hapus surveys
    console.log('2. Menghapus surveys...');
    const { error: surveyError } = await supabase
      .from('surveys')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except impossible ID
    
    if (surveyError) {
      console.log('❌ Error menghapus surveys:', surveyError.message);
      return;
    }
    console.log('✅ Surveys dibersihkan');
    
    console.log('\n🎉 Database berhasil dibersihkan dan siap untuk pertanyaan baru!');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Jalankan fungsi berdasarkan argument
const action = process.argv[2];

if (action === 'cleanup') {
  cleanupDatabase();
} else {
  checkDatabase();
}