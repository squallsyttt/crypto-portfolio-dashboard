'use client'

// 防抖函数
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// 节流函数
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 缓存装饰器
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  keySelector?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = keySelector ? keySelector(...args) : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = func(...args) as ReturnType<T>
    cache.set(key, result)

    return result
  }) as T
}

// 批量处理
export function batchProcessor<T, R>(
  processor: (items: T[]) => R[],
  batchSize: number = 100,
  delay: number = 16 // 一帧的时间
) {
  let queue: T[] = []
  let isProcessing = false

  const processNextBatch = async (): Promise<R[]> => {
    if (queue.length === 0 || isProcessing) {
      return []
    }

    isProcessing = true
    const batch = queue.splice(0, batchSize)

    return new Promise((resolve) => {
      setTimeout(() => {
        const results = processor(batch)
        isProcessing = false

        if (queue.length > 0) {
          processNextBatch()
        }

        resolve(results)
      }, delay)
    })
  }

  return {
    add: (items: T | T[]): Promise<R[]> => {
      queue.push(...(Array.isArray(items) ? items : [items]))
      return processNextBatch()
    },
    clear: () => {
      queue = []
      isProcessing = false
    },
  }
}

// 虚拟滚动帮助函数
export function calculateVirtualItems(
  totalCount: number,
  itemHeight: number,
  containerHeight: number,
  scrollTop: number,
  overscan: number = 5
) {
  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    totalCount - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight)
  )

  const start = Math.max(0, visibleStart - overscan)
  const end = Math.min(totalCount - 1, visibleEnd + overscan)

  const items = []
  for (let i = start; i <= end; i++) {
    items.push({
      index: i,
      offsetTop: i * itemHeight,
      height: itemHeight,
    })
  }

  return {
    items,
    totalHeight: totalCount * itemHeight,
    startIndex: start,
    endIndex: end,
  }
}

// 性能监控
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()

  measure<T>(name: string, fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const duration = performance.now() - start

    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    const measurements = this.metrics.get(name)!
    measurements.push(duration)

    // 保留最近100次测量
    if (measurements.length > 100) {
      measurements.shift()
    }

    return result
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const duration = performance.now() - start

    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    const measurements = this.metrics.get(name)!
    measurements.push(duration)

    if (measurements.length > 100) {
      measurements.shift()
    }

    return result
  }

  getStats(name: string) {
    const measurements = this.metrics.get(name) || []
    if (measurements.length === 0) {
      return null
    }

    const sorted = [...measurements].sort((a, b) => a - b)
    const sum = measurements.reduce((a, b) => a + b, 0)

    return {
      count: measurements.length,
      min: Math.min(...measurements),
      max: Math.max(...measurements),
      avg: sum / measurements.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    }
  }

  getAllStats() {
    const stats: Record<string, ReturnType<typeof this.getStats>> = {}
    for (const [name] of this.metrics) {
      stats[name] = this.getStats(name)
    }
    return stats
  }

  clear(name?: string) {
    if (name) {
      this.metrics.delete(name)
    } else {
      this.metrics.clear()
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()

// 内存使用监控
export function getMemoryUsage() {
  if ('memory' in performance) {
    const memory = (
      performance as unknown as {
        memory: {
          usedJSHeapSize: number
          totalJSHeapSize: number
          jsHeapSizeLimit: number
        }
      }
    ).memory
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usedPercent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    }
  }
  return null
}

// FPS 监控
export class FPSMonitor {
  private frames: number[] = []
  private lastTime = 0
  private animationId: number | null = null

  start(callback?: (fps: number) => void) {
    const measure = (timestamp: number) => {
      if (this.lastTime) {
        const fps = 1000 / (timestamp - this.lastTime)
        this.frames.push(fps)

        // 保留最近60帧
        if (this.frames.length > 60) {
          this.frames.shift()
        }

        if (callback && this.frames.length >= 10) {
          const avgFPS =
            this.frames.reduce((a, b) => a + b, 0) / this.frames.length
          callback(Math.round(avgFPS))
        }
      }

      this.lastTime = timestamp
      this.animationId = requestAnimationFrame(measure)
    }

    this.animationId = requestAnimationFrame(measure)
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.frames = []
    this.lastTime = 0
  }

  getAverageFPS() {
    if (this.frames.length === 0) return 0
    return Math.round(
      this.frames.reduce((a, b) => a + b, 0) / this.frames.length
    )
  }
}
