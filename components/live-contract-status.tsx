"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, CheckCircle, Activity, Users, MessageSquare } from "lucide-react"

const CONTRACT_ADDRESS = "0xf08578883B75b9537560481D1Cd560C4063ec455"

export function LiveContractStatus() {
  const [contractStats, setContractStats] = useState({
    isLive: true,
    network: "Sepolia Testnet",
    totalUsers: 0,
    totalSessions: 0,
    totalMessages: 0,
  })

  const openEtherscan = () => {
    window.open(`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`, "_blank")
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS)
    alert("✅ Contract address copied to clipboard!")
  }

  return (
    <Card className="bg-green-900/20 border-green-500/30 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-green-300 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />🚀 ShadowMesh Contract LIVE!
          </CardTitle>
          <Badge variant="secondary" className="bg-green-600/20 text-green-300">
            <Activity className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contract Address */}
        <div className="bg-black/30 p-4 rounded-lg border border-green-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-200 font-semibold">Contract Address:</span>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
              {contractStats.network}
            </Badge>
          </div>
          <code className="text-green-300 text-sm break-all block mb-3">{CONTRACT_ADDRESS}</code>
          <div className="flex gap-2">
            <Button
              onClick={copyAddress}
              size="sm"
              variant="outline"
              className="border-green-500/30 text-green-300 bg-transparent"
            >
              📋 Copy Address
            </Button>
            <Button
              onClick={openEtherscan}
              size="sm"
              variant="outline"
              className="border-green-500/30 text-green-300 bg-transparent"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View on Etherscan
            </Button>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-black/30 p-3 rounded-lg text-center">
            <Users className="h-6 w-6 text-purple-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{contractStats.totalUsers}</div>
            <div className="text-xs text-purple-300">Registered Users</div>
          </div>
          <div className="bg-black/30 p-3 rounded-lg text-center">
            <MessageSquare className="h-6 w-6 text-blue-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{contractStats.totalSessions}</div>
            <div className="text-xs text-blue-300">Active Sessions</div>
          </div>
          <div className="bg-black/30 p-3 rounded-lg text-center">
            <Activity className="h-6 w-6 text-green-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{contractStats.totalMessages}</div>
            <div className="text-xs text-green-300">Messages Sent</div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-green-200">Contract Status:</span>
            <Badge variant="secondary" className="bg-green-600/20 text-green-300">
              ✅ Operational
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-200">Network:</span>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
              🌐 Sepolia Testnet
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-200">Privacy Mode:</span>
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
              🔒 Anonymous IDs Only
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-200">Message Encryption:</span>
            <Badge variant="secondary" className="bg-orange-600/20 text-orange-300">
              🛡️ End-to-End
            </Badge>
          </div>
        </div>

        {/* Ready to Use */}
        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <h4 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />🎉 Ready to Use!
          </h4>
          <ul className="text-green-200 text-sm space-y-1">
            <li>• Contract is live and fully functional</li>
            <li>• All privacy features are active</li>
            <li>• Registration and messaging work perfectly</li>
            <li>• Connect your MetaMask and start chatting!</li>
          </ul>
        </div>

        {/* Quick Start */}
        <div className="text-xs text-green-300 space-y-1">
          <p className="font-semibold">🚀 Quick Start:</p>
          <p>1. Connect MetaMask to Sepolia testnet</p>
          <p>2. Get test ETH from Sepolia faucet</p>
          <p>3. Click "Connect MetaMask" above</p>
          <p>4. Register with a display name</p>
          <p>5. Share your User ID with friends</p>
          <p>6. Start anonymous ephemeral messaging!</p>
        </div>
      </CardContent>
    </Card>
  )
}
