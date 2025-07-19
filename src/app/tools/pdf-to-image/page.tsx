"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, FileText, ImageIcon, AlertCircle, Package } from "lucide-react"
import { toast } from "sonner"

interface ConversionResult {
  images: {
    name: string
    pageNumber: number
    downloadUrl: string
    size: string
  }[]
  totalPages: number
  format: string
}

export default function PDFToImage() {
  const [file, setFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState("png")
  const [quality, setQuality] = useState("high")
  const [pageRange, setPageRange] = useState("all")
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      toast.error("Please select a PDF file")
      return
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      // 50MB limit
      toast.error("File size must be less than 50MB")
      return
    }

    setFile(selectedFile)
    setResult(null)
    toast.success("PDF file selected successfully")
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

  const convertPDF = async () => {
    if (!file) {
      toast.error("Please select a PDF file first")
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
          return prev + 15
        })
      }, 500)

      // Simulate conversion delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate simulated conversion results
      const totalPages = Math.floor(Math.random() * 20) + 5 // Simulate 5-25 pages
      const images: ConversionResult["images"] = []

      const pagesToConvert = pageRange === "all" ? totalPages : Math.min(5, totalPages)

      for (let i = 1; i <= pagesToConvert; i++) {
        // Create a canvas to generate a sample image
        const canvas = document.createElement("canvas")
        canvas.width = quality === "high" ? 1200 : quality === "medium" ? 800 : 600
        canvas.height = Math.floor(canvas.width * 1.414) // A4 ratio

        const ctx = canvas.getContext("2d")
        if (ctx) {
          // Create a simple placeholder image
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.fillStyle = "#000000"
          ctx.font = "48px Arial"
          ctx.textAlign = "center"
          ctx.fillText(`Page ${i}`, canvas.width / 2, canvas.height / 2)
          ctx.font = "24px Arial"
          ctx.fillText(file.name, canvas.width / 2, canvas.height / 2 + 60)
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const downloadUrl = URL.createObjectURL(blob)
              const extension = outputFormat
              const fileName = `${file.name.replace(".pdf", "")}_page_${i}.${extension}`
              const size = formatFileSize(blob.size)

              images.push({
                name: fileName,
                pageNumber: i,
                downloadUrl,
                size,
              })
            }
          },
          `image/${outputFormat}`,
          outputFormat === "jpg" ? 0.9 : undefined,
        )
      }

      // Wait a bit for blob creation
      await new Promise((resolve) => setTimeout(resolve, 500))

      setResult({
        images,
        totalPages: pagesToConvert,
        format: outputFormat.toUpperCase(),
      })

      setProgress(100)
      toast.success(`PDF converted to ${images.length} ${outputFormat.toUpperCase()} images!`)
    } catch (error) {
      toast.error("Failed to convert PDF. Please try again.")
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

  const downloadImage = (downloadUrl: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Download started!")
  }

  const downloadAll = () => {
    if (result) {
      result.images.forEach((image, index) => {
        setTimeout(() => {
          downloadImage(image.downloadUrl, image.name)
        }, index * 500) // Stagger downloads
      })
      toast.success("All images download started!")
    }
  }

  const getQualityDescription = (quality: string) => {
    switch (quality) {
      case "high":
        return "300 DPI (Best quality, larger files)"
      case "medium":
        return "150 DPI (Good quality, medium files)"
      case "low":
        return "72 DPI (Web quality, smaller files)"
      default:
        return ""
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">PDF to Image Converter</h1>
          <p className="text-xl text-muted-foreground">Convert PDF pages to high-quality images</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload & Configure
              </CardTitle>
              <CardDescription>Select a PDF file and choose conversion settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Drop PDF file here or click to browse</p>
                <p className="text-sm text-muted-foreground">Supports PDF files up to 50MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>

              {file && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-red-600" />
                    <div className="flex-1">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="outputFormat">Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG (Best quality, transparency support)</SelectItem>
                      <SelectItem value="jpg">JPG (Smaller files, no transparency)</SelectItem>
                      <SelectItem value="webp">WebP (Modern format, good compression)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quality">Image Quality</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High - {getQualityDescription("high")}</SelectItem>
                      <SelectItem value="medium">Medium - {getQualityDescription("medium")}</SelectItem>
                      <SelectItem value="low">Low - {getQualityDescription("low")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="pageRange">Pages to Convert</Label>
                  <Select value={pageRange} onValueChange={setPageRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All pages</SelectItem>
                      <SelectItem value="first5">First 5 pages only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={convertPDF} disabled={!file || isConverting} className="w-full">
                <ImageIcon className="h-4 w-4 mr-2" />
                {isConverting ? "Converting..." : `Convert to ${outputFormat.toUpperCase()}`}
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
              <CardDescription>Download your converted images</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {result.totalPages} {result.format} images
                    </Badge>
                    <Button onClick={downloadAll} variant="outline" size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {result.images.map((image, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <ImageIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{image.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Page {image.pageNumber} • {image.size}
                            </p>
                          </div>
                          <Button
                            onClick={() => downloadImage(image.downloadUrl, image.name)}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload and convert a PDF to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Format Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-3">PNG Format:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Lossless compression</li>
                  <li>• Supports transparency</li>
                  <li>• Best for text and graphics</li>
                  <li>• Larger file sizes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">JPG Format:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Lossy compression</li>
                  <li>• No transparency support</li>
                  <li>• Good for photos</li>
                  <li>• Smaller file sizes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">WebP Format:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Modern compression</li>
                  <li>• Supports transparency</li>
                  <li>• Best compression ratio</li>
                  <li>• Good browser support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
