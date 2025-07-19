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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Scissors, Upload, Download, ImageIcon, Link2 } from "lucide-react";
import { toast } from "sonner";

export default function ImageResizer() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [originalDimensions, setOriginalDimensions] = useState({
		width: 0,
		height: 0,
	});
	const [newWidth, setNewWidth] = useState("");
	const [newHeight, setNewHeight] = useState("");
	const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
	const [resizeMode, setResizeMode] = useState("custom");
	const [isResizing, setIsResizing] = useState(false);
	const [resizedImage, setResizedImage] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const presetSizes = {
		"social-facebook": { width: 1200, height: 630, name: "Facebook Post" },
		"social-instagram": {
			width: 1080,
			height: 1080,
			name: "Instagram Square",
		},
		"social-twitter": { width: 1024, height: 512, name: "Twitter Header" },
		"web-banner": { width: 728, height: 90, name: "Web Banner" },
		"profile-pic": { width: 400, height: 400, name: "Profile Picture" },
		thumbnail: { width: 150, height: 150, name: "Thumbnail" },
	};

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			if (file.type.startsWith("image/")) {
				setSelectedFile(file);

				const img = new Image();
				img.onload = () => {
					setOriginalDimensions({
						width: img.width,
						height: img.height,
					});
					setNewWidth(img.width.toString());
					setNewHeight(img.height.toString());
				};
				img.src = URL.createObjectURL(file);

				setResizedImage("");
			} else {
				toast.error("Please select an image file");
			}
		}
	};

	const handleWidthChange = (value: string) => {
		setNewWidth(value);
		if (maintainAspectRatio && originalDimensions.width > 0) {
			const aspectRatio =
				originalDimensions.height / originalDimensions.width;
			const calculatedHeight = Math.round(
				Number.parseInt(value) * aspectRatio
			);
			setNewHeight(calculatedHeight.toString());
		}
	};

	const handleHeightChange = (value: string) => {
		setNewHeight(value);
		if (maintainAspectRatio && originalDimensions.height > 0) {
			const aspectRatio =
				originalDimensions.width / originalDimensions.height;
			const calculatedWidth = Math.round(
				Number.parseInt(value) * aspectRatio
			);
			setNewWidth(calculatedWidth.toString());
		}
	};

	const handlePresetSelect = (presetKey: string) => {
		if (presetKey === "custom") {
			setResizeMode("custom");
			return;
		}

		const preset = presetSizes[presetKey as keyof typeof presetSizes];
		setNewWidth(preset.width.toString());
		setNewHeight(preset.height.toString());
		setResizeMode(presetKey);
	};

	const resizeImage = async () => {
		if (!selectedFile || !newWidth || !newHeight) return;

		setIsResizing(true);
		try {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			const img = new Image();

			img.onload = () => {
				canvas.width = Number.parseInt(newWidth);
				canvas.height = Number.parseInt(newHeight);

				ctx?.drawImage(
					img,
					0,
					0,
					Number.parseInt(newWidth),
					Number.parseInt(newHeight)
				);

				const resizedDataUrl = canvas.toDataURL("image/png");
				setResizedImage(resizedDataUrl);

				toast.success("Resize Complete", {
					description: `Image resized to ${newWidth}x${newHeight} pixels`,
				});
				setIsResizing(false);
			};

			img.src = URL.createObjectURL(selectedFile);
		} catch (error) {
			toast.error("Resize Failed", {
				description: "An error occurred during resizing",
			});
			setIsResizing(false);
		}
	};

	const downloadResized = () => {
		if (resizedImage) {
			const link = document.createElement("a");
			link.download = `resized_${newWidth}x${newHeight}_${
				selectedFile?.name || "image.png"
			}`;
			link.href = resizedImage;
			link.click();
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Scissors className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						Image Resizer
					</h1>
					<p className='text-gray-600'>
						Resize images to any dimension while maintaining quality
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Settings Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Resize Settings</CardTitle>
							<CardDescription>
								Upload an image and set new dimensions
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
									Supports JPG, PNG, WebP
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
												Original:{" "}
												{originalDimensions.width} ×{" "}
												{originalDimensions.height}{" "}
												pixels
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Preset Sizes */}
							<div className='space-y-2'>
								<Label>Preset Sizes</Label>
								<Select
									value={resizeMode}
									onValueChange={handlePresetSelect}>
									<SelectTrigger>
										<SelectValue placeholder='Choose a preset size' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='custom'>
											Custom Size
										</SelectItem>
										{Object.entries(presetSizes).map(
											([key, preset]) => (
												<SelectItem
													key={key}
													value={key}>
													{preset.name} (
													{preset.width}×
													{preset.height})
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>
							</div>

							{/* Custom Dimensions */}
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Width (px)</Label>
									<Input
										type='number'
										value={newWidth}
										onChange={(e) =>
											handleWidthChange(e.target.value)
										}
										placeholder='Width'
									/>
								</div>
								<div className='space-y-2'>
									<Label>Height (px)</Label>
									<Input
										type='number'
										value={newHeight}
										onChange={(e) =>
											handleHeightChange(e.target.value)
										}
										placeholder='Height'
									/>
								</div>
							</div>

							{/* Aspect Ratio */}
							<div className='flex items-center space-x-2'>
								<Checkbox
									id='aspect-ratio'
									checked={maintainAspectRatio}
									onCheckedChange={(checked) =>
										setMaintainAspectRatio(checked === true)
									}
								/>
								<Label
									htmlFor='aspect-ratio'
									className='flex items-center gap-2'>
									<Link2 className='w-4 h-4' />
									Maintain aspect ratio
								</Label>
							</div>

							<Button
								onClick={resizeImage}
								disabled={
									!selectedFile ||
									!newWidth ||
									!newHeight ||
									isResizing
								}
								className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
								size='lg'>
								<Scissors className='w-4 h-4 mr-2' />
								{isResizing ? "Resizing..." : "Resize Image"}
							</Button>
						</CardContent>
					</Card>

					{/* Preview Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Preview</CardTitle>
							<CardDescription>
								Your resized image will appear here
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							{resizedImage ? (
								<div className='space-y-4'>
									<div className='border rounded-lg overflow-hidden bg-gray-50'>
										<img
											src={
												resizedImage ||
												"/placeholder.svg"
											}
											alt='Resized'
											className='max-w-full h-auto mx-auto'
										/>
									</div>

									<div className='bg-green-50 p-4 rounded-lg'>
										<h3 className='font-medium text-green-800 mb-2'>
											New Dimensions
										</h3>
										<p className='text-green-900'>
											<span className='font-bold'>
												{newWidth} × {newHeight}
											</span>{" "}
											pixels
										</p>
									</div>

									<Button
										onClick={downloadResized}
										className='w-full bg-transparent'
										variant='outline'>
										<Download className='w-4 h-4 mr-2' />
										Download Resized Image
									</Button>
								</div>
							) : (
								<div className='text-center py-12 text-gray-400'>
									<Scissors className='w-16 h-16 mx-auto mb-4' />
									<p>
										Upload an image to see the resized
										preview
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
