"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, CheckCircle, ChevronDown, ChevronUp, Info } from "lucide-react"

const CONTRACT_ADDRESS = "0x1A90681f89579b41eEc65d3647BAE2CEd2b6b634"

export function ContractInfo() {
  const [isExpanded, setIsExpanded] = useState(false)

  const openEtherscan = () => {
    window.open(`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`, "_blank")
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS)
    alert("Contract address copied to clipboard! 📋")
  }

  return (
    <Card className="bg-green-900/20 border-green-500/30 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-green-300 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Contract Successfully Deployed!
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-green-300 hover:bg-green-500/10"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
            <div className="text-sm text-blue-200">
              <p className="font-semibold mb-1">Why is this shown?</p>
              <ul className="space-y-1 text-xs">
                <li>• Contract addresses are public by design</li>
                <li>• Allows verification on Etherscan</li>
                <li>• Ensures transparency and trust</li>
                <li>• No private information is exposed</li>
              </ul>
            </div>
          </div>

          <div>
            <p className="text-green-200 mb-2">Your ShadowMesh contract is live on Sepolia testnet:</p>
            <div className="bg-black/30 p-3 rounded-lg border border-green-500/30">
              <code className="text-green-300 text-sm break-all">{CONTRACT_ADDRESS}</code>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={copyAddress}
              variant="outline"
              size="sm"
              className="border-green-500/30 text-green-300 bg-transparent"
            >
              📋 Copy Address
            </Button>
            <Button
              onClick={openEtherscan}
              variant="outline"
              size="sm"
              className="border-green-500/30 text-green-300 bg-transparent"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View on Etherscan
            </Button>
          </div>

          <div className="text-sm text-green-200">
            <p className="font-semibold mb-1">✅ Ready to use:</p>
            <ul className="space-y-1 ml-4">
              <li>• Connect your MetaMask wallet</li>
              <li>• Send connection requests to other users</li>
              <li>• Start ephemeral chat sessions</li>
              <li>• Experience truly private messaging!</li>
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
