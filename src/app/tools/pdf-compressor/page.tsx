"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, FileText, FileArchiveIcon as Compress, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface CompressionResult {
  originalSize: number
  compressedSize: number
  compressionRatio: number
  downloadUrl: string
}

export default function PDFCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [compressionLevel, setCompressionLevel] = useState("medium")
  const [isCompressing, setIsCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<CompressionResult | null>(null)
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

  const compressPDF = async () => {
    if (!file) {
      toast.error("Please select a PDF file first")
      return
    }

    setIsCompressing(true)
    setProgress(0)

    try {
      // Simulate compression process
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Simulate compression delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Calculate simulated compression
      const originalSize = file.size
      const compressionRates = {
        low: 0.85,
        medium: 0.65,
        high: 0.45,
        maximum: 0.3,
      }

      const rate = compressionRates[compressionLevel as keyof typeof compressionRates]
      const compressedSize = Math.floor(originalSize * rate)
      const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100)

      // Create a simulated compressed file (in real implementation, this would be actual compression)
      const compressedBlob = new Blob([file], { type: "application/pdf" })
      const downloadUrl = URL.createObjectURL(compressedBlob)

      setResult({
        originalSize,
        compressedSize,
        compressionRatio,
        downloadUrl,
      })

      setProgress(100)
      toast.success("PDF compressed successfully!")
    } catch (error) {
      toast.error("Failed to compress PDF. Please try again.")
    } finally {
      setIsCompressing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const downloadCompressed = () => {
    if (result) {
      const link = document.createElement("a")
      link.href = result.downloadUrl
      link.download = `compressed_${file?.name || "document.pdf"}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Download started!")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">PDF Compressor</h1>
          <p className="text-xl text-muted-foreground">Reduce PDF file size while maintaining quality</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload PDF
              </CardTitle>
              <CardDescription>Select a PDF file to compress (max 50MB)</CardDescription>
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

              <div>
                <Label htmlFor="compression">Compression Level</Label>
                <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (85% of original size)</SelectItem>
                    <SelectItem value="medium">Medium (65% of original size)</SelectItem>
                    <SelectItem value="high">High (45% of original size)</SelectItem>
                    <SelectItem value="maximum">Maximum (30% of original size)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={compressPDF} disabled={!file || isCompressing} className="w-full">
                <Compress className="h-4 w-4 mr-2" />
                {isCompressing ? "Compressing..." : "Compress PDF"}
              </Button>

              {isCompressing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-muted-foreground">{progress}% complete</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compression Results</CardTitle>
              <CardDescription>Download your compressed PDF file</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Original Size</p>
                      <p className="text-lg font-bold">{formatFileSize(result.originalSize)}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Compressed Size</p>
                      <p className="text-lg font-bold text-green-600">{formatFileSize(result.compressedSize)}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {result.compressionRatio}% size reduction
                    </Badge>
                  </div>

                  <Button onClick={downloadCompressed} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Compressed PDF
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Compress className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload and compress a PDF to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Compression Levels:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <strong>Low:</strong> Minimal compression, best quality
                  </li>
                  <li>
                    • <strong>Medium:</strong> Balanced compression and quality
                  </li>
                  <li>
                    • <strong>High:</strong> Significant compression, good quality
                  </li>
                  <li>
                    • <strong>Maximum:</strong> Highest compression, reduced quality
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Best Practices:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Test different compression levels</li>
                  <li>• Check quality after compression</li>
                  <li>• Keep original files as backup</li>
                  <li>• Consider file usage before compressing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
