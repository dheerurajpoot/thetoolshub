"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Download, RefreshCw, Database, Settings } from "lucide-react"
import { toast } from "sonner"

interface DataField {
  id: string
  name: string
  type: string
  enabled: boolean
}

interface GeneratedData {
  [key: string]: any
}

const defaultFields: DataField[] = [
  { id: "firstName", name: "First Name", type: "firstName", enabled: true },
  { id: "lastName", name: "Last Name", type: "lastName", enabled: true },
  { id: "email", name: "Email", type: "email", enabled: true },
  { id: "phone", name: "Phone", type: "phone", enabled: false },
  { id: "address", name: "Address", type: "address", enabled: false },
  { id: "city", name: "City", type: "city", enabled: false },
  { id: "country", name: "Country", type: "country", enabled: false },
  { id: "company", name: "Company", type: "company", enabled: false },
  { id: "jobTitle", name: "Job Title", type: "jobTitle", enabled: false },
  { id: "age", name: "Age", type: "age", enabled: false },
  { id: "birthDate", name: "Birth Date", type: "birthDate", enabled: false },
  { id: "username", name: "Username", type: "username", enabled: false },
  { id: "password", name: "Password", type: "password", enabled: false },
  { id: "website", name: "Website", type: "website", enabled: false },
  { id: "creditCard", name: "Credit Card", type: "creditCard", enabled: false },
]

export default function FakeDataGenerator() {
  const [fields, setFields] = useState<DataField[]>(defaultFields)
  const [recordCount, setRecordCount] = useState("10")
  const [outputFormat, setOutputFormat] = useState("json")
  const [generatedData, setGeneratedData] = useState<GeneratedData[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Sarah",
    "David",
    "Emily",
    "Chris",
    "Lisa",
    "Robert",
    "Maria",
    "James",
    "Anna",
    "William",
    "Emma",
    "Daniel",
    "Olivia",
  ]
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
  ]
  const companies = [
    "TechCorp",
    "DataSoft",
    "InnovateLab",
    "CloudTech",
    "DigitalWorks",
    "FutureSoft",
    "SmartSolutions",
    "WebDynamics",
    "CodeCraft",
    "ByteForge",
  ]
  const jobTitles = [
    "Software Engineer",
    "Product Manager",
    "Data Analyst",
    "UX Designer",
    "Marketing Manager",
    "Sales Representative",
    "HR Specialist",
    "Financial Analyst",
    "Operations Manager",
    "Customer Success Manager",
  ]
  const cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ]
  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Australia",
    "Japan",
    "Brazil",
    "India",
    "Mexico",
  ]

  const generateRandomData = (type: string): any => {
    switch (type) {
      case "firstName":
        return firstNames[Math.floor(Math.random() * firstNames.length)]
      case "lastName":
        return lastNames[Math.floor(Math.random() * lastNames.length)]
      case "email":
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()
        const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "company.com"]
        return `${firstName}.${lastName}@${domains[Math.floor(Math.random() * domains.length)]}`
      case "phone":
        return `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`
      case "address":
        return `${Math.floor(Math.random() * 9999 + 1)} ${["Main St", "Oak Ave", "Pine Rd", "Elm Dr", "Cedar Ln"][Math.floor(Math.random() * 5)]}`
      case "city":
        return cities[Math.floor(Math.random() * cities.length)]
      case "country":
        return countries[Math.floor(Math.random() * countries.length)]
      case "company":
        return companies[Math.floor(Math.random() * companies.length)]
      case "jobTitle":
        return jobTitles[Math.floor(Math.random() * jobTitles.length)]
      case "age":
        return Math.floor(Math.random() * 50 + 18)
      case "birthDate":
        const year = Math.floor(Math.random() * 50 + 1970)
        const month = Math.floor(Math.random() * 12 + 1)
          .toString()
          .padStart(2, "0")
        const day = Math.floor(Math.random() * 28 + 1)
          .toString()
          .padStart(2, "0")
        return `${year}-${month}-${day}`
      case "username":
        const user = firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()
        const num = Math.floor(Math.random() * 999 + 1)
        return `${user}${num}`
      case "password":
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
        let password = ""
        for (let i = 0; i < 12; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return password
      case "website":
        const sites = ["example.com", "mysite.org", "webdemo.net", "testsite.io", "sample.co"]
        return `https://www.${sites[Math.floor(Math.random() * sites.length)]}`
      case "creditCard":
        return `4${Math.floor(Math.random() * 1000000000000000)
          .toString()
          .padStart(15, "0")}`
      default:
        return "N/A"
    }
  }

  const generateData = async () => {
    const count = Number.parseInt(recordCount)
    if (count < 1 || count > 1000) {
      toast.error("Record count must be between 1 and 1000")
      return
    }

    const enabledFields = fields.filter((field) => field.enabled)
    if (enabledFields.length === 0) {
      toast.error("Please select at least one field to generate")
      return
    }

    setIsGenerating(true)

    try {
      // Simulate generation delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const data: GeneratedData[] = []
      for (let i = 0; i < count; i++) {
        const record: GeneratedData = {}
        enabledFields.forEach((field) => {
          record[field.name] = generateRandomData(field.type)
        })
        data.push(record)
      }

      setGeneratedData(data)
      toast.success(`Generated ${count} records successfully!`)
    } catch (error) {
      toast.error("Failed to generate data. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleField = (fieldId: string) => {
    setFields((prev) => prev.map((field) => (field.id === fieldId ? { ...field, enabled: !field.enabled } : field)))
  }

  const formatOutput = (data: GeneratedData[]) => {
    switch (outputFormat) {
      case "json":
        return JSON.stringify(data, null, 2)
      case "csv":
        if (data.length === 0) return ""
        const headers = Object.keys(data[0])
        const csvRows = [headers.join(","), ...data.map((row) => headers.map((header) => `"${row[header]}"`).join(","))]
        return csvRows.join("\n")
      case "sql":
        if (data.length === 0) return ""
        const tableName = "generated_data"
        const headers2 = Object.keys(data[0])
        const createTable = `CREATE TABLE ${tableName} (\n  ${headers2.map((h) => `${h.replace(/\s+/g, "_").toLowerCase()} VARCHAR(255)`).join(",\n  ")}\n);\n\n`
        const inserts = data
          .map(
            (row) =>
              `INSERT INTO ${tableName} (${headers2.map((h) => h.replace(/\s+/g, "_").toLowerCase()).join(", ")}) VALUES (${headers2.map((h) => `'${row[h]}'`).join(", ")});`,
          )
          .join("\n")
        return createTable + inserts
      default:
        return JSON.stringify(data, null, 2)
    }
  }

  const copyToClipboard = () => {
    const output = formatOutput(generatedData)
    navigator.clipboard.writeText(output)
    toast.success("Data copied to clipboard!")
  }

  const downloadData = () => {
    const output = formatOutput(generatedData)
    const extensions = { json: "json", csv: "csv", sql: "sql" }
    const extension = extensions[outputFormat as keyof typeof extensions]

    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `fake_data.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success("Download started!")
  }

  const enabledFieldsCount = fields.filter((f) => f.enabled).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Fake Data Generator</h1>
          <p className="text-xl text-muted-foreground">Generate realistic test data for your applications</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration
              </CardTitle>
              <CardDescription>Select fields and configure generation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="recordCount">Number of Records</Label>
                <Input
                  id="recordCount"
                  type="number"
                  min="1"
                  max="1000"
                  value={recordCount}
                  onChange={(e) => setRecordCount(e.target.value)}
                  placeholder="10"
                />
                <p className="text-xs text-muted-foreground mt-1">Maximum 1000 records</p>
              </div>

              <div>
                <Label htmlFor="outputFormat">Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Data Fields</Label>
                  <Badge variant="outline">{enabledFieldsCount} selected</Badge>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox id={field.id} checked={field.enabled} onCheckedChange={() => toggleField(field.id)} />
                      <Label htmlFor={field.id} className="text-sm font-normal">
                        {field.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={generateData} disabled={isGenerating || enabledFieldsCount === 0} className="w-full">
                <Database className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Data"}
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Generated Data</CardTitle>
              <CardDescription>
                {generatedData.length > 0
                  ? `${generatedData.length} records in ${outputFormat.toUpperCase()} format`
                  : "Configure settings and generate data to see results"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedData.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={downloadData} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={generateData} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>

                  <Textarea
                    value={formatOutput(generatedData)}
                    readOnly
                    rows={20}
                    className="font-mono text-sm resize-none"
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Configure your settings and click "Generate Data" to create test data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Use Cases & Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-3">Development & Testing:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Populate development databases</li>
                  <li>• Test application performance</li>
                  <li>• Create demo environments</li>
                  <li>• API testing and validation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Data Formats:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <strong>JSON:</strong> API responses, NoSQL databases
                  </li>
                  <li>
                    • <strong>CSV:</strong> Spreadsheets, data imports
                  </li>
                  <li>
                    • <strong>SQL:</strong> Database seeding, migrations
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Best Practices:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Never use fake data in production</li>
                  <li>• Respect data privacy regulations</li>
                  <li>• Use realistic data volumes for testing</li>
                  <li>• Validate data formats before use</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
