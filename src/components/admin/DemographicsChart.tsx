'use client'

import { useEffect, useState } from 'react'
import { getDemographicsAnalysis } from '@/lib/api'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

interface DemographicsData {
  gender: string
  age_group: string
  respondent_count: number
}

export default function DemographicsChart() {
  const [demographicsData, setDemographicsData] = useState<DemographicsData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDemographicsData()
  }, [])

  const loadDemographicsData = async () => {
    try {
      const result = await getDemographicsAnalysis()
      if (result.data) {
        setDemographicsData(result.data as DemographicsData[])
      }
    } catch (error) {
      console.error('Error loading demographics data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Process data for gender chart
  const genderData = demographicsData.reduce((acc: any[], item) => {
    const existing = acc.find(g => g.gender === item.gender)
    if (existing) {
      existing.count += item.respondent_count
    } else {
      acc.push({ gender: item.gender, count: item.respondent_count })
    }
    return acc
  }, [])

  // Process data for age chart
  const ageData = demographicsData.reduce((acc: any[], item) => {
    const existing = acc.find(a => a.age_group === item.age_group)
    if (existing) {
      existing.count += item.respondent_count
    } else {
      acc.push({ age_group: item.age_group, count: item.respondent_count })
    }
    return acc
  }, [])

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#a8edea']

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-8 animate-pulse">
            <div className="h-6 bg-card-bg rounded mb-4 w-1/4"></div>
            <div className="h-64 bg-card-bg rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Gender Distribution */}
      <div className="glass rounded-2xl p-8">
        <h3 className="text-2xl font-semibold text-text-primary mb-6">Distribusi Gender</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.gender}: ${((entry.count / genderData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    color: '#ffffff'
                  }}
                  formatter={(value: any) => [`${value} responden`, 'Jumlah']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-text-primary">Detail Gender</h4>
            {genderData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-card-bg rounded-xl">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-text-primary font-medium">{item.gender}</span>
                </div>
                <span className="text-accent-start font-bold">{item.count} responden</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="glass rounded-2xl p-8">
        <h3 className="text-2xl font-semibold text-text-primary mb-6">Distribusi Usia</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="age_group" 
                  stroke="#b8b8b8"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#b8b8b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    color: '#ffffff'
                  }}
                  formatter={(value: any) => [`${value} responden`, 'Jumlah']}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#ageGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="ageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4facfe" />
                    <stop offset="100%" stopColor="#00f2fe" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-text-primary">Detail Usia</h4>
            <div className="max-h-64 overflow-y-auto">
              {ageData
                .sort((a, b) => b.count - a.count)
                .map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-card-bg rounded-xl mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-accent-gradient"></div>
                    <span className="text-text-primary font-medium">{item.age_group}</span>
                  </div>
                  <span className="text-accent-start font-bold">{item.count} responden</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cross Analysis */}
      <div className="glass rounded-2xl p-8">
        <h3 className="text-2xl font-semibold text-text-primary mb-6">Analisis Silang (Gender x Usia)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Gender</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Kelompok Usia</th>
                <th className="text-center py-3 px-4 text-text-secondary font-medium">Jumlah Responden</th>
                <th className="text-center py-3 px-4 text-text-secondary font-medium">Persentase</th>
              </tr>
            </thead>
            <tbody>
              {demographicsData
                .sort((a, b) => b.respondent_count - a.respondent_count)
                .map((item, index) => {
                  const totalResponses = demographicsData.reduce((sum, d) => sum + d.respondent_count, 0)
                  const percentage = totalResponses > 0 ? ((item.respondent_count / totalResponses) * 100).toFixed(1) : '0'
                  
                  return (
                    <tr key={index} className="border-b border-glass-border hover:bg-card-bg transition-colors">
                      <td className="py-3 px-4 text-text-primary font-medium">{item.gender}</td>
                      <td className="py-3 px-4 text-text-primary">{item.age_group}</td>
                      <td className="py-3 px-4 text-center text-text-primary font-semibold">{item.respondent_count}</td>
                      <td className="py-3 px-4 text-center text-accent-start font-semibold">{percentage}%</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}