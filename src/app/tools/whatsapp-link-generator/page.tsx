"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, ExternalLink, MessageCircle, QrCode } from "lucide-react"
import { toast } from "sonner"
import QRCode from "qrcode"

export default function WhatsAppLinkGenerator() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const [qrCode, setQrCode] = useState("")

  const generateLink = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number")
      return
    }

    // Clean phone number (remove spaces, dashes, etc.)
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, "")

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message)

    // Generate WhatsApp link
    const link = `https://wa.me/${cleanNumber}${message ? `?text=${encodedMessage}` : ""}`

    setGeneratedLink(link)

    // Generate QR code
    try {
      const qr = await QRCode.toDataURL(link, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
      setQrCode(qr)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }

    toast.success("WhatsApp link generated successfully!")
  }

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink)
    toast.success("Link copied to clipboard!")
  }

  const openLink = () => {
    window.open(generatedLink, "_blank")
  }

  const downloadQR = () => {
    const link = document.createElement("a")
    link.download = "whatsapp-qr-code.png"
    link.href = qrCode
    link.click()
    toast.success("QR code downloaded!")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">WhatsApp Link Generator</h1>
          <p className="text-xl text-muted-foreground">Create direct WhatsApp chat links with pre-filled messages</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Link Configuration
              </CardTitle>
              <CardDescription>Enter phone number and optional message</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1234567890 or 1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Include country code (e.g., +1 for US, +44 for UK)</p>
              </div>

              <div>
                <Label htmlFor="message">Pre-filled Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Hello! I'm interested in your services..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This message will appear in the chat input when the link is opened
                </p>
              </div>

              <Button onClick={generateLink} className="w-full">
                Generate WhatsApp Link
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Link & QR Code</CardTitle>
              <CardDescription>Share this link or QR code to start WhatsApp conversations</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedLink ? (
                <div className="space-y-4">
                  <div>
                    <Label>WhatsApp Link</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={generatedLink} readOnly className="font-mono text-sm" />
                      <Button onClick={copyLink} variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button onClick={openLink} variant="outline" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {qrCode && (
                    <div className="text-center">
                      <Label>QR Code</Label>
                      <div className="mt-2 inline-block p-4 bg-white rounded-lg border">
                        <img src={qrCode || "/placeholder.svg"} alt="WhatsApp QR Code" className="mx-auto" />
                      </div>
                      <div className="mt-2">
                        <Button onClick={downloadQR} variant="outline" size="sm">
                          <QrCode className="h-4 w-4 mr-2" />
                          Download QR Code
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generate a link to see the result</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Business Use Cases:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Customer support links on websites</li>
                  <li>• Sales inquiry buttons</li>
                  <li>• Order status and tracking</li>
                  <li>• Appointment booking</li>
                  <li>• Product inquiries</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Marketing Applications:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• QR codes on business cards</li>
                  <li>• Social media bio links</li>
                  <li>• Email signature links</li>
                  <li>• Print advertising campaigns</li>
                  <li>• Event networking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
