'use client'

import { useMarketData, useMarketStats } from '@/hooks/useMockData'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DashboardGrid,
  GridSection,
} from '@/components/dashboard/dashboard-grid'
import { StatCard } from '@/components/dashboard/stat-card'
import { RankingList } from '@/components/dashboard/ranking-list'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Bitcoin,
  Activity,
} from 'lucide-react'
import { LiveIndicator } from '@/components/ui/live-indicator'
import { MarketCapPie } from '@/components/charts/market-cap-pie'
import { VolumeBar } from '@/components/charts/volume-bar'
import Link from 'next/link'

export default function Home() {
  const { data: marketData, isLoading, lastUpdate } = useMarketData()
  const { stats, isLoading: statsLoading } = useMarketStats()

  const topGainers = marketData
    .filter((coin) => coin.price_change_percentage_24h > 0)
    .sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    )
    .slice(0, 5)

  const topLosers = marketData
    .filter((coin) => coin.price_change_percentage_24h < 0)
    .sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
    )
    .slice(0, 5)

  return (
    <div className="p-6">
      <DashboardGrid>
        {/* 欢迎区域 */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">欢迎回来</h1>
          <p className="text-muted-foreground">
            这里是您的加密货币投资组合概览
          </p>
          {!isLoading && (
            <LiveIndicator isLive={true} lastUpdate={lastUpdate} />
          )}
        </div>

        {/* 市场概览统计 */}
        <GridSection>
          <StatCard
            title="总市值"
            value={stats ? `$${(stats.totalMarketCap / 1e12).toFixed(2)}T` : ''}
            change={
              stats
                ? {
                    value: stats.totalMarketCapChangePercentage24h,
                    label: '24h',
                    positive: stats.totalMarketCapChangePercentage24h >= 0,
                  }
                : undefined
            }
            icon={DollarSign}
            loading={statsLoading}
          />

          <StatCard
            title="24h交易量"
            value={stats ? `$${(stats.totalVolume24h / 1e9).toFixed(1)}B` : ''}
            description="全球交易量"
            icon={BarChart3}
            loading={statsLoading}
          />

          <StatCard
            title="BTC主导地位"
            value={stats ? `${stats.btcDominance.toFixed(1)}%` : ''}
            description="市场占比"
            icon={Bitcoin}
            loading={statsLoading}
            trend="neutral"
          />

          <StatCard
            title="活跃币种"
            value={stats ? stats.activeCoins : ''}
            description="正在追踪"
            badge={{
              text: '实时',
              variant: 'secondary',
            }}
            loading={statsLoading}
          />
        </GridSection>

        {/* 涨跌幅排行榜 */}
        <GridSection className="grid-cols-1 lg:grid-cols-2">
          <RankingList
            title="今日涨幅榜"
            data={topGainers}
            type="gainers"
            loading={isLoading}
            icon={<TrendingUp className="h-4 w-4" />}
            maxItems={5}
          />

          <RankingList
            title="今日跌幅榜"
            data={topLosers}
            type="losers"
            loading={isLoading}
            icon={<TrendingDown className="h-4 w-4" />}
            maxItems={5}
          />
        </GridSection>

        {/* 快速操作区域 */}
        <GridSection className="grid-cols-1 md:grid-cols-3">
          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                市场行情
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                查看完整的加密货币市场数据和排行榜
              </p>
              <Button asChild className="w-full">
                <Link href="/test">查看行情</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                投资组合
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                管理和追踪您的加密货币投资
              </p>
              <Button variant="outline" className="w-full" disabled>
                即将推出
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                技术分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                专业图表和技术指标分析工具
              </p>
              <Button variant="outline" className="w-full" disabled>
                即将推出
              </Button>
            </CardContent>
          </Card>
        </GridSection>

        {/* 数据可视化图表 */}
        <GridSection className="grid-cols-1 xl:grid-cols-2">
          <MarketCapPie />
          <VolumeBar />
        </GridSection>
      </DashboardGrid>
    </div>
  )
}
