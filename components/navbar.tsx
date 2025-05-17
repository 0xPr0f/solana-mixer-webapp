'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useWallet } from './wallet-provider'
import { Button } from '@/components/ui/button'
import { Settings, FileText, Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export function Navbar() {
  const { connected, publicKey, balance, connect, disconnect } = useWallet()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-teal-400 flex items-center justify-center animate-pulse-slow">
                <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-600 to-teal-400"></div>
                </div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400">
                Solana Mixer
              </span>
            </Link>

            <div className="hidden md:flex ml-10 space-x-8">
              <Link
                href="https://github.com/2kcmte/solana-mixer-core"
                className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium flex items-center transition-colors"
              >
                <FileText className="w-4 h-4 mr-1" /> Docs
              </Link>
            </div>
          </div>
          {/*
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              className="border-primary hover:bg-primary/10 transition-colors"
              onClick={connected ? disconnect : connect}
            >
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 rounded-full solana-gradient-bg"></div>
                {connected ? (
                  <span>
                    {publicKey?.toString().slice(0, 4) + "..." + publicKey?.toString().slice(-4)} ({balance.toFixed(2)}{" "}
                    SOL)
                  </span>
                ) : (
                  "Connect Wallet"
                )}
              </div>
            </Button>

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            )}

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
*/}
          <div className="flex items-center gap-3">
            <div className="wallet-adapter-dropdown">
              <WalletMultiButton className="wallet-adapter-button wallet-adapter-button-trigger bg-gradient-to-r from-purple-600 to-teal-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] text-white border border-border/50 rounded-md px-4 py-2 font-medium transition-all duration-300 transform hover:-translate-y-1" />
            </div>

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground min-w-10 h-10 flex items-center justify-center"
                aria-label={
                  theme === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                }
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            )}

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="ml-1"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="https://github.com/2kcmte/solana-mixer-core"
              className="text-muted-foreground hover:text-foreground  px-3 py-2 text-base font-medium flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" /> Docs
            </Link>
            {/*}
            <Button
              variant="outline"
              className="w-full border-primary hover:bg-primary/10 mt-2"
              onClick={connected ? disconnect : connect}
            >
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 rounded-full solana-gradient-bg"></div>
                {connected ? (
                  <span>
                    {publicKey?.toString().slice(0, 4) +
                      '...' +
                      publicKey?.toString().slice(-4)}{' '}
                    ({balance.toFixed(2)} SOL)
                  </span>
                ) : (
                  'Connect Wallet'
                )}
              </div>
            </Button> */}
            <div className="wallet-adapter-dropdown">
              <WalletMultiButton className="wallet-adapter-button wallet-adapter-button-trigger bg-gradient-to-r from-purple-600 to-teal-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] text-white border border-border/50 rounded-md px-4 py-2 font-medium transition-all duration-300 transform hover:-translate-y-1" />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
