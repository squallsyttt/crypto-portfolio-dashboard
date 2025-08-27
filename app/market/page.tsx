'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MarketTable } from '@/components/market/market-table'
import { MarketFilters } from '@/components/market/market-filters'
import { PriceChart } from '@/components/charts/price-chart'
import { MarketCapPie } from '@/components/charts/market-cap-pie'
import { VolumeBar } from '@/components/charts/volume-bar'
import { LiveIndicator } from '@/components/ui/live-indicator'
import { useMarketData } from '@/hooks/useMockData'
import { CoinData } from '@/lib/types'
import { TrendingUp, BarChart3 } from 'lucide-react'

export default function MarketPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null)
  const { data, lastUpdate } = useMarketData()

  const handleCoinClick = (coin: CoinData) => {
    setSelectedCoin(coin)
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">市场行情</h1>
        </div>
        <p className="text-muted-foreground">
          实时加密货币市场数据、价格追踪和深度分析
        </p>
        <LiveIndicator isLive={true} lastUpdate={lastUpdate} />
      </div>

      {/* 过滤器 */}
      <MarketFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 主要内容 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 左侧：市场数据表格 */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  市场数据
                </div>
                <div className="text-sm text-muted-foreground">
                  {data.length} 个币种
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <MarketTable
                searchQuery={searchQuery}
                onCoinClick={handleCoinClick}
              />
            </CardContent>
          </Card>
        </div>

        {/* 右侧：选中币种详情或图表 */}
        <div className="space-y-6">
          {selectedCoin ? (
            <PriceChart
              coinId={selectedCoin.id}
              coinName={selectedCoin.name}
              currentPrice={selectedCoin.current_price}
              change24h={selectedCoin.price_change_percentage_24h}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>选择币种查看详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>点击任意币种查看价格走势图</p>
                  <p className="text-sm mt-2">支持多时间段分析和技术指标</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 底部：数据可视化图表 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MarketCapPie />
        <VolumeBar maxItems={10} />
      </div>
    </div>
  )
}
