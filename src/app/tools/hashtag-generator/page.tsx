"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Hash, Shuffle, Trash2 } from "lucide-react"
import { toast } from "sonner"

const hashtagDatabase = {
  general: ["trending", "viral", "popular", "amazing", "awesome", "cool", "best", "top", "new", "hot"],
  business: [
    "entrepreneur",
    "startup",
    "business",
    "success",
    "marketing",
    "sales",
    "growth",
    "innovation",
    "leadership",
    "networking",
  ],
  lifestyle: [
    "lifestyle",
    "daily",
    "life",
    "inspiration",
    "motivation",
    "wellness",
    "selfcare",
    "mindfulness",
    "happiness",
    "positivity",
  ],
  food: ["food", "foodie", "delicious", "yummy", "cooking", "recipe", "chef", "restaurant", "homemade", "tasty"],
  travel: [
    "travel",
    "wanderlust",
    "adventure",
    "explore",
    "vacation",
    "trip",
    "journey",
    "destination",
    "backpacking",
    "tourism",
  ],
  fitness: [
    "fitness",
    "workout",
    "gym",
    "health",
    "exercise",
    "training",
    "bodybuilding",
    "cardio",
    "strength",
    "wellness",
  ],
  technology: [
    "tech",
    "technology",
    "innovation",
    "digital",
    "ai",
    "coding",
    "programming",
    "software",
    "gadgets",
    "future",
  ],
  fashion: ["fashion", "style", "outfit", "ootd", "trendy", "chic", "designer", "shopping", "beauty", "accessories"],
  photography: [
    "photography",
    "photo",
    "photographer",
    "camera",
    "art",
    "creative",
    "capture",
    "moment",
    "beautiful",
    "artistic",
  ],
  music: ["music", "song", "artist", "musician", "concert", "live", "studio", "album", "playlist", "sound"],
}

export default function HashtagGenerator() {
  const [keyword, setKeyword] = useState("")
  const [category, setCategory] = useState("general")
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([])
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])

  const generateHashtags = () => {
    if (!keyword.trim()) {
      toast.error("Please enter a keyword")
      return
    }

    const baseKeyword = keyword.toLowerCase().replace(/\s+/g, "")
    const categoryHashtags = hashtagDatabase[category as keyof typeof hashtagDatabase] || hashtagDatabase.general

    const hashtags = [
      baseKeyword,
      `${baseKeyword}2024`,
      `${baseKeyword}life`,
      `${baseKeyword}love`,
      `${baseKeyword}daily`,
      ...categoryHashtags.slice(0, 15),
      ...generateRelatedHashtags(baseKeyword),
    ]

    // Remove duplicates and add # prefix
    const uniqueHashtags = [...new Set(hashtags)].map((tag) => `#${tag}`)
    setGeneratedHashtags(uniqueHashtags.slice(0, 30))
    toast.success("Hashtags generated successfully!")
  }

  const generateRelatedHashtags = (keyword: string) => {
    const variations = [
      `${keyword}gram`,
      `${keyword}er`,
      `${keyword}ing`,
      `${keyword}s`,
      `love${keyword}`,
      `${keyword}addict`,
      `${keyword}community`,
      `${keyword}world`,
      `${keyword}time`,
      `${keyword}vibes`,
    ]
    return variations
  }

  const toggleHashtag = (hashtag: string) => {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(selectedHashtags.filter((h) => h !== hashtag))
    } else {
      setSelectedHashtags([...selectedHashtags, hashtag])
    }
  }

  const copySelected = () => {
    if (selectedHashtags.length === 0) {
      toast.error("Please select some hashtags first")
      return
    }
    navigator.clipboard.writeText(selectedHashtags.join(" "))
    toast.success(`${selectedHashtags.length} hashtags copied to clipboard!`)
  }

  const copyAll = () => {
    if (generatedHashtags.length === 0) {
      toast.error("No hashtags to copy")
      return
    }
    navigator.clipboard.writeText(generatedHashtags.join(" "))
    toast.success("All hashtags copied to clipboard!")
  }

  const clearSelected = () => {
    setSelectedHashtags([])
    toast.success("Selection cleared")
  }

  const shuffleHashtags = () => {
    const shuffled = [...generatedHashtags].sort(() => Math.random() - 0.5)
    setGeneratedHashtags(shuffled)
    toast.success("Hashtags shuffled!")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Hashtag Generator</h1>
          <p className="text-xl text-muted-foreground">Generate relevant hashtags for your social media posts</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Generate Hashtags
              </CardTitle>
              <CardDescription>Enter a keyword and select a category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="keyword">Keyword</Label>
                <Input
                  id="keyword"
                  placeholder="e.g., coffee, travel, fitness"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="food">Food & Cooking</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="fitness">Fitness & Health</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="fashion">Fashion & Style</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateHashtags} className="w-full">
                Generate Hashtags
              </Button>

              {selectedHashtags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Selected ({selectedHashtags.length})</Label>
                    <Button onClick={clearSelected} variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={copySelected} variant="outline" className="flex-1 bg-transparent">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Selected
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Generated Hashtags</CardTitle>
              <CardDescription>Click hashtags to select them, then copy your selection</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedHashtags.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={copyAll} variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All
                    </Button>
                    <Button onClick={shuffleHashtags} variant="outline" size="sm">
                      <Shuffle className="h-4 w-4 mr-2" />
                      Shuffle
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {generatedHashtags.map((hashtag, index) => (
                      <Badge
                        key={index}
                        variant={selectedHashtags.includes(hashtag) ? "default" : "secondary"}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => toggleHashtag(hashtag)}
                      >
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Hash className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a keyword and generate hashtags</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hashtag Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Instagram Tips:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use 20-30 hashtags per post</li>
                  <li>• Mix popular and niche hashtags</li>
                  <li>• Research hashtag popularity</li>
                  <li>• Create branded hashtags</li>
                  <li>• Hide hashtags in comments</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">General Guidelines:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Keep hashtags relevant to content</li>
                  <li>• Avoid banned or flagged hashtags</li>
                  <li>• Use trending hashtags when appropriate</li>
                  <li>• Monitor hashtag performance</li>
                  <li>• Update hashtag strategy regularly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
