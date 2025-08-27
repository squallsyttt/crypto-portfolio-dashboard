// 加密货币数据类型
export interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
  sparkline_in_7d?: {
    price: number[]
  }
}

// 投资组合持仓类型
export interface PortfolioHolding {
  id: string
  coinId: string
  symbol: string
  name: string
  image: string
  amount: number
  purchasePrice: number
  purchaseDate: string
  currentPrice: number
  currentValue: number
  gainLoss: number
  gainLossPercentage: number
  notes?: string
}

// 价格历史数据点
export interface PriceHistoryPoint {
  timestamp: number
  price: number
  market_cap: number
  total_volume: number
}

// 市场统计数据
export interface MarketStats {
  totalMarketCap: number
  totalVolume24h: number
  marketCapChange24h: number
  volumeChange24h: number
  btcDominance: number
  ethDominance: number
  activeCoins: number
  markets: number
  totalMarketCapChangePercentage24h: number
}

// 价格变化指标
export interface PriceAlert {
  id: string
  coinId: string
  symbol: string
  name: string
  targetPrice: number
  condition: 'above' | 'below'
  isActive: boolean
  createdAt: string
  triggeredAt?: string
}

// 图表数据类型
export interface ChartDataPoint {
  timestamp: number
  value: number
  label?: string
}

// OHLC K线数据
export interface CandlestickData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// 用户偏好设置
export interface UserSettings {
  defaultCurrency: 'usd' | 'cny' | 'eur' | 'jpy'
  theme: 'light' | 'dark' | 'system'
  refreshInterval: number // 秒
  notifications: {
    priceAlerts: boolean
    portfolioUpdates: boolean
    newsUpdates: boolean
  }
  displaySettings: {
    showSparklines: boolean
    showPercentageChange: boolean
    compactView: boolean
  }
}

// API响应类型
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  timestamp: number
}

// 分页数据类型
export interface PaginatedData<T> {
  items: T[]
  totalItems: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// 搜索结果类型
export interface SearchResult {
  coins: CoinData[]
  totalResults: number
  searchTerm: string
  timestamp: number
}

// 错误类型
export interface AppError {
  code: string
  message: string
  details?: unknown
  timestamp: number
}

// 加载状态类型
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// 时间范围选项
export type TimeRange = '1H' | '1D' | '7D' | '1M' | '3M' | '1Y' | 'ALL'

// 排序选项
export type SortOption = {
  field: keyof CoinData
  direction: 'asc' | 'desc'
}

// 筛选选项
export type FilterOptions = {
  priceRange?: {
    min: number
    max: number
  }
  marketCapRange?: {
    min: number
    max: number
  }
  volumeRange?: {
    min: number
    max: number
  }
  changeRange?: {
    min: number
    max: number
  }
  categories?: string[]
  onlyFavorites?: boolean
}
