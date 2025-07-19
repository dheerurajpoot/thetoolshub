"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, Upload, Download, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function PngToJpgConverter() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [convertedImage, setConvertedImage] = useState<string>("");
	const [quality, setQuality] = useState([90]);
	const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
	const [isConverting, setIsConverting] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			if (file.type === "image/png") {
				setSelectedFile(file);
				setConvertedImage("");
			} else {
				toast("Please select a PNG file");
			}
		}
	};

	const convertImage = async () => {
		if (!selectedFile) return;

		setIsConverting(true);
		try {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			const img = new Image();

			img.onload = () => {
				canvas.width = img.width;
				canvas.height = img.height;

				// Fill with background color (since JPG doesn't support transparency)
				ctx!.fillStyle = backgroundColor;
				ctx!.fillRect(0, 0, canvas.width, canvas.height);

				ctx?.drawImage(img, 0, 0);

				const jpgDataUrl = canvas.toDataURL(
					"image/jpeg",
					quality[0] / 100
				);
				setConvertedImage(jpgDataUrl);

				toast("PNG successfully converted to JPG");
				setIsConverting(false);
			};

			img.src = URL.createObjectURL(selectedFile);
		} catch (error) {
			toast("Conversion Failed");
			setIsConverting(false);
		}
	};

	const downloadConverted = () => {
		if (convertedImage) {
			const link = document.createElement("a");
			const fileName =
				selectedFile?.name.replace(/\.png$/i, ".jpg") ||
				"converted.jpg";
			link.download = fileName;
			link.href = convertedImage;
			link.click();
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<ArrowUpDown className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						PNG to JPG Converter
					</h1>
					<p className='text-gray-600'>
						Convert PNG images to JPG format with quality control
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Upload Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<ImageIcon className='w-5 h-5' />
								Upload PNG Image
							</CardTitle>
							<CardDescription>
								Select a PNG file to convert to JPG
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div
								className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors'
								onClick={() => fileInputRef.current?.click()}>
								<Upload className='w-12 h-12 text-gray-400 mx-auto mb-4' />
								<p className='text-gray-600 mb-2'>
									Click to upload PNG file
								</p>
								<p className='text-sm text-gray-500'>
									Maximum file size: 10MB
								</p>
								<input
									ref={fileInputRef}
									type='file'
									accept='.png,image/png'
									onChange={handleFileSelect}
									className='hidden'
								/>
							</div>

							{selectedFile && (
								<div className='bg-green-50 p-4 rounded-lg'>
									<div className='flex items-center gap-3'>
										<ImageIcon className='w-8 h-8 text-green-600' />
										<div>
											<p className='font-medium text-gray-800'>
												{selectedFile.name}
											</p>
											<p className='text-sm text-gray-600'>
												Size:{" "}
												{(
													selectedFile.size /
													1024 /
													1024
												).toFixed(2)}{" "}
												MB
											</p>
											<p className='text-sm text-green-600 font-medium'>
												PNG Format
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Quality Settings */}
							<div className='space-y-4'>
								<div className='space-y-3'>
									<div className='flex items-center justify-between'>
										<Label>JPG Quality</Label>
										<span className='text-sm font-medium'>
											{quality[0]}%
										</span>
									</div>
									<Slider
										value={quality}
										onValueChange={setQuality}
										max={100}
										min={10}
										step={5}
										className='w-full'
									/>
									<div className='flex justify-between text-xs text-gray-500'>
										<span>Smaller file</span>
										<span>Better quality</span>
									</div>
								</div>

								<div className='space-y-2'>
									<Label>
										Background Color (replaces transparency)
									</Label>
									<div className='flex gap-2'>
										<input
											type='color'
											value={backgroundColor}
											onChange={(e) =>
												setBackgroundColor(
													e.target.value
												)
											}
											className='w-16 h-10 p-1 border rounded'
										/>
										<input
											type='text'
											value={backgroundColor}
											onChange={(e) =>
												setBackgroundColor(
													e.target.value
												)
											}
											placeholder='#FFFFFF'
											className='flex-1 px-3 py-2 border rounded-md'
										/>
									</div>
								</div>
							</div>

							<Button
								onClick={convertImage}
								disabled={!selectedFile || isConverting}
								className='w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
								size='lg'>
								<ArrowUpDown className='w-4 h-4 mr-2' />
								{isConverting
									? "Converting..."
									: "Convert to JPG"}
							</Button>
						</CardContent>
					</Card>

					{/* Result Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Download className='w-5 h-5' />
								JPG Result
							</CardTitle>
							<CardDescription>
								Your converted JPG image
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							{convertedImage ? (
								<div className='space-y-4'>
									<div className='border rounded-lg overflow-hidden bg-gray-50'>
										<img
											src={
												convertedImage ||
												"/placeholder.svg"
											}
											alt='Converted JPG'
											className='w-full h-48 object-cover'
										/>
									</div>

									<div className='bg-blue-50 p-4 rounded-lg'>
										<div className='flex items-center gap-3'>
											<ImageIcon className='w-8 h-8 text-blue-600' />
											<div>
												<p className='font-medium text-gray-800'>
													Conversion Successful!
												</p>
												<p className='text-sm text-blue-600 font-medium'>
													JPG Format (Quality:{" "}
													{quality[0]}%)
												</p>
											</div>
										</div>
									</div>

									<Button
										onClick={downloadConverted}
										className='w-full bg-transparent'
										variant='outline'>
										<Download className='w-4 h-4 mr-2' />
										Download JPG Image
									</Button>

									<div className='bg-yellow-50 p-3 rounded-lg'>
										<p className='text-sm text-yellow-800'>
											<strong>Note:</strong> JPG format
											doesn't support transparency.
											Transparent areas have been replaced
											with the selected background color.
										</p>
									</div>
								</div>
							) : (
								<div className='text-center py-12 text-gray-400'>
									<ArrowUpDown className='w-16 h-16 mx-auto mb-4' />
									<p>
										Upload a PNG image to see the JPG
										conversion
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Format Comparison */}
				<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 mt-8'>
					<CardContent className='p-6'>
						<h3 className='font-semibold text-gray-800 mb-4'>
							📊 PNG vs JPG Comparison:
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<h4 className='font-medium text-gray-800 mb-3'>
									PNG Format
								</h4>
								<ul className='text-sm text-gray-600 space-y-1'>
									<li>✅ Supports transparency</li>
									<li>✅ Lossless compression</li>
									<li>✅ Better for graphics with text</li>
									<li>✅ Supports 16 million colors</li>
									<li>❌ Larger file sizes</li>
									<li>❌ Not ideal for photos</li>
								</ul>
							</div>
							<div>
								<h4 className='font-medium text-gray-800 mb-3'>
									JPG Format
								</h4>
								<ul className='text-sm text-gray-600 space-y-1'>
									<li>✅ Smaller file sizes</li>
									<li>✅ Better for photographs</li>
									<li>✅ Widely supported</li>
									<li>✅ Adjustable quality</li>
									<li>❌ No transparency support</li>
									<li>❌ Lossy compression</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
