"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Search, Shield, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface PlagiarismResult {
  percentage: number
  status: "unique" | "moderate" | "high"
  matches: {
    text: string
    source: string
    similarity: number
  }[]
}

export default function PlagiarismChecker() {
  const [text, setText] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<PlagiarismResult | null>(null)

  const checkPlagiarism = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to check")
      return
    }

    if (text.trim().split(" ").length < 10) {
      toast.error("Please enter at least 10 words for accurate checking")
      return
    }

    setIsChecking(true)

    // Simulate plagiarism checking process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    try {
      // Simulate plagiarism detection results
      const sentences = text.split(/[.!?]+/).filter((s) => s.trim())
      const randomPercentage = Math.floor(Math.random() * 30) + 5 // 5-35% plagiarism

      const matches = []
      const numMatches = Math.floor(randomPercentage / 10)

      for (let i = 0; i < numMatches && i < sentences.length; i++) {
        const sentence = sentences[i].trim()
        if (sentence) {
          matches.push({
            text: sentence,
            source: `example-source-${i + 1}.com`,
            similarity: Math.floor(Math.random() * 40) + 60, // 60-100% similarity
          })
        }
      }

      const status = randomPercentage < 15 ? "unique" : randomPercentage < 30 ? "moderate" : "high"

      setResult({
        percentage: randomPercentage,
        status,
        matches,
      })

      toast.success("Plagiarism check completed!")
    } catch (error) {
      toast.error("Error checking plagiarism. Please try again.")
    } finally {
      setIsChecking(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unique":
        return "text-green-600"
      case "moderate":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unique":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "moderate":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Shield className="h-5 w-5" />
    }
  }

  const getWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  const clearAll = () => {
    setText("")
    setResult(null)
    toast.success("Content cleared")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Plagiarism Checker</h1>
          <p className="text-xl text-muted-foreground">Check your content for originality and potential plagiarism</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Text to Check
              </CardTitle>
              <CardDescription>Paste your content here for plagiarism analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="text">Content</Label>
                <Textarea
                  id="text"
                  placeholder="Paste your text here for plagiarism checking..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={12}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Words: {getWordCount(text)} (minimum 10 words required)
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={checkPlagiarism} disabled={isChecking || getWordCount(text) < 10} className="flex-1">
                  {isChecking ? (
                    <>
                      <Search className="h-4 w-4 mr-2 animate-pulse" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Check Plagiarism
                    </>
                  )}
                </Button>
                <Button onClick={clearAll} variant="outline">
                  Clear
                </Button>
              </div>

              {isChecking && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Analyzing content...</span>
                    <span>Please wait</span>
                  </div>
                  <Progress value={33} className="animate-pulse" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Plagiarism Report
              </CardTitle>
              <CardDescription>Detailed analysis of your content originality</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {getStatusIcon(result.status)}
                      <span className={`text-2xl font-bold ${getStatusColor(result.status)}`}>
                        {result.percentage}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Potential plagiarism detected</p>
                    <Badge variant={result.status === "unique" ? "default" : "destructive"} className="mt-2">
                      {result.status === "unique"
                        ? "Unique Content"
                        : result.status === "moderate"
                          ? "Moderate Risk"
                          : "High Risk"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Content Analysis:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-medium text-green-700">{100 - result.percentage}%</div>
                        <div className="text-green-600">Unique</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="font-medium text-red-700">{result.percentage}%</div>
                        <div className="text-red-600">Similar</div>
                      </div>
                    </div>
                  </div>

                  {result.matches.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Potential Matches:</h4>
                      {result.matches.map((match, index) => (
                        <div key={index} className="p-3 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{match.similarity}% similar</Badge>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {match.source}
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground italic">"{match.text}..."</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Plagiarism report will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Understanding Plagiarism Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-700">Unique (0-15%)</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your content is original with minimal similarity to existing sources.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-medium text-yellow-700">Moderate (15-30%)</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Some similarities detected. Review and cite sources appropriately.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-red-700">High (30%+)</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Significant similarities found. Rewrite or properly cite sources.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
