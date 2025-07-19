"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Download, Plus, Trash2, Globe, FileText } from "lucide-react"
import { toast } from "sonner"

interface SitemapUrl {
  url: string
  priority: string
  changefreq: string
  lastmod: string
}

export default function SitemapGenerator() {
  const [urls, setUrls] = useState<SitemapUrl[]>([
    { url: "", priority: "1.0", changefreq: "weekly", lastmod: new Date().toISOString().split("T")[0] },
  ])
  const [sitemap, setSitemap] = useState("")

  const addUrl = () => {
    setUrls([
      ...urls,
      {
        url: "",
        priority: "0.8",
        changefreq: "weekly",
        lastmod: new Date().toISOString().split("T")[0],
      },
    ])
  }

  const removeUrl = (index: number) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index))
    }
  }

  const updateUrl = (index: number, field: keyof SitemapUrl, value: string) => {
    const newUrls = [...urls]
    newUrls[index][field] = value
    setUrls(newUrls)
  }

  const generateSitemap = () => {
    const validUrls = urls.filter((url) => url.url.trim())

    if (validUrls.length === 0) {
      toast.error("Please add at least one valid URL")
      return
    }

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${validUrls
  .map(
    (url) => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`

    setSitemap(sitemapXml)
    toast.success("Sitemap generated successfully!")
  }

  const copySitemap = () => {
    navigator.clipboard.writeText(sitemap)
    toast.success("Sitemap copied to clipboard!")
  }

  const downloadSitemap = () => {
    const blob = new Blob([sitemap], { type: "application/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sitemap.xml"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Sitemap downloaded!")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">XML Sitemap Generator</h1>
          <p className="text-xl text-muted-foreground">Create XML sitemaps for better search engine indexing</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                URL Configuration
              </CardTitle>
              <CardDescription>Add your website URLs with SEO settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {urls.map((url, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">URL {index + 1}</Label>
                    {urls.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeUrl(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <Input
                    placeholder="https://example.com/page"
                    value={url.url}
                    onChange={(e) => updateUrl(index, "url", e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Priority</Label>
                      <Select value={url.priority} onValueChange={(value) => updateUrl(index, "priority", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1.0">1.0 (Highest)</SelectItem>
                          <SelectItem value="0.9">0.9</SelectItem>
                          <SelectItem value="0.8">0.8</SelectItem>
                          <SelectItem value="0.7">0.7</SelectItem>
                          <SelectItem value="0.6">0.6</SelectItem>
                          <SelectItem value="0.5">0.5 (Medium)</SelectItem>
                          <SelectItem value="0.4">0.4</SelectItem>
                          <SelectItem value="0.3">0.3</SelectItem>
                          <SelectItem value="0.2">0.2</SelectItem>
                          <SelectItem value="0.1">0.1 (Lowest)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Change Frequency</Label>
                      <Select value={url.changefreq} onValueChange={(value) => updateUrl(index, "changefreq", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="always">Always</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Last Modified</Label>
                    <Input
                      type="date"
                      value={url.lastmod}
                      onChange={(e) => updateUrl(index, "lastmod", e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <Button onClick={addUrl} variant="outline" className="flex-1 bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add URL
                </Button>
                <Button onClick={generateSitemap} className="flex-1">
                  Generate Sitemap
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Sitemap
              </CardTitle>
              <CardDescription>Your XML sitemap ready for submission</CardDescription>
            </CardHeader>
            <CardContent>
              {sitemap ? (
                <div className="space-y-4">
                  <Textarea value={sitemap} readOnly className="min-h-[300px] font-mono text-sm" />
                  <div className="flex gap-2">
                    <Button onClick={copySitemap} variant="outline" className="flex-1 bg-transparent">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={downloadSitemap} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generate a sitemap to see the XML output</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>SEO Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Priority Guidelines:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 1.0: Homepage and most important pages</li>
                  <li>• 0.8: Category and main section pages</li>
                  <li>• 0.6: Individual content pages</li>
                  <li>• 0.4: Archive and tag pages</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Change Frequency:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Daily: News, blogs, frequently updated content</li>
                  <li>• Weekly: Product pages, regular updates</li>
                  <li>• Monthly: Company info, less frequent updates</li>
                  <li>• Yearly: Static pages, terms, privacy policy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
