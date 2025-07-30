# 🧪 ShadowMesh Testing Guide

## ✅ Step 1: Deploy Contract

### Using Remix IDE:
1. **Open [remix.ethereum.org](https://remix.ethereum.org)**
2. **Create file**: `EphemeralShadowMessenger.sol`
3. **Copy contract code** from `contracts/EphemeralShadowMessenger.sol`
4. **Compile**: Select Solidity 0.8.19+ and compile
5. **Deploy**: 
   - Select "Injected Provider - MetaMask"
   - Switch MetaMask to Sepolia testnet
   - Deploy the contract
   - **Copy the contract address** (starts with 0x...)

### ✅ Success Indicators:
- Contract deploys without errors
- You get a contract address (42 characters)
- Contract appears on Sepolia Etherscan

## ✅ Step 2: Update Frontend

### Update Contract Address:
\`\`\`typescript
// In app/page.tsx, line ~45
const CONTRACT_ADDRESS = "0xYourNewContractAddress" // Replace with actual address
\`\`\`

### ✅ Success Indicators:
- No "Contract not deployed" error message
- Application loads without red error cards

## ✅ Step 3: Test Registration Flow

### Test Sequence:
1. **Connect MetaMask**
   - Should show "Connect MetaMask" button
   - Click and approve connection
   - Should show registration dialog

2. **Register User**
   - Enter display name (e.g., "TestUser")
   - Click "Create Profile"
   - Should get unique 6-digit ID (e.g., 123456)
   - Should see success alert with ID

3. **Verify Registration**
   - Should see your ID and name in Connection Status
   - Should see "Online" status
   - Should see total users count

### ✅ Success Indicators:
- ✅ Registration completes without errors
- ✅ Unique 6-digit ID assigned
- ✅ User info displays correctly
- ✅ No "execution reverted" errors

## ✅ Step 4: Test User Search

### Test Sequence:
1. **Search for Non-existent User**
   - Enter random 6-digit number (e.g., 999999)
   - Click search button
   - Should show "User not found" message

2. **Search for Your Own ID**
   - Enter your own User ID
   - Should show "User found" message
   - Should populate connection request field

### ✅ Success Indicators:
- ✅ Search function works
- ✅ Proper error messages for invalid IDs
- ✅ Auto-populates target field when found

## ✅ Step 5: Test QR Code Sharing

### Test Sequence:
1. **Generate QR Code**
   - Click "Share ID" button
   - Should open QR code dialog
   - Should show QR code image
   - Should display your User ID and name

2. **Copy User ID**
   - Click "Copy User ID" button
   - Should show success message
   - Should copy ID to clipboard

### ✅ Success Indicators:
- ✅ QR code generates successfully
- ✅ QR code contains correct data
- ✅ Copy function works

## ✅ Step 6: Test Connection Requests (Multi-Account)

### Setup:
- Use two different MetaMask accounts
- Register both accounts with different names
- Note both User IDs

### Test Sequence:
1. **Send Connection Request**
   - Account A: Enter Account B's User ID
   - Click "Send Request"
   - Should show success message

2. **Accept Connection Request**
   - Switch to Account B
   - Should see incoming request from Account A
   - Click "Accept"
   - Should create chat session

3. **Verify Chat Session**
   - Both accounts should see active chat
   - Should be able to click and open chat

### ✅ Success Indicators:
- ✅ Connection requests send successfully
- ✅ Incoming requests appear correctly
- ✅ Acceptance creates chat session
- ✅ Both users see active session

## ✅ Step 7: Test Ephemeral Messaging

### Test Sequence:
1. **Send Messages**
   - Open active chat session
   - Type test message
   - Press Enter or click send
   - Should appear in chat

2. **Verify Encryption**
   - Check browser localStorage
   - Should see encrypted message data
   - Should not see plain text

3. **Test Message Persistence**
   - Refresh browser
   - Messages should still appear
   - Should decrypt correctly

### ✅ Success Indicators:
- ✅ Messages send successfully
- ✅ Messages appear in chat interface
- ✅ Messages are encrypted in storage
- ✅ Messages decrypt correctly

## ✅ Step 8: Test Session Destruction

### Test Sequence:
1. **End Chat Session**
   - Click "End Chat" button
   - Should show confirmation
   - Session should disappear from active list

2. **Verify Cleanup**
   - Check localStorage
   - Session keys should be removed
   - Messages should be inaccessible

3. **Go Offline**
   - Click "Go Offline" button
   - All sessions should end
   - Should show offline confirmation

### ✅ Success Indicators:
- ✅ Sessions end successfully
- ✅ All traces are cleaned up
- ✅ localStorage is cleared
- ✅ No residual data remains

## 🎯 Complete Test Checklist

- [ ] Contract deploys successfully
- [ ] Frontend connects without errors
- [ ] User registration works
- [ ] Unique IDs are assigned
- [ ] User search functions correctly
- [ ] QR code generation works
- [ ] Connection requests send/receive
- [ ] Chat sessions are created
- [ ] Messages send and decrypt
- [ ] Sessions end and cleanup properly
- [ ] All privacy features work
- [ ] No sensitive data exposed

## 🚨 Common Issues & Solutions

### "Execution Reverted" Error:
- ✅ **Solution**: Deploy new contract with fixed code
- ✅ **Check**: Contract address is correct
- ✅ **Verify**: Using Sepolia testnet

### "User Not Found" Error:
- ✅ **Solution**: Ensure both users are registered
- ✅ **Check**: User IDs are 6-digit numbers
- ✅ **Verify**: IDs exist in contract

### Messages Not Decrypting:
- ✅ **Solution**: Check session keys in localStorage
- ✅ **Check**: Both users accepted connection
- ✅ **Verify**: Encryption keys match

### QR Code Not Loading:
- ✅ **Solution**: Check internet connection
- ✅ **Check**: QR service is accessible
- ✅ **Verify**: User data is valid

## 🎉 Success Criteria

**✅ All tests pass = ShadowMesh is ready for use!**

The system should provide:
- Complete anonymity through User IDs
- Secure ephemeral messaging
- No permanent data storage
- Perfect privacy protection
- Enterprise-grade security

**🚀 Ready for production deployment!**
\`\`\`

Now let's create a final verification component:
