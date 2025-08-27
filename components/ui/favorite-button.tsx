'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/hooks/useMockData'
import { useSettingsStore } from '@/lib/store/settings-store'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  coinId: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function FavoriteButton({
  coinId,
  size = 'md',
  showLabel = false,
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { display } = useSettingsStore()
  const [isAnimating, setIsAnimating] = useState(false)

  const isFav = isFavorite(coinId)

  const handleToggle = async () => {
    if (display.animationsEnabled) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 300)
    }

    toggleFavorite(coinId)

    // 播放音效
    if (display.soundEnabled && !isFav) {
      // 这里可以播放收藏音效
      console.log('🎵 Favorite added sound')
    }
  }

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <Button
      variant={isFav ? 'default' : 'outline'}
      size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
      onClick={handleToggle}
      className={cn(
        'transition-all duration-200',
        sizeClasses[size],
        isFav && 'bg-pink-500 hover:bg-pink-600 text-white border-pink-500',
        isAnimating && display.animationsEnabled && 'animate-pulse scale-110',
        !showLabel && 'px-0',
        className
      )}
      title={isFav ? '取消收藏' : '添加到收藏'}
    >
      <Heart
        className={cn(
          iconSizes[size],
          'transition-colors duration-200',
          isFav && 'fill-current'
        )}
      />
      {showLabel && (
        <span className="ml-2 text-sm">{isFav ? '已收藏' : '收藏'}</span>
      )}
    </Button>
  )
}
