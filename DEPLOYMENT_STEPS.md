# 🚀 ShadowMesh Deployment Steps

## Step 1: Deploy Updated Contract

### Using Remix IDE:

1. **Go to [remix.ethereum.org](https://remix.ethereum.org)**
2. **Create new file**: `EphemeralShadowMessenger.sol`
3. **Copy the contract code** from `contracts/EphemeralShadowMessenger.sol`
4. **Compile with Solidity 0.8.19+**
5. **Deploy to Sepolia testnet** via MetaMask
6. **Copy the deployed contract address**

### Expected Contract Address Format:
\`\`\`
0x1234567890123456789012345678901234567890
\`\`\`

## Step 2: Update Frontend Configuration

Replace the CONTRACT_ADDRESS in `app/page.tsx`:

\`\`\`typescript
// OLD (placeholder)
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"

// NEW (your deployed address)
const CONTRACT_ADDRESS = "0xYourNewContractAddress"
\`\`\`

## Step 3: Test Registration Flow

1. **Connect MetaMask** to Sepolia testnet
2. **Get test ETH** from [Sepolia Faucet](https://sepoliafaucet.com/)
3. **Refresh the application**
4. **Register a new user** with display name
5. **Verify unique ID assignment** (6-digit number)

## Step 4: Verify All Functions

- ✅ User registration works without errors
- ✅ Unique ID generation (100000-999999)
- ✅ Connection requests by User ID
- ✅ Chat session creation
- ✅ Ephemeral messaging
- ✅ Session destruction

## 🎯 Success Indicators:

- No "execution reverted" errors
- Registration dialog appears for new users
- Unique 6-digit ID displayed after registration
- Connection requests work with User IDs
- Chat sessions start successfully

## 🔧 Troubleshooting:

**If you still get errors:**
1. Ensure contract is deployed successfully
2. Verify contract address is correct (42 characters)
3. Check MetaMask is on Sepolia network
4. Confirm you have test ETH for gas fees
5. Clear browser cache and localStorage
\`\`\`

Now let's update the frontend with the corrected contract address and add the new features:
