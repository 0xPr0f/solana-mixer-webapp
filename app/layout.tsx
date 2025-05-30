import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { WalletContextProvider } from '@/hooks/wallet-context-provider'
import Cover from './cover'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Solana Mixer',
  description: 'Privacy-focused mixer application for Solana',
  icons: './mixer-logo.png',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <WalletContextProvider>
            <Cover>{children}</Cover>
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
