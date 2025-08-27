'use client'

import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockDataGenerator } from '@/lib/mock-data'
import { TimeRange, PriceHistoryPoint } from '@/lib/types'
import { useSettingsStore } from '@/lib/store/settings-store'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PriceChartProps {
  coinId: string
  coinName: string
  currentPrice: number
  change24h: number
  className?: string
}

const timeRanges: { label: string; value: TimeRange }[] = [
  { label: '1D', value: '1D' },
  { label: '7D', value: '7D' },
  { label: '30D', value: '30D' },
  { label: '90D', value: '90D' },
  { label: '1Y', value: '1Y' },
]

export function PriceChart({
  coinId,
  coinName,
  currentPrice,
  change24h,
  className,
}: PriceChartProps) {
  const [data, setData] = useState<PriceHistoryPoint[]>([])
  const [timeRange, setTimeRange] = useState<TimeRange>('7D')
  const [isLoading, setIsLoading] = useState(true)
  const [chartType, setChartType] = useState<'line' | 'area'>('line')

  const { display, getFormattedPrice } = useSettingsStore()

  const isPositive = change24h >= 0
  const chartColor = isPositive ? '#22c55e' : '#ef4444'
  const gradientColor = isPositive ? '#22c55e20' : '#ef444420'

  // 生成图表数据
  useEffect(() => {
    const generateChartData = () => {
      setIsLoading(true)

      // 模拟异步加载
      setTimeout(() => {
        const historyData = mockDataGenerator.generatePriceHistory(
          coinId,
          timeRange
        )
        setData(historyData)
        setIsLoading(false)
      }, 500)
    }

    generateChartData()
  }, [coinId, timeRange])

  // 自定义Tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ payload: unknown }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="text-sm text-muted-foreground mb-1">
            {new Date(label).toLocaleDateString('zh-CN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: chartColor }}
            />
            <span className="font-medium">{getFormattedPrice(data.price)}</span>
          </div>
          {data.volume && (
            <p className="text-xs text-muted-foreground mt-1">
              成交量: {getFormattedPrice(data.volume)}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const formatXAxisTick = (tickItem: string) => {
    const date = new Date(tickItem)
    switch (timeRange) {
      case '1D':
        return date.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        })
      case '7D':
        return date.toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric',
        })
      case '30D':
      case '90D':
        return date.toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric',
        })
      case '1Y':
        return date.toLocaleDateString('zh-CN', {
          year: '2-digit',
          month: 'short',
        })
      default:
        return date.toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric',
        })
    }
  }

  if (isLoading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 bg-muted rounded animate-pulse w-32 mb-2"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
            </div>
            <div className="flex gap-2">
              {timeRanges.map((range) => (
                <div
                  key={range.value}
                  className="h-8 w-12 bg-muted rounded animate-pulse"
                ></div>
              ))}
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
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {coinName}
              <Badge
                variant={isPositive ? 'default' : 'destructive'}
                className="flex items-center gap-1"
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositive ? '+' : ''}
                {change24h.toFixed(2)}%
              </Badge>
            </CardTitle>
            <p className="text-2xl font-bold">
              {getFormattedPrice(currentPrice)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-muted p-1 rounded-md">
              <Button
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('line')}
              >
                线形
              </Button>
              <Button
                variant={chartType === 'area' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('area')}
              >
                面积
              </Button>
            </div>

            <div className="flex gap-1">
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  variant={timeRange === range.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          {chartType === 'line' ? (
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxisTick}
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => getFormattedPrice(value)}
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: chartColor }}
              />
            </LineChart>
          ) : (
            <AreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id={`gradient-${coinId}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxisTick}
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => getFormattedPrice(value)}
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#gradient-${coinId})`}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
