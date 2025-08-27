'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Briefcase,
  Home,
  Settings,
  Star,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Activity,
  PieChart,
  Wallet,
  Bell,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useMarketStats } from '@/hooks/useMockData'
import { cn } from '@/lib/utils'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  className?: string
  isMobile?: boolean
  onClose?: () => void
}

const sidebarItems = [
  {
    icon: Home,
    label: '仪表盘',
    href: '/',
    badge: null,
    description: '市场概览和关键指标',
  },
  {
    icon: TrendingUp,
    label: '市场行情',
    href: '/market',
    badge: null,
    description: '实时价格和市场数据',
  },
  {
    icon: Briefcase,
    label: '投资组合',
    href: '/portfolio',
    badge: null,
    description: '管理您的投资',
  },
  {
    icon: BarChart3,
    label: '图表分析',
    href: '/charts',
    badge: 'Pro',
    description: '专业技术分析工具',
  },
  {
    icon: Star,
    label: '收藏列表',
    href: '/favorites',
    badge: 12,
    description: '您关注的加密货币',
  },
  {
    icon: Bell,
    label: '价格提醒',
    href: '/alerts',
    badge: 3,
    description: '价格警报管理',
  },
  {
    icon: Settings,
    label: '设置',
    href: '/settings',
    badge: null,
    description: '个人偏好和配置',
  },
]

export function Sidebar({
  collapsed,
  onToggleCollapse,
  className,
  isMobile = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname()
  const { stats } = useMarketStats()

  return (
    <aside
      className={cn(
        'flex flex-col bg-card border-r transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64',
        isMobile && 'fixed inset-y-0 left-0 z-50 shadow-lg',
        className
      )}
    >
      {/* 顶部控制区 */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && !isMobile && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <TrendingUp className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">CryptoTracker</span>
          </div>
        )}

        {isMobile ? (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={cn(collapsed && 'mx-auto')}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <div key={item.href} className="relative">
              <Link href={item.href} onClick={isMobile ? onClose : undefined}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 h-10',
                    collapsed ? 'px-2' : 'px-3',
                    isActive && 'bg-primary text-primary-foreground shadow-sm'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left text-sm">
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? 'secondary' : 'outline'}
                          className="ml-auto text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>

              {/* 工具提示 - 仅在折叠状态显示 */}
              {collapsed && !isMobile && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-muted-foreground">
                    {item.description}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* 底部快速统计 */}
      {!collapsed && stats && (
        <div className="p-4 border-t">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">市场状态</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    开盘中
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">总市值</span>
                    <span className="font-medium">
                      ${(stats.totalMarketCap / 1e12).toFixed(2)}T
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">BTC主导率</span>
                    <span className="font-medium text-orange-500">
                      {stats.btcDominance.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">活跃币种</span>
                    <span className="font-medium">{stats.activeCoins}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <Button size="sm" className="w-full text-xs" asChild>
                    <Link href="/market">查看完整市场</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 折叠状态的底部指示器 */}
      {collapsed && stats && (
        <div className="p-2 border-t">
          <div className="w-full h-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded flex items-center justify-center">
            <PieChart className="h-4 w-4 text-primary" />
          </div>
        </div>
      )}
    </aside>
  )
}
