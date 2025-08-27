'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              出现错误
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">应用遇到了问题</h3>
              <p className="text-muted-foreground mb-4">
                {this.state.error?.message || '发生了未知错误，请稍后重试'}
              </p>
              <Button
                onClick={this.handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                重试
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="bg-muted p-4 rounded text-xs">
                <summary className="cursor-pointer font-medium mb-2">
                  错误详情 (开发模式)
                </summary>
                <pre className="whitespace-pre-wrap text-red-600">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

// Hook版本的错误边界
export function useErrorHandler() {
  return (error: Error, errorInfo?: string) => {
    console.error('Error:', error)
    if (errorInfo) {
      console.error('Error Info:', errorInfo)
    }

    // 这里可以集成错误报告服务
    // 比如 Sentry, LogRocket 等
  }
}
