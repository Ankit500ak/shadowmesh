"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowRight, CheckCircle } from "lucide-react"

export function MigrationNotice() {
  const oldContract = "0xC70A42B3CAa6324E2D2ec64ae5D18d25E379169F"
  const newContract = "0xf08578883B75b9537560481D1Cd560C4063ec455"

  return (
    <Card className="bg-yellow-900/20 border-yellow-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-yellow-300 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />📢 Contract Migration Complete
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-black/30 p-4 rounded-lg">
          <h4 className="text-white font-semibold mb-3">🔄 Contract Update Summary:</h4>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-red-600/20 text-red-300">
                OLD
              </Badge>
              <code className="text-red-300 text-xs">{oldContract}</code>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-yellow-400" />
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                NEW
              </Badge>
              <code className="text-green-300 text-xs">{newContract}</code>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-white font-medium mb-2">🔧 Issues Fixed:</h5>
            <ul className="text-yellow-200 text-sm space-y-1">
              <li>• Registration execution errors</li>
              <li>• User ID generation conflicts</li>
              <li>• Poor error handling</li>
              <li>• Gas optimization issues</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-medium mb-2">✨ Improvements:</h5>
            <ul className="text-yellow-200 text-sm space-y-1">
              <li>• Smoother user registration</li>
              <li>• Better unique ID system</li>
              <li>• Enhanced error messages</li>
              <li>• Optimized contract calls</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg text-center">
          <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <p className="text-green-300 font-semibold">✅ Migration Complete!</p>
          <p className="text-green-200 text-sm">All users can now register and use ShadowMesh without issues.</p>
        </div>

        <div className="text-xs text-yellow-300 space-y-1">
          <p>• Frontend automatically updated to use new contract</p>
          <p>• All previous functionality preserved and improved</p>
          <p>• No action required from users</p>
        </div>
      </CardContent>
    </Card>
  )
}
