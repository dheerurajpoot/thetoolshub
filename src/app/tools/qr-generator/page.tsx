"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { QrCode, Download, Copy } from "lucide-react";
import { toast } from "sonner";

export default function QRGenerator() {
	const [text, setText] = useState("");
	const [qrType, setQrType] = useState("text");
	const [qrSize, setQrSize] = useState("256");
	const [qrColor, setQrColor] = useState("#000000");
	const [bgColor, setBgColor] = useState("#ffffff");

	const generateQRCode = () => {
		if (!text.trim()) {
			toast.error("Please enter some text to generate QR code");
			return;
		}
		// In a real implementation, you would use a QR code library here
		toast.success("QR Code Generated");
	};

	const downloadQR = () => {
		toast.success("Downloaded");
	};

	const copyQRLink = () => {
		toast.success("Copied");
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
						<QrCode className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						QR Code Generator
					</h1>
					<p className='text-gray-600'>
						Generate custom QR codes for text, URLs, and more
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Input Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>QR Code Settings</CardTitle>
							<CardDescription>
								Configure your QR code content and appearance
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* QR Type */}
							<div className='space-y-2'>
								<Label>QR Code Type</Label>
								<Select
									value={qrType}
									onValueChange={setQrType}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='text'>
											Plain Text
										</SelectItem>
										<SelectItem value='url'>
											Website URL
										</SelectItem>
										<SelectItem value='email'>
											Email Address
										</SelectItem>
										<SelectItem value='phone'>
											Phone Number
										</SelectItem>
										<SelectItem value='wifi'>
											WiFi Network
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Content Input */}
							<div className='space-y-2'>
								<Label>Content</Label>
								{qrType === "text" && (
									<Textarea
										placeholder='Enter your text here...'
										value={text}
										onChange={(e) =>
											setText(e.target.value)
										}
										rows={4}
									/>
								)}
								{qrType === "url" && (
									<Input
										placeholder='https://example.com'
										value={text}
										onChange={(e) =>
											setText(e.target.value)
										}
									/>
								)}
								{qrType === "email" && (
									<Input
										placeholder='email@example.com'
										value={text}
										onChange={(e) =>
											setText(e.target.value)
										}
									/>
								)}
								{qrType === "phone" && (
									<Input
										placeholder='+1234567890'
										value={text}
										onChange={(e) =>
											setText(e.target.value)
										}
									/>
								)}
								{qrType === "wifi" && (
									<div className='space-y-3'>
										<Input placeholder='Network Name (SSID)' />
										<Input
											placeholder='Password'
											type='password'
										/>
										<Select>
											<SelectTrigger>
												<SelectValue placeholder='Security Type' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='WPA'>
													WPA/WPA2
												</SelectItem>
												<SelectItem value='WEP'>
													WEP
												</SelectItem>
												<SelectItem value='nopass'>
													No Password
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}
							</div>

							{/* Customization */}
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Size</Label>
									<Select
										value={qrSize}
										onValueChange={setQrSize}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='128'>
												128x128
											</SelectItem>
											<SelectItem value='256'>
												256x256
											</SelectItem>
											<SelectItem value='512'>
												512x512
											</SelectItem>
											<SelectItem value='1024'>
												1024x1024
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label>Foreground Color</Label>
									<div className='flex gap-2'>
										<Input
											type='color'
											value={qrColor}
											onChange={(e) =>
												setQrColor(e.target.value)
											}
											className='w-16 h-10 p-1 border rounded'
										/>
										<Input
											value={qrColor}
											onChange={(e) =>
												setQrColor(e.target.value)
											}
											placeholder='#000000'
										/>
									</div>
								</div>
							</div>

							<div className='space-y-2'>
								<Label>Background Color</Label>
								<div className='flex gap-2'>
									<Input
										type='color'
										value={bgColor}
										onChange={(e) =>
											setBgColor(e.target.value)
										}
										className='w-16 h-10 p-1 border rounded'
									/>
									<Input
										value={bgColor}
										onChange={(e) =>
											setBgColor(e.target.value)
										}
										placeholder='#ffffff'
									/>
								</div>
							</div>

							<Button
								onClick={generateQRCode}
								className='w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
								size='lg'>
								<QrCode className='w-4 h-4 mr-2' />
								Generate QR Code
							</Button>
						</CardContent>
					</Card>

					{/* Preview Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>QR Code Preview</CardTitle>
							<CardDescription>
								Your generated QR code will appear here
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* QR Code Display */}
							<div className='flex justify-center'>
								<div
									className='border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center'
									style={{
										backgroundColor: bgColor,
										minHeight: "300px",
										minWidth: "300px",
									}}>
									{text ? (
										<div className='text-center'>
											<QrCode
												className='w-32 h-32 mx-auto mb-4'
												style={{ color: qrColor }}
											/>
											<p className='text-sm text-gray-600'>
												QR Code Preview
											</p>
										</div>
									) : (
										<div className='text-center text-gray-400'>
											<QrCode className='w-16 h-16 mx-auto mb-2' />
											<p>
												Enter content to generate QR
												code
											</p>
										</div>
									)}
								</div>
							</div>

							{/* Action Buttons */}
							{text && (
								<div className='space-y-3'>
									<Button
										onClick={downloadQR}
										className='w-full bg-transparent'
										variant='outline'>
										<Download className='w-4 h-4 mr-2' />
										Download PNG
									</Button>
									<Button
										onClick={copyQRLink}
										className='w-full bg-transparent'
										variant='outline'>
										<Copy className='w-4 h-4 mr-2' />
										Copy Link
									</Button>
								</div>
							)}

							{/* Info */}
							<div className='bg-blue-50 p-4 rounded-lg'>
								<h3 className='font-semibold text-blue-800 mb-2'>
									QR Code Tips:
								</h3>
								<ul className='text-sm text-blue-700 space-y-1'>
									<li>
										• Keep content concise for better
										scanning
									</li>
									<li>
										• Ensure good contrast between colors
									</li>
									<li>• Test QR codes before printing</li>
									<li>
										• Larger sizes work better for printing
									</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
