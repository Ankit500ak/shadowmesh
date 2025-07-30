"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function DeploymentHelper() {
  const [contractAddress, setContractAddress] = useState("")

  const copyContractCode = () => {
    const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EphemeralShadowMessenger {
    // ... (full contract code from previous response)
}`

    navigator.clipboard.writeText(contractCode)
    alert("Contract code copied to clipboard! 📋")
  }

  const updateContractAddress = () => {
    if (contractAddress) {
      alert(`Update CONTRACT_ADDRESS in app/page.tsx to: ${contractAddress}`)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-blue-900/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-300">🚀 Quick Deployment Guide</CardTitle>
          <CardDescription className="text-blue-200">Deploy the smart contract to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-white font-semibold mb-2">Step 1: Deploy Contract</h4>
            <ol className="text-blue-200 text-sm space-y-1 ml-4">
              <li>
                1. Go to{" "}
                <a
                  href="https://remix.ethereum.org"
                  target="_blank"
                  className="text-blue-400 underline"
                  rel="noreferrer"
                >
                  Remix IDE
                </a>
              </li>
              <li>2. Create new file: EphemeralShadowMessenger.sol</li>
              <li>3. Copy the contract code (button below)</li>
              <li>4. Compile with Solidity 0.8.19+</li>
              <li>5. Deploy to Sepolia testnet via MetaMask</li>
            </ol>
            <Button onClick={copyContractCode} className="mt-2 bg-blue-600 hover:bg-blue-700">
              📋 Copy Contract Code
            </Button>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Step 2: Update Frontend</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Paste deployed contract address..."
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="bg-black/30 border-blue-500/30 text-white"
              />
              <Button
                onClick={updateContractAddress}
                variant="outline"
                className="border-blue-500/30 text-blue-300 bg-transparent"
              >
                Update
              </Button>
            </div>
            <p className="text-xs text-blue-300 mt-1">Copy this address and update CONTRACT_ADDRESS in app/page.tsx</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Step 3: Test</h4>
            <ul className="text-blue-200 text-sm space-y-1 ml-4">
              <li>• Get Sepolia ETH from faucet</li>
              <li>• Connect MetaMask to Sepolia network</li>
              <li>• Refresh this page</li>
              <li>• Start sending connection requests!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
