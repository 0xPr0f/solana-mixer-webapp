import { Navbar } from '@/components/navbar'
import { WalletContextProvider } from '@/components/wallet-provider'
import { Toaster } from '@/components/ui/toaster'
import { ModalProvider } from '@/components/modal-provider'
import Link from 'next/link'
import HomePage from './main-interface'

export default function Home() {
  return (
    <>
      <HomePage />
    </>
  )
}
