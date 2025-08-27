'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useMarketData, usePortfolio } from '@/hooks/useMockData'
import { useSettingsStore } from '@/lib/store/settings-store'
import { CoinData } from '@/lib/types'
import { Plus, Search, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddHoldingDialogProps {
  children: React.ReactNode
}

export function AddHoldingDialog({ children }: AddHoldingDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null)
  const [amount, setAmount] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: marketData } = useMarketData()
  const { addToPortfolio } = usePortfolio()
  const { getFormattedPrice } = useSettingsStore()

  // 过滤币种
  const filteredCoins = useMemo(() => {
    if (!searchQuery) return marketData.slice(0, 20) // 显示前20个

    return marketData
      .filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 10)
  }, [marketData, searchQuery])

  // 计算投资金额和当前价值
  const calculatedValues = useMemo(() => {
    if (!selectedCoin || !amount || !purchasePrice) {
      return { invested: 0, currentValue: 0, gainLoss: 0, gainLossPercent: 0 }
    }

    const amountNum = parseFloat(amount)
    const priceNum = parseFloat(purchasePrice)

    if (isNaN(amountNum) || isNaN(priceNum)) {
      return { invested: 0, currentValue: 0, gainLoss: 0, gainLossPercent: 0 }
    }

    const invested = amountNum * priceNum
    const currentValue = amountNum * selectedCoin.current_price
    const gainLoss = currentValue - invested
    const gainLossPercent = invested > 0 ? (gainLoss / invested) * 100 : 0

    return { invested, currentValue, gainLoss, gainLossPercent }
  }, [selectedCoin, amount, purchasePrice])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCoin || !amount || !purchasePrice) return

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟API调用

      addToPortfolio(
        selectedCoin.id,
        parseFloat(amount),
        parseFloat(purchasePrice)
      )

      // 重置表单
      setSelectedCoin(null)
      setAmount('')
      setPurchasePrice('')
      setSearchQuery('')
      setOpen(false)
    } catch (error) {
      console.error('添加持仓失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUseLivePrice = () => {
    if (selectedCoin) {
      setPurchasePrice(selectedCoin.current_price.toString())
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            添加持仓
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 选择币种 */}
          <div className="space-y-2">
            <Label>选择加密货币</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索币种..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* 币种选择列表 */}
            <div className="max-h-48 overflow-y-auto border rounded-md">
              {filteredCoins.map((coin) => (
                <div
                  key={coin.id}
                  className={cn(
                    'flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors',
                    selectedCoin?.id === coin.id &&
                      'bg-primary/10 border-primary'
                  )}
                  onClick={() => {
                    setSelectedCoin(coin)
                    setSearchQuery(coin.name)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {coin.symbol.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{coin.name}</p>
                      <p className="text-xs text-muted-foreground uppercase">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {getFormattedPrice(coin.current_price)}
                    </p>
                    <Badge
                      variant={
                        coin.price_change_percentage_24h >= 0
                          ? 'default'
                          : 'destructive'
                      }
                      className="text-xs"
                    >
                      {coin.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              ))}

              {filteredCoins.length === 0 && searchQuery && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>未找到匹配的币种</p>
                </div>
              )}
            </div>
          </div>

          {/* 持仓数量 */}
          <div className="space-y-2">
            <Label htmlFor="amount">持仓数量</Label>
            <Input
              id="amount"
              type="number"
              step="any"
              placeholder="输入持仓数量"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!selectedCoin}
            />
            {selectedCoin && (
              <p className="text-xs text-muted-foreground">
                单位: {selectedCoin.symbol.toUpperCase()}
              </p>
            )}
          </div>

          {/* 购买价格 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="purchase-price">购买价格</Label>
              {selectedCoin && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleUseLivePrice}
                  className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                >
                  使用当前价格
                </Button>
              )}
            </div>
            <Input
              id="purchase-price"
              type="number"
              step="any"
              placeholder="输入购买价格"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              disabled={!selectedCoin}
            />
            {selectedCoin && (
              <p className="text-xs text-muted-foreground">
                当前价格: {getFormattedPrice(selectedCoin.current_price)}
              </p>
            )}
          </div>

          {/* 预计算 */}
          {calculatedValues.invested > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">投资预览</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">投资金额</p>
                  <p className="font-medium">
                    {getFormattedPrice(calculatedValues.invested)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">当前价值</p>
                  <p className="font-medium">
                    {getFormattedPrice(calculatedValues.currentValue)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">盈亏情况</p>
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        'font-medium',
                        calculatedValues.gainLoss >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      )}
                    >
                      {calculatedValues.gainLoss >= 0 ? '+' : ''}
                      {getFormattedPrice(Math.abs(calculatedValues.gainLoss))}
                    </p>
                    <Badge
                      variant={
                        calculatedValues.gainLoss >= 0
                          ? 'default'
                          : 'destructive'
                      }
                      className="text-xs"
                    >
                      {calculatedValues.gainLoss >= 0 ? '+' : ''}
                      {calculatedValues.gainLossPercent.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={
                !selectedCoin || !amount || !purchasePrice || isSubmitting
              }
            >
              {isSubmitting ? '添加中...' : '添加持仓'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
