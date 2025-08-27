'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FavoriteButton } from '@/components/ui/favorite-button'
import { PriceChangeIndicator } from '@/components/ui/price-change-indicator'
import { useMarketData } from '@/hooks/useMockData'
import { useMarketStore } from '@/lib/store/market-store'
import { useSettingsStore } from '@/lib/store/settings-store'
import { CoinData } from '@/lib/types'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  // TrendingUp,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarketTableProps {
  searchQuery?: string
  onCoinClick?: (coin: CoinData) => void
  className?: string
}

type SortField =
  | 'market_cap_rank'
  | 'name'
  | 'current_price'
  | 'market_cap'
  | 'total_volume'
  | 'price_change_percentage_24h'
type SortDirection = 'asc' | 'desc'

export function MarketTable({
  searchQuery = '',
  onCoinClick,
  className,
}: MarketTableProps) {
  const { data, isLoading } = useMarketData()
  const { setSortBy, setSortDirection } = useMarketStore()
  const { display, getFormattedPrice } = useSettingsStore()

  const [currentSortField, setCurrentSortField] =
    useState<SortField>('market_cap_rank')
  const [currentSortDirection, setCurrentSortDirection] =
    useState<SortDirection>('asc')

  // 处理排序
  const handleSort = (field: SortField) => {
    if (field === currentSortField) {
      const newDirection = currentSortDirection === 'asc' ? 'desc' : 'asc'
      setCurrentSortDirection(newDirection)
      setSortDirection(newDirection)
    } else {
      setCurrentSortField(field)
      setCurrentSortDirection('desc')
      setSortBy(
        field === 'market_cap_rank'
          ? 'market_cap'
          : (field as 'market_cap' | 'price' | 'change_24h')
      )
      setSortDirection('desc')
    }
  }

  // 过滤和排序数据
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // 排序
    filtered = filtered.sort((a, b) => {
      let aValue: number | string
      let bValue: number | string

      switch (currentSortField) {
        case 'market_cap_rank':
          aValue = a.market_cap_rank
          bValue = b.market_cap_rank
          break
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'current_price':
          aValue = a.current_price
          bValue = b.current_price
          break
        case 'market_cap':
          aValue = a.market_cap
          bValue = b.market_cap
          break
        case 'total_volume':
          aValue = a.total_volume
          bValue = b.total_volume
          break
        case 'price_change_percentage_24h':
          aValue = a.price_change_percentage_24h
          bValue = b.price_change_percentage_24h
          break
        default:
          aValue = a.market_cap_rank
          bValue = b.market_cap_rank
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return currentSortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return currentSortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    })

    return filtered
  }, [data, searchQuery, currentSortField, currentSortDirection])

  // 排序图标组件
  const SortIcon = ({ field }: { field: SortField }) => {
    if (currentSortField !== field) {
      return <ArrowUpDown className="h-3 w-3 opacity-50" />
    }
    return currentSortDirection === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-primary" />
    ) : (
      <ArrowDown className="h-3 w-3 text-primary" />
    )
  }

  if (isLoading) {
    return (
      <div className={cn('border rounded-md', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>币种</TableHead>
              <TableHead className="text-right">价格</TableHead>
              <TableHead className="text-right">24h%</TableHead>
              <TableHead className="text-right">市值</TableHead>
              <TableHead className="text-right">24h交易量</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 20 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 bg-muted rounded animate-pulse w-8"></div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-12"></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-4 bg-muted rounded animate-pulse w-16 ml-auto"></div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-4 bg-muted rounded animate-pulse w-12 ml-auto"></div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-4 bg-muted rounded animate-pulse w-20 ml-auto"></div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-4 bg-muted rounded animate-pulse w-16 ml-auto"></div>
                </TableCell>
                <TableCell>
                  <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className={cn('border rounded-md', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('market_cap_rank')}
                className="h-8 px-2 font-medium"
              >
                #
                <SortIcon field="market_cap_rank" />
              </Button>
            </TableHead>

            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('name')}
                className="h-8 px-2 font-medium"
              >
                币种
                <SortIcon field="name" />
              </Button>
            </TableHead>

            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('current_price')}
                className="h-8 px-2 font-medium"
              >
                价格
                <SortIcon field="current_price" />
              </Button>
            </TableHead>

            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('price_change_percentage_24h')}
                className="h-8 px-2 font-medium"
              >
                24h%
                <SortIcon field="price_change_percentage_24h" />
              </Button>
            </TableHead>

            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('market_cap')}
                className="h-8 px-2 font-medium"
              >
                市值
                <SortIcon field="market_cap" />
              </Button>
            </TableHead>

            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('total_volume')}
                className="h-8 px-2 font-medium"
              >
                24h交易量
                <SortIcon field="total_volume" />
              </Button>
            </TableHead>

            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredAndSortedData.map((coin) => (
            <TableRow
              key={coin.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onCoinClick?.(coin)}
            >
              <TableCell className="font-medium">
                <Badge
                  variant="secondary"
                  className="w-8 h-6 p-0 flex items-center justify-center text-xs"
                >
                  {coin.market_cap_rank}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {coin.symbol.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-sm text-muted-foreground uppercase">
                      {coin.symbol}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-right font-medium">
                {getFormattedPrice(coin.current_price)}
              </TableCell>

              <TableCell className="text-right">
                <PriceChangeIndicator
                  change={coin.price_change_percentage_24h}
                  showIcon={true}
                  className="justify-end"
                />
              </TableCell>

              <TableCell className="text-right font-medium">
                {display.showMarketCap && getFormattedPrice(coin.market_cap)}
              </TableCell>

              <TableCell className="text-right text-muted-foreground">
                {display.show24hVolume && getFormattedPrice(coin.total_volume)}
              </TableCell>

              <TableCell onClick={(e) => e.stopPropagation()}>
                <FavoriteButton coinId={coin.id} size="sm" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredAndSortedData.length === 0 && searchQuery && (
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>未找到匹配的加密货币</p>
          <p className="text-sm">尝试搜索其他关键词</p>
        </div>
      )}
    </div>
  )
}
