import { Connection, PublicKey } from '@solana/web3.js'

const DEPOSIT_DISCRIM = Buffer.from([120, 248, 61, 83, 31, 142, 107, 144])

function decodeLeafIndex(raw: Buffer): number {
  return raw.readUInt32LE(8 + 32)
}

function formatAgo(ts: number): string {
  const d = Math.floor(Date.now() / 1000 - ts)
  if (d < 60) return `${d}s ago`
  const m = Math.floor(d / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export async function fetchDepositList(
  rpcUrl: string,
  programId: string
): Promise<{ id: string; time: string }[]> {
  const RPC_URL = rpcUrl
  const PROGRAM_ID = new PublicKey(programId)
  const conn = new Connection(RPC_URL, 'confirmed')
  const sigs = await conn.getSignaturesForAddress(PROGRAM_ID, { limit: 12 })

  const out: { leafIndex: number; blockTime: number }[] = []
  for (let { signature } of sigs) {
    const tx = await conn.getTransaction(signature, { commitment: 'confirmed' })
    if (!tx?.meta?.logMessages || tx.blockTime == null) continue
    for (let log of tx.meta.logMessages) {
      if (!log.startsWith('Program data: ')) continue
      let buf: Buffer
      try {
        buf = Buffer.from(log.slice(13), 'base64')
      } catch {
        continue
      }
      if (buf.length < 8 + 32 + 4) continue
      if (!buf.slice(0, 8).equals(DEPOSIT_DISCRIM)) continue

      const leafIndex = decodeLeafIndex(buf)
      out.push({ leafIndex, blockTime: tx.blockTime })
    }
  }

  out.sort((a, b) => b.leafIndex - a.leafIndex)
  return out.map((e) => ({
    id: String(e.leafIndex + 1),
    time: formatAgo(e.blockTime),
  }))
}
