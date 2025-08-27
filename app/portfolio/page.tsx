'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PortfolioOverview } from '@/components/portfolio/portfolio-overview'
import { AddHoldingDialog } from '@/components/portfolio/add-holding-dialog'
import { PriceAlerts } from '@/components/portfolio/price-alerts'
import { LiveIndicator } from '@/components/ui/live-indicator'
import { useMarketData } from '@/hooks/useMockData'
import { Briefcase, Plus, Bell, TrendingUp, BarChart3 } from 'lucide-react'

export default function PortfolioPage() {
  const { lastUpdate } = useMarketData()

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">投资组合</h1>
          </div>

          <AddHoldingDialog>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              添加持仓
            </Button>
          </AddHoldingDialog>
        </div>

        <p className="text-muted-foreground">
          管理和追踪您的加密货币投资，分析收益表现
        </p>
        <LiveIndicator isLive={true} lastUpdate={lastUpdate} />
      </div>

      {/* 选项卡内容 */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            投资概览
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            价格预警
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            深度分析
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PortfolioOverview />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <PriceAlerts />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">深度分析功能</h3>
            <p className="max-w-md mx-auto">
              风险评估、相关性分析、投资建议等高级功能正在开发中
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
