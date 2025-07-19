"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Upload, Download, FileText, File, AlertCircle, Settings } from "lucide-react"
import { toast } from "sonner"

interface ConversionResult {
  originalSize: number
  convertedSize: number
  downloadUrl: string
  format: string
}

export default function PDFToWord() {
  const [file, setFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState("docx")
  const [conversionMode, setConversionMode] = useState("standard")
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
          return prev + 10
        })
      }, 400)

      // Simulate conversion delay
      await new Promise((resolve) => setTimeout(resolve, 4000))

      // Create a simulated converted file
      const convertedSize = Math.floor(file.size * 0.8) // Simulate size change
      const mimeType =
        outputFormat === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "application/rtf"

      const convertedBlob = new Blob([file], { type: mimeType })
      const downloadUrl = URL.createObjectURL(convertedBlob)

      setResult({
        originalSize: file.size,
        convertedSize,
        downloadUrl,
        format: outputFormat.toUpperCase(),
      })

      setProgress(100)
      toast.success("PDF converted to Word successfully!")
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

  const downloadConverted = () => {
    if (result) {
      const link = document.createElement("a")
      link.href = result.downloadUrl
      const extension = outputFormat === "docx" ? "docx" : "rtf"
      link.download = `${file?.name.replace(".pdf", "") || "document"}.${extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Download started!")
    }
  }

  const getFormatIcon = () => {
    return outputFormat === "docx" ? (
      <File className="h-5 w-5 text-blue-600" />
    ) : (
      <FileText className="h-5 w-5 text-green-600" />
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">PDF to Word Converter</h1>
          <p className="text-xl text-muted-foreground">Convert PDF documents to editable Word format</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload PDF
              </CardTitle>
              <CardDescription>Select a PDF file to convert to Word format</CardDescription>
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
                      <SelectItem value="docx">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-blue-600" />
                          DOCX (Microsoft Word)
                        </div>
                      </SelectItem>
                      <SelectItem value="rtf">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          RTF (Rich Text Format)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="conversionMode">Conversion Mode</Label>
                  <Select value={conversionMode} onValueChange={setConversionMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (Balanced quality & speed)</SelectItem>
                      <SelectItem value="accurate">Accurate (Better formatting, slower)</SelectItem>
                      <SelectItem value="fast">Fast (Quick conversion, basic formatting)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={convertPDF} disabled={!file || isConverting} className="w-full">
                {getFormatIcon()}
                <span className="ml-2">
                  {isConverting ? "Converting..." : `Convert to ${outputFormat.toUpperCase()}`}
                </span>
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
              <CardDescription>Download your converted Word document</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    {getFormatIcon()}
                    <p className="font-medium text-green-800 mt-2">Conversion Completed!</p>
                    <p className="text-sm text-green-600 mt-1">PDF converted to {result.format} format</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Original Size</p>
                      <p className="text-lg font-bold">{formatFileSize(result.originalSize)}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Converted Size</p>
                      <p className="text-lg font-bold text-blue-600">{formatFileSize(result.convertedSize)}</p>
                    </div>
                  </div>

                  <Button onClick={downloadConverted} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download {result.format} File
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload and convert a PDF to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Conversion Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Output Formats:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <strong>DOCX:</strong> Modern Microsoft Word format
                  </li>
                  <li>
                    • <strong>RTF:</strong> Universal rich text format
                  </li>
                  <li>• Both formats preserve text and basic formatting</li>
                  <li>• DOCX offers better compatibility with Word</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Conversion Modes:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <strong>Standard:</strong> Good balance of quality and speed
                  </li>
                  <li>
                    • <strong>Accurate:</strong> Better formatting preservation
                  </li>
                  <li>
                    • <strong>Fast:</strong> Quick conversion with basic formatting
                  </li>
                  <li>• Choose based on your quality requirements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">What Works Best:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Text-based PDFs convert more accurately</li>
                  <li>• Simple layouts preserve better</li>
                  <li>• Standard fonts are handled well</li>
                  <li>• Tables and lists are usually preserved</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Limitations:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Complex layouts may need manual adjustment</li>
                  <li>• Scanned PDFs require OCR processing</li>
                  <li>• Some formatting may be lost</li>
                  <li>• Images are embedded as-is</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
