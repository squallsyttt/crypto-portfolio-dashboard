'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AlertsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">价格提醒</h1>
        <p className="text-muted-foreground">价格警报管理</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>功能开发中</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">价格提醒功能正在开发中...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
