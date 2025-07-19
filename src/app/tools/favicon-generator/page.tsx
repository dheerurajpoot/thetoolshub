"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
	Upload,
	Download,
	Copy,
	Check,
	ImageIcon,
	Palette,
} from "lucide-react";
import { toast } from "sonner";

const faviconSizes = [
	{ size: 16, name: "favicon-16x16.png" },
	{ size: 32, name: "favicon-32x32.png" },
	{ size: 48, name: "favicon-48x48.png" },
	{ size: 64, name: "favicon-64x64.png" },
	{ size: 96, name: "favicon-96x96.png" },
	{ size: 128, name: "favicon-128x128.png" },
	{ size: 180, name: "apple-touch-icon.png" },
	{ size: 192, name: "android-chrome-192x192.png" },
	{ size: 512, name: "android-chrome-512x512.png" },
];

export default function FaviconGenerator() {
	const [text, setText] = useState("A");
	const [backgroundColor, setBackgroundColor] = useState("#3b82f6");
	const [textColor, setTextColor] = useState("#ffffff");
	const [fontSize, setFontSize] = useState("24");
	const [fontFamily, setFontFamily] = useState("Arial");
	const [borderRadius, setBorderRadius] = useState("0");
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [generatedFavicons, setGeneratedFavicons] = useState<
		{ size: number; dataUrl: string; name: string }[]
	>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [copied, setCopied] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast("File too large", {
					description: "Please select an image smaller than 5MB",
				});
				return;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				setUploadedImage(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const generateFavicon = (size: number): Promise<string> => {
		return new Promise((resolve) => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d")!;
			canvas.width = size;
			canvas.height = size;

			// Background
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, size, size);

			// Border radius
			if (Number.parseInt(borderRadius) > 0) {
				const radius = Math.min(
					Number.parseInt(borderRadius),
					size / 2
				);
				ctx.globalCompositeOperation = "destination-in";
				ctx.beginPath();
				ctx.roundRect(0, 0, size, size, radius);
				ctx.fill();
				ctx.globalCompositeOperation = "source-over";
			}

			if (uploadedImage) {
				// Draw uploaded image
				const img = new Image();
				img.crossOrigin = "anonymous";
				img.onload = () => {
					const padding = size * 0.1;
					ctx.drawImage(
						img,
						padding,
						padding,
						size - padding * 2,
						size - padding * 2
					);
					resolve(canvas.toDataURL("image/png"));
				};
				img.src = uploadedImage;
			} else {
				// Draw text
				const scaledFontSize = Math.max(
					8,
					(Number.parseInt(fontSize) * size) / 64
				);
				ctx.fillStyle = textColor;
				ctx.font = `bold ${scaledFontSize}px ${fontFamily}`;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(text, size / 2, size / 2);
				resolve(canvas.toDataURL("image/png"));
			}
		});
	};

	const generateAllFavicons = async () => {
		setIsGenerating(true);
		try {
			const favicons = [];
			for (const { size, name } of faviconSizes) {
				const dataUrl = await generateFavicon(size);
				favicons.push({ size, dataUrl, name });
			}
			setGeneratedFavicons(favicons);
			toast("Success!", {
				description: "Favicons generated successfully",
			});
		} catch (error) {
			toast("Error", {
				description: "Failed to generate favicons",
			});
		} finally {
			setIsGenerating(false);
		}
	};

	const downloadFavicon = (dataUrl: string, filename: string) => {
		const link = document.createElement("a");
		link.download = filename;
		link.href = dataUrl;
		link.click();
	};

	const downloadAll = () => {
		generatedFavicons.forEach(({ dataUrl, name }) => {
			setTimeout(() => downloadFavicon(dataUrl, name), 100);
		});
	};

	const generateHTMLCode = () => {
		return `<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">

<!-- Android Chrome -->
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">

<!-- Additional sizes -->
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="128x128" href="/favicon-128x128.png">`;
	};

	const copyHTMLCode = async () => {
		try {
			await navigator.clipboard.writeText(generateHTMLCode());
			toast("Copied!", {
				description: "HTML code copied to clipboard",
			});
		} catch (error) {
			toast("Error", {
				description: "Failed to copy to clipboard",
			});
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4'>
			<div className='max-w-6xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Favicon Generator
					</h1>
					<p className='text-gray-600'>
						Create professional favicons for your website in all
						required sizes
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Input Section */}
					<div className='space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<ImageIcon className='w-5 h-5' />
									Upload Image or Create Text Favicon
								</CardTitle>
								<CardDescription>
									Upload an image or create a text-based
									favicon
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<Label htmlFor='image-upload'>
										Upload Image (Optional)
									</Label>
									<div className='mt-2'>
										<input
											ref={fileInputRef}
											type='file'
											id='image-upload'
											accept='image/*'
											onChange={handleImageUpload}
											className='hidden'
										/>
										<Button
											onClick={() =>
												fileInputRef.current?.click()
											}
											variant='outline'
											className='w-full'>
											<Upload className='w-4 h-4 mr-2' />
											Choose Image
										</Button>
									</div>
									{uploadedImage && (
										<div className='mt-2'>
											<img
												src={
													uploadedImage ||
													"/placeholder.svg"
												}
												alt='Uploaded'
												className='w-16 h-16 object-cover rounded border'
											/>
											<Button
												onClick={() =>
													setUploadedImage(null)
												}
												variant='outline'
												size='sm'
												className='mt-2'>
												Remove
											</Button>
										</div>
									)}
								</div>

								{!uploadedImage && (
									<>
										<div>
											<Label htmlFor='text'>Text</Label>
											<Input
												id='text'
												value={text}
												onChange={(e) =>
													setText(e.target.value)
												}
												placeholder='Enter text (1-3 characters work best)'
												maxLength={5}
											/>
										</div>

										<div className='grid grid-cols-2 gap-4'>
											<div>
												<Label htmlFor='bg-color'>
													Background Color
												</Label>
												<div className='flex gap-2 mt-1'>
													<Input
														id='bg-color'
														type='color'
														value={backgroundColor}
														onChange={(e) =>
															setBackgroundColor(
																e.target.value
															)
														}
														className='w-12 h-10 p-1 border rounded'
													/>
													<Input
														value={backgroundColor}
														onChange={(e) =>
															setBackgroundColor(
																e.target.value
															)
														}
														placeholder='#3b82f6'
													/>
												</div>
											</div>

											<div>
												<Label htmlFor='text-color'>
													Text Color
												</Label>
												<div className='flex gap-2 mt-1'>
													<Input
														id='text-color'
														type='color'
														value={textColor}
														onChange={(e) =>
															setTextColor(
																e.target.value
															)
														}
														className='w-12 h-10 p-1 border rounded'
													/>
													<Input
														value={textColor}
														onChange={(e) =>
															setTextColor(
																e.target.value
															)
														}
														placeholder='#ffffff'
													/>
												</div>
											</div>
										</div>

										<div className='grid grid-cols-2 gap-4'>
											<div>
												<Label htmlFor='font-size'>
													Font Size
												</Label>
												<Input
													id='font-size'
													type='number'
													value={fontSize}
													onChange={(e) =>
														setFontSize(
															e.target.value
														)
													}
													min='8'
													max='48'
												/>
											</div>

											<div>
												<Label htmlFor='font-family'>
													Font Family
												</Label>
												<Select
													value={fontFamily}
													onValueChange={
														setFontFamily
													}>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value='Arial'>
															Arial
														</SelectItem>
														<SelectItem value='Helvetica'>
															Helvetica
														</SelectItem>
														<SelectItem value='Times New Roman'>
															Times New Roman
														</SelectItem>
														<SelectItem value='Georgia'>
															Georgia
														</SelectItem>
														<SelectItem value='Verdana'>
															Verdana
														</SelectItem>
														<SelectItem value='Courier New'>
															Courier New
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>

										<div>
											<Label htmlFor='border-radius'>
												Border Radius (px)
											</Label>
											<Input
												id='border-radius'
												type='number'
												value={borderRadius}
												onChange={(e) =>
													setBorderRadius(
														e.target.value
													)
												}
												min='0'
												max='32'
											/>
										</div>
									</>
								)}

								<Button
									onClick={generateAllFavicons}
									disabled={
										isGenerating ||
										(!text.trim() && !uploadedImage)
									}
									className='w-full'>
									{isGenerating
										? "Generating..."
										: "Generate Favicons"}
								</Button>
							</CardContent>
						</Card>

						{/* Preview */}
						<Card>
							<CardHeader>
								<CardTitle>Preview</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex items-center gap-4'>
									<div
										className='w-16 h-16 flex items-center justify-center text-white font-bold border rounded'
										style={{
											backgroundColor: backgroundColor,
											color: textColor,
											fontSize: `${Math.max(
												8,
												Number.parseInt(fontSize) / 2
											)}px`,
											fontFamily: fontFamily,
											borderRadius: `${Number.parseInt(
												borderRadius
											)}px`,
										}}>
										{uploadedImage ? (
											<img
												src={
													uploadedImage ||
													"/placeholder.svg"
												}
												alt='Preview'
												className='w-full h-full object-cover'
												style={{
													borderRadius: `${Number.parseInt(
														borderRadius
													)}px`,
												}}
											/>
										) : (
											text
										)}
									</div>
									<div className='text-sm text-gray-600'>
										<p>
											This is how your favicon will look
										</p>
										<p className='text-xs'>
											Actual size: 16x16 to 512x512 pixels
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Results Section */}
					<div className='space-y-6'>
						{generatedFavicons.length > 0 && (
							<>
								<Card>
									<CardHeader>
										<CardTitle className='flex items-center justify-between'>
											Generated Favicons
											<Button
												onClick={downloadAll}
												size='sm'>
												<Download className='w-4 h-4 mr-2' />
												Download All
											</Button>
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='grid grid-cols-3 gap-4'>
											{generatedFavicons.map(
												({ size, dataUrl, name }) => (
													<div
														key={size}
														className='text-center'>
														<img
															src={
																dataUrl ||
																"/placeholder.svg"
															}
															alt={`${size}x${size}`}
															className='w-12 h-12 mx-auto border rounded mb-2'
														/>
														<p className='text-xs text-gray-600 mb-1'>
															{size}x{size}
														</p>
														<Button
															onClick={() =>
																downloadFavicon(
																	dataUrl,
																	name
																)
															}
															size='sm'
															variant='outline'
															className='text-xs'>
															Download
														</Button>
													</div>
												)
											)}
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className='flex items-center justify-between'>
											HTML Code
											<Button
												onClick={copyHTMLCode}
												size='sm'
												variant='outline'>
												{copied ? (
													<Check className='w-4 h-4 mr-2' />
												) : (
													<Copy className='w-4 h-4 mr-2' />
												)}
												{copied ? "Copied!" : "Copy"}
											</Button>
										</CardTitle>
										<CardDescription>
											Add this code to your HTML
											&lt;head&gt; section
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Textarea
											value={generateHTMLCode()}
											readOnly
											className='font-mono text-sm'
											rows={12}
										/>
									</CardContent>
								</Card>
							</>
						)}

						{/* Tips */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Palette className='w-5 h-5' />
									Tips for Great Favicons
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3 text-sm'>
								<div className='flex items-start gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
									<p>
										<strong>Keep it simple:</strong>{" "}
										Favicons are very small, so simple
										designs work best
									</p>
								</div>
								<div className='flex items-start gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
									<p>
										<strong>High contrast:</strong> Use
										contrasting colors for better visibility
									</p>
								</div>
								<div className='flex items-start gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
									<p>
										<strong>Brand consistency:</strong> Use
										your brand colors and style
									</p>
								</div>
								<div className='flex items-start gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
									<p>
										<strong>Test at small sizes:</strong>{" "}
										Make sure it&apos;s recognizable at
										16x16 pixels
									</p>
								</div>
								<div className='flex items-start gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
									<p>
										<strong>Multiple formats:</strong>{" "}
										Include various sizes for different
										devices
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
