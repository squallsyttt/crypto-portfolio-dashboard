'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMarketStore } from '@/lib/store/market-store'
import { useMarketData } from '@/hooks/useMockData'
import { useSettingsStore } from '@/lib/store/settings-store'
import {
  Bell,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PriceAlertsProps {
  className?: string
}

export function PriceAlerts({ className }: PriceAlertsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedCoinId, setSelectedCoinId] = useState('')
  const [alertPrice, setAlertPrice] = useState('')
  const [alertType, setAlertType] = useState<'above' | 'below'>('above')

  const { alerts, addAlert, removeAlert, toggleAlert } = useMarketStore()
  const { data: marketData } = useMarketData()
  const { getFormattedPrice } = useSettingsStore()

  // 获取币种当前价格和状态
  const getAlertStatus = (alert: {
    coinId: string
    type: 'above' | 'below'
    price: number
  }) => {
    const coin = marketData.find((c) => c.id === alert.coinId)
    if (!coin) return { status: 'unknown', triggered: false }

    const triggered =
      alert.type === 'above'
        ? coin.current_price >= alert.price
        : coin.current_price <= alert.price

    return {
      status: triggered ? 'triggered' : 'active',
      triggered,
      currentPrice: coin.current_price,
      coin,
    }
  }

  const handleAddAlert = () => {
    if (!selectedCoinId || !alertPrice) return

    addAlert(selectedCoinId, parseFloat(alertPrice), alertType)

    // 重置表单
    setSelectedCoinId('')
    setAlertPrice('')
    setAlertType('above')
    setIsAddDialogOpen(false)
  }

  const activeAlerts = alerts.filter((alert) => alert.active)
  const triggeredAlerts = activeAlerts.filter(
    (alert) => getAlertStatus(alert).triggered
  )

  return (
    <div className={cn('space-y-6', className)}>
      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{activeAlerts.length}</p>
                <p className="text-sm text-muted-foreground">活跃预警</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {triggeredAlerts.length}
                </p>
                <p className="text-sm text-muted-foreground">已触发</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {activeAlerts.length - triggeredAlerts.length}
                </p>
                <p className="text-sm text-muted-foreground">待触发</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 预警列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              价格预警
            </CardTitle>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  添加预警
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加价格预警</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>选择币种</Label>
                    <Select
                      value={selectedCoinId}
                      onValueChange={setSelectedCoinId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择币种" />
                      </SelectTrigger>
                      <SelectContent>
                        {marketData.slice(0, 20).map((coin) => (
                          <SelectItem key={coin.id} value={coin.id}>
                            <div className="flex items-center gap-2">
                              <span>{coin.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {coin.symbol.toUpperCase()}
                              </Badge>
                              <span className="text-muted-foreground">
                                {getFormattedPrice(coin.current_price)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>预警类型</Label>
                    <Select
                      value={alertType}
                      onValueChange={(value: 'above' | 'below') =>
                        setAlertType(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            价格高于
                          </div>
                        </SelectItem>
                        <SelectItem value="below">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            价格低于
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>目标价格</Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="输入目标价格"
                      value={alertPrice}
                      onChange={(e) => setAlertPrice(e.target.value)}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <Button
                    onClick={handleAddAlert}
                    disabled={!selectedCoinId || !alertPrice}
                  >
                    添加预警
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无价格预警</p>
              <p className="text-sm">添加预警以便及时获得价格变动通知</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const status = getAlertStatus(alert)

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-lg border',
                      status.triggered &&
                        alert.active &&
                        'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20',
                      !alert.active && 'opacity-50'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {/* 状态指示器 */}
                      <div className="flex flex-col items-center gap-1">
                        {status.triggered && alert.active ? (
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        ) : (
                          <Bell
                            className={cn(
                              'h-5 w-5',
                              alert.active
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            )}
                          />
                        )}
                        {alert.type === 'above' ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                      </div>

                      {/* 币种信息 */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {status.coin?.name || alert.coinId}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {status.coin?.symbol.toUpperCase() || alert.coinId}
                          </Badge>
                          {status.triggered && alert.active && (
                            <Badge variant="destructive" className="text-xs">
                              已触发
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.type === 'above' ? '价格高于' : '价格低于'}{' '}
                          {getFormattedPrice(alert.price)}
                        </p>
                        {status.coin && (
                          <p className="text-xs text-muted-foreground">
                            当前价格: {getFormattedPrice(status.currentPrice)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={alert.active}
                        onCheckedChange={() => toggleAlert(alert.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAlert(alert.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
