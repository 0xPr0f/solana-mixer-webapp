'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AmountSlider } from '@/components/amount-slider'
import { Info, Copy, Check, AlertTriangle, ArrowDownToLine } from 'lucide-react'
import { ModalProvider, useModal } from '@/components/modal-provider'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import NodeWallet from '@coral-xyz/anchor'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import {
  deserializeNote,
  generateProofForWithdrawal,
  handleCreateNote,
} from '@/server/handle-interaction'
import { DEVNET_RPC_URL, MIXER_PROGRAM_PUBKEY_1SOL } from '@/server/constants'
import MixerIdl from '@/server/mixer-program.json'
import type { SolanaMixer } from '@/server/mixer-abi'
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  ComputeBudgetProgram,
  Connection,
} from '@solana/web3.js'
import * as borsh from '@coral-xyz/borsh'
import { fetchDepositList } from '@/components/deposit-fetch'
import { WalletContextProvider } from '@/components/wallet-provider'
import { Toaster } from '@/components/ui/toaster'
import { Navbar } from '@/components/navbar'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { getSigner } from '@/server/privatekey'

export default function MainInterface() {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()
  const { toast } = useToast()
  const [provider, setProvider] = useState<AnchorProvider | null>(null)
  const [program, setProgram] = useState<Program<SolanaMixer> | null>(null)
  const [note, setNote] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [deposits, setDeposits] = useState<{ id: string; time: string }[]>([])
  const [loading, setLoading] = useState({
    withdraw: false,
    deposit: false,
  })
  useEffect(() => {
    const fallbackRpcUrl = DEVNET_RPC_URL
    fetchDepositList(
      connection.rpcEndpoint ?? fallbackRpcUrl,
      MIXER_PROGRAM_PUBKEY_1SOL
    ).then((deposits) => {
      setDeposits(deposits)
    })
  }, [loading])

  useEffect(() => {
    if (loading.deposit || loading.withdraw) {
      toast({
        title: 'Generating Proof',
        description:
          'Please wait while the proof is generated, This may take some time',
      })
    }
  }, [loading.deposit, loading.withdraw])

  useEffect(() => {
    if (!wallet) return
    const p = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    })
    setProvider(p)
    setProgram(new Program<SolanaMixer>(MixerIdl, p))
  }, [wallet, connection])

  const depositOnChain = useCallback(
    async (commitment: Uint8Array) => {
      if (!program || !wallet) throw new Error('Wallet not ready')
      const [statePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('mixer_state')],
        new PublicKey(MIXER_PROGRAM_PUBKEY_1SOL)
      )
      const additionalComputeBudgetInstruction =
        ComputeBudgetProgram.setComputeUnitLimit({
          units: 555555,
        })
      await program.methods
        .deposit([...commitment])
        .accounts({
          depositor: wallet.publicKey,
        })
        .preInstructions([additionalComputeBudgetInstruction])
        .rpc()
    },
    [program, wallet]
  )

  const [amount, setAmount] = useState(1)
  const [token, setToken] = useState('SOL')
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit')
  const { openModal, closeModal } = useModal()

  const amountSteps = [{ value: 1, label: '1 SOL' }]

  const handleAmountChange = (value: number) => setAmount(value)

  const handleDeposit = async () => {
    if (!wallet) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
      })
      return
    }
    const balanceInLamports = await connection.getBalance(wallet.publicKey)
    const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL

    if (balanceInSOL < amount) {
      toast({
        title: 'Error',
        description: 'Insufficient balance',
      })
      return
    }
    openModal(DepositModalContent, 'Your private note', {
      token,
      amount,
      onClose: closeModal,
      depositOnChain,
    })
  }

  const WithdrawFundsFromMixer = async ({
    note,
    recipientAddress,
  }: {
    note: string
    recipientAddress: string
  }) => {
    console.log('Withdraw implemented', note, recipientAddress)
    if (!program || !wallet) throw new Error('Wallet not ready')
    setLoading({ ...loading, withdraw: true })

    const noteDetails = await deserializeNote(
      note,
      new PublicKey(MIXER_PROGRAM_PUBKEY_1SOL).toBase58() ??
        MIXER_PROGRAM_PUBKEY_1SOL
    )
    const newKeypair = Keypair.generate()
    const relayerPublicKey = newKeypair.publicKey
    console.log(noteDetails)
    let proof_bytes: Uint8Array = new Uint8Array()
    let public_inputs: Uint8Array = new Uint8Array()

    try {
      const result = await generateProofForWithdrawal(
        noteDetails.nullifier_str,
        noteDetails.secret_str,
        connection.rpcEndpoint,
        new PublicKey(MIXER_PROGRAM_PUBKEY_1SOL).toBase58() ??
          MIXER_PROGRAM_PUBKEY_1SOL,
        recipientAddress,
        recipientAddress
      )
      proof_bytes = new Uint8Array(result.proof_bytes)
      public_inputs = new Uint8Array(result.public_inputs)

      const accountInfo = await connection.getAccountInfo(
        new PublicKey(MIXER_PROGRAM_PUBKEY_1SOL)
      )

      console.log(
        'Proof Bytes: ' + proof_bytes,
        '\nPublic Inputs ' + public_inputs,
        '\nPublic Root for check Should be Current Root ' +
          public_inputs.slice(0, 32)
      )
    } catch (e) {
      console.error('withdraw proof error', e)
      setLoading({ ...loading, withdraw: false })
    }

    const proofBuf = Buffer.from(proof_bytes)
    const publicInputsBuf = Buffer.from(public_inputs)
    const nullifierBuf = public_inputs.slice(32, 64)
    if (!(proofBuf.length > 0 && publicInputsBuf.length > 0)) return

    const additionalComputeBudgetInstruction =
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 555555,
      })

    try {
      const tempconnection = new Connection(DEVNET_RPC_URL, {
        commitment: 'confirmed',
      })
      const tempSigner = await getSigner()
      const wallet = {
        publicKey: tempSigner.publicKey,
        signTransaction: async (tx: any) => {
          tx.partialSign(tempSigner)
          return tx
        },
        signAllTransactions: async (txs: any) => {
          txs.forEach((tx: any) => tx.partialSign(tempSigner))
          return txs
        },
        payer: tempSigner,
      }
      const tempprovider = new AnchorProvider(tempconnection, wallet, {
        commitment: 'confirmed',
      })
      const tempprogram = new Program<SolanaMixer>(MixerIdl, tempprovider)
      await tempprogram.methods
        .withdraw([...nullifierBuf], proofBuf, publicInputsBuf)
        .accounts({
          caller: wallet.publicKey,
          recipient: new PublicKey(recipientAddress),
          relayer: new PublicKey(recipientAddress),
        })
        .preInstructions([additionalComputeBudgetInstruction])
        .rpc()
        .then(() => {
          toast({
            title: 'Withdrawal successful',
            description: 'Your funds have been withdrawn',
          })
        })
        .catch((e) => {
          console.error('withdraw error', e)
          setLoading({ ...loading, withdraw: false })
        })
    } catch (e) {
      console.error('withdraw error', e)
      setLoading({ ...loading, withdraw: false })
    }
    setLoading({ ...loading, withdraw: false })
  }

  return (
    <div className="page-container bg-gradient-to-b from-background to-background/80">
      <WalletContextProvider>
        <TooltipProvider>
          <ModalProvider>
            <Navbar />
            <div className="main-content py-8">
              <div className="max-w-5xl w-full px-4 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3">
                    <div className="relative">
                      <div className="flex">
                        <div
                          className={`relative cursor-pointer py-3 px-6 text-center font-medium z-10 ${
                            activeTab === 'deposit'
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                              : 'bg-background/80 text-muted-foreground hover:text-foreground'
                          }`}
                          style={{
                            clipPath: 'polygon(0 0, 90% 0, 100% 100%, 0 100%)',
                            width: '50%',
                          }}
                          onClick={() => setActiveTab('deposit')}
                        >
                          Deposit
                        </div>
                        <div
                          className={`relative cursor-pointer py-3 px-6 text-center font-medium z-10 -ml-4 ${
                            activeTab === 'withdraw'
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                              : 'bg-background/80 text-muted-foreground hover:text-foreground'
                          }`}
                          style={{
                            clipPath:
                              'polygon(10% 0, 100% 0, 100% 100%, 0 100%)',
                            width: '50%',
                          }}
                          onClick={() => setActiveTab('withdraw')}
                        >
                          Withdraw
                        </div>
                      </div>

                      <Card className="border border-purple-500/20 rounded-t-none rounded-b-lg shadow-lg shadow-purple-500/5">
                        {activeTab === 'deposit' ? (
                          <div className="p-6 space-y-5">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-muted-foreground">
                                Token
                              </label>
                              <Select value={token} onValueChange={setToken}>
                                <SelectTrigger className="w-full bg-background/50 border border-purple-500/20">
                                  <SelectValue placeholder="Select token" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SOL">SOL</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-muted-foreground">
                                  Amount
                                </label>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center text-xs text-purple-400">
                                      <Info className="w-3 h-3 mr-1" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="left"
                                    align="center"
                                    className="bg-background/90 border border-purple-500/20"
                                  >
                                    <span>The denominator to deposit</span>
                                    <br />
                                    <span>Currently only 1 SOL</span>
                                  </TooltipContent>
                                </Tooltip>
                              </div>

                              <AmountSlider
                                value={amount}
                                onChange={handleAmountChange}
                                steps={amountSteps}
                              />
                            </div>

                            <Button
                              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white font-medium py-5 rounded-md"
                              onClick={handleDeposit}
                            >
                              {wallet ? 'Deposit' : 'Connect'}
                            </Button>
                          </div>
                        ) : (
                          <div className="p-6 space-y-5">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-muted-foreground">
                                Note
                              </label>

                              <textarea
                                placeholder="Please enter your note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="font-mono text-sm bg-background/50 w-full p-3 rounded-md border border-purple-500/20 resize-y min-h-[80px]"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-muted-foreground">
                                Recipient Address
                              </label>

                              <Input
                                placeholder="Please paste address here"
                                value={recipientAddress}
                                onChange={(e) =>
                                  setRecipientAddress(e.target.value)
                                }
                                className="font-mono text-sm bg-background/50 border-purple-500/20"
                              />
                            </div>

                            <Button
                              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white font-medium py-5 rounded-md"
                              onClick={() => {
                                if (note && recipientAddress) {
                                  WithdrawFundsFromMixer({
                                    note: note,
                                    recipientAddress: recipientAddress,
                                  })
                                } else {
                                  toast({
                                    title: 'Error',
                                    description:
                                      'Please enter a note and recipient address',
                                  })
                                }
                              }}
                            >
                              {wallet ? (
                                <>
                                  {loading.withdraw && (
                                    <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  )}
                                  Withdraw
                                </>
                              ) : (
                                'Connect'
                              )}
                            </Button>
                          </div>
                        )}
                      </Card>
                    </div>
                  </div>

                  {/* Right pane */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                        Statistics
                      </h2>
                      <div className="bg-background/50 border border-purple-500/20 rounded-full px-3 py-1 text-xs flex items-center">
                        <span className="text-purple-500">{amount} SOL</span>
                      </div>
                    </div>

                    <Card className="border border-purple-500/20 rounded-lg shadow-lg shadow-purple-500/5">
                      <div className="p-6 space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-muted-foreground text-sm">
                              Anonymity set
                            </span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="ml-2 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xs text-white font-bold">
                                  ?
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                align="center"
                                className="bg-background/90 border border-purple-500/20"
                              >
                                <span>The number of deposits</span>
                                <br />
                                <span>in the set from which your </span>
                                <br />
                                <span>withdrawal might originate</span>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>

                        <div className="text-lg font-bold">
                          {deposits.length} equal user deposits
                        </div>

                        <div>
                          <h3 className="text-muted-foreground text-sm mb-2">
                            Latest deposits
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {deposits.map((deposit) => (
                              <div
                                key={deposit.id}
                                className="bg-background/50 border border-purple-500/20 rounded p-2 text-xs"
                              >
                                <div className="flex justify-between">
                                  <span>{deposit.id}</span>
                                  <span className="text-muted-foreground">
                                    {deposit.time}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
            <footer className="footer py-4 border-t border-purple-500/10">
              <div className="container mx-auto px-4 text-xs text-muted-foreground">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p>
                      Donations address:{' '}
                      <Link
                        href="https://solscan.io/address/AkMYNCURMts5zjKeCCnwx1tusiMTHJjWi2v1F1c5Sqdc"
                        target="_blank"
                        className="text-purple-400 hover:text-purple-500 transition-colors"
                      >
                        AkMYNCURMts5zjKeCCnwx1tusiMTHJjWi2v1F1c5Sqdc
                      </Link>
                    </p>
                    <p>Solana Mixer version: 1.0.0</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://x.com/oziprof"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-purple-500 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <path d="M6 4l12 16M6 20L18 4" />
                      </svg>
                    </a>
                    <a
                      href="https://github.com/2kcmte/solana-mixer-core"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-purple-500 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                        <path d="M9 18c-4.51 2-5-2-7-2"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </footer>
            <Toaster />
          </ModalProvider>
        </TooltipProvider>
      </WalletContextProvider>
    </div>
  )

  function DepositModalContent({
    token,
    amount,
    onClose,
    depositOnChain,
  }: {
    token: string
    amount: number
    onClose: () => void
    depositOnChain: (commitment: Uint8Array) => Promise<void>
  }) {
    const { toast } = useToast()
    const [noteBackedUp, setNoteBackedUp] = useState(false)
    const [copied, setCopied] = useState(false)
    const [note, setNote] = useState('')
    const [loading, setLoading] = useState(false)
    const [depositDetails, setDepositDetails] = useState<{
      note: string
      commitment: Uint8Array
    }>({ note: '', commitment: new Uint8Array(32) })

    const downloadNoteFile = useCallback(
      (text: string) => {
        const blob = new Blob([text], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `backup-solana-mixer-${amount
          .toString()
          .toLowerCase()}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      },
      [amount]
    )

    useEffect(() => {
      handleCreateNote(amount).then((details) => {
        setNote(details.note)
        setDepositDetails(details)
        downloadNoteFile(details.note)
      })
    }, [amount, downloadNoteFile])

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Please back up your note. You will need it later to withdraw your
          deposit.
        </p>
        <p className="text-sm text-muted-foreground">
          Treat your note as a private key - never share it with anyone,
          including Solana Mixer developers.
        </p>

        <div className="bg-background/50 p-3 rounded-md font-mono text-xs break-all relative group border border-purple-500/20">
          {note}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-purple-500"
            onClick={() => {
              navigator.clipboard.writeText(note)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)

              console.log(depositDetails)
            }}
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={() => downloadNoteFile(note)}
          disabled={!note}
          className="border-purple-500/20 text-purple-500 hover:bg-purple-500/10"
        >
          <ArrowDownToLine className="mr-2" />
          Download Note
        </Button>
        <p className="text-sm">
          The browser will ask to save your note as a file:
          <span className="font-mono text-xs ml-1 text-purple-400">
            backup-solana-mixer-{amount.toString().toLowerCase()}.txt
          </span>
        </p>

        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 p-3 rounded-md flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <p className="text-sm font-medium">
            FAILURE TO BACKUP NOTES WILL RESULT IN LOSS OF FUNDS
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="backup-confirmation"
            checked={noteBackedUp}
            onCheckedChange={(c) => setNoteBackedUp(c as boolean)}
            className="border-purple-500 text-purple-500"
          />
          <label htmlFor="backup-confirmation" className="text-sm font-medium">
            I backed up the note
          </label>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white flex items-center justify-center py-5 rounded-md"
          disabled={!noteBackedUp || loading}
          onClick={async () => {
            setLoading(true)
            try {
              await depositOnChain(depositDetails.commitment)
              toast({
                title: 'Deposit successful',
                description: `You deposited ${amount} ${token}.`,
              })
              onClose()
            } catch (e) {
              console.error('deposit error', e)
              setLoading(false)
            }
          }}
        >
          {loading && (
            <div
              className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-label="loading"
            />
          )}{' '}
          Send Deposit
        </Button>
      </div>
    )
  }
}
