'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FavoritesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">收藏列表</h1>
        <p className="text-muted-foreground">您关注的加密货币</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>功能开发中</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">收藏功能正在开发中...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
