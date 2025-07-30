# ShadowMesh Deployment Guide

## Prerequisites
1. MetaMask browser extension installed
2. Test ETH on Sepolia testnet (get from faucet)
3. Node.js and npm installed

## Smart Contract Deployment

### Using Remix IDE (Recommended for beginners)
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create new file: `ShadowMessenger.sol`
3. Copy the Solidity contract code
4. Compile with Solidity 0.8.19+
5. Deploy to Sepolia testnet via MetaMask
6. Copy the deployed contract address

### Using Hardhat (Advanced)
\`\`\`bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
# Add contract to contracts/ folder
# Configure hardhat.config.js with Sepolia network
npx hardhat compile
npx hardhat deploy --network sepolia
\`\`\`

## Frontend Setup

1. **Update Contract Address**
   \`\`\`typescript
   // In app/page.tsx, replace:
   const CONTRACT_ADDRESS = "0x..." // Your deployed contract address
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Connect MetaMask**
   - Switch to Sepolia testnet
   - Connect your wallet
   - Start messaging!

## Testing the Application

1. **Deploy Contract**: Use Remix to deploy to Sepolia
2. **Update Frontend**: Add your contract address
3. **Get Test ETH**: Use Sepolia faucet
4. **Test Messaging**:
   - Generate a 32-byte hash (use online tools)
   - Send to another address
   - Fetch messages from that address

## Example Message Hash Generation
\`\`\`javascript
// In browser console:
const hash = ethers.keccak256(ethers.toUtf8Bytes("Hello, this is a secret message!"))
console.log(hash) // Use this as message hash
\`\`\`

## Network Configuration
- **Sepolia Testnet**
  - Chain ID: 11155111
  - RPC URL: https://sepolia.infura.io/v3/YOUR_KEY
  - Faucet: https://sepoliafaucet.com/

## Troubleshooting
- Ensure MetaMask is on correct network
- Check contract address is correct
- Verify you have test ETH for gas fees
- Message hash must be exactly 32 bytes (64 hex chars)
