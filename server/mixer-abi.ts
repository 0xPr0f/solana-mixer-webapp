/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_mixer.json`.
 */
export type SolanaMixer = {
  address: 'B7odahygLXdwCYmJteVyBFXXe9qEW5hyvCXieRGBoTTz'
  metadata: {
    name: 'solanaMixer'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'deposit'
      docs: [
        'Deposit: takes a 32‐byte `commitment`, collects lamports, updates Merkle tree'
      ]
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182]
      accounts: [
        {
          name: 'state'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 105, 120, 101, 114, 95, 115, 116, 97, 116, 101]
              }
            ]
          }
        },
        {
          name: 'depositor'
          signer: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'commitment'
          type: {
            array: ['u8', 32]
          }
        }
      ]
    },
    {
      name: 'initialize'
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237]
      accounts: [
        {
          name: 'state'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 105, 120, 101, 114, 95, 115, 116, 97, 116, 101]
              }
            ]
          }
        },
        {
          name: 'admin'
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'depositAmount'
          type: 'u64'
        }
      ]
    },
    {
      name: 'withdraw'
      docs: [
        'Withdraw: verify SNARK proof, check Merkle root & nullifier, pay out'
      ]
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34]
      accounts: [
        {
          name: 'state'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 105, 120, 101, 114, 95, 115, 116, 97, 116, 101]
              }
            ]
          }
        },
        {
          name: 'caller'
          signer: true
        },
        {
          name: 'recipient'
          writable: true
        },
        {
          name: 'relayer'
          writable: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'proof'
          type: 'bytes'
        },
        {
          name: 'publicInputs'
          type: 'bytes'
        }
      ]
    }
  ]
  accounts: [
    {
      name: 'state'
      discriminator: [216, 146, 107, 94, 104, 75, 182, 177]
    }
  ]
  events: [
    {
      name: 'depositEvent'
      discriminator: [120, 248, 61, 83, 31, 142, 107, 144]
    },
    {
      name: 'withdrawEvent'
      discriminator: [22, 9, 133, 26, 160, 44, 71, 192]
    }
  ]
  errors: [
    {
      code: 6000
      name: 'invalidProof'
      msg: 'Invalid SNARK proof'
    },
    {
      code: 6001
      name: 'invalidInput'
      msg: 'Bad public inputs'
    },
    {
      code: 6002
      name: 'invalidRoot'
      msg: 'Root not recognized'
    },
    {
      code: 6003
      name: 'nullifierAlreadyUsed'
      msg: 'Nullifier already used'
    },
    {
      code: 6004
      name: 'mathError'
      msg: 'Overflow during math'
    },
    {
      code: 6005
      name: 'treeFull'
      msg: 'Merkle tree is full'
    },
    {
      code: 6006
      name: 'hasherError'
      msg: 'Poseidon hasher failure'
    },
    {
      code: 6007
      name: 'depositAmountZero'
      msg: 'Deposit amount is zero'
    }
  ]
  types: [
    {
      name: 'depositEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'commitment'
            type: {
              array: ['u8', 32]
            }
          },
          {
            name: 'leafIndex'
            type: 'u32'
          },
          {
            name: 'depositor'
            type: 'pubkey'
          }
        ]
      }
    },
    {
      name: 'state'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'administrator'
            type: 'pubkey'
          },
          {
            name: 'nextIndex'
            type: 'u32'
          },
          {
            name: 'currentRootIndex'
            type: 'u32'
          },
          {
            name: 'currentRoot'
            type: {
              array: ['u8', 32]
            }
          },
          {
            name: 'filledSubtrees'
            type: {
              array: [
                {
                  array: ['u8', 32]
                },
                20
              ]
            }
          },
          {
            name: 'rootHistory'
            type: {
              array: [
                {
                  array: ['u8', 32]
                },
                33
              ]
            }
          },
          {
            name: 'nullifiersUsed'
            type: {
              vec: {
                array: ['u8', 32]
              }
            }
          },
          {
            name: 'depositAmount'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'withdrawEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'nullifierHash'
            type: {
              array: ['u8', 32]
            }
          },
          {
            name: 'recipient'
            type: 'pubkey'
          },
          {
            name: 'relayer'
            type: 'pubkey'
          },
          {
            name: 'fee'
            type: 'u64'
          },
          {
            name: 'refund'
            type: 'u64'
          }
        ]
      }
    }
  ]
}
