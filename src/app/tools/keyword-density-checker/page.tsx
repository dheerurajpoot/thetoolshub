"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, Search, BarChart3 } from "lucide-react"

export default function KeywordDensityChecker() {
  const [text, setText] = useState("")
  const [targetKeyword, setTargetKeyword] = useState("")
  const [analysis, setAnalysis] = useState<any>(null)

  const analyzeKeywordDensity = () => {
    if (!text.trim()) return

    const words = text.toLowerCase().match(/\b\w+\b/g) || []
    const totalWords = words.length

    // Count word frequency
    const wordCount: { [key: string]: number } = {}
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })

    // Sort by frequency
    const sortedWords = Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)

    // Calculate densities
    const keywordDensities = sortedWords.map(([word, count]) => ({
      word,
      count,
      density: ((count / totalWords) * 100).toFixed(2),
    }))

    // Target keyword analysis
    let targetAnalysis = null
    if (targetKeyword.trim()) {
      const targetCount = wordCount[targetKeyword.toLowerCase()] || 0
      const targetDensity = ((targetCount / totalWords) * 100).toFixed(2)

      targetAnalysis = {
        keyword: targetKeyword,
        count: targetCount,
        density: targetDensity,
        recommendation: getRecommendation(Number.parseFloat(targetDensity)),
      }
    }

    setAnalysis({
      totalWords,
      uniqueWords: Object.keys(wordCount).length,
      keywordDensities,
      targetAnalysis,
      readingTime: Math.ceil(totalWords / 200),
    })
  }

  const getRecommendation = (density: number) => {
    if (density === 0) return { text: "Keyword not found", color: "text-red-600" }
    if (density < 1) return { text: "Too low - consider adding more", color: "text-yellow-600" }
    if (density <= 3) return { text: "Good density range", color: "text-green-600" }
    if (density <= 5) return { text: "Slightly high - consider reducing", color: "text-yellow-600" }
    return { text: "Too high - reduce keyword usage", color: "text-red-600" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Keyword Density Checker</h1>
          <p className="text-gray-600">Analyze keyword density and optimize your content for SEO</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Content Analysis</CardTitle>
              <CardDescription>Enter your content and target keyword for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Target Keyword (Optional)</Label>
                <Input
                  placeholder="Enter your target keyword"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Content Text</Label>
                <Textarea
                  placeholder="Paste your content here for keyword density analysis..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-64 resize-none"
                />
              </div>

              <Button
                onClick={analyzeKeywordDensity}
                disabled={!text.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <Search className="w-4 h-4 mr-2" />
                Analyze Keyword Density
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analysis Results
              </CardTitle>
              <CardDescription>Keyword density analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-6">
                  {/* Overview Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-blue-600">Total Words</p>
                      <p className="text-xl font-bold text-blue-800">{analysis.totalWords}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-green-600">Unique Words</p>
                      <p className="text-xl font-bold text-green-800">{analysis.uniqueWords}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-purple-600">Reading Time</p>
                      <p className="text-xl font-bold text-purple-800">{analysis.readingTime}m</p>
                    </div>
                  </div>

                  {/* Target Keyword Analysis */}
                  {analysis.targetAnalysis && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h3 className="font-semibold text-yellow-800 mb-2">
                        Target Keyword: "{analysis.targetAnalysis.keyword}"
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <p className="text-sm text-yellow-600">Count</p>
                          <p className="text-lg font-bold text-yellow-800">{analysis.targetAnalysis.count}</p>
                        </div>
                        <div>
                          <p className="text-sm text-yellow-600">Density</p>
                          <p className="text-lg font-bold text-yellow-800">{analysis.targetAnalysis.density}%</p>
                        </div>
                      </div>
                      <p className={`text-sm font-medium ${analysis.targetAnalysis.recommendation.color}`}>
                        {analysis.targetAnalysis.recommendation.text}
                      </p>
                    </div>
                  )}

                  {/* Top Keywords */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">Top Keywords by Density</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {analysis.keywordDensities.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                            <span className="font-medium text-gray-800">{item.word}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">{item.density}%</p>
                            <p className="text-xs text-gray-500">{item.count} times</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4" />
                  <p>Enter your content to analyze keyword density</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* SEO Tips */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">💡 SEO Keyword Density Tips:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <ul className="space-y-2">
                <li>
                  • <strong>Ideal density:</strong> 1-3% for primary keywords
                </li>
                <li>
                  • <strong>Avoid keyword stuffing:</strong> Over 5% can hurt rankings
                </li>
                <li>
                  • <strong>Use variations:</strong> Include synonyms and related terms
                </li>
                <li>
                  • <strong>Natural placement:</strong> Keywords should flow naturally
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  • <strong>Focus on quality:</strong> Content value over keyword count
                </li>
                <li>
                  • <strong>Long-tail keywords:</strong> Often more effective than single words
                </li>
                <li>
                  • <strong>Context matters:</strong> Semantic relevance is important
                </li>
                <li>
                  • <strong>Monitor competitors:</strong> Analyze top-ranking content
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
