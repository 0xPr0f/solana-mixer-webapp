# Solana Mixer WebApp

A privacy-focused mixer application for Solana that allows users to deposit and withdraw SOL while maintaining anonymity.

## Features

- 🔒 Privacy-focused mixing of SOL tokens
- 💰 Fixed deposit amount of 1 SOL
- 🔐 Zero-knowledge proof-based withdrawals
- 🎯 User-friendly interface with modern design
- 🔄 Real-time deposit tracking
- 📱 Responsive design for all devices

## Technical Overview

The application uses:
- Zero-knowledge proofs for privacy
- Merkle tree for commitment tracking
- SNARK verification for withdrawals
- Solana blockchain for transactions

## Getting Started

### Prerequisites

- Node.js (Latest LTS version)
- Solana CLI tools
- A Solana wallet (e.g., Phantom)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd solana-tornado
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

1. Connect your Solana wallet
2. Choose between Deposit or Withdraw
3. For deposits:
   - Select the amount (currently 1 SOL)
   - Confirm the transaction
   - Save your private note securely
4. For withdrawals:
   - Enter your private note
   - Specify recipient address
   - Confirm the transaction

## Security

- Private notes must be backed up securely
- Never share your private note with anyone
- The application uses zero-knowledge proofs to ensure privacy
- All transactions are verified on-chain

## Development

Built with:
- Next.js
- Solana Web3.js
- Anchor Framework
- Radix UI Components

## License

[Add your license information here]

## Support

For support, please [add your support contact information]

## Contributing

[Add contribution guidelines if applicable]

