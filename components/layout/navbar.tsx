'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings, Menu, TrendingUp, Activity } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { SearchDialog } from './search-dialog'
import { NotificationDropdown } from './notification-dropdown'
import { UserDropdown } from './user-dropdown'

interface NavbarProps {
  onMenuClick: () => void
  className?: string
}

export function Navbar({ onMenuClick, className }: NavbarProps) {
  const pathname = usePathname()

  return (
    <header
      className={`border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
    >
      <div className="flex h-16 items-center px-4 gap-4">
        {/* 移动端菜单按钮 */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">打开菜单</span>
        </Button>

        {/* Logo和标题 */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TrendingUp className="h-4 w-4" />
          </div>
          <span className="hidden sm:inline-block">CryptoTracker Pro</span>
        </Link>

        {/* 导航链接 - 桌面端 */}
        <nav className="hidden md:flex items-center gap-6 ml-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            仪表盘
          </Link>
          <Link
            href="/market"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/market'
                ? 'text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            市场行情
          </Link>
          <Link
            href="/portfolio"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/portfolio'
                ? 'text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            投资组合
          </Link>
          <Link
            href="/charts"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/charts'
                ? 'text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            图表分析
          </Link>
        </nav>

        {/* 搜索栏 */}
        <div className="flex-1 max-w-md mx-4">
          <SearchDialog />
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-2">
          {/* 市场状态指示器 */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            <Activity className="h-3 w-3" />
            <span className="text-xs font-medium">Market Open</span>
          </div>

          {/* 通知 */}
          <NotificationDropdown />

          {/* 主题切换 */}
          <ThemeToggle />

          {/* 设置 */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4" />
              <span className="sr-only">设置</span>
            </Link>
          </Button>

          {/* 用户菜单 */}
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}
