import type { Metadata } from 'next'
import './globals.css'
import { ClientLayout } from './client-layout'

// SEO和元数据配置
export const metadata: Metadata = {
  title: {
    default: 'CryptoTracker Pro - 专业加密货币投资组合管理',
    template: '%s | CryptoTracker Pro',
  },
  description:
    '实时追踪加密货币价格，管理投资组合，分析市场趋势。支持100+主流币种，提供专业图表分析工具。',
  keywords: [
    '加密货币',
    '比特币',
    '以太坊',
    '投资组合',
    '价格追踪',
    '区块链',
    '数字货币',
    '加密资产管理',
  ],
  authors: [{ name: 'CryptoTracker Team' }],
  creator: 'CryptoTracker Pro',
  publisher: 'CryptoTracker Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://crypto-tracker-pro.vercel.app'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url:
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://crypto-tracker-pro.vercel.app',
    title: 'CryptoTracker Pro - 专业加密货币投资组合管理',
    description:
      '实时追踪加密货币价格，管理投资组合，分析市场趋势。支持100+主流币种，提供专业图表分析工具。',
    siteName: 'CryptoTracker Pro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CryptoTracker Pro - 加密货币投资组合管理',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CryptoTracker Pro - 专业加密货币投资组合管理',
    description: '实时追踪加密货币价格，管理投资组合，分析市场趋势。',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

// 根布局组件
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <ClientLayout>{children}</ClientLayout>
    </html>
  )
}
