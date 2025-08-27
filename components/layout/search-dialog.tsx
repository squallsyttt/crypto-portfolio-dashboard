'use client'

import * as React from 'react'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground h-9"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        搜索加密货币...
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* 这里后续会实现完整的搜索对话框 */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg">
            <div className="bg-background p-6 rounded-lg border shadow-lg">
              <div className="space-y-4">
                <Input placeholder="搜索加密货币..." className="w-full" />
                <div className="text-sm text-muted-foreground">
                  搜索功能即将推出...
                </div>
                <Button onClick={() => setOpen(false)} className="w-full">
                  关闭
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
