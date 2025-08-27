'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PriceChangeIndicatorProps {
  change: number
  showIcon?: boolean
  showSign?: boolean
  className?: string
}

export function PriceChangeIndicator({
  change,
  showIcon = true,
  showSign = true,
  className,
}: PriceChangeIndicatorProps) {
  const isPositive = change > 0
  const isNegative = change < 0
  const isNeutral = change === 0

  const colorClass = isPositive
    ? 'text-green-600 dark:text-green-400'
    : isNegative
      ? 'text-red-600 dark:text-red-400'
      : 'text-muted-foreground'

  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus

  return (
    <div
      className={cn(
        'flex items-center gap-1 text-sm font-medium transition-colors',
        colorClass,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      <span>
        {showSign && isPositive && '+'}
        {Math.abs(change).toFixed(2)}%
      </span>
    </div>
  )
}
