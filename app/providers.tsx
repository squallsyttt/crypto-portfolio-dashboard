'use client'

import { ThemeProvider } from '@/components/providers/theme-provider'
import { ErrorBoundary } from '@/components/ui/error-boundary'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="crypto-tracker-theme"
      >
        {children}
      </ThemeProvider>
    </ErrorBoundary>
  )
}
