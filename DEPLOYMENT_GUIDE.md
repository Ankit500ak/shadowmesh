# ShadowMesh Deployment Guide

## 🚨 Fix for ENS Error

The ENS error occurs when the contract address is invalid or empty. Follow these steps:

### 1. Deploy Smart Contract

**Using Remix IDE (Recommended):**
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create new file: `EphemeralShadowMessenger.sol`
3. Copy the complete contract code from the project
4. Compile with Solidity 0.8.19 or higher
5. Deploy to Sepolia testnet using MetaMask
6. **Copy the deployed contract address**

### 2. Update Frontend Configuration

In `app/page.tsx`, replace:
\`\`\`typescript
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"
\`\`\`

With your actual deployed contract address:
\`\`\`typescript
const CONTRACT_ADDRESS = "0xYourActualContractAddress"
\`\`\`

### 3. Network Setup

**Sepolia Testnet Configuration:**
- Network Name: Sepolia
- RPC URL: https://sepolia.infura.io/v3/YOUR_KEY
- Chain ID: 11155111
- Currency Symbol: ETH
- Block Explorer: https://sepolia.etherscan.io

**Get Test ETH:**
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://sepoliafaucet.com/)

### 4. Testing

1. Connect MetaMask to Sepolia network
2. Ensure you have test ETH for gas fees
3. Refresh the application
4. Connect your wallet
5. Start sending connection requests!

## 🔧 Troubleshooting

**Common Issues:**
- ❌ "Invalid ENS name" → Contract address not set correctly
- ❌ "Network mismatch" → Switch MetaMask to Sepolia
- ❌ "Insufficient funds" → Get test ETH from faucet
- ❌ "Transaction failed" → Check gas limits and network congestion

**Validation Checklist:**
- ✅ Contract deployed successfully
- ✅ Contract address is 42 characters (0x + 40 hex chars)
- ✅ MetaMask connected to Sepolia
- ✅ Test ETH available for gas
- ✅ Frontend updated with correct address

## 🎯 Quick Test

Once deployed, test the flow:
1. **Connect Wallet** → Should show your address
2. **Send Request** → Enter another address and send
3. **Accept Request** → Use second account to accept
4. **Start Chatting** → Exchange ephemeral messages
5. **End Session** → Verify all traces are destroyed

The ENS error should be completely resolved once you deploy the contract and update the address! 🚀
