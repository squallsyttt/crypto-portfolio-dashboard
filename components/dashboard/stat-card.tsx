'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
    positive?: boolean
  }
  icon?: LucideIcon
  description?: string
  loading?: boolean
  className?: string
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  loading = false,
  className,
  badge,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn('hover:shadow-md transition-shadow', className)}>
        <CardHeader className="pb-3">
          <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted rounded animate-pulse w-24 mb-2"></div>
          <div className="h-3 bg-muted rounded animate-pulse w-16"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            {title}
          </div>
          {badge && (
            <Badge variant={badge.variant || 'outline'} className="text-xs">
              {badge.text}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(change || description) && (
          <div className="flex items-center justify-between mt-2">
            {change && (
              <p
                className={cn(
                  'text-sm flex items-center gap-1',
                  change.positive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {change.positive ? '+' : ''}
                {change.value}% {change.label}
              </p>
            )}
            {description && !change && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
