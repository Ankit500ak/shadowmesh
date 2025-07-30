"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Rocket, Shield, Users, MessageSquare, Zap } from "lucide-react"

export function DeploymentSuccess() {
  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Anonymous User IDs",
      description: "6-digit IDs instead of wallet addresses",
      status: "✅ Active",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Ephemeral Messaging",
      description: "Messages auto-delete after 1 hour",
      status: "✅ Active",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Connection Requests",
      description: "Send/accept requests by User ID",
      status: "✅ Active",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Session Destruction",
      description: "Complete cleanup when chat ends",
      status: "✅ Active",
    },
  ]

  return (
    <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Rocket className="h-6 w-6 text-green-400" />🎉 ShadowMesh Successfully Deployed!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Success Message */}
        <div className="text-center space-y-2">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
          <h3 className="text-2xl font-bold text-white">Deployment Complete!</h3>
          <p className="text-green-200">
            Your ShadowMesh contract is live on Sepolia testnet and ready for anonymous messaging.
          </p>
        </div>

        {/* Feature Status */}
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="bg-black/30 p-4 rounded-lg border border-green-500/20">
              <div className="flex items-start gap-3">
                <div className="text-green-400 mt-1">{feature.icon}</div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{feature.title}</h4>
                  <p className="text-gray-300 text-sm mb-2">{feature.description}</p>
                  <Badge variant="secondary" className="bg-green-600/20 text-green-300 text-xs">
                    {feature.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
          <h4 className="text-blue-300 font-semibold mb-3">🚀 What's Next?</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="text-white font-medium mb-2">For Users:</h5>
              <ul className="text-blue-200 space-y-1">
                <li>• Connect MetaMask wallet</li>
                <li>• Register for unique User ID</li>
                <li>• Share ID with trusted contacts</li>
                <li>• Start anonymous messaging</li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-medium mb-2">For Developers:</h5>
              <ul className="text-blue-200 space-y-1">
                <li>• Deploy to mainnet for production</li>
                <li>• Add real-time notifications</li>
                <li>• Implement group messaging</li>
                <li>• Add voice/video calling</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Highlights */}
        <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
          <h4 className="text-purple-300 font-semibold mb-3">🔒 Privacy & Security</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h5 className="text-white font-medium mb-1">Zero Tracking</h5>
              <p className="text-purple-200">No wallet addresses exposed publicly</p>
            </div>
            <div>
              <h5 className="text-white font-medium mb-1">Ephemeral Data</h5>
              <p className="text-purple-200">All messages auto-delete completely</p>
            </div>
            <div>
              <h5 className="text-white font-medium mb-1">Anonymous IDs</h5>
              <p className="text-purple-200">Only 6-digit IDs for connections</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3">
            🚀 Start Anonymous Messaging Now!
          </Button>
          <p className="text-gray-400 text-xs mt-2">Connect your wallet above to begin using ShadowMesh</p>
        </div>
      </CardContent>
    </Card>
  )
}
