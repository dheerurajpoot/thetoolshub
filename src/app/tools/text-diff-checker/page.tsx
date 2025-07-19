"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Copy, GitCompare, RotateCcw } from "lucide-react"
import { toast } from "sonner"

interface DiffResult {
  additions: number
  deletions: number
  changes: {
    type: "added" | "removed" | "unchanged"
    text: string
    lineNumber: number
  }[]
}

export default function TextDiffChecker() {
  const [originalText, setOriginalText] = useState("")
  const [modifiedText, setModifiedText] = useState("")
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null)

  const calculateDiff = () => {
    if (!originalText.trim() || !modifiedText.trim()) {
      toast.error("Please enter both original and modified text")
      return
    }

    const originalLines = originalText.split("\n")
    const modifiedLines = modifiedText.split("\n")

    const changes: DiffResult["changes"] = []
    let additions = 0
    let deletions = 0

    // Simple diff algorithm
    const maxLines = Math.max(originalLines.length, modifiedLines.length)

    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i] || ""
      const modifiedLine = modifiedLines[i] || ""

      if (originalLine === modifiedLine) {
        changes.push({
          type: "unchanged",
          text: originalLine,
          lineNumber: i + 1,
        })
      } else if (!originalLine && modifiedLine) {
        changes.push({
          type: "added",
          text: modifiedLine,
          lineNumber: i + 1,
        })
        additions++
      } else if (originalLine && !modifiedLine) {
        changes.push({
          type: "removed",
          text: originalLine,
          lineNumber: i + 1,
        })
        deletions++
      } else {
        // Line was modified
        changes.push({
          type: "removed",
          text: originalLine,
          lineNumber: i + 1,
        })
        changes.push({
          type: "added",
          text: modifiedLine,
          lineNumber: i + 1,
        })
        additions++
        deletions++
      }
    }

    setDiffResult({ additions, deletions, changes })
    toast.success("Diff calculated successfully!")
  }

  const copyDiff = () => {
    if (!diffResult) {
      toast.error("No diff to copy")
      return
    }

    const diffText = diffResult.changes
      .map((change) => {
        const prefix = change.type === "added" ? "+ " : change.type === "removed" ? "- " : "  "
        return `${prefix}${change.text}`
      })
      .join("\n")

    navigator.clipboard.writeText(diffText)
    toast.success("Diff copied to clipboard!")
  }

  const swapTexts = () => {
    const temp = originalText
    setOriginalText(modifiedText)
    setModifiedText(temp)
    setDiffResult(null)
    toast.success("Texts swapped!")
  }

  const clearAll = () => {
    setOriginalText("")
    setModifiedText("")
    setDiffResult(null)
    toast.success("All content cleared")
  }

  const getLineClass = (type: string) => {
    switch (type) {
      case "added":
        return "bg-green-50 border-l-4 border-green-500 text-green-800"
      case "removed":
        return "bg-red-50 border-l-4 border-red-500 text-red-800"
      default:
        return "bg-gray-50"
    }
  }

  const getLinePrefix = (type: string) => {
    switch (type) {
      case "added":
        return "+ "
      case "removed":
        return "- "
      default:
        return "  "
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Text Diff Checker</h1>
          <p className="text-xl text-muted-foreground">Compare two texts and see the differences line by line</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Original Text</CardTitle>
              <CardDescription>Enter the original version of your text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter original text here..."
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                rows={12}
                className="resize-none font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Lines: {originalText.split("\n").length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modified Text</CardTitle>
              <CardDescription>Enter the modified version of your text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter modified text here..."
                value={modifiedText}
                onChange={(e) => setModifiedText(e.target.value)}
                rows={12}
                className="resize-none font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Lines: {modifiedText.split("\n").length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 mt-6">
          <Button onClick={calculateDiff} className="flex-1">
            <GitCompare className="h-4 w-4 mr-2" />
            Compare Texts
          </Button>
          <Button onClick={swapTexts} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Swap
          </Button>
          <Button onClick={clearAll} variant="outline">
            Clear All
          </Button>
        </div>

        {diffResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                Diff Results
              </CardTitle>
              <CardDescription>
                Line-by-line comparison showing additions, deletions, and unchanged content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-green-700 border-green-300">
                  +{diffResult.additions} additions
                </Badge>
                <Badge variant="outline" className="text-red-700 border-red-300">
                  -{diffResult.deletions} deletions
                </Badge>
                <Button onClick={copyDiff} variant="outline" size="sm" className="ml-auto bg-transparent">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Diff
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {diffResult.changes.map((change, index) => (
                    <div key={index} className={`px-4 py-1 font-mono text-sm ${getLineClass(change.type)}`}>
                      <span className="inline-block w-8 text-gray-500 text-xs">{change.lineNumber}</span>
                      <span className="font-medium mr-2">{getLinePrefix(change.type)}</span>
                      <span>{change.text || " "}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Use Text Diff Checker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Understanding the Output:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <span className="text-green-700 font-medium">Green lines (+)</span>: Added content
                  </li>
                  <li>
                    • <span className="text-red-700 font-medium">Red lines (-)</span>: Removed content
                  </li>
                  <li>
                    • <span className="text-gray-700 font-medium">Gray lines</span>: Unchanged content
                  </li>
                  <li>• Line numbers help track position in text</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Common Use Cases:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Compare document versions</li>
                  <li>• Review code changes</li>
                  <li>• Track content modifications</li>
                  <li>• Identify text differences</li>
                  <li>• Merge conflict resolution</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
