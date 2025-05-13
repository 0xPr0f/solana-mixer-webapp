"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { Connection, type PublicKey, clusterApiUrl } from "@solana/web3.js"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"

interface WalletContextType {
  connected: boolean
  publicKey: PublicKey | null
  balance: number
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  connection: Connection
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  publicKey: null,
  balance: 0,
  connect: async () => {},
  disconnect: async () => {},
  connection: new Connection(clusterApiUrl("devnet")),
})

export const useWallet = () => useContext(WalletContext)

export const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [adapter, setAdapter] = useState<PhantomWalletAdapter | null>(null)
  const [balance, setBalance] = useState(0)
  const connection = new Connection(clusterApiUrl("devnet"))

  useEffect(() => {
    if (typeof window !== "undefined") {
      const phantomAdapter = new PhantomWalletAdapter()
      setAdapter(phantomAdapter)
    }
  }, [])

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey && connected) {
        try {
          const balance = await connection.getBalance(publicKey)
          setBalance(balance / 1000000000) // Convert lamports to SOL
        } catch (error) {
          console.error("Error fetching balance:", error)
        }
      }
    }

    fetchBalance()
    const intervalId = setInterval(fetchBalance, 10000) // Update balance every 10 seconds

    return () => clearInterval(intervalId)
  }, [publicKey, connected, connection])

  const connect = async () => {
    if (!adapter) return

    try {
      await adapter.connect()
      setConnected(true)
      setPublicKey(adapter.publicKey)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  const disconnect = async () => {
    if (!adapter) return

    try {
      await adapter.disconnect()
      setConnected(false)
      setPublicKey(null)
      setBalance(0)
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  return (
    <WalletContext.Provider value={{ connected, publicKey, balance, connect, disconnect, connection }}>
      {children}
    </WalletContext.Provider>
  )
}
