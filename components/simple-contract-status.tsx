"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, CheckCircle, Activity, Copy } from "lucide-react"

const CONTRACT_ADDRESS = "0xC70A42B3CAa6324E2D2ec64ae5D18d25E379169F"

export function SimpleContractStatus() {
  const [copied, setCopied] = useState(false)

  const openEtherscan = () => {
    window.open(`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`, "_blank")
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
              Sepolia Testnet
            </Badge>
          </div>
          <div className="bg-black/50 p-3 rounded mb-3">
            <code className="text-green-300 text-sm break-all">{CONTRACT_ADDRESS}</code>
          </div>
          <div className="flex gap-2">
            <Button onClick={copyAddress} size="sm" className="bg-green-600 hover:bg-green-700">
              <Copy className="h-3 w-3 mr-1" />
              {copied ? "Copied!" : "Copy"}
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

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-green-200">Contract Status:</span>
              <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                ✅ Deployed
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-200">Network:</span>
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                🌐 Sepolia
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-green-200">Privacy Mode:</span>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                🔒 Anonymous
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-200">Encryption:</span>
              <Badge variant="secondary" className="bg-orange-600/20 text-orange-300">
                🛡️ E2E
              </Badge>
            </div>
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
        <div className="bg-black/30 border border-gray-500/30 p-3 rounded-lg">
          <h4 className="text-white font-semibold mb-2">🚀 Quick Start:</h4>
          <ol className="text-gray-300 text-sm space-y-1">
            <li>1. Connect MetaMask to Sepolia testnet</li>
            <li>2. Get test ETH from Sepolia faucet</li>
            <li>3. Click "Connect MetaMask" above</li>
            <li>4. Register with a display name</li>
            <li>5. Share your User ID with friends</li>
            <li>6. Start anonymous ephemeral messaging!</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
