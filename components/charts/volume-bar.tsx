'use client'

import { useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useMarketData } from '@/hooks/useMockData'
import { useSettingsStore } from '@/lib/store/settings-store'
import { BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VolumeBarProps {
  className?: string
  maxItems?: number
}

export function VolumeBar({ className, maxItems = 15 }: VolumeBarProps) {
  const { data, isLoading } = useMarketData()
  const { getFormattedPrice } = useSettingsStore()

  // 处理图表数据
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    return data
      .slice(0, maxItems)
      .filter(
        (coin) =>
          coin &&
          coin.total_volume &&
          coin.market_cap &&
          coin.name &&
          coin.symbol
      ) // 过滤无效数据
      .map((coin) => ({
        name: coin.name || '',
        symbol: coin.symbol || '',
        volume: coin.total_volume || 0,
        marketCap: coin.market_cap || 0,
        priceChange: coin.price_change_percentage_24h || 0,
        volumeRatio:
          coin.market_cap > 0 ? (coin.total_volume / coin.market_cap) * 100 : 0, // 成交量/市值比
        color:
          (coin.price_change_percentage_24h || 0) >= 0 ? '#22c55e' : '#ef4444',
      }))
      .sort((a, b) => (b.volume || 0) - (a.volume || 0)) // 按交易量排序
  }, [data, maxItems])

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
            <span className="font-medium">
              {data.name || ''} ({data.symbol || ''})
            </span>
            <Badge
              variant={(data.priceChange || 0) >= 0 ? 'default' : 'destructive'}
              className="text-xs"
            >
              {(data.priceChange || 0) >= 0 ? '+' : ''}
              {data.priceChange ? data.priceChange.toFixed(2) : '0.00'}%
            </Badge>
          </div>
          <div className="space-y-1 text-sm">
            <p>
              24h交易量:{' '}
              <span className="font-medium">
                {getFormattedPrice(data.volume || 0)}
              </span>
            </p>
            <p>
              市值:{' '}
              <span className="font-medium">
                {getFormattedPrice(data.marketCap || 0)}
              </span>
            </p>
            <p>
              换手率:{' '}
              <span className="font-medium">
                {data.volumeRatio ? data.volumeRatio.toFixed(2) : '0.00'}%
              </span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  // 格式化Y轴刻度
  const formatYAxisTick = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(1)}K`
    }
    return `$${value}`
  }

  // 格式化X轴标签
  const formatXAxisTick = (tickItem: string) => {
    const coin = chartData.find((c) => c.name === tickItem)
    return coin ? coin.symbol : tickItem
  }

  if (isLoading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse w-40"></div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            24小时交易量排行
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">暂无数据</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          24小时交易量排行
          <Badge variant="outline">Top {maxItems}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="name"
              tickFormatter={formatXAxisTick}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              className="text-xs"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatYAxisTick}
              className="text-xs"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="volume" radius={[4, 4, 0, 0]} maxBarSize={50}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* 统计信息 */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {chartData.length}
            </p>
            <p className="text-xs text-muted-foreground">追踪币种</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">
              {getFormattedPrice(
                chartData.reduce((sum, coin) => sum + (coin.volume || 0), 0)
              )}
            </p>
            <p className="text-xs text-muted-foreground">总交易量</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">
              {chartData.length > 0
                ? (
                    chartData.reduce(
                      (sum, coin) => sum + (coin.volumeRatio || 0),
                      0
                    ) / chartData.length
                  ).toFixed(1)
                : '0.0'}
              %
            </p>
            <p className="text-xs text-muted-foreground">平均换手率</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {chartData.filter((coin) => (coin.priceChange || 0) > 0).length}
            </p>
            <p className="text-xs text-muted-foreground">上涨币种</p>
          </div>
        </div>

        {/* 活跃度指标 */}
        <div className="mt-4">
          <h4 className="font-medium text-sm text-muted-foreground mb-3">
            活跃度排行
          </h4>
          <div className="space-y-2">
            {chartData
              .sort((a, b) => (b.volumeRatio || 0) - (a.volumeRatio || 0))
              .slice(0, 5)
              .map((coin, index) => {
                if (!coin) return null

                const maxRatio = Math.max(
                  ...chartData.map((c) => c.volumeRatio || 0)
                )

                return (
                  <div
                    key={coin.symbol || index}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="w-6 h-6 p-0 flex items-center justify-center text-xs"
                      >
                        {index + 1}
                      </Badge>
                      <span className="font-medium text-sm">
                        {coin.symbol || ''}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {coin.name || ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {coin.volumeRatio
                          ? coin.volumeRatio.toFixed(2)
                          : '0.00'}
                        %
                      </span>
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, maxRatio > 0 ? ((coin.volumeRatio || 0) / maxRatio) * 100 : 0)}%`,
                          }}
                        />
                      </div>
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
