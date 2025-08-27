'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { PriceHistoryPoint, TimeRange } from '@/lib/types'
import { mockDataGenerator } from '@/lib/mock-data'
import { useMarketStore } from '@/lib/store/market-store'
import { useSettingsStore } from '@/lib/store/settings-store'

/**
 * 市场数据管理Hook - 集成Zustand
 */
export function useMarketData() {
  const {
    marketData,
    isLoading,
    error,
    lastUpdate,
    refreshInterval,
    setMarketData,
    setLoading,
    setError,
    setLastUpdate,
    getSortedMarketData,
  } = useMarketStore()

  const { display } = useSettingsStore()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 初始化数据
  const initializeData = useCallback(() => {
    try {
      setLoading(true)
      setError(null)

      setTimeout(() => {
        const initialData = mockDataGenerator.generateMarketData()
        setMarketData(initialData)
        setLastUpdate(new Date())
        setLoading(false)
      }, 500)
    } catch (err) {
      setError('Failed to load market data')
      setLoading(false)
    }
  }, [setLoading, setError, setMarketData, setLastUpdate])

  // 更新价格数据
  const updatePrices = useCallback(() => {
    if (marketData.length > 0 && display.animationsEnabled) {
      try {
        const updatedData = mockDataGenerator.updatePrices(marketData)
        setMarketData(updatedData)
        setLastUpdate(new Date())
      } catch (err) {
        console.error('Failed to update prices:', err)
      }
    }
  }, [marketData, display.animationsEnabled, setMarketData, setLastUpdate])

  // 手动刷新数据
  const refresh = useCallback(() => {
    initializeData()
  }, [initializeData])

  // 获取指定币种
  const getCoinById = useCallback(
    (id: string) => {
      return marketData.find((coin) => coin.id === id)
    },
    [marketData]
  )

  // 搜索币种
  const searchCoins = useCallback(
    (query: string) => {
      if (!query) return marketData
      return mockDataGenerator.searchCoins(query)
    },
    [marketData]
  )

  // 初始化
  useEffect(() => {
    if (marketData.length === 0) {
      initializeData()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [initializeData, marketData.length])

  // 设置价格更新定时器
  useEffect(() => {
    if (!isLoading && marketData.length > 0 && refreshInterval > 0) {
      intervalRef.current = setInterval(updatePrices, refreshInterval)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [isLoading, marketData.length, refreshInterval, updatePrices])

  return {
    data: getSortedMarketData(),
    isLoading,
    error,
    lastUpdate,
    refresh,
    getCoinById,
    searchCoins,
  }
}

/**
 * 市场统计数据Hook - 集成Zustand
 */
export function useMarketStats() {
  const {
    marketStats,
    isLoading,
    error,
    setMarketStats,
    setLoading,
    setError,
  } = useMarketStore()

  useEffect(() => {
    const generateStats = () => {
      setLoading(true)
      setTimeout(() => {
        const stats = mockDataGenerator.generateMarketStats()
        setMarketStats(stats)
        setLoading(false)
      }, 300)
    }

    if (!marketStats) {
      generateStats()
    }

    // 每30秒更新一次统计数据
    const interval = setInterval(generateStats, 30000)

    return () => clearInterval(interval)
  }, [marketStats, setMarketStats, setLoading])

  return { stats: marketStats, isLoading: isLoading }
}

/**
 * 收藏功能Hook
 */
export function useFavorites() {
  const {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    getFavoriteCoins,
  } = useMarketStore()

  return {
    favorites,
    favoriteCoins: getFavoriteCoins(),
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite: (coinId: string) => favorites.includes(coinId),
  }
}

/**
 * 投资组合Hook
 */
export function usePortfolio() {
  const {
    portfolio,
    addToPortfolio,
    removeFromPortfolio,
    updatePortfolioAmount,
    getPortfolioValue,
    getPortfolioChange,
  } = useMarketStore()

  const { getFormattedPrice } = useSettingsStore()

  return {
    portfolio,
    portfolioValue: getPortfolioValue(),
    portfolioChange: getPortfolioChange(),
    formattedPortfolioValue: getFormattedPrice(getPortfolioValue()),
    addToPortfolio,
    removeFromPortfolio,
    updatePortfolioAmount,
    hasHolding: (coinId: string) => coinId in portfolio,
  }
}

/**
 * 价格历史数据Hook
 */
export function usePriceHistory(coinId: string, timeRange: TimeRange = '7D') {
  const [data, setData] = useState<PriceHistoryPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!coinId) return

    setIsLoading(true)

    // 模拟异步加载
    setTimeout(() => {
      const history = mockDataGenerator.generatePriceHistory(coinId, timeRange)
      setData(history)
      setIsLoading(false)
    }, 200)
  }, [coinId, timeRange])

  return { data, isLoading }
}

/**
 * 实时价格更新Hook
 */
export function useRealTimePrice(coinId: string) {
  const [price, setPrice] = useState<number>(0)
  const [change24h, setChange24h] = useState<number>(0)
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(() => {
    if (!coinId) return

    // 模拟WebSocket连接
    setIsConnected(true)

    const interval = setInterval(() => {
      // 获取最新价格
      const allCoins = mockDataGenerator.generateMarketData()
      const coin = allCoins.find((c) => c.id === coinId)

      if (coin) {
        setPrice(coin.current_price)
        setChange24h(coin.price_change_percentage_24h)
      }
    }, 1000) // 每秒更新

    return () => {
      clearInterval(interval)
      setIsConnected(false)
    }
  }, [coinId])

  return {
    price,
    change24h,
    isConnected,
  }
}

/**
 * 数据缓存Hook
 */
export function useDataCache<T>(
  key: string,
  fetcher: () => Promise<T> | T,
  ttl: number = 300000 // 5分钟缓存
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getCachedData = useCallback(() => {
    const cached = localStorage.getItem(`cache_${key}`)
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < ttl) {
          return data
        }
      } catch {
        // 缓存数据无效，忽略
      }
    }
    return null
  }, [key, ttl])

  const setCachedData = useCallback(
    (data: T) => {
      const cacheItem = {
        data,
        timestamp: Date.now(),
      }
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem))
    },
    [key]
  )

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 先检查缓存
      const cachedData = getCachedData()
      if (cachedData) {
        setData(cachedData)
        setIsLoading(false)
        return
      }

      // 获取新数据
      const result = await fetcher()
      setData(result)
      setCachedData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [fetcher, getCachedData, setCachedData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const invalidateCache = useCallback(() => {
    localStorage.removeItem(`cache_${key}`)
    fetchData()
  }, [key, fetchData])

  return {
    data,
    isLoading,
    error,
    refresh: fetchData,
    invalidateCache,
  }
}
