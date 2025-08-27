'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Search, Filter, TrendingUp, TrendingDown, X, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarketFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  className?: string
}

interface FilterState {
  priceRange: [number, number]
  marketCapRange: [number, number]
  changeRange: [number, number]
  categories: string[]
  onlyFavorites: boolean
  onlyGainers: boolean
  onlyLosers: boolean
}

const initialFilters: FilterState = {
  priceRange: [0, 100000],
  marketCapRange: [0, 1000000000000], // 1T
  changeRange: [-100, 100],
  categories: [],
  onlyFavorites: false,
  onlyGainers: false,
  onlyLosers: false,
}

const categories = [
  'DeFi',
  'Layer 1',
  'Layer 2',
  'Meme Coins',
  'Gaming',
  'NFT',
  'Web3',
  'AI',
  'Privacy',
  'Exchange',
]

export function MarketFilters({
  searchQuery,
  onSearchChange,
  className,
}: MarketFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // 统计活跃过滤器数量
  const getActiveFiltersCount = () => {
    let count = 0

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) count++
    if (
      filters.marketCapRange[0] > 0 ||
      filters.marketCapRange[1] < 1000000000000
    )
      count++
    if (filters.changeRange[0] > -100 || filters.changeRange[1] < 100) count++
    if (filters.categories.length > 0) count++
    if (filters.onlyFavorites) count++
    if (filters.onlyGainers) count++
    if (filters.onlyLosers) count++

    return count
  }

  // 重置过滤器
  const resetFilters = () => {
    setFilters(initialFilters)
  }

  // 快速过滤按钮
  const QuickFilterButton = ({
    active,
    onClick,
    children,
    icon: Icon,
  }: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
    icon: React.ComponentType<{ className?: string }>
  }) => (
    <Button
      variant={active ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className="flex items-center gap-1"
    >
      <Icon className="h-3 w-3" />
      {children}
    </Button>
  )

  const formatPrice = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value}`
  }

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(1)}T`
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`
    }
    return `$${value}`
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className={cn('space-y-4', className)}>
      {/* 搜索栏和快速过滤 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* 搜索输入框 */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索加密货币..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* 快速过滤器 */}
        <div className="flex flex-wrap gap-2">
          <QuickFilterButton
            active={filters.onlyFavorites}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                onlyFavorites: !prev.onlyFavorites,
              }))
            }
            icon={Star}
          >
            收藏
          </QuickFilterButton>

          <QuickFilterButton
            active={filters.onlyGainers}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                onlyGainers: !prev.onlyGainers,
                onlyLosers: prev.onlyGainers ? prev.onlyLosers : false,
              }))
            }
            icon={TrendingUp}
          >
            上涨
          </QuickFilterButton>

          <QuickFilterButton
            active={filters.onlyLosers}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                onlyLosers: !prev.onlyLosers,
                onlyGainers: prev.onlyLosers ? prev.onlyGainers : false,
              }))
            }
            icon={TrendingDown}
          >
            下跌
          </QuickFilterButton>

          {/* 高级过滤器 */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="h-3 w-3 mr-1" />
                过滤器
                {activeFiltersCount > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    variant="destructive"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80" align="end">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">高级过滤器</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                  >
                    重置
                  </Button>
                </div>

                {/* 价格区间 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    价格区间: {formatPrice(filters.priceRange[0])} -{' '}
                    {formatPrice(filters.priceRange[1])}
                  </Label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: value as [number, number],
                      }))
                    }
                    max={100000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                </div>

                {/* 市值区间 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    市值区间: {formatMarketCap(filters.marketCapRange[0])} -{' '}
                    {formatMarketCap(filters.marketCapRange[1])}
                  </Label>
                  <Slider
                    value={filters.marketCapRange}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        marketCapRange: value as [number, number],
                      }))
                    }
                    max={1000000000000}
                    min={0}
                    step={1000000000}
                    className="w-full"
                  />
                </div>

                {/* 涨跌幅区间 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    24h涨跌幅: {filters.changeRange[0]}% -{' '}
                    {filters.changeRange[1]}%
                  </Label>
                  <Slider
                    value={filters.changeRange}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        changeRange: value as [number, number],
                      }))
                    }
                    max={100}
                    min={-100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* 分类筛选 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">分类</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={
                          filters.categories.includes(category)
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            categories: prev.categories.includes(category)
                              ? prev.categories.filter((c) => c !== category)
                              : [...prev.categories, category],
                          }))
                        }}
                        className="h-7 px-2 text-xs"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 活跃过滤器标签 */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.onlyFavorites && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              仅收藏
              <Button
                variant="ghost"
                size="sm"
                className="h-auto w-auto p-0 ml-1 hover:bg-transparent"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, onlyFavorites: false }))
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.onlyGainers && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              仅上涨
              <Button
                variant="ghost"
                size="sm"
                className="h-auto w-auto p-0 ml-1 hover:bg-transparent"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, onlyGainers: false }))
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.onlyLosers && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              仅下跌
              <Button
                variant="ghost"
                size="sm"
                className="h-auto w-auto p-0 ml-1 hover:bg-transparent"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, onlyLosers: false }))
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.categories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {category}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto w-auto p-0 ml-1 hover:bg-transparent"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    categories: prev.categories.filter((c) => c !== category),
                  }))
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
