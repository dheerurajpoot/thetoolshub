"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PasswordAnalysis {
  score: number
  strength: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong" | "Very Strong"
  checks: {
    length: boolean
    lowercase: boolean
    uppercase: boolean
    numbers: boolean
    symbols: boolean
    noCommon: boolean
    noPersonal: boolean
  }
  suggestions: string[]
  estimatedCrackTime: string
}

const commonPasswords = [
  "password",
  "123456",
  "123456789",
  "qwerty",
  "abc123",
  "password123",
  "admin",
  "letmein",
  "welcome",
  "monkey",
  "1234567890",
  "dragon",
]

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null)

  useEffect(() => {
    if (password) {
      analyzePassword(password)
    } else {
      setAnalysis(null)
    }
  }, [password])

  const analyzePassword = (pwd: string) => {
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      numbers: /\d/.test(pwd),
      symbols: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
      noCommon: !commonPasswords.includes(pwd.toLowerCase()),
      noPersonal: true, // Simplified - in real app would check against user data
    }

    let score = 0
    if (checks.length) score += 20
    if (checks.lowercase) score += 10
    if (checks.uppercase) score += 10
    if (checks.numbers) score += 15
    if (checks.symbols) score += 20
    if (checks.noCommon) score += 15
    if (checks.noPersonal) score += 10

    // Bonus for length
    if (pwd.length >= 12) score += 10
    if (pwd.length >= 16) score += 10

    const strength = getStrengthLabel(score)
    const suggestions = generateSuggestions(checks, pwd)
    const estimatedCrackTime = calculateCrackTime(pwd, score)

    setAnalysis({
      score,
      strength,
      checks,
      suggestions,
      estimatedCrackTime,
    })
  }

  const getStrengthLabel = (score: number): PasswordAnalysis["strength"] => {
    if (score < 30) return "Very Weak"
    if (score < 50) return "Weak"
    if (score < 70) return "Fair"
    if (score < 85) return "Good"
    if (score < 95) return "Strong"
    return "Very Strong"
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "Very Weak":
        return "text-red-600"
      case "Weak":
        return "text-red-500"
      case "Fair":
        return "text-yellow-600"
      case "Good":
        return "text-blue-600"
      case "Strong":
        return "text-green-600"
      case "Very Strong":
        return "text-green-700"
      default:
        return "text-gray-600"
    }
  }

  const getProgressColor = (score: number) => {
    if (score < 30) return "bg-red-500"
    if (score < 50) return "bg-red-400"
    if (score < 70) return "bg-yellow-500"
    if (score < 85) return "bg-blue-500"
    return "bg-green-500"
  }

  const generateSuggestions = (checks: PasswordAnalysis["checks"], pwd: string): string[] => {
    const suggestions = []

    if (!checks.length) suggestions.push("Use at least 8 characters (12+ recommended)")
    if (!checks.lowercase) suggestions.push("Add lowercase letters (a-z)")
    if (!checks.uppercase) suggestions.push("Add uppercase letters (A-Z)")
    if (!checks.numbers) suggestions.push("Include numbers (0-9)")
    if (!checks.symbols) suggestions.push("Add special characters (!@#$%^&*)")
    if (!checks.noCommon) suggestions.push("Avoid common passwords")

    if (pwd.length < 12) suggestions.push("Consider using 12+ characters for better security")
    if (suggestions.length === 0) suggestions.push("Excellent! Your password meets all security criteria")

    return suggestions
  }

  const calculateCrackTime = (pwd: string, score: number): string => {
    const length = pwd.length
    const hasLower = /[a-z]/.test(pwd)
    const hasUpper = /[A-Z]/.test(pwd)
    const hasNumbers = /\d/.test(pwd)
    const hasSymbols = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)

    let charset = 0
    if (hasLower) charset += 26
    if (hasUpper) charset += 26
    if (hasNumbers) charset += 10
    if (hasSymbols) charset += 32

    const combinations = Math.pow(charset, length)
    const guessesPerSecond = 1000000000 // 1 billion guesses per second

    const seconds = combinations / (2 * guessesPerSecond) // Average case

    if (seconds < 1) return "Instantly"
    if (seconds < 60) return "Less than a minute"
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`
    return "Centuries"
  }

  const CheckIcon = ({ passed }: { passed: boolean }) =>
    passed ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Password Strength Checker</h1>
          <p className="text-xl text-muted-foreground">Test your password strength and get security recommendations</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Password Input
              </CardTitle>
              <CardDescription>Enter your password to analyze its strength</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your password is not stored or transmitted anywhere
                </p>
              </div>

              {analysis && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Strength Score</Label>
                      <Badge className={getStrengthColor(analysis.strength)}>{analysis.strength}</Badge>
                    </div>
                    <Progress value={analysis.score} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">{analysis.score}/100 points</p>
                  </div>

                  <div>
                    <Label className="text-sm">Estimated Crack Time</Label>
                    <p className="text-lg font-medium mt-1">{analysis.estimatedCrackTime}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Analysis</CardTitle>
              <CardDescription>Detailed breakdown of your password security</CardDescription>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Security Checks</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckIcon passed={analysis.checks.length} />
                        <span>At least 8 characters</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckIcon passed={analysis.checks.lowercase} />
                        <span>Contains lowercase letters</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckIcon passed={analysis.checks.uppercase} />
                        <span>Contains uppercase letters</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckIcon passed={analysis.checks.numbers} />
                        <span>Contains numbers</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckIcon passed={analysis.checks.symbols} />
                        <span>Contains special characters</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckIcon passed={analysis.checks.noCommon} />
                        <span>Not a common password</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Suggestions</Label>
                    <div className="space-y-2">
                      {analysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a password to see security analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Password Security Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Creating Strong Passwords:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use at least 12 characters (longer is better)</li>
                  <li>• Mix uppercase, lowercase, numbers, and symbols</li>
                  <li>• Avoid dictionary words and personal information</li>
                  <li>• Use unique passwords for each account</li>
                  <li>• Consider using passphrases with random words</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Additional Security:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Enable two-factor authentication (2FA)</li>
                  <li>• Use a reputable password manager</li>
                  <li>• Regularly update important passwords</li>
                  <li>• Never share passwords via email or text</li>
                  <li>• Monitor accounts for suspicious activity</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
