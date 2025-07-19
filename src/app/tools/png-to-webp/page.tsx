"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, ImageIcon, RefreshCw, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface ConversionResult {
  originalSize: number
  convertedSize: number
  compressionRatio: number
  downloadUrl: string
  preview: string
}

export default function PNGToWebP() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState("80")
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/png")) {
      toast.error("Please select a PNG image file")
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error("File size must be less than 10MB")
      return
    }

    setFile(selectedFile)
    setResult(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)

    toast.success("PNG image selected successfully")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const convertToWebP = async () => {
    if (!file || !preview) {
      toast.error("Please select a PNG file first")
      return
    }

    setIsConverting(true)
    setProgress(0)

    try {
      // Simulate conversion process
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 20
        })
      }, 200)

      // Create canvas for conversion
      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = preview
      })

      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Could not get canvas context")

      ctx.drawImage(img, 0, 0)

      // Convert to WebP
      const webpDataUrl = canvas.toDataURL("image/webp", Number.parseInt(quality) / 100)

      // Convert data URL to blob
      const response = await fetch(webpDataUrl)
      const blob = await response.blob()

      const downloadUrl = URL.createObjectURL(blob)
      const originalSize = file.size
      const convertedSize = blob.size
      const compressionRatio = Math.round(((originalSize - convertedSize) / originalSize) * 100)

      setResult({
        originalSize,
        convertedSize,
        compressionRatio,
        downloadUrl,
        preview: webpDataUrl,
      })

      setProgress(100)
      toast.success("PNG converted to WebP successfully!")
    } catch (error) {
      toast.error("Failed to convert PNG to WebP. Please try again.")
      console.error("Conversion error:", error)
    } finally {
      setIsConverting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const downloadConverted = () => {
    if (result) {
      const link = document.createElement("a")
      link.href = result.downloadUrl
      link.download = `${file?.name.replace(".png", "") || "image"}.webp`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Download started!")
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    toast.success("File cleared")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">PNG to WebP Converter</h1>
          <p className="text-xl text-muted-foreground">
            Convert PNG images to modern WebP format with better compression
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload PNG Image
              </CardTitle>
              <CardDescription>Select a PNG image to convert to WebP format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Drop PNG image here or click to browse</p>
                <p className="text-sm text-muted-foreground">Supports PNG files up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>

              {preview && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <ImageIcon className="h-6 w-6 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium">{file?.name}</p>
                        <p className="text-sm text-muted-foreground">{file && formatFileSize(file.size)}</p>
                      </div>
                      <Button onClick={clearFile} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-32 object-contain bg-white rounded border"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quality">WebP Quality: {quality}%</Label>
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100% (Lossless)</SelectItem>
                        <SelectItem value="90">90% (Excellent quality)</SelectItem>
                        <SelectItem value="80">80% (High quality)</SelectItem>
                        <SelectItem value="70">70% (Good quality)</SelectItem>
                        <SelectItem value="60">60% (Medium quality)</SelectItem>
                        <SelectItem value="50">50% (Lower quality, smaller size)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Button onClick={convertToWebP} disabled={!file || isConverting} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                {isConverting ? "Converting..." : "Convert to WebP"}
              </Button>

              {isConverting && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-muted-foreground">{progress}% complete</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Results</CardTitle>
              <CardDescription>Download your converted WebP image</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <img
                      src={result.preview || "/placeholder.svg"}
                      alt="WebP Preview"
                      className="w-full h-32 object-contain bg-white rounded border mb-3"
                    />
                    <p className="font-medium text-green-800 text-center">WebP Conversion Complete!</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Original PNG</p>
                      <p className="text-lg font-bold">{formatFileSize(result.originalSize)}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">WebP Size</p>
                      <p className="text-lg font-bold text-blue-600">{formatFileSize(result.convertedSize)}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {result.compressionRatio > 0 ? `${result.compressionRatio}% smaller` : "Similar size"}
                    </Badge>
                  </div>

                  <Button onClick={downloadConverted} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download WebP Image
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload and convert a PNG to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Why Convert PNG to WebP?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">WebP Advantages:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 25-35% smaller file sizes than PNG</li>
                  <li>• Supports both lossy and lossless compression</li>
                  <li>• Maintains transparency like PNG</li>
                  <li>• Better compression algorithms</li>
                  <li>• Faster web page loading</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Best Practices:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use 80-90% quality for most images</li>
                  <li>• 100% quality for lossless conversion</li>
                  <li>• Test different quality settings</li>
                  <li>• Keep PNG originals as backup</li>
                  <li>• Check browser compatibility if needed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
