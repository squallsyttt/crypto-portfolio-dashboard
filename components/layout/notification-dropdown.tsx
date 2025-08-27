'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function NotificationDropdown() {
  const notificationCount = 3

  return (
    <Button variant="ghost" size="sm" className="relative">
      <Bell className="h-4 w-4" />
      {notificationCount > 0 && (
        <Badge
          className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
          variant="destructive"
        >
          {notificationCount}
        </Badge>
      )}
      <span className="sr-only">通知</span>
    </Button>
  )
}
