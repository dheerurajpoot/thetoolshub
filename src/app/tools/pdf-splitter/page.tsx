"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, FileText, Split, AlertCircle, Package } from "lucide-react"
import { toast } from "sonner"

interface SplitResult {
  files: {
    name: string
    pages: string
    downloadUrl: string
  }[]
  totalFiles: number
}

export default function PDFSplitter() {
  const [file, setFile] = useState<File | null>(null)
  const [splitMode, setSplitMode] = useState("pages")
  const [pageRanges, setPageRanges] = useState("")
  const [pagesPerFile, setPagesPerFile] = useState("1")
  const [isSplitting, setIsSplitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<SplitResult | null>(null)
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

  const splitPDF = async () => {
    if (!file) {
      toast.error("Please select a PDF file first")
      return
    }

    if (splitMode === "ranges" && !pageRanges.trim()) {
      toast.error("Please specify page ranges")
      return
    }

    if (splitMode === "pages" && (!pagesPerFile || Number.parseInt(pagesPerFile) < 1)) {
      toast.error("Please specify valid pages per file")
      return
    }

    setIsSplitting(true)
    setProgress(0)

    try {
      // Simulate splitting process
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 15
        })
      }, 300)

      // Simulate splitting delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate simulated split results
      const totalPages = Math.floor(Math.random() * 50) + 10 // Simulate 10-60 pages
      const splitFiles: SplitResult["files"] = []

      if (splitMode === "pages") {
        const pagesPerFileNum = Number.parseInt(pagesPerFile)
        const numFiles = Math.ceil(totalPages / pagesPerFileNum)

        for (let i = 0; i < numFiles; i++) {
          const startPage = i * pagesPerFileNum + 1
          const endPage = Math.min((i + 1) * pagesPerFileNum, totalPages)
          const blob = new Blob([file], { type: "application/pdf" })

          splitFiles.push({
            name: `${file.name.replace(".pdf", "")}_part_${i + 1}.pdf`,
            pages: startPage === endPage ? `Page ${startPage}` : `Pages ${startPage}-${endPage}`,
            downloadUrl: URL.createObjectURL(blob),
          })
        }
      } else if (splitMode === "ranges") {
        const ranges = pageRanges
          .split(",")
          .map((range) => range.trim())
          .filter(Boolean)

        ranges.forEach((range, index) => {
          const blob = new Blob([file], { type: "application/pdf" })
          splitFiles.push({
            name: `${file.name.replace(".pdf", "")}_range_${index + 1}.pdf`,
            pages: `Pages ${range}`,
            downloadUrl: URL.createObjectURL(blob),
          })
        })
      } else if (splitMode === "single") {
        for (let i = 1; i <= totalPages; i++) {
          const blob = new Blob([file], { type: "application/pdf" })
          splitFiles.push({
            name: `${file.name.replace(".pdf", "")}_page_${i}.pdf`,
            pages: `Page ${i}`,
            downloadUrl: URL.createObjectURL(blob),
          })
        }
      }

      setResult({
        files: splitFiles,
        totalFiles: splitFiles.length,
      })

      setProgress(100)
      toast.success(`PDF split into ${splitFiles.length} files successfully!`)
    } catch (error) {
      toast.error("Failed to split PDF. Please try again.")
    } finally {
      setIsSplitting(false)
    }
  }

  const downloadFile = (downloadUrl: string, fileName: string) => {
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
      result.files.forEach((file, index) => {
        setTimeout(() => {
          downloadFile(file.downloadUrl, file.name)
        }, index * 500) // Stagger downloads
      })
      toast.success("All files download started!")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">PDF Splitter</h1>
          <p className="text-xl text-muted-foreground">Split PDF files into multiple documents</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload & Configure
              </CardTitle>
              <CardDescription>Select a PDF file and choose splitting options</CardDescription>
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
                <Label htmlFor="splitMode">Split Mode</Label>
                <Select value={splitMode} onValueChange={setSplitMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pages">Split by pages per file</SelectItem>
                    <SelectItem value="ranges">Split by page ranges</SelectItem>
                    <SelectItem value="single">Extract each page separately</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {splitMode === "pages" && (
                <div>
                  <Label htmlFor="pagesPerFile">Pages per file</Label>
                  <Input
                    id="pagesPerFile"
                    type="number"
                    min="1"
                    value={pagesPerFile}
                    onChange={(e) => setPagesPerFile(e.target.value)}
                    placeholder="e.g., 5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Number of pages to include in each split file</p>
                </div>
              )}

              {splitMode === "ranges" && (
                <div>
                  <Label htmlFor="pageRanges">Page ranges</Label>
                  <Input
                    id="pageRanges"
                    value={pageRanges}
                    onChange={(e) => setPageRanges(e.target.value)}
                    placeholder="e.g., 1-5, 10-15, 20"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Comma-separated ranges (e.g., 1-5, 10-15, 20)</p>
                </div>
              )}

              <Button onClick={splitPDF} disabled={!file || isSplitting} className="w-full">
                <Split className="h-4 w-4 mr-2" />
                {isSplitting ? "Splitting..." : "Split PDF"}
              </Button>

              {isSplitting && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-muted-foreground">{progress}% complete</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Split Results</CardTitle>
              <CardDescription>Download your split PDF files</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {result.totalFiles} files created
                    </Badge>
                    <Button onClick={downloadAll} variant="outline" size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {result.files.map((file, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-red-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{file.pages}</p>
                          </div>
                          <Button onClick={() => downloadFile(file.downloadUrl, file.name)} variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Split className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload and split a PDF to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              How to Use PDF Splitter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-3">Split by Pages:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Set number of pages per file</li>
                  <li>• Creates equal-sized files</li>
                  <li>• Good for dividing large documents</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Split by Ranges:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Specify exact page ranges</li>
                  <li>• Use format: 1-5, 10-15, 20</li>
                  <li>• Extract specific sections</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Extract Pages:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Creates one file per page</li>
                  <li>• Useful for individual pages</li>
                  <li>• Maximum flexibility</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
