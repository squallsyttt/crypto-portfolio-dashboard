'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingScreenProps {
  message?: string
  className?: string
}

export function LoadingScreen({
  message = '加载中...',
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center min-h-[400px] w-full',
        className
      )}
    >
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          {/* 动画图标 */}
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>

          {/* 加载文本 */}
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">{message}</p>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 简单的行内加载器
export function InlineLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  )
}

// 骨架屏组件
export function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
