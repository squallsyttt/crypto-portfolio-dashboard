'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FavoriteButton } from '@/components/ui/favorite-button'
import { cn } from '@/lib/utils'
import { CoinData } from '@/lib/types'

interface RankingListProps {
  title: string
  data: CoinData[]
  type: 'gainers' | 'losers'
  loading?: boolean
  icon?: React.ReactNode
  maxItems?: number
}

export function RankingList({
  title,
  data,
  type,
  loading = false,
  icon,
  maxItems = 5,
}: RankingListProps) {
  const displayData = data.slice(0, maxItems)
  const isGainers = type === 'gainers'

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: maxItems }).map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 animate-pulse"
              >
                <div className="w-6 h-4 bg-muted rounded"></div>
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-12"></div>
                </div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={cn(
            'flex items-center gap-2',
            isGainers ? 'text-green-600' : 'text-red-600'
          )}
        >
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayData.length > 0 ? (
          <div className="space-y-3">
            {displayData.map((coin, index) => (
              <div
                key={coin.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="secondary"
                    className="w-6 h-6 p-0 flex items-center justify-center text-xs"
                  >
                    {index + 1}
                  </Badge>

                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold',
                      isGainers
                        ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-700 dark:from-green-900/30 dark:to-green-800/40 dark:text-green-400'
                        : 'bg-gradient-to-br from-red-100 to-red-200 text-red-700 dark:from-red-900/30 dark:to-red-800/40 dark:text-red-400'
                    )}
                  >
                    {coin.symbol.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{coin.name}</p>
                    <p className="text-xs text-muted-foreground uppercase">
                      {coin.symbol}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div
                      className={cn(
                        'font-medium text-sm flex items-center gap-1',
                        isGainers ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {isGainers ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {isGainers ? '+' : ''}
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ${coin.current_price.toFixed(2)}
                    </p>
                  </div>

                  <FavoriteButton coinId={coin.id} size="sm" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              {isGainers ? '暂无涨幅数据' : '暂无跌幅数据'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
