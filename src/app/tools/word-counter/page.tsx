"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Type, FileText, Clock, BarChart3 } from "lucide-react"

export default function WordCounter() {
  const [text, setText] = useState("")
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  })

  useEffect(() => {
    const calculateStats = () => {
      const characters = text.length
      const charactersNoSpaces = text.replace(/\s/g, "").length
      const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length
      const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
      const readingTime = Math.ceil(words / 200) // Average reading speed: 200 words per minute

      setStats({
        characters,
        charactersNoSpaces,
        words,
        sentences,
        paragraphs,
        readingTime,
      })
    }

    calculateStats()
  }, [text])

  const statCards = [
    { label: "Characters", value: stats.characters, icon: Type, color: "text-blue-600" },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces, icon: Type, color: "text-green-600" },
    { label: "Words", value: stats.words, icon: FileText, color: "text-purple-600" },
    { label: "Sentences", value: stats.sentences, icon: BarChart3, color: "text-orange-600" },
    { label: "Paragraphs", value: stats.paragraphs, icon: BarChart3, color: "text-red-600" },
    { label: "Reading Time (min)", value: stats.readingTime, icon: Clock, color: "text-indigo-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Type className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Word Counter</h1>
          <p className="text-gray-600">Count words, characters, sentences, and more in your text</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Text Input */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 h-full">
              <CardHeader>
                <CardTitle>Enter Your Text</CardTitle>
                <CardDescription>Type or paste your text below to get real-time statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="text-input">Text Content</Label>
                  <Textarea
                    id="text-input"
                    placeholder="Start typing or paste your text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[400px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Statistics</h2>
            {statCards.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={index} className="shadow-lg border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
                      </div>
                      <IconComponent className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Additional Info */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Quick Facts</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    • Average word length: {stats.words > 0 ? (stats.charactersNoSpaces / stats.words).toFixed(1) : 0}{" "}
                    characters
                  </p>
                  <p>
                    • Average sentence length: {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : 0}{" "}
                    words
                  </p>
                  <p>• Most common word length: 4-5 characters</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
