"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, RefreshCw, FileText, Zap } from "lucide-react"
import { toast } from "sonner"

const synonymDatabase: { [key: string]: string[] } = {
  good: ["excellent", "great", "outstanding", "superb", "wonderful", "fantastic"],
  bad: ["poor", "terrible", "awful", "horrible", "dreadful", "unacceptable"],
  big: ["large", "huge", "enormous", "massive", "gigantic", "substantial"],
  small: ["tiny", "little", "miniature", "compact", "petite", "minor"],
  important: ["crucial", "vital", "essential", "significant", "critical", "key"],
  easy: ["simple", "effortless", "straightforward", "uncomplicated", "basic", "elementary"],
  difficult: ["challenging", "complex", "complicated", "tough", "demanding", "intricate"],
  fast: ["quick", "rapid", "swift", "speedy", "hasty", "prompt"],
  slow: ["gradual", "leisurely", "unhurried", "deliberate", "sluggish", "steady"],
  new: ["fresh", "recent", "modern", "contemporary", "latest", "current"],
  old: ["ancient", "vintage", "traditional", "classic", "aged", "mature"],
  help: ["assist", "support", "aid", "facilitate", "contribute", "enable"],
  make: ["create", "produce", "generate", "construct", "build", "develop"],
  use: ["utilize", "employ", "apply", "implement", "operate", "leverage"],
  get: ["obtain", "acquire", "receive", "gain", "secure", "attain"],
  show: ["display", "demonstrate", "reveal", "exhibit", "present", "illustrate"],
  think: ["believe", "consider", "contemplate", "reflect", "ponder", "assume"],
  know: ["understand", "comprehend", "realize", "recognize", "acknowledge", "grasp"],
  work: ["function", "operate", "perform", "execute", "labor", "toil"],
  find: ["discover", "locate", "identify", "uncover", "detect", "spot"],
  give: ["provide", "offer", "supply", "deliver", "present", "grant"],
}

export default function ArticleRewriter() {
  const [originalText, setOriginalText] = useState("")
  const [rewrittenText, setRewrittenText] = useState("")
  const [rewriteMode, setRewriteMode] = useState("standard")
  const [isProcessing, setIsProcessing] = useState(false)

  const rewriteText = async () => {
    if (!originalText.trim()) {
      toast.error("Please enter some text to rewrite")
      return
    }

    setIsProcessing(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      const rewritten = originalText

      // Split into sentences
      const sentences = rewritten.split(/[.!?]+/).filter((s) => s.trim())

      const rewrittenSentences = sentences.map((sentence) => {
        let newSentence = sentence.trim()

        // Replace words with synonyms
        Object.keys(synonymDatabase).forEach((word) => {
          const synonyms = synonymDatabase[word]
          const regex = new RegExp(`\\b${word}\\b`, "gi")

          if (regex.test(newSentence)) {
            const randomSynonym = synonyms[Math.floor(Math.random() * synonyms.length)]
            newSentence = newSentence.replace(regex, randomSynonym)
          }
        })

        // Apply different rewriting strategies based on mode
        switch (rewriteMode) {
          case "creative":
            newSentence = rewriteCreatively(newSentence)
            break
          case "formal":
            newSentence = rewriteFormally(newSentence)
            break
          case "simple":
            newSentence = rewriteSimply(newSentence)
            break
          default:
            // Standard rewriting
            break
        }

        return newSentence
      })

      const finalText = rewrittenSentences.join(". ") + "."
      setRewrittenText(finalText)
      toast.success("Text rewritten successfully!")
    } catch (error) {
      toast.error("Error rewriting text. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const rewriteCreatively = (sentence: string) => {
    // Add creative variations
    const creativeStarters = ["Interestingly,", "Remarkably,", "Notably,", "Surprisingly,"]
    if (Math.random() > 0.7) {
      const starter = creativeStarters[Math.floor(Math.random() * creativeStarters.length)]
      return `${starter} ${sentence.toLowerCase()}`
    }
    return sentence
  }

  const rewriteFormally = (sentence: string) => {
    // Make more formal
    return sentence
      .replace(/don't/g, "do not")
      .replace(/can't/g, "cannot")
      .replace(/won't/g, "will not")
      .replace(/it's/g, "it is")
      .replace(/that's/g, "that is")
  }

  const rewriteSimply = (sentence: string) => {
    // Simplify complex words
    return sentence
      .replace(/utilize/g, "use")
      .replace(/demonstrate/g, "show")
      .replace(/facilitate/g, "help")
      .replace(/approximately/g, "about")
      .replace(/consequently/g, "so")
  }

  const copyRewritten = () => {
    if (!rewrittenText) {
      toast.error("No rewritten text to copy")
      return
    }
    navigator.clipboard.writeText(rewrittenText)
    toast.success("Rewritten text copied to clipboard!")
  }

  const clearAll = () => {
    setOriginalText("")
    setRewrittenText("")
    toast.success("All text cleared")
  }

  const getWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Article Rewriter</h1>
          <p className="text-xl text-muted-foreground">Rewrite your content while maintaining the original meaning</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Original Text
              </CardTitle>
              <CardDescription>Paste your content here to rewrite it</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="rewrite-mode">Rewriting Mode</Label>
                <Select value={rewriteMode} onValueChange={setRewriteMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="simple">Simple</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="original">Original Text</Label>
                <Textarea
                  id="original"
                  placeholder="Paste your article or text here..."
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  rows={12}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">Words: {getWordCount(originalText)}</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={rewriteText} disabled={isProcessing || !originalText.trim()} className="flex-1">
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Rewriting...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Rewrite Text
                    </>
                  )}
                </Button>
                <Button onClick={clearAll} variant="outline">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Rewritten Text
              </CardTitle>
              <CardDescription>Your rewritten content with improved readability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rewrittenText ? (
                <>
                  <Textarea
                    value={rewrittenText}
                    onChange={(e) => setRewrittenText(e.target.value)}
                    rows={12}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">Words: {getWordCount(rewrittenText)}</p>
                  <Button onClick={copyRewritten} className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Rewritten Text
                  </Button>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Rewritten text will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Rewriting Modes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Mode Descriptions:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <strong>Standard:</strong> Balanced rewriting with synonym replacement
                  </li>
                  <li>
                    • <strong>Creative:</strong> Adds creative elements and varied sentence structures
                  </li>
                  <li>
                    • <strong>Formal:</strong> Professional tone with formal language
                  </li>
                  <li>
                    • <strong>Simple:</strong> Simplified language for better readability
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Best Practices:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Always review rewritten content for accuracy</li>
                  <li>• Ensure the meaning remains unchanged</li>
                  <li>• Check for proper grammar and flow</li>
                  <li>• Use for inspiration, not final copy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
