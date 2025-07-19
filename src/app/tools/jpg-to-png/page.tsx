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
import { ArrowUpDown, Upload, Download, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function JpgToPngConverter() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [convertedImage, setConvertedImage] = useState<string>("");
	const [isConverting, setIsConverting] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			if (file.type === "image/jpeg" || file.type === "image/jpg") {
				setSelectedFile(file);
				setConvertedImage("");
			} else {
				toast.error("Please select a JPG/JPEG file");
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

				// Fill with white background (since PNG supports transparency)
				ctx!.fillStyle = "white";
				ctx!.fillRect(0, 0, canvas.width, canvas.height);

				ctx?.drawImage(img, 0, 0);

				const pngDataUrl = canvas.toDataURL("image/png");
				setConvertedImage(pngDataUrl);

				toast.success("JPG successfully converted to PNG");
				setIsConverting(false);
			};

			img.src = URL.createObjectURL(selectedFile);
		} catch (error) {
			toast.error("Conversion Failed");
			setIsConverting(false);
		}
	};

	const downloadConverted = () => {
		if (convertedImage) {
			const link = document.createElement("a");
			const fileName =
				selectedFile?.name.replace(/\.(jpg|jpeg)$/i, ".png") ||
				"converted.png";
			link.download = fileName;
			link.href = convertedImage;
			link.click();
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<ArrowUpDown className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						JPG to PNG Converter
					</h1>
					<p className='text-gray-600'>
						Convert JPG/JPEG images to PNG format with transparency
						support
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Upload Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<ImageIcon className='w-5 h-5' />
								Upload JPG Image
							</CardTitle>
							<CardDescription>
								Select a JPG or JPEG file to convert
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div
								className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 transition-colors'
								onClick={() => fileInputRef.current?.click()}>
								<Upload className='w-12 h-12 text-gray-400 mx-auto mb-4' />
								<p className='text-gray-600 mb-2'>
									Click to upload JPG/JPEG file
								</p>
								<p className='text-sm text-gray-500'>
									Maximum file size: 10MB
								</p>
								<input
									ref={fileInputRef}
									type='file'
									accept='.jpg,.jpeg,image/jpeg'
									onChange={handleFileSelect}
									className='hidden'
								/>
							</div>

							{selectedFile && (
								<div className='bg-orange-50 p-4 rounded-lg'>
									<div className='flex items-center gap-3'>
										<ImageIcon className='w-8 h-8 text-orange-600' />
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
											<p className='text-sm text-orange-600 font-medium'>
												JPG Format
											</p>
										</div>
									</div>
								</div>
							)}

							<Button
								onClick={convertImage}
								disabled={!selectedFile || isConverting}
								className='w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
								size='lg'>
								<ArrowUpDown className='w-4 h-4 mr-2' />
								{isConverting
									? "Converting..."
									: "Convert to PNG"}
							</Button>

							{/* Format Comparison */}
							<div className='bg-blue-50 p-4 rounded-lg'>
								<h3 className='font-semibold text-blue-800 mb-3'>
									JPG vs PNG
								</h3>
								<div className='grid grid-cols-2 gap-4 text-sm'>
									<div>
										<p className='font-medium text-blue-900 mb-2'>
											JPG
										</p>
										<ul className='text-blue-700 space-y-1'>
											<li>• Smaller file size</li>
											<li>• No transparency</li>
											<li>• Lossy compression</li>
											<li>• Best for photos</li>
										</ul>
									</div>
									<div>
										<p className='font-medium text-blue-900 mb-2'>
											PNG
										</p>
										<ul className='text-blue-700 space-y-1'>
											<li>• Larger file size</li>
											<li>• Supports transparency</li>
											<li>• Lossless compression</li>
											<li>• Best for graphics</li>
										</ul>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Result Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Download className='w-5 h-5' />
								PNG Result
							</CardTitle>
							<CardDescription>
								Your converted PNG image
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
											alt='Converted PNG'
											className='w-full h-48 object-cover'
										/>
									</div>

									<div className='bg-green-50 p-4 rounded-lg'>
										<div className='flex items-center gap-3'>
											<ImageIcon className='w-8 h-8 text-green-600' />
											<div>
												<p className='font-medium text-gray-800'>
													Conversion Successful!
												</p>
												<p className='text-sm text-green-600 font-medium'>
													PNG Format
												</p>
											</div>
										</div>
									</div>

									<Button
										onClick={downloadConverted}
										className='w-full bg-transparent'
										variant='outline'>
										<Download className='w-4 h-4 mr-2' />
										Download PNG Image
									</Button>

									<div className='bg-yellow-50 p-3 rounded-lg'>
										<p className='text-sm text-yellow-800'>
											<strong>Note:</strong> PNG files are
											typically larger than JPG but
											support transparency and offer
											lossless quality.
										</p>
									</div>
								</div>
							) : (
								<div className='text-center py-12 text-gray-400'>
									<ArrowUpDown className='w-16 h-16 mx-auto mb-4' />
									<p>
										Upload a JPG image to see the PNG
										conversion
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
