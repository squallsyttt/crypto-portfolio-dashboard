import {
  CoinData,
  PriceHistoryPoint,
  MarketStats,
  CandlestickData,
  PortfolioHolding,
  TimeRange,
} from './types'

// 主要加密货币列表，包含真实的信息
const CRYPTO_COINS = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', basePrice: 43000 },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', basePrice: 2500 },
  { id: 'binancecoin', symbol: 'bnb', name: 'BNB', basePrice: 300 },
  { id: 'solana', symbol: 'sol', name: 'Solana', basePrice: 100 },
  { id: 'cardano', symbol: 'ada', name: 'Cardano', basePrice: 0.5 },
  { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', basePrice: 35 },
  { id: 'polkadot', symbol: 'dot', name: 'Polkadot', basePrice: 7 },
  { id: 'chainlink', symbol: 'link', name: 'Chainlink', basePrice: 15 },
  { id: 'polygon', symbol: 'matic', name: 'Polygon', basePrice: 0.8 },
  { id: 'litecoin', symbol: 'ltc', name: 'Litecoin', basePrice: 70 },
  { id: 'near', symbol: 'near', name: 'NEAR Protocol', basePrice: 2.5 },
  { id: 'uniswap', symbol: 'uni', name: 'Uniswap', basePrice: 6 },
  {
    id: 'internet-computer',
    symbol: 'icp',
    name: 'Internet Computer',
    basePrice: 5,
  },
  { id: 'aptos', symbol: 'apt', name: 'Aptos', basePrice: 8 },
  { id: 'arbitrum', symbol: 'arb', name: 'Arbitrum', basePrice: 1.2 },
  { id: 'optimism', symbol: 'op', name: 'Optimism', basePrice: 2.5 },
  { id: 'cosmos', symbol: 'atom', name: 'Cosmos Hub', basePrice: 10 },
  { id: 'filecoin', symbol: 'fil', name: 'Filecoin', basePrice: 5 },
  { id: 'hedera-hashgraph', symbol: 'hbar', name: 'Hedera', basePrice: 0.06 },
  { id: 'vechain', symbol: 'vet', name: 'VeChain', basePrice: 0.025 },
  // 添加更多币种以达到100个
  { id: 'stellar', symbol: 'xlm', name: 'Stellar', basePrice: 0.12 },
  { id: 'algorand', symbol: 'algo', name: 'Algorand', basePrice: 0.15 },
  { id: 'tezos', symbol: 'xtz', name: 'Tezos', basePrice: 1 },
  { id: 'elrond-erd-2', symbol: 'egld', name: 'MultiversX', basePrice: 35 },
  { id: 'flow', symbol: 'flow', name: 'Flow', basePrice: 0.7 },
]

// 扩展到100个币种
const generateAdditionalCoins = () => {
  const additional = []
  for (let i = CRYPTO_COINS.length; i < 100; i++) {
    additional.push({
      id: `coin-${i}`,
      symbol: `c${i}`,
      name: `Crypto ${i}`,
      basePrice: Math.random() * 1000 + 0.001,
    })
  }
  return additional
}

const ALL_COINS = [...CRYPTO_COINS, ...generateAdditionalCoins()]

class MockDataGenerator {
  private lastPriceUpdate: { [key: string]: number } = {}
  private priceHistory: { [key: string]: PriceHistoryPoint[] } = {}

  constructor() {
    // 初始化价格历史
    this.initializePriceHistory()
  }

  /**
   * 生成随机数，带有正态分布特征
   */
  private normalRandom(mean: number = 0, stdDev: number = 1): number {
    let u = 0,
      v = 0
    while (u === 0) u = Math.random() // 确保不为0
    while (v === 0) v = Math.random()

    const z0 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v)
    return z0 * stdDev + mean
  }

  /**
   * 生成价格变化，模拟真实的市场波动
   */
  private generatePriceChange(
    currentPrice: number,
    baseVolatility: number = 0.05
  ): number {
    // 使用正态分布生成价格变化
    const change = this.normalRandom(0, baseVolatility)
    // 添加一些趋势性（偶尔的大涨大跌）
    const trendFactor = Math.random() < 0.05 ? this.normalRandom(0, 0.15) : 0

    return currentPrice * (1 + change + trendFactor)
  }

  /**
   * 生成市场数据 - 100个加密货币
   */
  generateMarketData(): CoinData[] {
    const now = new Date()

    return ALL_COINS.map((coinInfo, index) => {
      const currentPrice =
        this.lastPriceUpdate[coinInfo.id] || coinInfo.basePrice
      const newPrice = this.generatePriceChange(currentPrice, 0.03)

      // 更新价格记录
      this.lastPriceUpdate[coinInfo.id] = newPrice

      // 计算24小时变化
      const change24h = (Math.random() - 0.5) * 0.2 // -10% 到 +10%
      const price24hAgo = newPrice / (1 + change24h)

      // 计算市场数据
      const marketCap =
        (newPrice * (1000000 + Math.random() * 100000000) * (101 - index)) / 100
      const totalVolume = marketCap * (0.02 + Math.random() * 0.1)

      const high24h = newPrice * (1 + Math.random() * 0.05)
      const low24h = newPrice * (1 - Math.random() * 0.05)

      // 生成7天价格数据用于sparkline
      const sparklinePrices = []
      let price = newPrice
      for (let i = 0; i < 7; i++) {
        price = this.generatePriceChange(price, 0.02)
        sparklinePrices.unshift(price)
      }

      const coinData: CoinData = {
        id: coinInfo.id,
        symbol: coinInfo.symbol,
        name: coinInfo.name,
        image: `https://coin-images.coingecko.com/coins/images/${index + 1}/small/${coinInfo.id}.png`,
        current_price: Number(newPrice.toFixed(6)),
        market_cap: Number(marketCap.toFixed(0)),
        market_cap_rank: index + 1,
        fully_diluted_valuation: marketCap * (1 + Math.random() * 0.2),
        total_volume: Number(totalVolume.toFixed(0)),
        high_24h: Number(high24h.toFixed(6)),
        low_24h: Number(low24h.toFixed(6)),
        price_change_24h: Number((newPrice - price24hAgo).toFixed(6)),
        price_change_percentage_24h: Number((change24h * 100).toFixed(2)),
        market_cap_change_24h: marketCap * change24h,
        market_cap_change_percentage_24h: Number((change24h * 100).toFixed(2)),
        circulating_supply: marketCap / newPrice,
        total_supply:
          Math.random() > 0.3
            ? (marketCap / newPrice) * (1 + Math.random() * 0.5)
            : null,
        max_supply:
          Math.random() > 0.5
            ? (marketCap / newPrice) * (1 + Math.random())
            : null,
        ath: Number((newPrice * (1 + Math.random() * 5)).toFixed(6)),
        ath_change_percentage: Number((-Math.random() * 80).toFixed(2)),
        ath_date: new Date(
          now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        atl: Number((newPrice * Math.random() * 0.1).toFixed(6)),
        atl_change_percentage: Number((Math.random() * 1000 + 100).toFixed(2)),
        atl_date: new Date(
          now.getTime() - Math.random() * 1000 * 24 * 60 * 60 * 1000
        ).toISOString(),
        last_updated: now.toISOString(),
        sparkline_in_7d: {
          price: sparklinePrices.map((p) => Number(p.toFixed(6))),
        },
      }

      return coinData
    })
  }

  /**
   * 初始化价格历史数据
   */
  private initializePriceHistory(): void {
    ALL_COINS.forEach((coin) => {
      const history: PriceHistoryPoint[] = []
      let price = coin.basePrice
      const now = Date.now()

      // 生成30天的历史数据，每小时一个点
      for (let i = 30 * 24; i >= 0; i--) {
        const timestamp = now - i * 60 * 60 * 1000
        price = this.generatePriceChange(price, 0.015)
        const marketCap = price * (1000000 + Math.random() * 100000000)

        history.push({
          timestamp,
          price: Number(price.toFixed(6)),
          market_cap: Number(marketCap.toFixed(0)),
          total_volume: Number(
            (marketCap * (0.02 + Math.random() * 0.08)).toFixed(0)
          ),
        })
      }

      this.priceHistory[coin.id] = history
    })
  }

  /**
   * 获取指定币种的价格历史
   */
  generatePriceHistory(
    coinId: string,
    timeRange: TimeRange = '7D'
  ): PriceHistoryPoint[] {
    const history = this.priceHistory[coinId] || []
    const now = Date.now()

    let hoursBack: number
    switch (timeRange) {
      case '1H':
        hoursBack = 1
        break
      case '1D':
        hoursBack = 24
        break
      case '7D':
        hoursBack = 24 * 7
        break
      case '30D':
        hoursBack = 24 * 30
        break
      case '90D':
        hoursBack = 24 * 90
        break
      case '1Y':
        hoursBack = 24 * 365
        break
      case 'ALL':
        hoursBack = 24 * 365 * 5
        break
      default:
        hoursBack = 24 * 7
    }

    const cutoffTime = now - hoursBack * 60 * 60 * 1000
    return history.filter((point) => point.timestamp >= cutoffTime)
  }

  /**
   * 生成K线图数据
   */
  generateCandlestickData(
    coinId: string,
    timeRange: TimeRange = '1D'
  ): CandlestickData[] {
    const priceHistory = this.generatePriceHistory(coinId, timeRange)
    const candlesticks: CandlestickData[] = []

    // 将价格历史数据转换为K线数据（每4小时一根K线）
    for (let i = 0; i < priceHistory.length - 4; i += 4) {
      const slice = priceHistory.slice(i, i + 4)
      const open = slice[0].price
      const close = slice[slice.length - 1].price
      const high = Math.max(...slice.map((p) => p.price))
      const low = Math.min(...slice.map((p) => p.price))
      const volume =
        slice.reduce((sum, p) => sum + p.total_volume, 0) / slice.length

      candlesticks.push({
        timestamp: slice[0].timestamp,
        open: Number(open.toFixed(6)),
        high: Number(high.toFixed(6)),
        low: Number(low.toFixed(6)),
        close: Number(close.toFixed(6)),
        volume: Number(volume.toFixed(0)),
      })
    }

    return candlesticks
  }

  /**
   * 生成市场统计数据
   */
  generateMarketStats(): MarketStats {
    const coins = this.generateMarketData()

    const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0)
    const totalVolume24h = coins.reduce(
      (sum, coin) => sum + coin.total_volume,
      0
    )

    const btcMarketCap = coins.find((c) => c.id === 'bitcoin')?.market_cap || 0
    const ethMarketCap = coins.find((c) => c.id === 'ethereum')?.market_cap || 0

    const btcDominance = (btcMarketCap / totalMarketCap) * 100
    const ethDominance = (ethMarketCap / totalMarketCap) * 100

    // 模拟24小时变化
    const marketCapChange24h = totalMarketCap * (Math.random() - 0.5) * 0.05
    const volumeChange24h = totalVolume24h * (Math.random() - 0.5) * 0.1

    return {
      totalMarketCap: Number(totalMarketCap.toFixed(0)),
      totalVolume24h: Number(totalVolume24h.toFixed(0)),
      marketCapChange24h: Number(marketCapChange24h.toFixed(0)),
      volumeChange24h: Number(volumeChange24h.toFixed(0)),
      btcDominance: Number(btcDominance.toFixed(2)),
      ethDominance: Number(ethDominance.toFixed(2)),
      activeCoins: coins.length,
      markets: 500 + Math.floor(Math.random() * 100),
      totalMarketCapChangePercentage24h: Number(
        ((marketCapChange24h / totalMarketCap) * 100).toFixed(2)
      ),
    }
  }

  /**
   * 更新现有币种的价格（模拟实时更新）
   */
  updatePrices(currentCoins: CoinData[]): CoinData[] {
    return currentCoins.map((coin) => {
      const newPrice = this.generatePriceChange(coin.current_price, 0.002) // 更小的波动
      const priceChange24h =
        newPrice - (coin.current_price - coin.price_change_24h)
      const changePercentage =
        (priceChange24h / (newPrice - priceChange24h)) * 100

      // 更新价格历史
      if (this.priceHistory[coin.id]) {
        this.priceHistory[coin.id].push({
          timestamp: Date.now(),
          price: newPrice,
          market_cap: coin.market_cap * (newPrice / coin.current_price),
          total_volume: coin.total_volume,
        })

        // 保持历史记录不超过30天
        if (this.priceHistory[coin.id].length > 30 * 24) {
          this.priceHistory[coin.id] = this.priceHistory[coin.id].slice(
            -30 * 24
          )
        }
      }

      return {
        ...coin,
        current_price: Number(newPrice.toFixed(6)),
        price_change_24h: Number(priceChange24h.toFixed(6)),
        price_change_percentage_24h: Number(changePercentage.toFixed(2)),
        market_cap: Number(
          (coin.market_cap * (newPrice / coin.current_price)).toFixed(0)
        ),
        last_updated: new Date().toISOString(),
      }
    })
  }

  /**
   * 生成示例投资组合
   */
  generateSamplePortfolio(): PortfolioHolding[] {
    const sampleHoldings = [
      { coinId: 'bitcoin', amount: 0.5, purchasePrice: 40000 },
      { coinId: 'ethereum', amount: 2, purchasePrice: 2200 },
      { coinId: 'binancecoin', amount: 5, purchasePrice: 280 },
      { coinId: 'solana', amount: 10, purchasePrice: 85 },
      { coinId: 'cardano', amount: 1000, purchasePrice: 0.45 },
    ]

    const coins = this.generateMarketData()

    return sampleHoldings
      .map((holding, index) => {
        const coin = coins.find((c) => c.id === holding.coinId)
        if (!coin) return null

        const currentValue = holding.amount * coin.current_price
        const purchaseValue = holding.amount * holding.purchasePrice
        const gainLoss = currentValue - purchaseValue
        const gainLossPercentage = (gainLoss / purchaseValue) * 100

        return {
          id: `holding-${index}`,
          coinId: holding.coinId,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.image,
          amount: holding.amount,
          purchasePrice: holding.purchasePrice,
          purchaseDate: new Date(
            Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000
          ).toISOString(),
          currentPrice: coin.current_price,
          currentValue: Number(currentValue.toFixed(2)),
          gainLoss: Number(gainLoss.toFixed(2)),
          gainLossPercentage: Number(gainLossPercentage.toFixed(2)),
          notes: index === 0 ? 'Long term hold' : undefined,
        }
      })
      .filter(Boolean) as PortfolioHolding[]
  }

  /**
   * 搜索币种
   */
  searchCoins(query: string, limit: number = 50): CoinData[] {
    const allCoins = this.generateMarketData()
    const searchTerm = query.toLowerCase()

    return allCoins
      .filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchTerm) ||
          coin.symbol.toLowerCase().includes(searchTerm) ||
          coin.id.toLowerCase().includes(searchTerm)
      )
      .slice(0, limit)
  }
}

// 导出单例实例
export const mockDataGenerator = new MockDataGenerator()
