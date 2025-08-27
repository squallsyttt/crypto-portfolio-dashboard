'use client'

import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function UserDropdown() {
  return (
    <Button variant="ghost" size="sm">
      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
        <User className="h-3 w-3 text-primary-foreground" />
      </div>
      <span className="sr-only">用户菜单</span>
    </Button>
  )
}
