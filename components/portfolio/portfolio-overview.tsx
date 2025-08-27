'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/dashboard/stat-card'
import {
  DashboardGrid,
  GridSection,
} from '@/components/dashboard/dashboard-grid'
import { usePortfolio } from '@/hooks/useMockData'
import { useMarketData } from '@/hooks/useMockData'
import { useSettingsStore } from '@/lib/store/settings-store'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Activity,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function PortfolioOverview() {
  const { portfolio, portfolioValue } = usePortfolio()
  const { data: marketData } = useMarketData()
  const { getFormattedPrice } = useSettingsStore()

  // 计算投资组合统计
  const portfolioStats = useMemo(() => {
    if (Object.keys(portfolio).length === 0) {
      return {
        totalInvested: 0,
        currentValue: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        bestPerformer: null,
        worstPerformer: null,
        totalCoins: 0,
        diversificationScore: 0,
      }
    }

    let totalInvested = 0
    let currentValue = 0
    let bestGain = -Infinity
    let worstGain = Infinity
    let bestPerformer = null
    let worstPerformer = null

    const holdings = Object.entries(portfolio)
      .map(([coinId, holding]) => {
        const coin = marketData.find((c) => c.id === coinId)
        if (!coin) return null

        const invested = holding.purchasePrice * holding.amount
        const current = coin.current_price * holding.amount
        const gainLoss = current - invested
        const gainLossPercent = (gainLoss / invested) * 100

        totalInvested += invested
        currentValue += current

        if (gainLossPercent > bestGain) {
          bestGain = gainLossPercent
          bestPerformer = { coin, gainLossPercent, gainLoss }
        }

        if (gainLossPercent < worstGain) {
          worstGain = gainLossPercent
          worstPerformer = { coin, gainLossPercent, gainLoss }
        }

        return {
          coinId,
          coin,
          holding,
          invested,
          current,
          gainLoss,
          gainLossPercent,
          weight: (current / portfolioValue) * 100,
        }
      })
      .filter(Boolean)

    // 计算多样化评分 (基于持仓权重的分散程度)
    const weights = holdings.map((h) => h!.weight)
    const diversificationScore =
      weights.length > 0
        ? Math.max(
            0,
            100 - (weights.reduce((sum, w) => sum + w * w, 0) / 100) * 100
          )
        : 0

    return {
      totalInvested,
      currentValue,
      totalGainLoss: currentValue - totalInvested,
      totalGainLossPercent:
        totalInvested > 0
          ? ((currentValue - totalInvested) / totalInvested) * 100
          : 0,
      bestPerformer,
      worstPerformer,
      totalCoins: holdings.length,
      diversificationScore,
      holdings,
    }
  }, [portfolio, marketData, portfolioValue])

  const hasPortfolio = Object.keys(portfolio).length > 0

  if (!hasPortfolio) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <PieChart className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">开始构建您的投资组合</h3>
          <p className="text-muted-foreground text-center max-w-md">
            添加您的第一笔加密货币投资，开始追踪收益和分析表现
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardGrid>
      {/* 主要统计数据 */}
      <GridSection>
        <StatCard
          title="投资组合总价值"
          value={getFormattedPrice(portfolioStats.currentValue)}
          change={{
            value: portfolioStats.totalGainLossPercent,
            label: '总收益',
            positive: portfolioStats.totalGainLoss >= 0,
          }}
          icon={DollarSign}
        />

        <StatCard
          title="总投入成本"
          value={getFormattedPrice(portfolioStats.totalInvested)}
          description="累计投资金额"
          icon={Target}
        />

        <StatCard
          title="总盈亏"
          value={getFormattedPrice(Math.abs(portfolioStats.totalGainLoss))}
          change={{
            value: portfolioStats.totalGainLossPercent,
            label: '收益率',
            positive: portfolioStats.totalGainLoss >= 0,
          }}
          icon={portfolioStats.totalGainLoss >= 0 ? TrendingUp : TrendingDown}
        />

        <StatCard
          title="持仓币种"
          value={portfolioStats.totalCoins}
          description="多样化投资"
          badge={{
            text: `${Math.round(portfolioStats.diversificationScore)}分`,
            variant:
              portfolioStats.diversificationScore > 70 ? 'default' : 'outline',
          }}
          icon={PieChart}
        />
      </GridSection>

      {/* 表现最佳和最差 */}
      {portfolioStats.bestPerformer && portfolioStats.worstPerformer && (
        <GridSection className="grid-cols-1 lg:grid-cols-2">
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-600">
                <TrendingUp className="h-4 w-4" />
                表现最佳
              </CardTitle>
            </CardHeader>
            <CardContent>
              {portfolioStats.bestPerformer ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {
                        (
                          portfolioStats.bestPerformer as {
                            coin: { name: string }
                          }
                        )?.coin?.name
                      }
                    </p>
                    <p className="text-sm text-muted-foreground uppercase">
                      {
                        (
                          portfolioStats.bestPerformer as {
                            coin: { symbol: string }
                          }
                        )?.coin?.symbol
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      +
                      {(
                        portfolioStats.bestPerformer as {
                          gainLossPercent: number
                        }
                      )?.gainLossPercent?.toFixed(2)}
                      %
                    </p>
                    <p className="text-sm text-green-600">
                      +
                      {getFormattedPrice(
                        (portfolioStats.bestPerformer as { gainLoss: number })
                          ?.gainLoss || 0
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  暂无数据
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-red-600">
                <TrendingDown className="h-4 w-4" />
                表现最差
              </CardTitle>
            </CardHeader>
            <CardContent>
              {portfolioStats.worstPerformer ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {
                        (
                          portfolioStats.worstPerformer as {
                            coin: { name: string }
                          }
                        )?.coin?.name
                      }
                    </p>
                    <p className="text-sm text-muted-foreground uppercase">
                      {
                        (
                          portfolioStats.worstPerformer as {
                            coin: { symbol: string }
                          }
                        )?.coin?.symbol
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      {(
                        portfolioStats.worstPerformer as {
                          gainLossPercent: number
                        }
                      )?.gainLossPercent?.toFixed(2)}
                      %
                    </p>
                    <p className="text-sm text-red-600">
                      {getFormattedPrice(
                        (portfolioStats.worstPerformer as { gainLoss: number })
                          ?.gainLoss || 0
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  暂无数据
                </p>
              )}
            </CardContent>
          </Card>
        </GridSection>
      )}

      {/* 持仓分布 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            持仓分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolioStats.holdings?.map((holding) => (
              <div
                key={holding!.coinId}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {holding!.coin.symbol.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{holding!.coin.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {holding!.holding.amount}{' '}
                      {holding!.coin.symbol.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium">
                    {getFormattedPrice(holding!.current)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        holding!.gainLoss >= 0 ? 'default' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {holding!.gainLoss >= 0 ? '+' : ''}
                      {holding!.gainLossPercent.toFixed(1)}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {holding!.weight.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* 权重进度条 */}
                <div className="w-16 ml-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={cn(
                        'h-2 rounded-full transition-all duration-300',
                        holding!.gainLoss >= 0 ? 'bg-green-500' : 'bg-red-500'
                      )}
                      style={{
                        width: `${Math.min(100, holding!.weight * 2)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 投资建议 */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">投资组合建议</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {portfolioStats.diversificationScore > 80
                    ? '您的投资组合分散度很好，风险控制良好。'
                    : portfolioStats.diversificationScore > 60
                      ? '考虑增加更多不同币种以提高分散度。'
                      : '投资组合过于集中，建议分散投资降低风险。'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardGrid>
  )
}
