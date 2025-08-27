'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Currency = 'USD' | 'EUR' | 'CNY' | 'JPY' | 'GBP'
type Language = 'zh-CN' | 'en-US' | 'ja-JP'
type Theme = 'light' | 'dark' | 'system'

interface NotificationSettings {
  priceAlerts: boolean
  portfolioUpdates: boolean
  newsUpdates: boolean
  systemNotifications: boolean
  emailNotifications: boolean
  pushNotifications: boolean
}

interface DisplaySettings {
  currency: Currency
  language: Language
  theme: Theme
  compactMode: boolean
  showPercentageChange: boolean
  showMarketCap: boolean
  show24hVolume: boolean
  animationsEnabled: boolean
  soundEnabled: boolean
}

interface SettingsState {
  // 设置状态
  display: DisplaySettings
  notifications: NotificationSettings

  // Actions
  setDisplaySetting: <K extends keyof DisplaySettings>(
    key: K,
    value: DisplaySettings[K]
  ) => void
  setNotificationSetting: <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => void
  resetToDefaults: () => void

  // 辅助方法
  getCurrencySymbol: () => string
  getFormattedPrice: (price: number) => string
  isNotificationEnabled: (type: keyof NotificationSettings) => boolean
}

const defaultDisplaySettings: DisplaySettings = {
  currency: 'USD',
  language: 'zh-CN',
  theme: 'system',
  compactMode: false,
  showPercentageChange: true,
  showMarketCap: true,
  show24hVolume: true,
  animationsEnabled: true,
  soundEnabled: true,
}

const defaultNotificationSettings: NotificationSettings = {
  priceAlerts: true,
  portfolioUpdates: true,
  newsUpdates: false,
  systemNotifications: true,
  emailNotifications: false,
  pushNotifications: true,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // 初始状态
      display: defaultDisplaySettings,
      notifications: defaultNotificationSettings,

      // Actions
      setDisplaySetting: (key, value) =>
        set((state) => ({
          display: {
            ...state.display,
            [key]: value,
          },
        })),

      setNotificationSetting: (key, value) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [key]: value,
          },
        })),

      resetToDefaults: () =>
        set({
          display: defaultDisplaySettings,
          notifications: defaultNotificationSettings,
        }),

      // 辅助方法
      getCurrencySymbol: () => {
        const { display } = get()
        const symbols = {
          USD: '$',
          EUR: '€',
          CNY: '¥',
          JPY: '¥',
          GBP: '£',
        }
        return symbols[display.currency]
      },

      getFormattedPrice: (price) => {
        const { display } = get()
        const symbol = get().getCurrencySymbol()

        if (price >= 1e9) {
          return `${symbol}${(price / 1e9).toFixed(2)}B`
        } else if (price >= 1e6) {
          return `${symbol}${(price / 1e6).toFixed(2)}M`
        } else if (price >= 1e3) {
          return `${symbol}${(price / 1e3).toFixed(2)}K`
        } else {
          return `${symbol}${price.toFixed(2)}`
        }
      },

      isNotificationEnabled: (type) => {
        const { notifications } = get()
        return notifications[type]
      },
    }),
    {
      name: 'settings-storage',
    }
  )
)
