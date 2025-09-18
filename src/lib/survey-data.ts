export interface SurveyQuestion {
  id: string
  title: string
  order: number
  options: SurveyOption[]
}

export interface SurveyOption {
  value: string
  label: string
  description?: string
}

export interface SurveyAnswer {
  questionId: string
  questionText: string
  answerValue: string
  answerLabel: string
  questionOrder: number
}

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: 'gender',
    title: 'Jenis Kelamin',
    order: 1,
    options: [
      {
        value: 'male',
        label: 'Laki-laki',
        description: 'Jenis kelamin laki-laki'
      },
      {
        value: 'female',
        label: 'Perempuan',
        description: 'Jenis kelamin perempuan'
      }
    ]
  },
  {
    id: 'age',
    title: 'Umur Anda berapa?',
    order: 2,
    options: [
      {
        value: '10-12',
        label: '10-12 tahun',
        description: 'Usia sekolah dasar'
      },
      {
        value: '13-15',
        label: '13-15 tahun',
        description: 'Usia sekolah menengah pertama'
      },
      {
        value: '16-18',
        label: '16-18 tahun',
        description: 'Usia sekolah menengah atas'
      },
      {
        value: '19-21',
        label: '19-21 tahun',
        description: 'Usia mahasiswa'
      },
      {
        value: '22-25',
        label: '22-25 tahun',
        description: 'Usia dewasa muda'
      },
      {
        value: '26-30',
        label: '26-30 tahun',
        description: 'Usia dewasa'
      },
      {
        value: '31+',
        label: '31+ tahun',
        description: 'Usia dewasa matang'
      }
    ]
  },
  {
    id: 'bullying',
    title: 'Seberapa sering Anda melihat perilaku perundungan di lingkungan Anda?',
    order: 3,
    options: [
      {
        value: 'never',
        label: 'Tidak Pernah',
        description: 'Saya tidak pernah melihat perilaku perundungan'
      },
      {
        value: 'rarely',
        label: 'Jarang (1-2 kali dalam 6 bulan)',
        description: 'Sesekali melihat, tapi tidak sering terjadi'
      },
      {
        value: 'sometimes',
        label: 'Kadang-kadang (1-2 kali per bulan)',
        description: 'Terjadi beberapa kali dalam sebulan'
      },
      {
        value: 'often',
        label: 'Sering (1-2 kali per minggu)',
        description: 'Hampir setiap minggu melihat kejadian'
      },
      {
        value: 'very_often',
        label: 'Sangat Sering (hampir setiap hari)',
        description: 'Hampir setiap hari melihat perilaku perundungan'
      }
    ]
  },
  {
    id: 'hate_speech',
    title: 'Bagaimana dampak ujaran kasar terhadap kenyamanan lingkungan sosial Anda?',
    order: 4,
    options: [
      {
        value: 'no_impact',
        label: 'Tidak Ada Dampak',
        description: 'Saya tidak merasa terganggu sama sekali'
      },
      {
        value: 'slight_impact',
        label: 'Dampak Kecil (sedikit mengganggu)',
        description: 'Sedikit mengganggu tapi masih bisa diabaikan'
      },
      {
        value: 'moderate_impact',
        label: 'Dampak Sedang (cukup mengganggu)',
        description: 'Cukup mengganggu dan membuat tidak nyaman'
      },
      {
        value: 'high_impact',
        label: 'Dampak Besar (sangat mengganggu)',
        description: 'Sangat mengganggu dan membuat lingkungan tidak kondusif'
      },
      {
        value: 'severe_impact',
        label: 'Dampak Sangat Besar (merusak suasana)',
        description: 'Merusak suasana dan membuat lingkungan toxic'
      }
    ]
  },
  {
    id: 'gossip',
    title: 'Seberapa sering Anda mendengar atau melihat perilaku ghibah (membicarakan keburukan orang lain)?',
    order: 5,
    options: [
      {
        value: 'never',
        label: 'Tidak Pernah',
        description: 'Lingkungan saya bebas dari ghibah'
      },
      {
        value: 'rarely',
        label: 'Jarang (sesekali)',
        description: 'Sesekali terjadi dalam situasi tertentu'
      },
      {
        value: 'sometimes',
        label: 'Kadang-kadang (beberapa kali per bulan)',
        description: 'Beberapa kali dalam sebulan'
      },
      {
        value: 'often',
        label: 'Sering (hampir setiap minggu)',
        description: 'Hampir setiap minggu mendengar ghibah'
      },
      {
        value: 'very_often',
        label: 'Sangat Sering (setiap hari)',
        description: 'Ghibah sudah menjadi hal yang sangat umum'
      }
    ]
  },
  {
    id: 'pornography',
    title: 'Seberapa mudah akses konten pornografi bagi remaja di lingkungan Anda?',
    order: 6,
    options: [
      {
        value: 'very_difficult',
        label: 'Sangat Sulit (hampir tidak mungkin)',
        description: 'Hampir tidak mungkin mengakses konten tersebut'
      },
      {
        value: 'difficult',
        label: 'Sulit (butuh usaha khusus)',
        description: 'Butuh usaha khusus untuk mengakses'
      },
      {
        value: 'moderate',
        label: 'Sedang (cukup mudah jika dicari)',
        description: 'Cukup mudah jika memang dicari'
      },
      {
        value: 'easy',
        label: 'Mudah (mudah ditemukan)',
        description: 'Mudah ditemukan tanpa usaha khusus'
      },
      {
        value: 'very_easy',
        label: 'Sangat Mudah (tersedia dimana-mana)',
        description: 'Tersedia dimana-mana dan mudah diakses'
      }
    ]
  },
  {
    id: 'social_media',
    title: 'Seberapa sering Anda melihat konten negatif (hate speech, cyberbullying) di media sosial?',
    order: 7,
    options: [
      {
        value: 'never',
        label: 'Tidak Pernah',
        description: 'Feed media sosial saya bersih dari konten negatif'
      },
      {
        value: 'rarely',
        label: 'Jarang (1-2 kali per bulan)',
        description: 'Sesekali muncul di timeline'
      },
      {
        value: 'sometimes',
        label: 'Kadang-kadang (1-2 kali per minggu)',
        description: 'Beberapa kali seminggu melihat konten negatif'
      },
      {
        value: 'often',
        label: 'Sering (beberapa kali per minggu)',
        description: 'Sering muncul di feed media sosial'
      },
      {
        value: 'very_often',
        label: 'Sangat Sering (hampir setiap hari)',
        description: 'Hampir setiap hari melihat konten negatif'
      }
    ]
  },
  {
    id: 'family_communication',
    title: 'Bagaimana kondisi komunikasi dalam keluarga Anda terkait pembahasan nilai-nilai moral?',
    order: 8,
    options: [
      {
        value: 'very_good',
        label: 'Sangat Baik (sering diskusi terbuka)',
        description: 'Keluarga sering membahas nilai moral secara terbuka'
      },
      {
        value: 'good',
        label: 'Baik (sesekali dibahas)',
        description: 'Sesekali membahas nilai-nilai moral'
      },
      {
        value: 'fair',
        label: 'Cukup (jarang dibahas)',
        description: 'Jarang membahas topik nilai moral'
      },
      {
        value: 'poor',
        label: 'Kurang (hampir tidak pernah)',
        description: 'Hampir tidak pernah membahas nilai moral'
      },
      {
        value: 'very_poor',
        label: 'Sangat Kurang (tidak pernah dibahas)',
        description: 'Tidak pernah membahas nilai-nilai moral'
      }
    ]
  },
  {
    id: 'social_impact',
    title: 'Bagaimana pengaruh perilaku negatif tersebut terhadap kepercayaan dan kenyamanan dalam interaksi sosial Anda?',
    order: 9,
    options: [
      {
        value: 'no_influence',
        label: 'Tidak Berpengaruh',
        description: 'Tidak mempengaruhi kepercayaan sosial saya'
      },
      {
        value: 'slight_influence',
        label: 'Sedikit Berpengaruh',
        description: 'Sedikit mempengaruhi cara berinteraksi'
      },
      {
        value: 'moderate_influence',
        label: 'Cukup Berpengaruh',
        description: 'Cukup mempengaruhi kepercayaan sosial'
      },
      {
        value: 'high_influence',
        label: 'Sangat Berpengaruh',
        description: 'Sangat mempengaruhi kenyamanan berinteraksi'
      },
      {
        value: 'destructive',
        label: 'Merusak Kepercayaan Sosial',
        description: 'Merusak kepercayaan dan kenyamanan sosial'
      }
    ]
  },
  {
    id: 'solution',
    title: 'Menurut Anda, apa solusi paling efektif untuk mengatasi masalah penurunan akhlak remaja ini?',
    order: 10,
    options: [
      {
        value: 'character_education',
        label: 'Pendidikan Karakter di Sekolah',
        description: 'Memperkuat pendidikan akhlak di sekolah'
      },
      {
        value: 'community_empowerment',
        label: 'Pemberdayaan dan Pengawasan Masyarakat',
        description: 'Melibatkan komunitas dalam pengawasan dan pembinaan'
      },
      {
        value: 'strict_regulation',
        label: 'Regulasi dan Sanksi yang Lebih Ketat',
        description: 'Membuat aturan dan sanksi yang lebih tegas'
      },
      {
        value: 'technology_control',
        label: 'Kontrol Teknologi dan Media Digital',
        description: 'Mengatur akses konten negatif di media digital'
      },
      {
        value: 'holistic_approach',
        label: 'Pendekatan Holistik (kombinasi semua solusi)',
        description: 'Kombinasi semua solusi di atas untuk hasil optimal'
      }
    ]
  }
]