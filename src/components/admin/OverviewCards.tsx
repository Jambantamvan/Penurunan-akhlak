'use client'

import { useEffect, useState } from 'react'
import { getTotalResponses, getAnalyticsSummary } from '@/lib/api'
import { Users, CheckCircle, Clock, TrendingUp } from 'lucide-react'

interface OverviewData {
  totalResponses: number
  completionRate: number
  avgCompletionTime: string
  latestResponse: string
}

export default function OverviewCards() {
  const [data, setData] = useState<OverviewData>({
    totalResponses: 0,
    completionRate: 0,
    avgCompletionTime: '5-7 min',
    latestResponse: 'Belum ada data'
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOverviewData()
  }, [])

  const loadOverviewData = async () => {
    try {
      const totalResult = await getTotalResponses()
      const summaryResult = await getAnalyticsSummary()

      if (totalResult.count !== undefined) {
        setData(prev => ({
          ...prev,
          totalResponses: totalResult.count,
          completionRate: totalResult.count > 0 ? 95 : 0, // Estimate 95% completion rate
          latestResponse: totalResult.count > 0 ? 'Baru saja' : 'Belum ada data'
        }))
      }
    } catch (error) {
      console.error('Error loading overview data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const cards = [
    {
      title: 'Total Responden',
      value: data.totalResponses.toLocaleString(),
      icon: Users,
      color: 'text-gradient-primary',
      bgColor: 'bg-[rgba(102,126,234,0.1)]'
    },
    {
      title: 'Tingkat Penyelesaian',
      value: `${data.completionRate}%`,
      icon: CheckCircle,
      color: 'text-gradient-accent',
      bgColor: 'bg-[rgba(79,172,254,0.1)]'
    },
    {
      title: 'Rata-rata Waktu',
      value: data.avgCompletionTime,
      icon: Clock,
      color: 'text-gradient-secondary',
      bgColor: 'bg-[rgba(240,147,251,0.1)]'
    },
    {
      title: 'Respons Terakhir',
      value: data.latestResponse,
      icon: TrendingUp,
      color: 'text-gradient-accent',
      bgColor: 'bg-[rgba(79,172,254,0.1)]'
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-card-bg rounded mb-4"></div>
            <div className="h-8 bg-card-bg rounded mb-2"></div>
            <div className="h-3 bg-card-bg rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon
        return (
          <div 
            key={index}
            className="glass rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <IconComponent className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
            
            <h3 className="text-sm font-medium text-text-secondary mb-2">
              {card.title}
            </h3>
            
            <p className={`text-3xl font-bold ${card.color} mb-1`}>
              {card.value}
            </p>
          </div>
        )
      })}
    </div>
  )
}