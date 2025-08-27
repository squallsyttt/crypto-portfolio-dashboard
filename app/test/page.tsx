'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TestPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回仪表盘
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">市场行情</h1>
          <p className="text-muted-foreground">实时加密货币市场数据</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>功能开发中</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              市场行情页面正在开发中，敬请期待！
            </p>
            <p className="text-sm text-muted-foreground">
              这个页面将显示完整的加密货币市场数据、排行榜和详细的价格分析。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
