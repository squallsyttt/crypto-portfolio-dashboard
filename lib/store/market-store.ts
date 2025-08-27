'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { CoinData, MarketStats } from '@/lib/types'

interface MarketState {
  // 数据状态
  marketData: CoinData[]
  marketStats: MarketStats | null
  favorites: string[]
  portfolio: {
    [coinId: string]: {
      amount: number
      purchasePrice: number
      purchaseDate: Date
    }
  }
  alerts: {
    id: string
    coinId: string
    price: number
    type: 'above' | 'below'
    active: boolean
  }[]

  // UI状态
  isLoading: boolean
  error: string | null
  lastUpdate: Date
  refreshInterval: number
  sortBy: 'market_cap' | 'price' | 'change_24h'
  sortDirection: 'asc' | 'desc'

  // Actions
  setMarketData: (data: CoinData[]) => void
  setMarketStats: (stats: MarketStats) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setLastUpdate: (date: Date) => void

  // Favorites管理
  addToFavorites: (coinId: string) => void
  removeFromFavorites: (coinId: string) => void
  toggleFavorite: (coinId: string) => void

  // Portfolio管理
  addToPortfolio: (
    coinId: string,
    amount: number,
    purchasePrice: number
  ) => void
  removeFromPortfolio: (coinId: string) => void
  updatePortfolioAmount: (coinId: string, amount: number) => void

  // Alerts管理
  addAlert: (coinId: string, price: number, type: 'above' | 'below') => void
  removeAlert: (alertId: string) => void
  toggleAlert: (alertId: string) => void

  // UI控制
  setSortBy: (sortBy: 'market_cap' | 'price' | 'change_24h') => void
  setSortDirection: (direction: 'asc' | 'desc') => void
  setRefreshInterval: (interval: number) => void

  // 计算属性
  getSortedMarketData: () => CoinData[]
  getFavoriteCoins: () => CoinData[]
  getPortfolioValue: () => number
  getPortfolioChange: () => number
}

export const useMarketStore = create<MarketState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        marketData: [],
        marketStats: null,
        favorites: [],
        portfolio: {},
        alerts: [],

        isLoading: false,
        error: null,
        lastUpdate: new Date(),
        refreshInterval: 5000,
        sortBy: 'market_cap',
        sortDirection: 'desc',

        // Actions
        setMarketData: (data) => set({ marketData: data }),
        setMarketStats: (stats) => set({ marketStats: stats }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        setLastUpdate: (date) => set({ lastUpdate: date }),

        // Favorites管理
        addToFavorites: (coinId) =>
          set((state) => ({
            favorites: state.favorites.includes(coinId)
              ? state.favorites
              : [...state.favorites, coinId],
          })),

        removeFromFavorites: (coinId) =>
          set((state) => ({
            favorites: state.favorites.filter((id) => id !== coinId),
          })),

        toggleFavorite: (coinId) => {
          const state = get()
          if (state.favorites.includes(coinId)) {
            state.removeFromFavorites(coinId)
          } else {
            state.addToFavorites(coinId)
          }
        },

        // Portfolio管理
        addToPortfolio: (coinId, amount, purchasePrice) =>
          set((state) => ({
            portfolio: {
              ...state.portfolio,
              [coinId]: {
                amount,
                purchasePrice,
                purchaseDate: new Date(),
              },
            },
          })),

        removeFromPortfolio: (coinId) =>
          set((state) => {
            const newPortfolio = { ...state.portfolio }
            delete newPortfolio[coinId]
            return { portfolio: newPortfolio }
          }),

        updatePortfolioAmount: (coinId, amount) =>
          set((state) => ({
            portfolio: {
              ...state.portfolio,
              [coinId]: {
                ...state.portfolio[coinId],
                amount,
              },
            },
          })),

        // Alerts管理
        addAlert: (coinId, price, type) =>
          set((state) => ({
            alerts: [
              ...state.alerts,
              {
                id: Date.now().toString(),
                coinId,
                price,
                type,
                active: true,
              },
            ],
          })),

        removeAlert: (alertId) =>
          set((state) => ({
            alerts: state.alerts.filter((alert) => alert.id !== alertId),
          })),

        toggleAlert: (alertId) =>
          set((state) => ({
            alerts: state.alerts.map((alert) =>
              alert.id === alertId ? { ...alert, active: !alert.active } : alert
            ),
          })),

        // UI控制
        setSortBy: (sortBy) => set({ sortBy }),
        setSortDirection: (direction) => set({ sortDirection: direction }),
        setRefreshInterval: (interval) => set({ refreshInterval: interval }),

        // 计算属性
        getSortedMarketData: () => {
          const { marketData, sortBy, sortDirection } = get()
          return [...marketData].sort((a, b) => {
            let aValue: number, bValue: number

            switch (sortBy) {
              case 'market_cap':
                aValue = a.market_cap
                bValue = b.market_cap
                break
              case 'price':
                aValue = a.current_price
                bValue = b.current_price
                break
              case 'change_24h':
                aValue = a.price_change_percentage_24h
                bValue = b.price_change_percentage_24h
                break
              default:
                aValue = a.market_cap
                bValue = b.market_cap
            }

            return sortDirection === 'desc' ? bValue - aValue : aValue - bValue
          })
        },

        getFavoriteCoins: () => {
          const { marketData, favorites } = get()
          return marketData.filter((coin) => favorites.includes(coin.id))
        },

        getPortfolioValue: () => {
          const { marketData, portfolio } = get()
          return Object.entries(portfolio).reduce(
            (total, [coinId, holding]) => {
              const coin = marketData.find((c) => c.id === coinId)
              return total + (coin ? coin.current_price * holding.amount : 0)
            },
            0
          )
        },

        getPortfolioChange: () => {
          const { marketData, portfolio } = get()
          let totalInvested = 0
          let currentValue = 0

          Object.entries(portfolio).forEach(([coinId, holding]) => {
            const coin = marketData.find((c) => c.id === coinId)
            totalInvested += holding.purchasePrice * holding.amount
            currentValue += coin ? coin.current_price * holding.amount : 0
          })

          return totalInvested > 0
            ? ((currentValue - totalInvested) / totalInvested) * 100
            : 0
        },
      }),
      {
        name: 'market-storage',
        partialize: (state) => ({
          favorites: state.favorites,
          portfolio: state.portfolio,
          alerts: state.alerts,
          refreshInterval: state.refreshInterval,
          sortBy: state.sortBy,
          sortDirection: state.sortDirection,
        }),
      }
    ),
    {
      name: 'market-store',
    }
  )
)
