'use client'

import { useState, useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMarketData } from '@/hooks/useMockData'
import { useSettingsStore } from '@/lib/store/settings-store'
import { PieChart as PieChartIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarketCapPieProps {
  className?: string
}

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f97316', // orange
  '#ec4899', // pink
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#84cc16', // lime
]

export function MarketCapPie({ className }: MarketCapPieProps) {
  const { data, isLoading } = useMarketData()
  const { getFormattedPrice } = useSettingsStore()
  const [showTop, setShowTop] = useState<5 | 10>(10)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // 处理图表数据
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    const topCoins = data
      .slice(0, showTop)
      .filter((coin) => coin && coin.market_cap && coin.name && coin.symbol) // 过滤无效数据
      .map((coin, index) => ({
        name: coin.name || '',
        symbol: coin.symbol || '',
        value: coin.market_cap || 0,
        percentage: 0, // 将在下面计算
        color: COLORS[index % COLORS.length],
        priceChange: coin.price_change_percentage_24h || 0,
      }))

    if (topCoins.length === 0) return []

    // 计算总市值
    const totalMarketCap = topCoins.reduce(
      (sum, coin) => sum + (coin.value || 0),
      0
    )

    if (totalMarketCap === 0) return []

    // 计算百分比
    return topCoins.map((coin) => ({
      ...coin,
      percentage: ((coin.value || 0) / totalMarketCap) * 100,
    }))
  }, [data, showTop])

  // 自定义Tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ payload: unknown }>
  }) => {
    if (active && payload && payload.length && payload[0]?.payload) {
      const data = payload[0].payload
      if (!data) return null

      return (
        <div className="bg-background border rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color || '#ccc' }}
            />
            <span className="font-medium">
              {data.name || ''} ({data.symbol || ''})
            </span>
          </div>
          <div className="space-y-1 text-sm">
            <p>
              市值:{' '}
              <span className="font-medium">
                {getFormattedPrice(data.value || 0)}
              </span>
            </p>
            <p>
              占比:{' '}
              <span className="font-medium">
                {data.percentage ? data.percentage.toFixed(2) : '0.00'}%
              </span>
            </p>
            <p
              className={cn(
                '24h变化:',
                (data.priceChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              <span className="font-medium">
                {(data.priceChange || 0) >= 0 ? '+' : ''}
                {data.priceChange ? data.priceChange.toFixed(2) : '0.00'}%
              </span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  // 自定义Legend
  const CustomLegend = ({
    payload,
  }: {
    payload?: Array<{ payload: unknown; color: string }>
  }) => {
    if (!payload || !Array.isArray(payload)) return null

    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload.map((entry, index: number) => {
          if (!entry || !entry.payload) return null

          return (
            <div
              key={index}
              className="flex items-center gap-1 text-xs cursor-pointer hover:bg-muted px-2 py-1 rounded"
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color || '#ccc' }}
              />
              <span>{entry.payload?.symbol || ''}</span>
              <span className="text-muted-foreground">
                {entry.payload?.percentage
                  ? entry.payload.percentage.toFixed(1)
                  : '0.0'}
                %
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-muted rounded animate-pulse w-40"></div>
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
              <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            市值分布占比
            <Badge variant="outline">Top {showTop}</Badge>
          </CardTitle>

          <div className="flex gap-2">
            <Button
              variant={showTop === 5 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowTop(5)}
            >
              Top 5
            </Button>
            <Button
              variant={showTop === 10 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowTop(10)}
            >
              Top 10
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) =>
                `${entry.symbol} ${entry.percentage ? entry.percentage.toFixed(1) : '0.0'}%`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={activeIndex === index ? '#ffffff' : 'none'}
                  strokeWidth={activeIndex === index ? 2 : 0}
                  style={{
                    filter:
                      activeIndex === null || activeIndex === index
                        ? 'none'
                        : 'opacity(0.6)',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>

        {/* 详细数据表格 */}
        <div className="mt-6 space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground mb-3">
            详细数据
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {chartData.map((coin, index) => {
              if (!coin) return null

              return (
                <div
                  key={coin.symbol || index}
                  className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: coin.color || '#ccc' }}
                      />
                      <span className="font-medium text-sm">
                        {coin.name || ''}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {coin.symbol || ''}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      {coin.percentage ? coin.percentage.toFixed(2) : '0.00'}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {getFormattedPrice(coin.value || 0)}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-medium',
                        (coin.priceChange || 0) >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      )}
                    >
                      {(coin.priceChange || 0) >= 0 ? '+' : ''}
                      {coin.priceChange ? coin.priceChange.toFixed(2) : '0.00'}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
