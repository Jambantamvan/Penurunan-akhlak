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
    id: 'negative_behavior',
    title: 'Perilaku apa yang pernah Anda lakukan semasa remaja?',
    order: 2,
    options: [
      {
        value: 'free_socialization',
        label: 'Pergaulan bebas tanpa kontrol',
        description: 'Bergaul secara bebas tanpa batasan dan pengawasan'
      },
      {
        value: 'social_media_addiction',
        label: 'Kecanduan media sosial dan konten negatif',
        description: 'Menghabiskan waktu berlebihan di media sosial dengan konten negatif'
      },
      {
        value: 'substance_abuse',
        label: 'Penyalahgunaan narkoba, alkohol, dan rokok',
        description: 'Menggunakan narkoba, alkohol, atau merokok'
      },
      {
        value: 'consumerism',
        label: 'Perilaku konsumtif dan hedonis',
        description: 'Berperilaku konsumtif dan mencari kesenangan duniawi'
      },
      {
        value: 'violence',
        label: 'Tawuran dan kekerasan',
        description: 'Terlibat dalam tawuran dan perilaku kekerasan'
      }
    ]
  },
  {
    id: 'improvement_activities',
    title: 'Kegiatan apa yang membantu Anda untuk memperbaiki akhlak Anda?',
    order: 3,
    options: [
      {
        value: 'religious_activities',
        label: 'Rajin mengikuti kegiatan keagamaan (pengajian, kajian, atau ibadah bersama)',
        description: 'Aktif dalam kegiatan keagamaan untuk memperbaiki akhlak'
      },
      {
        value: 'social_service',
        label: 'Aktif dalam kegiatan sosial dan bakti masyarakat',
        description: 'Terlibat dalam kegiatan sosial dan membantu masyarakat'
      },
      {
        value: 'positive_organization',
        label: 'Mengikuti organisasi sekolah atau kampus yang positif',
        description: 'Bergabung dengan organisasi yang memberikan dampak positif'
      },
      {
        value: 'reading_habit',
        label: 'Membiasakan membaca buku atau literatur yang bermanfaat',
        description: 'Mengembangkan kebiasaan membaca buku yang bermanfaat'
      },
      {
        value: 'good_friendship',
        label: 'Menjalin pergaulan dengan teman yang berakhlak baik dan saling mengingatkan',
        description: 'Berteman dengan orang-orang yang berakhlak baik'
      }
    ]
  },
  {
    id: 'peer_free_socialization',
    title: 'Saya sering melihat teman sebaya terlibat dalam pergaulan bebas.',
    order: 4,
    options: [
      {
        value: 'strongly_agree',
        label: 'Sangat Setuju',
        description: 'Sangat setuju dengan pernyataan ini'
      },
      {
        value: 'agree',
        label: 'Setuju',
        description: 'Setuju dengan pernyataan ini'
      },
      {
        value: 'disagree',
        label: 'Tidak Setuju',
        description: 'Tidak setuju dengan pernyataan ini'
      },
      {
        value: 'strongly_disagree',
        label: 'Sangat Tidak Setuju',
        description: 'Sangat tidak setuju dengan pernyataan ini'
      }
    ]
  },
  {
    id: 'social_media_influence',
    title: 'Media sosial berpengaruh besar terhadap pola pikir dan perilaku remaja.',
    order: 5,
    options: [
      {
        value: 'strongly_agree',
        label: 'Sangat Setuju',
        description: 'Sangat setuju dengan pernyataan ini'
      },
      {
        value: 'agree',
        label: 'Setuju',
        description: 'Setuju dengan pernyataan ini'
      },
      {
        value: 'disagree',
        label: 'Tidak Setuju',
        description: 'Tidak setuju dengan pernyataan ini'
      },
      {
        value: 'strongly_disagree',
        label: 'Sangat Tidak Setuju',
        description: 'Sangat tidak setuju dengan pernyataan ini'
      }
    ]
  },
  {
    id: 'violence_occurrence',
    title: 'Tawuran atau kekerasan antar remaja masih sering terjadi di lingkungan saya.',
    order: 6,
    options: [
      {
        value: 'strongly_agree',
        label: 'Sangat Setuju',
        description: 'Sangat setuju dengan pernyataan ini'
      },
      {
        value: 'agree',
        label: 'Setuju',
        description: 'Setuju dengan pernyataan ini'
      },
      {
        value: 'disagree',
        label: 'Tidak Setuju',
        description: 'Tidak setuju dengan pernyataan ini'
      },
      {
        value: 'strongly_disagree',
        label: 'Sangat Tidak Setuju',
        description: 'Sangat tidak setuju dengan pernyataan ini'
      }
    ]
  },
  {
    id: 'substance_accessibility',
    title: 'Penyalahgunaan rokok, alkohol, atau narkoba mudah ditemukan di kalangan remaja.',
    order: 7,
    options: [
      {
        value: 'strongly_agree',
        label: 'Sangat Setuju',
        description: 'Sangat setuju dengan pernyataan ini'
      },
      {
        value: 'agree',
        label: 'Setuju',
        description: 'Setuju dengan pernyataan ini'
      },
      {
        value: 'disagree',
        label: 'Tidak Setuju',
        description: 'Tidak setuju dengan pernyataan ini'
      },
      {
        value: 'strongly_disagree',
        label: 'Sangat Tidak Setuju',
        description: 'Sangat tidak setuju dengan pernyataan ini'
      }
    ]
  },
  {
    id: 'supervision_importance',
    title: 'Pengawasan orang tua dan guru berperan penting dalam mencegah dekadensi akhlak remaja.',
    order: 8,
    options: [
      {
        value: 'strongly_agree',
        label: 'Sangat Setuju',
        description: 'Sangat setuju dengan pernyataan ini'
      },
      {
        value: 'agree',
        label: 'Setuju',
        description: 'Setuju dengan pernyataan ini'
      },
      {
        value: 'disagree',
        label: 'Tidak Setuju',
        description: 'Tidak setuju dengan pernyataan ini'
      },
      {
        value: 'strongly_disagree',
        label: 'Sangat Tidak Setuju',
        description: 'Sangat tidak setuju dengan pernyataan ini'
      }
    ]
  }
]