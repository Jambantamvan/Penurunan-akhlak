'use client'

import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
  BarController
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
  BarController
)

interface SurveyChartProps {
  questionId: string
  questionText: string
  data: Array<{
    answer_label: string
    count: number
    percentage: number
  }>
  chartType?: 'bar' | 'pie'
}

export function SurveyChart({ questionId, questionText, data, chartType = 'bar' }: SurveyChartProps) {
  const chartRef = useRef<any>(null)

  const colors = [
    'rgba(102, 126, 234, 0.8)',
    'rgba(118, 75, 162, 0.8)',
    'rgba(255, 119, 198, 0.8)',
    'rgba(120, 219, 255, 0.8)',
    'rgba(255, 206, 84, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)'
  ]

  const borderColors = [
    'rgba(102, 126, 234, 1)',
    'rgba(118, 75, 162, 1)',
    'rgba(255, 119, 198, 1)',
    'rgba(120, 219, 255, 1)',
    'rgba(255, 206, 84, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ]

  const chartData = {
    labels: data.map(item => item.answer_label),
    datasets: [
      {
        label: 'Responses',
        data: data.map(item => item.count),
        backgroundColor: colors.slice(0, data.length),
        borderColor: borderColors.slice(0, data.length),
        borderWidth: 2,
        hoverBackgroundColor: colors.slice(0, data.length).map(color => color.replace('0.8', '0.9')),
        hoverBorderColor: borderColors.slice(0, data.length),
        hoverBorderWidth: 3
      }
    ]
  }

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
            weight: 'bold' as const
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: questionText,
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const item = data[context.dataIndex]
            return `${context.label}: ${item.count} responses (${item.percentage.toFixed(1)}%)`
          }
        }
      }
    }
  }

  const barOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#ffffff',
          font: {
            size: 11
          },
          stepSize: 1
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          lineWidth: 1
        }
      },
      x: {
        ticks: {
          color: '#ffffff',
          font: {
            size: 11
          },
          maxRotation: 45,
          minRotation: 0
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          lineWidth: 1
        }
      }
    }
  }

  const pieOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        ...commonOptions.plugins.legend,
        position: 'right' as const
      }
    }
  }

  if (data.length === 0) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '3rem', opacity: 0.5 }}>📊</div>
        <h3 style={{ 
          color: '#ffffff', 
          margin: 0,
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          {questionText}
        </h3>
        <p style={{ 
          color: '#b8b8b8', 
          margin: 0,
          fontSize: '0.9rem'
        }}>
          No responses yet
        </p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}
    >
      <div style={{ 
        height: chartType === 'pie' ? '400px' : '350px',
        position: 'relative'
      }}>
        {chartType === 'bar' ? (
          <Bar ref={chartRef} data={chartData} options={barOptions} />
        ) : (
          <Pie ref={chartRef} data={chartData} options={pieOptions} />
        )}
      </div>
      
      {/* Response Summary */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <h4 style={{
          color: '#ffffff',
          margin: '0 0 0.75rem 0',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          📈 Response Summary
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem'
        }}>
          {data.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: colors[index % colors.length],
                flexShrink: 0
              }}></div>
              <span style={{
                color: '#ffffff',
                fontSize: '0.8rem',
                flex: 1,
                minWidth: 0
              }}>
                {item.answer_label.length > 25 
                  ? `${item.answer_label.substring(0, 25)}...` 
                  : item.answer_label
                }
              </span>
              <span style={{
                color: '#667eea',
                fontSize: '0.8rem',
                fontWeight: '600',
                flexShrink: 0
              }}>
                {item.count} ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: '0.75rem',
          textAlign: 'center',
          padding: '0.5rem',
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <span style={{
            color: '#667eea',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            Total Responses: {data.reduce((sum, item) => sum + item.count, 0)}
          </span>
        </div>
      </div>
    </div>
  )
}