'use server'

import { PROVE_SERVER_HOST } from './constants'

export async function handleCreateNote(amount: number) {
  try {
    const response = await fetch(
      `${PROVE_SERVER_HOST}/api/generate-deposit-details`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to process deposit')
    }
    console.log(process.env.TEST)
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error handling deposit:', error)
    throw error
  }
}

export async function deserializeNote(note: string, program_pubkey: string) {
  try {
    const response = await fetch(
      `${PROVE_SERVER_HOST}/api/decode-note-details`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: note,
          program_pubkey: program_pubkey,
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to process note')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error handling note:', error)
    throw error
  }
}

const WS_HOST = PROVE_SERVER_HOST.replace(/^http/, 'ws')
export async function generateProofForWithdrawal(
  nullifier: string,
  secret: string,
  rpcUrl: string,
  programPubkey: string,
  recipient: string,
  relayer: string
): Promise<{ proof_bytes: number[]; public_inputs: number[] }> {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(`${WS_HOST}/ws/compute_withdrawal`)
    const serverUrl = PROVE_SERVER_HOST
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          nullifier,
          secret,
          rpc_url: rpcUrl,
          program_pubkey: programPubkey,
          new_withdrawal_recipient_address: recipient,
          new_relayer_address: relayer,
          server_url: serverUrl,
        })
      )
    }

    socket.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data)
        if (data.error) {
          reject(new Error(data.error))
        } else {
          resolve({
            proof_bytes: data.proof_bytes,
            public_inputs: data.public_inputs,
          })
        }
      } catch (e) {
        reject(e)
      } finally {
        socket.close()
      }
    }

    socket.onerror = (err) => {
      reject(new Error('WebSocket error'))
    }

    const timeout = setTimeout(() => {
      reject(new Error('Proof generation timed out'))
      socket.close()
    }, 1_200_000) // 20 minutes or so

    const clear = () => clearTimeout(timeout)
    socket.onmessage = (evt) => {
      clear()
      try {
        const data = JSON.parse(evt.data)
        if (data.error) reject(new Error(data.error))
        else
          resolve({
            proof_bytes: data.proof_bytes,
            public_inputs: data.public_inputs,
          })
      } catch (e) {
        reject(e)
      } finally {
        socket.close()
      }
    }
    socket.onerror = (e) => {
      clear()
      reject(new Error('WebSocket error'))
    }
  })
}
