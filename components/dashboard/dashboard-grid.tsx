'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardGridProps {
  children: ReactNode
  className?: string
}

interface GridSectionProps {
  children: ReactNode
  className?: string
}

interface GridItemProps {
  children: ReactNode
  className?: string
  span?: 1 | 2 | 3 | 4 | 6 | 12
}

export function DashboardGrid({ children, className }: DashboardGridProps) {
  return <div className={cn('space-y-6', className)}>{children}</div>
}

export function GridSection({ children, className }: GridSectionProps) {
  return (
    <section
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
        className
      )}
    >
      {children}
    </section>
  )
}

export function GridItem({ children, className, span = 1 }: GridItemProps) {
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
    3: 'col-span-1 md:col-span-2 lg:col-span-3',
    4: 'col-span-1 md:col-span-2 lg:col-span-4',
    6: 'col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6',
    12: 'col-span-full',
  }

  return <div className={cn(spanClasses[span], className)}>{children}</div>
}
