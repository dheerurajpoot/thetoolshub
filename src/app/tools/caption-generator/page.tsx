"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, Sparkles, RefreshCw, Heart } from "lucide-react"
import { toast } from "sonner"

const captionTemplates = {
  motivational: [
    "Dream big, work hard, stay focused. {topic} is just the beginning! ✨",
    "Every step forward is progress. Keep pushing towards your {topic} goals! 💪",
    "Success isn't just about what you accomplish, but what you inspire others to do. {topic} 🌟",
    "The journey of a thousand miles begins with a single step. Start your {topic} adventure today! 🚀",
    "Believe in yourself and all that you are. Your {topic} journey is unique and beautiful! 💫",
  ],
  funny: [
    "When life gives you {topic}, make it Instagram-worthy! 😂",
    "Me: I'll just post one photo about {topic}. Also me: *posts 47 stories* 🤳",
    "Current mood: {topic} and coffee. That's it, that's the post ☕",
    "Plot twist: {topic} was actually the main character all along 🎭",
    "Breaking news: Local person discovers {topic} and won't stop talking about it 📰",
  ],
  professional: [
    "Excited to share insights about {topic} with our community. What are your thoughts? 💼",
    "Reflecting on the impact of {topic} in today's landscape. Innovation never stops! 🔄",
    "Grateful for the opportunity to explore {topic} and its potential. Learning never ends! 📚",
    "Collaboration and {topic} go hand in hand. Together, we achieve more! 🤝",
    "The future of {topic} is bright, and we're here for the journey! 🌅",
  ],
  lifestyle: [
    "Living my best life, one {topic} moment at a time! ✨",
    "Simple pleasures: {topic} and good vibes only 🌸",
    "Finding joy in the little things, especially {topic}! 💕",
    "Weekend mood: {topic} and zero plans. Perfect! 🌿",
    "Life is beautiful when you appreciate {topic} moments like these 🌺",
  ],
  travel: [
    "Wanderlust and {topic} - the perfect combination! 🌍",
    "Collecting memories, not things. {topic} edition! ✈️",
    "Adventure awaits around every corner. Today's discovery: {topic}! 🗺️",
    "Home is where the heart is, but {topic} is where the soul feels free 🏔️",
    "Not all who wander are lost, some are just looking for the best {topic}! 🧭",
  ],
  food: [
    "Good food, good mood! This {topic} is everything! 🍽️",
    "Life's too short for bad {topic}. This one hits different! 😋",
    "Happiness is homemade, especially when it involves {topic}! 👨‍🍳",
    "Food is love made visible, and this {topic} is pure love! ❤️",
    "Warning: This {topic} may cause extreme happiness and food coma! 🤤",
  ],
}

const hashtagSuggestions = {
  motivational: ["#motivation", "#inspiration", "#success", "#goals", "#mindset", "#growth"],
  funny: ["#funny", "#humor", "#meme", "#lol", "#comedy", "#relatable"],
  professional: ["#business", "#professional", "#career", "#networking", "#leadership", "#innovation"],
  lifestyle: ["#lifestyle", "#wellness", "#selfcare", "#mindfulness", "#happiness", "#positivity"],
  travel: ["#travel", "#wanderlust", "#adventure", "#explore", "#vacation", "#journey"],
  food: ["#food", "#foodie", "#delicious", "#yummy", "#cooking", "#recipe"],
}

export default function CaptionGenerator() {
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("motivational")
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([])
  const [selectedCaption, setSelectedCaption] = useState("")

  const generateCaptions = () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic")
      return
    }

    const templates = captionTemplates[tone as keyof typeof captionTemplates]
    const captions = templates.map((template) => template.replace(/{topic}/g, topic.trim()))

    setGeneratedCaptions(captions)
    toast.success("Captions generated successfully!")
  }

  const copyCaption = (caption: string) => {
    const hashtags = hashtagSuggestions[tone as keyof typeof hashtagSuggestions].join(" ")
    const fullCaption = `${caption}\n\n${hashtags}`
    navigator.clipboard.writeText(fullCaption)
    toast.success("Caption copied with hashtags!")
  }

  const regenerateCaptions = () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first")
      return
    }
    generateCaptions()
  }

  const customizeCaption = (caption: string) => {
    setSelectedCaption(caption)
  }

  const copyCustomCaption = () => {
    if (!selectedCaption.trim()) {
      toast.error("No caption to copy")
      return
    }
    const hashtags = hashtagSuggestions[tone as keyof typeof hashtagSuggestions].join(" ")
    const fullCaption = `${selectedCaption}\n\n${hashtags}`
    navigator.clipboard.writeText(fullCaption)
    toast.success("Custom caption copied with hashtags!")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Caption Generator</h1>
          <p className="text-xl text-muted-foreground">Create engaging captions for your social media posts</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Caption Settings
              </CardTitle>
              <CardDescription>Customize your caption style and topic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="topic">Topic/Subject</Label>
                <Input
                  id="topic"
                  placeholder="e.g., coffee, workout, sunset"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="tone">Tone & Style</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motivational">Motivational</SelectItem>
                    <SelectItem value="funny">Funny/Humorous</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="food">Food & Dining</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateCaptions} className="w-full">
                Generate Captions
              </Button>

              {generatedCaptions.length > 0 && (
                <Button onClick={regenerateCaptions} variant="outline" className="w-full bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              )}

              <div>
                <Label className="text-sm">Suggested Hashtags</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {hashtagSuggestions[tone as keyof typeof hashtagSuggestions].map((hashtag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Generated Captions</CardTitle>
              <CardDescription>Click on any caption to customize it, or copy directly</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedCaptions.length > 0 ? (
                <div className="space-y-4">
                  {generatedCaptions.map((caption, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => customizeCaption(caption)}
                    >
                      <p className="text-sm mb-3">{caption}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Heart className="h-3 w-3" />
                          <span>Click to customize</span>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            copyCaption(caption)
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a topic and generate captions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedCaption && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Customize Caption</CardTitle>
              <CardDescription>Edit the selected caption to make it perfect for your post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={selectedCaption}
                onChange={(e) => setSelectedCaption(e.target.value)}
                rows={4}
                placeholder="Customize your caption here..."
              />
              <div className="flex gap-2">
                <Button onClick={copyCustomCaption} className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Custom Caption
                </Button>
                <Button onClick={() => setSelectedCaption("")} variant="outline">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Caption Writing Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Engagement Tips:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Ask questions to encourage comments</li>
                  <li>• Use emojis to add personality</li>
                  <li>• Include a call-to-action</li>
                  <li>• Share personal stories or experiences</li>
                  <li>• Keep it authentic and genuine</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Best Practices:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Front-load important information</li>
                  <li>• Use line breaks for readability</li>
                  <li>• Include relevant hashtags</li>
                  <li>• Match tone to your brand voice</li>
                  <li>• Test different caption lengths</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
