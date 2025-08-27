'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ChartsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">图表分析</h1>
        <p className="text-muted-foreground">专业技术分析工具和图表</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>功能开发中</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              图表分析工具正在开发中...
            </p>
            <p className="text-sm text-muted-foreground">
              将包含K线图、技术指标、交易量分析等专业工具
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
