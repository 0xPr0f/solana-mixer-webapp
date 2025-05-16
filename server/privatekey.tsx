'use server'

import { Keypair } from '@solana/web3.js'

const PRIVATE_KEY_HEX = process.env.PRIVATE_KEY_HEX as string

export async function getSigner() {
  return Keypair.fromSeed(Uint8Array.from(Buffer.from(PRIVATE_KEY_HEX, 'hex')))
}
