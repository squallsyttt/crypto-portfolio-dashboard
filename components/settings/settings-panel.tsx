'use client'

import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useSettingsStore } from '@/lib/store/settings-store'
import { useMarketStore } from '@/lib/store/market-store'
import {
  Palette,
  Globe,
  Bell,
  DollarSign,
  Zap,
  Volume2,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react'

export function SettingsPanel() {
  const {
    display,
    notifications,
    setDisplaySetting,
    setNotificationSetting,
    resetToDefaults,
  } = useSettingsStore()

  const { setRefreshInterval } = useMarketStore()

  const handleRefreshIntervalChange = (value: string) => {
    const interval = parseInt(value)
    setRefreshInterval(interval)
  }

  return (
    <div className="space-y-6">
      {/* 显示设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            显示设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 主题设置 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              主题
            </Label>
            <Select
              value={display.theme}
              onValueChange={(value: 'light' | 'dark' | 'system') =>
                setDisplaySetting('theme', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    浅色
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    深色
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    跟随系统
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 货币设置 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              显示货币
            </Label>
            <Select
              value={display.currency}
              onValueChange={(value: 'USD' | 'EUR' | 'CNY' | 'JPY' | 'GBP') =>
                setDisplaySetting('currency', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">美元 (USD)</SelectItem>
                <SelectItem value="EUR">欧元 (EUR)</SelectItem>
                <SelectItem value="CNY">人民币 (CNY)</SelectItem>
                <SelectItem value="JPY">日元 (JPY)</SelectItem>
                <SelectItem value="GBP">英镑 (GBP)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 语言设置 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              显示语言
            </Label>
            <Select
              value={display.language}
              onValueChange={(value: 'zh-CN' | 'en-US' | 'ja-JP') =>
                setDisplaySetting('language', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh-CN">简体中文</SelectItem>
                <SelectItem value="en-US">English</SelectItem>
                <SelectItem value="ja-JP">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* 数据刷新间隔 */}
          <div className="space-y-2">
            <Label>数据刷新间隔</Label>
            <Select
              defaultValue="5000"
              onValueChange={handleRefreshIntervalChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1000">1秒</SelectItem>
                <SelectItem value="3000">3秒</SelectItem>
                <SelectItem value="5000">5秒</SelectItem>
                <SelectItem value="10000">10秒</SelectItem>
                <SelectItem value="30000">30秒</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 显示选项 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>紧凑模式</Label>
              <Switch
                checked={display.compactMode}
                onCheckedChange={(checked) =>
                  setDisplaySetting('compactMode', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>显示24h涨跌幅</Label>
              <Switch
                checked={display.showPercentageChange}
                onCheckedChange={(checked) =>
                  setDisplaySetting('showPercentageChange', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>显示市值</Label>
              <Switch
                checked={display.showMarketCap}
                onCheckedChange={(checked) =>
                  setDisplaySetting('showMarketCap', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>显示24h交易量</Label>
              <Switch
                checked={display.show24hVolume}
                onCheckedChange={(checked) =>
                  setDisplaySetting('show24hVolume', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                启用动画效果
              </Label>
              <Switch
                checked={display.animationsEnabled}
                onCheckedChange={(checked) =>
                  setDisplaySetting('animationsEnabled', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                启用音效
              </Label>
              <Switch
                checked={display.soundEnabled}
                onCheckedChange={(checked) =>
                  setDisplaySetting('soundEnabled', checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 通知设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            通知设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>价格预警通知</Label>
            <Switch
              checked={notifications.priceAlerts}
              onCheckedChange={(checked) =>
                setNotificationSetting('priceAlerts', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>投资组合更新</Label>
            <Switch
              checked={notifications.portfolioUpdates}
              onCheckedChange={(checked) =>
                setNotificationSetting('portfolioUpdates', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>新闻推送</Label>
            <Switch
              checked={notifications.newsUpdates}
              onCheckedChange={(checked) =>
                setNotificationSetting('newsUpdates', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>系统通知</Label>
            <Switch
              checked={notifications.systemNotifications}
              onCheckedChange={(checked) =>
                setNotificationSetting('systemNotifications', checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label>邮件通知</Label>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) =>
                setNotificationSetting('emailNotifications', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>推送通知</Label>
            <Switch
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) =>
                setNotificationSetting('pushNotifications', checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
