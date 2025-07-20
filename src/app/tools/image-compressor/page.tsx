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
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
	FileArchiveIcon as Compress,
	Upload,
	Download,
	ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

export default function ImageCompressor() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [quality, setQuality] = useState([80]);
	const [originalSize, setOriginalSize] = useState<number>(0);
	const [compressedSize, setCompressedSize] = useState<number>(0);
	const [isCompressing, setIsCompressing] = useState(false);
	const [compressedImage, setCompressedImage] = useState<string>("");
	const [outputFormat, setOutputFormat] = useState("jpeg");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			if (file.type.startsWith("image/")) {
				setSelectedFile(file);
				setOriginalSize(file.size);
				setCompressedImage("");
				setCompressedSize(0);
			} else {
				toast.error("Please select an image file");
			}
		}
	};

	const compressImage = async () => {
		if (!selectedFile) return;

		setIsCompressing(true);
		try {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			const img = new Image();

			img.onload = () => {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx?.drawImage(img, 0, 0);

				let mimeType = "image/jpeg";
				let ext = "jpg";
				if (outputFormat === "png") {
					mimeType = "image/png";
					ext = "png";
				} else if (outputFormat === "webp") {
					mimeType = "image/webp";
					ext = "webp";
				}

				const compressedDataUrl = canvas.toDataURL(
					mimeType,
					outputFormat === "jpeg" || outputFormat === "webp"
						? quality[0] / 100
						: undefined
				);
				setCompressedImage(compressedDataUrl);

				// Calculate real compressed size from base64
				const base64 = compressedDataUrl.split(",")[1];
				const realSize = Math.floor(
					(base64.length * 3) / 4 -
						(base64.endsWith("==")
							? 2
							: base64.endsWith("=")
							? 1
							: 0)
				);
				setCompressedSize(realSize);

				toast.success("Compression Complete", {
					description: `Image compressed successfully! Size reduced by ${Math.round(
						((originalSize - realSize) / originalSize) * 100
					)}%`,
				});
			};

			img.src = URL.createObjectURL(selectedFile);
		} catch (error) {
			toast.error("Compression Failed", {
				description: "An error occurred during compression",
			});
		} finally {
			setIsCompressing(false);
		}
	};

	const downloadCompressed = () => {
		if (compressedImage) {
			const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
			const link = document.createElement("a");
			link.download = `compressed_${
				selectedFile?.name.replace(/\.[^.]+$/, "") || "image"
			}.${ext}`;
			link.href = compressedImage;
			link.click();
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return (
			Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
			" " +
			sizes[i]
		);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Compress className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						Image Compressor
					</h1>
					<p className='text-gray-600'>
						Reduce image file size while maintaining quality
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Upload Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Upload Image</CardTitle>
							<CardDescription>
								Select an image file to compress
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div
								className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors'
								onClick={() => fileInputRef.current?.click()}>
								<Upload className='w-12 h-12 text-gray-400 mx-auto mb-4' />
								<p className='text-gray-600 mb-2'>
									Click to upload or drag and drop
								</p>
								<p className='text-sm text-gray-500'>
									Supports JPG, PNG, WebP (Max 10MB)
								</p>
								<input
									ref={fileInputRef}
									type='file'
									accept='image/*'
									onChange={handleFileSelect}
									className='hidden'
								/>
							</div>

							{selectedFile && (
								<div className='bg-blue-50 p-4 rounded-lg'>
									<div className='flex items-center gap-3'>
										<ImageIcon className='w-8 h-8 text-blue-600' />
										<div>
											<p className='font-medium text-gray-800'>
												{selectedFile.name}
											</p>
											<p className='text-sm text-gray-600'>
												Original size:{" "}
												{formatFileSize(originalSize)}
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Output Format */}
							<div className='space-y-2'>
								<Label>Output Format</Label>
								<select
									value={outputFormat}
									onChange={(e) =>
										setOutputFormat(e.target.value)
									}
									className='w-full border rounded p-2'>
									<option value='jpeg'>
										JPEG (Best for photos)
									</option>
									<option value='png'>
										PNG (Best for graphics)
									</option>
									<option value='webp'>
										WebP (Modern, best compression)
									</option>
								</select>
							</div>

							{/* Quality Slider */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<Label>Compression Quality</Label>
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

							<Button
								onClick={compressImage}
								disabled={!selectedFile || isCompressing}
								className='w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
								size='lg'>
								<Compress className='w-4 h-4 mr-2' />
								{isCompressing
									? "Compressing..."
									: "Compress Image"}
							</Button>
						</CardContent>
					</Card>

					{/* Result Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Compression Result</CardTitle>
							<CardDescription>
								Your compressed image will appear here
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							{compressedImage ? (
								<div className='space-y-4'>
									<div className='border rounded-lg overflow-hidden'>
										<img
											src={
												compressedImage ||
												"/placeholder.svg"
											}
											alt='Compressed'
											className='w-full h-48 object-cover'
										/>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div className='bg-red-50 p-3 rounded-lg'>
											<p className='text-sm text-red-800 font-medium'>
												Original
											</p>
											<p className='text-lg font-bold text-red-900'>
												{formatFileSize(originalSize)}
											</p>
										</div>
										<div className='bg-green-50 p-3 rounded-lg'>
											<p className='text-sm text-green-800 font-medium'>
												Compressed
											</p>
											<p className='text-lg font-bold text-green-900'>
												{formatFileSize(compressedSize)}
											</p>
										</div>
									</div>

									<div className='bg-blue-50 p-4 rounded-lg'>
										<p className='text-center text-blue-800'>
											<span className='font-bold text-2xl'>
												{Math.round(
													((originalSize -
														compressedSize) /
														originalSize) *
														100
												)}
												%
											</span>
											<br />
											<span className='text-sm'>
												Size Reduction
											</span>
										</p>
									</div>

									<Button
										onClick={downloadCompressed}
										className='w-full bg-transparent'
										variant='outline'>
										<Download className='w-4 h-4 mr-2' />
										Download Compressed Image
									</Button>
								</div>
							) : (
								<div className='text-center py-12 text-gray-400'>
									<Compress className='w-16 h-16 mx-auto mb-4' />
									<p>
										Upload an image to see compression
										results
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Tips */}
				<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 mt-8'>
					<CardContent className='p-6'>
						<h3 className='font-semibold text-gray-800 mb-4'>
							💡 Compression Tips:
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
							<ul className='space-y-2'>
								<li>• Higher quality = larger file size</li>
								<li>• JPG works best for photos</li>
								<li>
									• PNG is better for graphics with
									transparency
								</li>
							</ul>
							<ul className='space-y-2'>
								<li>• WebP format offers better compression</li>
								<li>• Consider resizing large images first</li>
								<li>
									• Quality 80-90% often provides good balance
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
