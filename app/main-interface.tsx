'use client'

import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Lock, Zap, GitMerge, Leaf, Code } from 'lucide-react'

export default function HomePage() {
  const { setTheme } = useTheme()

  // Force dark theme
  useEffect(() => {
    setTheme('dark')
  }, [setTheme])

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-purple-900/30 blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-teal-900/30 blur-3xl animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute top-40 right-1/3 w-48 h-48 rounded-full bg-blue-900/30 blur-3xl animate-pulse-slow animation-delay-1000"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
          <div className="mb-8 relative">
            <div className="w-24 h-24 md:w-28 md:h-28 mx-auto relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-teal-400 opacity-20 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-600 to-teal-400 opacity-40"></div>
              <div className="absolute inset-4 rounded-full bg-black"></div>
              <div className="absolute inset-6 rounded-full bg-gradient-to-br from-purple-600 to-teal-400"></div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400">
              Solana Mixer
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-10 leading-relaxed">
            A privacy-preserving, fixed-denomination mixer on Solana,
            implemented in Anchor and verified with Succinct SP1.
          </p>

          <Link href="/app">
            <Button className="bg-gradient-to-r from-purple-600 to-teal-400 text-white px-8 py-6 text-lg font-medium rounded-lg hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all duration-300 transform hover:-translate-y-1">
              Launch App
            </Button>
          </Link>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            fill="none"
            className="w-full"
          >
            <path
              d="M0,96L60,80C120,64,240,32,360,24C480,16,600,32,720,48C840,64,960,80,1080,80C1200,80,1320,64,1380,56L1440,48L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
              fill="#111111"
            />
          </svg>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-400">
                Overview
              </span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              The Solana Mixer is a zero-knowledge privacy solution that allows
              users to deposit and withdraw SOL while maintaining anonymity. It
              uses a combination of cryptographic primitives to ensure that
              deposits and withdrawals cannot be linked.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#0a0a0a] rounded-xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] group">
              <div className="mb-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-teal-400 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <GitMerge className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-400">
                Merkle Tree Structure
              </h3>
              <p className="text-gray-300">
                Poseidon-hashed Merkle tree with depth 20 and a 33-root history
                buffer, supporting up to 2²⁰ deposits.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0a0a0a] rounded-xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] group">
              <div className="mb-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-teal-400 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-400">
                Zero-Knowledge Proofs
              </h3>
              <p className="text-gray-300">
                Uses Succinct SP1-generated Groth16 proofs for unlinking deposit
                and withdrawal addresses in a single on-chain instruction.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0a0a0a] rounded-xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] group">
              <div className="mb-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-teal-400 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-400">
                Fixed Denomination
              </h3>
              <p className="text-gray-300">
                Configurable deposit amount (e.g., 1 SOL) ensures transactional
                uniformity, enhancing the anonymity set.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-black relative">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-900/30 blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-teal-900/30 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-400">
                How It Works
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="relative mx-auto max-w-md">
                <div className="w-full aspect-square bg-[#0a0a0a] rounded-xl p-4 border border-gray-800 shadow-[0_0_25px_rgba(0,0,0,0.3)]">
                  <svg
                    viewBox="0 0 400 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    {/* Merkle Tree Visualization */}
                    {/* Root */}
                    <circle
                      cx="200"
                      cy="50"
                      r="15"
                      fill="url(#solanaGradient)"
                      className="animate-pulse-slow"
                    />
                    <text
                      x="200"
                      y="55"
                      textAnchor="middle"
                      fontSize="10"
                      fill="white"
                    >
                      Root
                    </text>

                    {/* Level 1 */}
                    <line
                      x1="200"
                      y1="65"
                      x2="150"
                      y2="95"
                      stroke="url(#solanaGradient)"
                      strokeWidth="2"
                    />
                    <line
                      x1="200"
                      y1="65"
                      x2="250"
                      y2="95"
                      stroke="url(#solanaGradient)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="150"
                      cy="100"
                      r="12"
                      fill="#222"
                      stroke="url(#solanaGradient)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="250"
                      cy="100"
                      r="12"
                      fill="#222"
                      stroke="url(#solanaGradient)"
                      strokeWidth="2"
                    />

                    {/* Level 2 */}
                    <line
                      x1="150"
                      y1="112"
                      x2="125"
                      y2="142"
                      stroke="url(#solanaGradient)"
                      strokeWidth="2"
                    />
                    <line
                      x1="150"
                      y1="112"
                      x2="175"
                      y2="142"
                      stroke="url(#solanaGradient)"
                      strokeWidth="2"
                    />
                    <line
                      x1="250"
                      y1="112"
                      x2="225"
                      y2="142"
                      stroke="url(#solanaGradient)"
                      strokeWidth="2"
                    />
                    <line
                      x1="250"
                      y1="112"
                      x2="275"
                      y2="142"
                      stroke="url(#solanaGradient)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="125"
                      cy="150"
                      r="10"
                      fill="#222"
                      stroke="url(#solanaGradient)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="175"
                      cy="150"
                      r="10"
                      fill="#222"
                      stroke="url(#solanaGradient)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="225"
                      cy="150"
                      r="10"
                      fill="#222"
                      stroke="url(#solanaGradient)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="275"
                      cy="150"
                      r="10"
                      fill="#222"
                      stroke="url(#solanaGradient)"
                      strokeWidth="2"
                    />

                    <line
                      x1="125"
                      y1="160"
                      x2="115"
                      y2="185"
                      stroke="url(#solanaGradient)"
                      strokeWidth="1"
                      strokeDasharray="2"
                    />
                    <line
                      x1="125"
                      y1="160"
                      x2="135"
                      y2="185"
                      stroke="url(#solanaGradient)"
                      strokeWidth="1"
                      strokeDasharray="2"
                    />
                    <line
                      x1="175"
                      y1="160"
                      x2="165"
                      y2="185"
                      stroke="url(#solanaGradient)"
                      strokeWidth="1"
                      strokeDasharray="2"
                    />
                    <line
                      x1="175"
                      y1="160"
                      x2="185"
                      y2="185"
                      stroke="url(#solanaGradient)"
                      strokeWidth="1"
                      strokeDasharray="2"
                    />
                    <line
                      x1="225"
                      y1="160"
                      x2="215"
                      y2="185"
                      stroke="url(#solanaGradient)"
                      strokeWidth="1"
                      strokeDasharray="2"
                    />
                    <line
                      x1="225"
                      y1="160"
                      x2="235"
                      y2="185"
                      stroke="url(#solanaGradient)"
                      strokeWidth="1"
                      strokeDasharray="2"
                    />
                    <line
                      x1="275"
                      y1="160"
                      x2="265"
                      y2="185"
                      stroke="url(#solanaGradient)"
                      strokeWidth="1"
                      strokeDasharray="2"
                    />
                    <line
                      x1="275"
                      y1="160"
                      x2="285"
                      y2="185"
                      stroke="url(#solanaGradient)"
                      strokeWidth="1"
                      strokeDasharray="2"
                    />

                    {/* Leaves (level 20 implied) */}
                    <text
                      x="200"
                      y="220"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#888"
                    >
                      . . .
                    </text>
                    <text
                      x="200"
                      y="240"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#888"
                    >
                      Depth 20
                    </text>

                    {/* Deposits at the bottom */}
                    <rect
                      x="80"
                      y="280"
                      width="240"
                      height="50"
                      rx="6"
                      fill="#111"
                      stroke="url(#solanaGradient)"
                      strokeWidth="2"
                    />
                    <text
                      x="200"
                      y="310"
                      textAnchor="middle"
                      fontSize="12"
                      fill="url(#solanaGradient)"
                    >
                      2²⁰ Deposits
                    </text>

                    {/* Buffer Visualization */}
                    <rect
                      x="320"
                      y="50"
                      width="40"
                      height="200"
                      rx="6"
                      fill="#111"
                      stroke="url(#solanaGradient)"
                      strokeWidth="2"
                    />
                    <text
                      x="340"
                      y="180"
                      textAnchor="middle"
                      fontSize="10"
                      fill="url(#solanaGradient)"
                      transform="rotate(-90, 340, 180)"
                    >
                      33-Root History Buffer
                    </text>

                    <defs>
                      <linearGradient
                        id="solanaGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#9945FF" />
                        <stop offset="100%" stopColor="#14F195" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-6">
              <div className="p-6 bg-[#0a0a0a] rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-teal-400 flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-400">
                    Deposit
                  </span>
                </h3>
                <p className="text-gray-300 ml-14">
                  Users deposit a fixed amount (e.g., 1 SOL) and submit a
                  commitment that is added to the Merkle tree.
                </p>
              </div>

              <div className="p-6 bg-[#0a0a0a] rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-teal-400 flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-400">
                    Generate Proof
                  </span>
                </h3>
                <p className="text-gray-300 ml-14">
                  A zero-knowledge proof is generated off-chain using SP1,
                  proving knowledge of a deposit without revealing which one.
                </p>
              </div>

              <div className="p-6 bg-[#0a0a0a] rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-teal-400 flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-400">
                    Withdraw
                  </span>
                </h3>
                <p className="text-gray-300 ml-14">
                  The proof is verified on-chain, confirming Merkle tree
                  inclusion and nullifier uniqueness before processing the
                  withdrawal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-400">
                Technical Details
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-[#0a0a0a] rounded-xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]">
              <h3 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-400">
                Implementation
              </h3>
              <div className="flex items-start mb-5">
                <Code className="h-6 w-6 text-purple-400 mr-4 mt-1 flex-shrink-0" />
                <span className="text-gray-300">Rust + Anchor framework</span>
              </div>
              <div className="flex items-start mb-5">
                <GitMerge className="h-6 w-6 text-purple-400 mr-4 mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Poseidon-hashed Merkle tree (depth 20)
                </span>
              </div>
              <div className="flex items-start">
                <Leaf className="h-6 w-6 text-purple-400 mr-4 mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  33-root history buffer to ensure root validity
                </span>
              </div>
            </div>

            <div className="bg-[#0a0a0a] rounded-xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]">
              <h3 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-400">
                Smart Contract Functions
              </h3>
              <div className="space-y-4 text-gray-300 font-mono text-sm">
                <div className="p-4 bg-black rounded-lg border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
                  <span className="text-purple-400">initialize</span>
                  <span className="text-gray-500">(deposit_amount)</span>
                </div>
                <div className="p-4 bg-black rounded-lg border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
                  <span className="text-purple-400">deposit</span>
                  <span className="text-gray-500">(commitment)</span>
                </div>
                <div className="p-4 bg-black rounded-lg border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
                  <span className="text-purple-400">withdraw</span>
                  <span className="text-gray-500">(proof, public_inputs)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 bg-black relative">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-purple-900/30 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-teal-900/30 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-400">
                Security Considerations
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 bg-[#0a0a0a] rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] group">
              <div className="mb-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-teal-400 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Lock className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold mb-3 text-lg">On-Chain Verification</h3>
              <p className="text-gray-300">
                All cryptographic operations are performed on-chain, ensuring
                complete verification of proofs.
              </p>
            </div>

            <div className="p-8 bg-[#0a0a0a] rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] group">
              <div className="mb-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-teal-400 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold mb-3 text-lg">Nullifier System</h3>
              <p className="text-gray-300">
                Prevents double-spending by ensuring each deposit can only be
                withdrawn once.
              </p>
            </div>

            <div className="p-8 bg-[#0a0a0a] rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] group">
              <div className="mb-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-teal-400 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <GitMerge className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold mb-3 text-lg">Root History</h3>
              <p className="text-gray-300">
                33-root history buffer maintains record of previous valid roots
                for withdrawal verification.
              </p>
            </div>

            <div className="p-8 bg-[#0a0a0a] rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] group">
              <div className="mb-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-teal-400 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold mb-3 text-lg">Poseidon Hash</h3>
              <p className="text-gray-300">
                Optimized for zero-knowledge proof efficiency with strong
                cryptographic guarantees.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-[#111111] to-black relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-purple-900/20 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-teal-900/20 blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              Ready to experience financial{' '}
              <span className="solana-gradient-text">privacy</span>?
            </h2>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
              Built with Rust, powered by Solana, secured by succinct
              zero-knowledge proofs.
            </p>

            <Link href="/app">
              <Button className="solana-gradient-bg text-white px-10 py-7 text-xl rounded-lg hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1">
                Go to App
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full solana-gradient-bg flex items-center justify-center mr-2">
                <div className="w-4 h-4 rounded-full bg-black"></div>
              </div>
              <span className="solana-gradient-text font-bold">
                Solana Mixer
              </span>
            </div>

            <div className="text-gray-500 text-sm">
              Built by 0xpr0f © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
