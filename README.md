# ShadowMesh - Ephemeral Chat System

## 🚀 **LIVE ON SEPOLIA TESTNET!**

**Contract Address:** `0xC70A42B3CAa6324E2D2ec64ae5D18d25E379169F`
**Network:** Sepolia Testnet
**Status:** ✅ Fully Operational (Updated Contract)

[View on Etherscan](https://sepolia.etherscan.io/address/0xC70A42B3CAa6324E2D2ec64ae5D18d25E379169F)

### 🔧 Latest Updates:
- ✅ Fixed registration errors
- ✅ Improved user ID generation
- ✅ Enhanced error handling
- ✅ Better privacy features
- ✅ Optimized gas usage

## 🔥 Revolutionary Concept

ShadowMesh now implements **truly ephemeral messaging** where:
- **Connection requests** must be sent and accepted
- **Temporary sessions** are created with shared encryption keys
- **Messages auto-destruct** after 1 hour
- **All traces vanish** when chat ends or users go offline
- **Zero permanent storage** of conversations

## 🛡️ Enhanced Security Model

### Connection Flow:
1. **Request Phase**: User A sends connection request to User B
2. **Acceptance Phase**: User B accepts, creating temporary session with shared key
3. **Chat Phase**: Encrypted messages exchanged using session key
4. **Destruction Phase**: Session ends, all keys and messages destroyed

### Auto-Destruction Triggers:
- ⏰ **Session Timeout**: 30 minutes of inactivity
- 📴 **User Goes Offline**: All sessions automatically ended
- 🔥 **Manual End**: Either user can end the chat
- ⏱️ **Message Expiry**: Individual messages expire after 1 hour

## 🔐 Technical Implementation

### Smart Contract Features:
- **Connection Request Management**: Send/accept/reject requests
- **Ephemeral Session Tracking**: Temporary chat sessions
- **Auto-cleanup Mechanisms**: Expired message and session removal
- **Privacy-First Design**: No permanent sender/receiver traces
- **Offline Detection**: Automatic session termination

### Frontend Features:
- **Real-time Connection Management**: Live request handling
- **Session-based Chat Interface**: Dedicated chat windows
- **Auto-refresh**: 5-second updates for real-time experience
- **Key Management**: Automatic encryption key generation and destruction
- **Status Tracking**: Online/offline user status

## 🚀 Key Improvements

1. **True Ephemeral Nature**: Nothing persists after chat ends
2. **Connection-based System**: Must request and accept connections
3. **Session Management**: Temporary, time-limited chat sessions
4. **Auto-destruction**: Multiple triggers for complete cleanup
5. **Real-time Interface**: Live updates and status tracking

## 📋 Usage Flow

1. **Connect Wallet**: MetaMask integration
2. **Send Request**: Enter target address and send connection request
3. **Accept/Reject**: Handle incoming connection requests
4. **Chat**: Exchange encrypted messages in temporary session
5. **Auto-destruct**: Session ends automatically or manually

## 🔧 Deployment

1. Deploy `EphemeralShadowMessenger.sol` to testnet
2. Update `CONTRACT_ADDRESS` in frontend
3. Run `npm install && npm run dev`
4. Connect MetaMask and start ephemeral chatting!

## 🌟 Perfect For:

- **Whistleblowing**: Secure, untraceable communication
- **Sensitive Discussions**: Business negotiations, personal matters
- **Privacy-focused Users**: Those who value digital privacy
- **Temporary Coordination**: Event planning, one-time collaborations
- **Anonymous Communication**: No permanent identity linking

This system ensures that once a chat session ends, it's as if the conversation never happened - true digital ephemeral messaging! 🔥

## 🎉 Ready to Use!

ShadowMesh is now live and ready for anonymous messaging! Connect your MetaMask wallet to Sepolia testnet and start chatting.

### Quick Start:
1. **Get Sepolia ETH**: [Sepolia Faucet](https://sepoliafaucet.com/)
2. **Connect MetaMask**: Switch to Sepolia testnet
3. **Register**: Get your unique 6-digit User ID
4. **Connect**: Send requests using other User IDs
5. **Chat**: Start ephemeral messaging sessions

## 🔥 Revolutionary Features Now Live:

### ✅ Anonymous User System
- **6-digit User IDs** instead of wallet addresses
- **Complete privacy** - no personal information required
- **Zero tracking** - wallet addresses never exposed
- **Session-based visibility** - only connected users see each other

### ✅ Ephemeral Messaging
- **Auto-destruction** - messages expire after 1 hour
- **Session cleanup** - all traces destroyed when chat ends
- **Offline triggers** - sessions end when users go offline
- **Manual destruction** - either user can end the chat

### ✅ Enhanced Security
- **End-to-end encryption** with session-based keys
- **No permanent storage** of conversations
- **Privacy-first design** - no sender/receiver traces
- **Zero-knowledge architecture** - contract knows nothing about content

### ✅ User Experience
- **QR Code sharing** for easy ID distribution
- **User search** functionality
- **Real-time updates** every 5 seconds
- **Intuitive interface** with modern design
