"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, TestTube } from "lucide-react"

interface TestResult {
  name: string
  status: "pass" | "fail" | "pending"
  description: string
}

export function TestVerification() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Contract Deployment", status: "pending", description: "Smart contract deployed to Sepolia" },
    { name: "Frontend Connection", status: "pending", description: "Frontend connects to contract" },
    { name: "User Registration", status: "pending", description: "User can register and get unique ID" },
    { name: "User Search", status: "pending", description: "Can search for users by ID" },
    { name: "QR Code Generation", status: "pending", description: "QR codes generate correctly" },
    { name: "Connection Requests", status: "pending", description: "Can send/receive connection requests" },
    { name: "Chat Sessions", status: "pending", description: "Chat sessions create successfully" },
    { name: "Message Encryption", status: "pending", description: "Messages are encrypted properly" },
    { name: "Session Cleanup", status: "pending", description: "Sessions destroy completely" },
    { name: "Privacy Protection", status: "pending", description: "No sensitive data exposed" },
  ])

  const updateTest = (index: number, status: "pass" | "fail") => {
    setTests((prev) => prev.map((test, i) => (i === index ? { ...test, status } : test)))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "fail":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-green-600/20 text-green-300"
      case "fail":
        return "bg-red-600/20 text-red-300"
      default:
        return "bg-yellow-600/20 text-yellow-300"
    }
  }

  const passedTests = tests.filter((t) => t.status === "pass").length
  const totalTests = tests.length
  const allPassed = passedTests === totalTests

  return (
    <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          System Verification ({passedTests}/{totalTests})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <p className="text-white font-medium">{test.name}</p>
                  <p className="text-gray-400 text-sm">{test.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className={getStatusColor(test.status)}>
                  {test.status}
                </Badge>
                {test.status === "pending" && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() => updateTest(index, "pass")}
                      className="bg-green-600 hover:bg-green-700 text-xs"
                    >
                      ✓
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateTest(index, "fail")}
                      variant="destructive"
                      className="text-xs"
                    >
                      ✗
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {allPassed && (
          <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg text-center">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-green-300 font-semibold text-lg">🎉 All Tests Passed!</h3>
            <p className="text-green-200 text-sm">ShadowMesh is fully functional and ready for use!</p>
          </div>
        )}

        <div className="text-xs text-purple-300 space-y-1">
          <p>• Test each feature manually and mark as pass/fail</p>
          <p>• All tests must pass for production readiness</p>
          <p>• Report any failures for debugging</p>
        </div>
      </CardContent>
    </Card>
  )
}
