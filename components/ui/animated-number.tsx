'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedNumberProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export function AnimatedNumber({
  value,
  duration = 1000,
  className,
  prefix = '',
  suffix = '',
  decimals = 2,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (displayValue === value) return

    setIsAnimating(true)
    const startTime = Date.now()
    const startValue = displayValue
    const difference = value - startValue

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // 使用easeOutCubic缓动函数
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + difference * easeProgress

      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration, displayValue])

  const formattedValue = displayValue.toFixed(decimals)

  return (
    <span
      className={cn(
        'transition-colors duration-200',
        isAnimating && 'text-primary',
        className
      )}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}
