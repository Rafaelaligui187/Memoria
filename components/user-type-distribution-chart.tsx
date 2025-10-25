"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface UserTypeDistributionChartProps {
  userTypeCounts: {
    students: number
    faculty: number
    staff: number
    alumni: number
    arSisters: number
    utility: number
    advisory: number
  }
  loading?: boolean
}

export function UserTypeDistributionChart({ userTypeCounts, loading = false }: UserTypeDistributionChartProps) {
  const data = [
    { label: "Students", value: userTypeCounts.students, color: "bg-blue-500" },
    { label: "Faculty", value: userTypeCounts.faculty, color: "bg-green-500" },
    { label: "Staff", value: userTypeCounts.staff, color: "bg-purple-500" },
    { label: "Alumni", value: userTypeCounts.alumni, color: "bg-orange-500" },
    { label: "AR Sisters", value: userTypeCounts.arSisters, color: "bg-pink-500" },
    { label: "Utility", value: userTypeCounts.utility, color: "bg-teal-500" },
    { label: "Advisory", value: userTypeCounts.advisory, color: "bg-indigo-500" },
  ]

  const totalCount = data.reduce((sum, item) => sum + item.value, 0)
  const maxValue = Math.max(...data.map(item => item.value))

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            User Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-end justify-between space-x-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="animate-pulse bg-gray-200 rounded-t w-full mb-2" style={{ height: `${Math.random() * 200 + 50}px` }}></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          User Type Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {maxValue === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No data available</p>
            <p className="text-sm">No profiles found for this school year</p>
          </div>
        ) : (
          <div className="h-80 flex items-end justify-between space-x-2">
            {data.map((item, index) => {
              const percentage = totalCount > 0 ? Math.round((item.value / totalCount) * 100) : 0
              const barHeight = maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%'
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  {/* Percentage value at top */}
                  <div className="text-sm font-bold text-gray-700 mb-2 group-hover:text-gray-900 transition-colors">
                    {percentage}%
                  </div>
                  
                  {/* Bar */}
                  <div className="relative w-full flex flex-col justify-end">
                    <div
                      className={`${item.color} rounded-t transition-all duration-500 ease-out hover:opacity-80 cursor-pointer shadow-sm`}
                      style={{
                        height: barHeight,
                        minHeight: item.value > 0 ? '20px' : '0px'
                      }}
                      title={`${item.label}: ${item.value} profiles (${percentage}%)`}
                    />
                  </div>
                  
                  {/* Label */}
                  <div className="text-xs font-medium text-gray-600 mt-2 text-center leading-tight">
                    {item.label}
                  </div>
                  
                  {/* Count */}
                  <div className="text-xs text-gray-500 mt-1">
                    {item.value}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
