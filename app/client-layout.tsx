'use client'

import { useState } from 'react'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <body className="font-sans antialiased">
      <Providers>
        <div className="flex h-screen bg-background overflow-hidden">
          {/* 移动端遮罩 */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* 侧边栏 - 桌面端 */}
          <div className="hidden md:flex">
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>

          {/* 侧边栏 - 移动端 */}
          {mobileMenuOpen && (
            <Sidebar
              collapsed={false}
              onToggleCollapse={() => {}}
              isMobile
              onClose={() => setMobileMenuOpen(false)}
            />
          )}

          {/* 主内容区域 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar onMenuClick={() => setMobileMenuOpen(true)} />

            <main className="flex-1 overflow-auto">
              <div className="h-full">{children}</div>
            </main>
          </div>
        </div>
      </Providers>
    </body>
  )
}
