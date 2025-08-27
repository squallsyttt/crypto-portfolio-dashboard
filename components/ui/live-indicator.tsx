'use client'

import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LiveIndicatorProps {
  isLive?: boolean
  lastUpdate?: Date
  className?: string
}

export function LiveIndicator({
  isLive = true,
  lastUpdate,
  className,
}: LiveIndicatorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <div className="relative flex items-center">
        <Activity
          className={cn(
            'h-4 w-4',
            isLive ? 'text-green-500' : 'text-muted-foreground'
          )}
        />
        {isLive && (
          <div className="absolute -inset-1">
            <div className="w-6 h-6 rounded-full bg-green-500/20 animate-pulse" />
          </div>
        )}
      </div>

      <span className="text-muted-foreground">
        {isLive ? '实时数据' : '离线数据'}
        {lastUpdate && mounted && (
          <>
            <span className="mx-1">·</span>
            <span>最后更新: {lastUpdate.toLocaleTimeString()}</span>
          </>
        )}
      </span>
    </div>
  )
}
