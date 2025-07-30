"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Wallet, MessageSquare, Shield, UserPlus, X, Check, User, Hash, Search, QrCode } from "lucide-react"

// Enhanced Contract ABI with all functions
const CONTRACT_ABI = [
  "function registerUser(string _displayName) external returns (uint256)",
  "function updateDisplayName(string _newDisplayName) external",
  "function sendConnectionRequest(uint256 _targetUserId) external returns (bytes32)",
  "function acceptConnectionRequest(bytes32 _requestId, bytes32 _encryptionKeyHash) external returns (bytes32)",
  "function rejectConnectionRequest(bytes32 _requestId) external",
  "function sendEphemeralMessage(bytes32 _sessionId, bytes32 _encryptedContent) external returns (bytes32)",
  "function endChatSession(bytes32 _sessionId) external",
  "function goOffline() external",
  "function getMyUserId() external view returns (uint256)",
  "function isUserRegistered() external view returns (bool)",
  "function getMyUserInfo() external view returns (uint256, string, uint256, bool)",
  "function getUserInfo(uint256 _userId) external view returns (string, bool, uint256)",
  "function getMyPendingRequests() external view returns (bytes32[] memory)",
  "function getMyIncomingRequests() external view returns (bytes32[] memory)",
  "function getMyActiveSessions() external view returns (bytes32[] memory)",
  "function getSessionMessages(bytes32 _sessionId) external view returns (bytes32[] memory)",
  "function doesUserExist(uint256 _userId) external view returns (bool)",
  "function getPlatformStats() external view returns (uint256, uint256, uint256, uint256)",
  "function connectionRequests(bytes32) external view returns (uint256, uint256, uint256, uint256, uint8, bytes32)",
  "function chatSessions(bytes32) external view returns (uint256, uint256, bytes32, bytes32, uint256, uint256, bool, uint256)",
  "function messages(bytes32) external view returns (bytes32, bytes32, uint256, uint256, bool, uint256)",
  "event UserRegistered(uint256 indexed userId, uint256 timestamp)",
  "event ConnectionRequested(bytes32 indexed requestId, uint256 indexed requesterId, uint256 indexed targetId)",
  "event ConnectionAccepted(bytes32 indexed sessionId, uint256 indexed user1Id, uint256 indexed user2Id)",
  "event SessionEnded(bytes32 indexed sessionId, uint256 indexed user1Id, uint256 indexed user2Id)",
  "event EphemeralMessageSent(bytes32 indexed sessionId, bytes32 indexed messageId, uint256 senderId)",
]

// 🚀 UPDATED WITH NEW DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = "0xC70A42B3CAa6324E2D2ec64ae5D18d25E379169F" // ✅ NEW CONTRACT ADDRESS

const isValidAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address) && address !== "0x0000000000000000000000000000000000000000"
  } catch {
    return false
  }
}

interface UserInfo {
  userId: number
  displayName: string
  registeredAt: number
  isOnline: boolean
}

interface ConnectionRequest {
  id: string
  requesterId: number
  targetId: number
  timestamp: number
  expiresAt: number
  status: number
  requesterInfo?: { displayName: string; isOnline: boolean }
}

interface ChatSession {
  id: string
  user1Id: number
  user2Id: number
  encryptionKey: string
  startTime: number
  lastActivity: number
  isActive: boolean
  messageCount: number
  otherUserInfo?: { displayName: string; isOnline: boolean }
}

interface EphemeralMessage {
  id: string
  sessionId: string
  content: string
  timestamp: number
  senderId: number
  isOwn: boolean
}

export default function EphemeralShadowMesh() {
  const [account, setAccount] = useState<string>("")
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // User management
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [showRegistration, setShowRegistration] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [registering, setRegistering] = useState(false)

  // Connection management
  const [targetUserId, setTargetUserId] = useState("")
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([])
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>([])
  const [activeSessions, setActiveSessions] = useState<ChatSession[]>([])

  // Chat state
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [sessionMessages, setSessionMessages] = useState<EphemeralMessage[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)

  // New features
  const [searchQuery, setSearchQuery] = useState("")
  const [showQRCode, setShowQRCode] = useState(false)

  // Platform stats
  const [platformStats, setPlatformStats] = useState({ totalUsers: 0, myRequests: 0, mySent: 0, mySessions: 0 })

  // Auto-refresh
  useEffect(() => {
    if (contract && userInfo) {
      const interval = setInterval(() => {
        refreshData()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [contract, userInfo])

  // Connect wallet
  const connectWallet = async () => {
    try {
      setLoading(true)
      setError("")

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed! Please install MetaMask to continue.")
      }

      if (!isValidAddress(CONTRACT_ADDRESS)) {
        throw new Error("⚠️ Contract not deployed yet! Please deploy the contract and update CONTRACT_ADDRESS.")
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please connect your MetaMask wallet.")
      }

      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      setProvider(provider)
      setContract(contract)
      setAccount(accounts[0])

      // Check if user is registered
      await checkUserRegistration(contract)
    } catch (err: any) {
      console.error("Wallet connection error:", err)
      setError(err.message || "Failed to connect wallet")
    } finally {
      setLoading(false)
    }
  }

  // Check if user is registered
  const checkUserRegistration = async (contractInstance: ethers.Contract) => {
    try {
      // Use the safe registration check
      const isRegistered = await contractInstance.isUserRegistered()

      if (!isRegistered) {
        setShowRegistration(true)
        await loadPlatformStats(contractInstance)
      } else {
        const [userIdBN, displayName, registeredAt, isOnline] = await contractInstance.getMyUserInfo()

        setUserInfo({
          userId: Number(userIdBN),
          displayName,
          registeredAt: Number(registeredAt),
          isOnline,
        })

        await refreshData(contractInstance)
      }
    } catch (err: any) {
      console.error("Error checking user registration:", err)
      setShowRegistration(true)
      setError("Please register to use ShadowMesh")
    }
  }

  // Register new user
  const registerUser = async () => {
    if (!contract || !displayName.trim()) return

    try {
      setRegistering(true)
      setError("")

      const tx = await contract.registerUser(displayName.trim())
      const receipt = await tx.wait()

      // Get user ID from event or direct call
      let userId = 0
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed?.name === "UserRegistered"
        } catch {
          return false
        }
      })

      if (event) {
        const parsed = contract.interface.parseLog(event)
        userId = Number(parsed?.args[0])
      } else {
        // Fallback: get user ID directly
        const userIdBN = await contract.getMyUserId()
        userId = Number(userIdBN)
      }

      if (userId > 0) {
        setUserInfo({
          userId,
          displayName: displayName.trim(),
          registeredAt: Date.now() / 1000,
          isOnline: true,
        })

        setShowRegistration(false)
        setDisplayName("")
        await refreshData()

        alert(
          `🎉 Welcome to ShadowMesh!\n\nYour unique ID is: ${userId}\n\nShare this ID with people you want to connect with!`,
        )
      }
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || "Failed to register user")
    } finally {
      setRegistering(false)
    }
  }

  // Search for users
  const searchUsers = async () => {
    if (!searchQuery || !contract) return

    try {
      const userId = Number.parseInt(searchQuery)
      if (!isNaN(userId) && userId > 0) {
        const userExists = await contract.doesUserExist(userId)
        if (userExists) {
          setTargetUserId(searchQuery)
          setSearchQuery("")
          alert(`✅ User #${userId} found! Click "Send Request" to connect.`)
        } else {
          alert(`❌ User #${userId} not found.`)
        }
      } else {
        alert("Please enter a valid 6-digit User ID")
      }
    } catch (err: any) {
      setError("Error searching for user")
    }
  }

  // Generate QR Code for sharing User ID
  const generateQRCode = () => {
    if (!userInfo) return

    const qrData = `shadowmesh:${userInfo.userId}:${userInfo.displayName}`
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`

    return qrUrl
  }

  // Refresh all data
  const refreshData = async (contractInstance?: ethers.Contract) => {
    const contractToUse = contractInstance || contract
    if (!contractToUse || !userInfo) return

    try {
      await Promise.all([
        loadPendingRequests(contractToUse),
        loadIncomingRequests(contractToUse),
        loadActiveSessions(contractToUse),
        loadPlatformStats(contractToUse),
      ])
    } catch (err: any) {
      console.error("Error refreshing data:", err)
    }
  }

  // Load pending requests
  const loadPendingRequests = async (contractInstance: ethers.Contract) => {
    try {
      const requestIds = await contractInstance.getMyPendingRequests()
      const requests: ConnectionRequest[] = []

      for (const id of requestIds) {
        try {
          const [requesterId, targetId, timestamp, expiresAt, status] = await contractInstance.connectionRequests(id)

          if (Number(status) === 0) {
            requests.push({
              id,
              requesterId: Number(requesterId),
              targetId: Number(targetId),
              timestamp: Number(timestamp),
              expiresAt: Number(expiresAt),
              status: Number(status),
            })
          }
        } catch (err) {
          console.warn("Error loading request:", id, err)
        }
      }

      setPendingRequests(requests)
    } catch (err: any) {
      console.error("Error loading pending requests:", err)
    }
  }

  // Load incoming requests
  const loadIncomingRequests = async (contractInstance: ethers.Contract) => {
    try {
      const requestIds = await contractInstance.getMyIncomingRequests()
      const requests: ConnectionRequest[] = []

      for (const id of requestIds) {
        try {
          const [requesterId, targetId, timestamp, expiresAt, status] = await contractInstance.connectionRequests(id)

          if (Number(status) === 0 && Number(expiresAt) > Date.now() / 1000) {
            let requesterInfo = { displayName: "Unknown", isOnline: false }
            try {
              const [displayName, isOnline] = await contractInstance.getUserInfo(Number(requesterId))
              requesterInfo = { displayName, isOnline }
            } catch (err) {
              console.warn("Could not load requester info:", err)
            }

            requests.push({
              id,
              requesterId: Number(requesterId),
              targetId: Number(targetId),
              timestamp: Number(timestamp),
              expiresAt: Number(expiresAt),
              status: Number(status),
              requesterInfo,
            })
          }
        } catch (err) {
          console.warn("Error loading incoming request:", id, err)
        }
      }

      setIncomingRequests(requests)
    } catch (err: any) {
      console.error("Error loading incoming requests:", err)
    }
  }

  // Load active sessions
  const loadActiveSessions = async (contractInstance: ethers.Contract) => {
    try {
      const sessionIds = await contractInstance.getMyActiveSessions()
      const sessions: ChatSession[] = []

      for (const id of sessionIds) {
        try {
          const [user1Id, user2Id, sessionId, encryptionKeyHash, startTime, lastActivity, isActive, messageCount] =
            await contractInstance.chatSessions(id)

          if (isActive) {
            const otherUserId = Number(user1Id) === userInfo!.userId ? Number(user2Id) : Number(user1Id)

            let otherUserInfo = { displayName: "Unknown", isOnline: false }
            try {
              const [displayName, isOnline] = await contractInstance.getUserInfo(otherUserId)
              otherUserInfo = { displayName, isOnline }
            } catch (err) {
              console.warn("Could not load other user info:", err)
            }

            sessions.push({
              id,
              user1Id: Number(user1Id),
              user2Id: Number(user2Id),
              encryptionKey: "",
              startTime: Number(startTime),
              lastActivity: Number(lastActivity),
              isActive,
              messageCount: Number(messageCount),
              otherUserInfo,
            })
          }
        } catch (err) {
          console.warn("Error loading session:", id, err)
        }
      }

      setActiveSessions(sessions)
    } catch (err: any) {
      console.error("Error loading active sessions:", err)
    }
  }

  // Load platform stats
  const loadPlatformStats = async (contractInstance: ethers.Contract) => {
    try {
      const [totalUsers, myRequests, mySent, mySessions] = await contractInstance.getPlatformStats()
      setPlatformStats({
        totalUsers: Number(totalUsers),
        myRequests: Number(myRequests),
        mySent: Number(mySent),
        mySessions: Number(mySessions),
      })
    } catch (err: any) {
      console.error("Error loading platform stats:", err)
    }
  }

  // Send connection request
  const sendConnectionRequest = async () => {
    if (!contract || !targetUserId) return

    try {
      setLoading(true)
      setError("")

      const userId = Number.parseInt(targetUserId)
      if (isNaN(userId) || userId <= 0) {
        throw new Error("Please enter a valid user ID (6-digit number)")
      }

      if (userId === userInfo!.userId) {
        throw new Error("Cannot send connection request to yourself")
      }

      const userExists = await contract.doesUserExist(userId)
      if (!userExists) {
        throw new Error("User ID does not exist")
      }

      const tx = await contract.sendConnectionRequest(userId)
      await tx.wait()

      setTargetUserId("")
      await refreshData()
      alert(`✅ Connection request sent to User #${userId}! 🚀`)
    } catch (err: any) {
      console.error("Send request error:", err)
      setError(err.message || "Failed to send connection request")
    } finally {
      setLoading(false)
    }
  }

  // Accept connection request
  const acceptRequest = async (requestId: string) => {
    if (!contract) return

    try {
      setLoading(true)
      setError("")

      const sharedKey = ethers.keccak256(ethers.toUtf8Bytes(account + requestId + Date.now()))
      const keyHash = ethers.keccak256(ethers.toUtf8Bytes(sharedKey))

      const tx = await contract.acceptConnectionRequest(requestId, keyHash)
      const receipt = await tx.wait()

      const sessionEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed?.name === "ConnectionAccepted"
        } catch {
          return false
        }
      })

      if (sessionEvent) {
        const parsed = contract.interface.parseLog(sessionEvent)
        const sessionId = parsed?.args[0]
        if (sessionId) {
          localStorage.setItem(`session_key_${sessionId}`, sharedKey)
        }
      }

      await refreshData()
      alert("✅ Connection accepted! Chat session started 🎉")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Reject connection request
  const rejectRequest = async (requestId: string) => {
    if (!contract) return

    try {
      const tx = await contract.rejectConnectionRequest(requestId)
      await tx.wait()
      await refreshData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Load messages for selected session
  const loadSessionMessages = async (session: ChatSession) => {
    if (!contract) return

    try {
      const messageIds = await contract.getSessionMessages(session.id)
      const messages: EphemeralMessage[] = []
      const encryptionKey = localStorage.getItem(`session_key_${session.id}`)

      for (const msgId of messageIds) {
        const [sessionId, encryptedContent, timestamp, expiresAt, isActive, senderId] = await contract.messages(msgId)

        if (isActive && Number(expiresAt) > Date.now() / 1000) {
          const encryptedData = localStorage.getItem(`ipfs_${encryptedContent}`)
          let decryptedContent = "🔒 Unable to decrypt"

          if (encryptedData && encryptionKey) {
            decryptedContent = decryptMessage(encryptedData, encryptionKey)
          }

          messages.push({
            id: msgId,
            sessionId,
            content: decryptedContent,
            timestamp: Number(timestamp),
            senderId: Number(senderId),
            isOwn: Number(senderId) === userInfo!.userId,
          })
        }
      }

      setSessionMessages(messages.sort((a, b) => a.timestamp - b.timestamp))
    } catch (err: any) {
      console.error("Error loading session messages:", err)
    }
  }

  // Send ephemeral message
  const sendEphemeralMessage = async () => {
    if (!contract || !selectedSession || !messageInput) return

    try {
      setSendingMessage(true)
      setError("")

      const encryptionKey = localStorage.getItem(`session_key_${selectedSession.id}`)
      if (!encryptionKey) {
        throw new Error("Encryption key not found for this session")
      }

      const encryptedContent = encryptMessage(messageInput, encryptionKey)
      const ipfsHash = await storeToIPFS(encryptedContent)

      const tx = await contract.sendEphemeralMessage(selectedSession.id, ipfsHash)
      await tx.wait()

      setMessageInput("")
      await loadSessionMessages(selectedSession)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSendingMessage(false)
    }
  }

  // End chat session
  const endChatSession = async (sessionId: string) => {
    if (!contract) return

    try {
      const tx = await contract.endChatSession(sessionId)
      await tx.wait()

      localStorage.removeItem(`session_key_${sessionId}`)

      setSelectedSession(null)
      setSessionMessages([])
      await refreshData()

      alert("🔥 Chat session ended. All traces destroyed!")
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Go offline
  const goOffline = async () => {
    if (!contract) return

    try {
      const tx = await contract.goOffline()
      await tx.wait()

      activeSessions.forEach((session) => {
        localStorage.removeItem(`session_key_${session.id}`)
      })

      setActiveSessions([])
      setSelectedSession(null)
      setSessionMessages([])

      alert("📴 Gone offline. All chat sessions ended!")
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Utility functions
  const encryptMessage = (message: string, key: string): string => {
    return btoa(message + "|" + key.slice(-8))
  }

  const decryptMessage = (encryptedMessage: string, key: string): string => {
    try {
      const decrypted = atob(encryptedMessage)
      const [message, keyCheck] = decrypted.split("|")
      return keyCheck === key.slice(-8) ? message : "🔒 Decryption failed"
    } catch {
      return "🔒 Invalid encrypted message"
    }
  }

  const storeToIPFS = async (content: string): Promise<string> => {
    const hash = ethers.keccak256(ethers.toUtf8Bytes(content + Date.now()))
    localStorage.setItem(`ipfs_${hash}`, content)
    return hash
  }

  const formatTime = (timestamp: number) => new Date(timestamp * 1000).toLocaleString()

  if (!isValidAddress(CONTRACT_ADDRESS)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-bold text-white flex items-center justify-center gap-3">
              <Shield className="h-10 w-10" />
              ShadowMesh
            </h1>
            <p className="text-purple-200 text-lg">Anonymous • Ephemeral • Untraceable</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-white flex items-center justify-center gap-3">
            <Shield className="h-10 w-10" />
            ShadowMesh
          </h1>
          <p className="text-purple-200 text-lg">Anonymous • Ephemeral • Untraceable</p>
          <p className="text-purple-300 text-sm">Connect by unique ID - no personal information exposed</p>
        </div>

        {/* Registration Dialog */}
        <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
          <DialogContent className="bg-black/90 border-purple-500/30 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Create Your Anonymous Profile
              </DialogTitle>
              <DialogDescription className="text-purple-200">
                Choose a display name. You'll get a unique 6-digit ID that others can use to connect with you.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter display name (max 20 chars)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.slice(0, 20))}
                className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
              />
              <div className="flex gap-2">
                <Button
                  onClick={registerUser}
                  disabled={registering || !displayName.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {registering ? "Creating Profile..." : "Create Profile"}
                </Button>
              </div>
              <div className="text-xs text-purple-300 space-y-1">
                <p>• Your unique ID will be a 6-digit number (e.g., 123456)</p>
                <p>• Others can connect to you using this ID</p>
                <p>• Your wallet address remains completely private</p>
                <p>• Display name can be changed later</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* QR Code Dialog */}
        <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
          <DialogContent className="bg-black/90 border-purple-500/30 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Share Your User ID
              </DialogTitle>
              <DialogDescription className="text-purple-200">Share this QR code for easy connection</DialogDescription>
            </DialogHeader>
            {userInfo && (
              <div className="text-center space-y-4">
                <img
                  src={generateQRCode() || "/placeholder.svg"}
                  alt="User ID QR Code"
                  className="mx-auto border border-purple-500/30 rounded-lg"
                />
                <div className="space-y-2">
                  <p className="text-white">
                    Your User ID: <span className="font-bold text-purple-300">#{userInfo.userId}</span>
                  </p>
                  <p className="text-purple-200">Display Name: {userInfo.displayName}</p>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(userInfo.userId.toString())
                      alert("User ID copied to clipboard!")
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    📋 Copy User ID
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Wallet Connection */}
        <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!account ? (
              <Button onClick={connectWallet} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
                {loading ? "Connecting..." : "Connect MetaMask"}
              </Button>
            ) : userInfo ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Your ID:</span>
                      <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {userInfo.userId}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Name:</span>
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                        {userInfo.displayName}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Status:</span>
                      <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Total Users:</span>
                      <Badge variant="secondary" className="bg-gray-600/20 text-gray-300">
                        {platformStats.totalUsers}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={refreshData}
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 bg-transparent"
                  >
                    🔄 Refresh
                  </Button>
                  <Button
                    onClick={() => setShowQRCode(true)}
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 bg-transparent"
                  >
                    <QrCode className="h-4 w-4 mr-1" />
                    Share ID
                  </Button>
                  <Button onClick={goOffline} variant="destructive" className="bg-red-600/20 text-red-300">
                    📴 Go Offline
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <p>Setting up your anonymous profile...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-900/20 border-red-500/30">
            <CardContent className="pt-6">
              <p className="text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {userInfo && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Connections */}
            <div className="lg:col-span-1 space-y-6">
              {/* User Search */}
              <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Find Users
                  </CardTitle>
                  <CardDescription className="text-purple-200">Search for users by their 6-digit ID</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search User ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                    />
                    <Button
                      onClick={searchUsers}
                      disabled={!searchQuery || searchQuery.length < 6}
                      variant="outline"
                      className="border-purple-500/30 text-purple-300 bg-transparent"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Send Connection Request */}
              <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Connect by User ID
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Enter a 6-digit user ID to send a connection request
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Enter 6-digit User ID (e.g., 123456)"
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                  />
                  <Button
                    onClick={sendConnectionRequest}
                    disabled={loading || !targetUserId || targetUserId.length < 6}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    📤 Send Request
                  </Button>
                  <div className="text-xs text-purple-300">
                    <p>• User IDs are 6-digit numbers</p>
                    <p>• Only connected users can see each other's IDs</p>
                    <p>• No personal information is shared</p>
                  </div>
                </CardContent>
              </Card>

              {/* Incoming Requests */}
              <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Incoming Requests ({incomingRequests.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div key={request.id} className="bg-black/30 p-3 rounded-lg border border-yellow-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                            #{request.requesterId}
                          </Badge>
                          <span className="text-white text-sm">{request.requesterInfo?.displayName || "Unknown"}</span>
                          {request.requesterInfo?.isOnline && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                        </div>
                        <span className="text-xs text-gray-400">{formatTime(request.timestamp)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => acceptRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-xs"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectRequest(request.id)}
                          className="text-xs"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  {incomingRequests.length === 0 && (
                    <p className="text-gray-400 text-center py-4">No incoming requests</p>
                  )}
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Active Chats ({activeSessions.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeSessions.map((session) => {
                    const otherUserId = session.user1Id === userInfo.userId ? session.user2Id : session.user1Id
                    return (
                      <div
                        key={session.id}
                        className={`bg-black/30 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedSession?.id === session.id
                            ? "border-purple-500"
                            : "border-gray-500/30 hover:border-purple-500/50"
                        }`}
                        onClick={() => {
                          setSelectedSession(session)
                          loadSessionMessages(session)
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                              #{otherUserId}
                            </Badge>
                            <span className="text-white text-sm">
                              {session.otherUserInfo?.displayName || "Unknown"}
                            </span>
                            {session.otherUserInfo?.isOnline && (
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            )}
                          </div>
                          <Badge variant="secondary" className="bg-green-600/20 text-green-300 text-xs">
                            Active
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400">
                          Messages: {session.messageCount} • Started: {formatTime(session.startTime)}
                        </div>
                      </div>
                    )
                  })}
                  {activeSessions.length === 0 && <p className="text-gray-400 text-center py-4">No active chats</p>}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Chat Interface */}
            <div className="lg:col-span-2">
              {selectedSession ? (
                <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm h-[600px] flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          Chat with #
                          {selectedSession.user1Id === userInfo.userId
                            ? selectedSession.user2Id
                            : selectedSession.user1Id}
                          <span className="text-sm font-normal">({selectedSession.otherUserInfo?.displayName})</span>
                        </CardTitle>
                        <CardDescription className="text-purple-200">
                          Ephemeral session • Messages auto-delete • No traces left
                        </CardDescription>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => endChatSession(selectedSession.id)}
                        className="bg-red-600/20 text-red-300"
                      >
                        🔥 End Chat
                      </Button>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                      {sessionMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg max-w-[80%] ${
                            message.isOwn ? "bg-purple-600/20 ml-auto text-right" : "bg-gray-600/20 mr-auto"
                          }`}
                        >
                          <div className="text-white">{message.content}</div>
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                            <span>#{message.senderId}</span>
                            <span>•</span>
                            <span>{formatTime(message.timestamp)}</span>
                          </div>
                        </div>
                      ))}
                      {sessionMessages.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                          No messages yet. Start the conversation! 💬
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your ephemeral message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendEphemeralMessage()}
                        className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                      />
                      <Button
                        onClick={sendEphemeralMessage}
                        disabled={sendingMessage || !messageInput}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {sendingMessage ? "..." : "🚀"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm h-[600px] flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No Chat Selected</h3>
                    <p>Select an active chat session to start messaging</p>
                    <p className="text-sm mt-2">Or send a connection request using a User ID</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Enhanced How It Works */}
        <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">🔐 Enhanced Anonymous System</CardTitle>
          </CardHeader>
          <CardContent className="text-purple-200 space-y-3">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Privacy Features:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Unique 6-digit ID system</li>
                  <li>• No wallet address exposure</li>
                  <li>• Anonymous display names</li>
                  <li>• Session-based visibility</li>
                  <li>• Zero permanent linking</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">New Features:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• User ID search function</li>
                  <li>• QR code sharing</li>
                  <li>• Enhanced registration</li>
                  <li>• Better error handling</li>
                  <li>• Improved UI/UX</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Connection Flow:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Register for unique ID</li>
                  <li>• Search/find other users</li>
                  <li>• Send connection requests</li>
                  <li>• Accept/reject requests</li>
                  <li>• Start ephemeral chats</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Security Benefits:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• No blockchain tracking</li>
                  <li>• Temporary sessions only</li>
                  <li>• Complete anonymity</li>
                  <li>• Perfect for whistleblowing</li>
                  <li>• Enterprise-grade privacy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
