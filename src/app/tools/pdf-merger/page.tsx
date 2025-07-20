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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
	Upload,
	Download,
	FileText,
	Merge,
	X,
	ArrowUp,
	ArrowDown,
	AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { PDFDocument } from "pdf-lib";

interface PDFFile {
	id: string;
	file: File;
	name: string;
	size: number;
}

export default function PDFMerger() {
	const [files, setFiles] = useState<PDFFile[]>([]);
	const [isMerging, setIsMerging] = useState(false);
	const [progress, setProgress] = useState(0);
	const [mergedFileUrl, setMergedFileUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (selectedFiles: FileList) => {
		const newFiles: PDFFile[] = [];

		Array.from(selectedFiles).forEach((file) => {
			if (file.type !== "application/pdf") {
				toast.error(`${file.name} is not a PDF file`);
				return;
			}

			if (file.size > 50 * 1024 * 1024) {
				// 50MB limit
				toast.error(`${file.name} is too large (max 50MB)`);
				return;
			}

			const isDuplicate = files.some(
				(existingFile) =>
					existingFile.name === file.name &&
					existingFile.size === file.size
			);

			if (isDuplicate) {
				toast.error(`${file.name} is already added`);
				return;
			}

			newFiles.push({
				id: Math.random().toString(36).substr(2, 9),
				file,
				name: file.name,
				size: file.size,
			});
		});

		if (newFiles.length > 0) {
			setFiles((prev) => [...prev, ...newFiles]);
			toast.success(`${newFiles.length} PDF file(s) added`);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		if (e.dataTransfer.files.length > 0) {
			handleFileSelect(e.dataTransfer.files);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const removeFile = (id: string) => {
		setFiles((prev) => prev.filter((file) => file.id !== id));
		toast.success("File removed");
	};

	const moveFile = (id: string, direction: "up" | "down") => {
		setFiles((prev) => {
			const index = prev.findIndex((file) => file.id === id);
			if (index === -1) return prev;

			const newFiles = [...prev];
			if (direction === "up" && index > 0) {
				[newFiles[index], newFiles[index - 1]] = [
					newFiles[index - 1],
					newFiles[index],
				];
			} else if (direction === "down" && index < newFiles.length - 1) {
				[newFiles[index], newFiles[index + 1]] = [
					newFiles[index + 1],
					newFiles[index],
				];
			}
			return newFiles;
		});
	};

	const mergePDFs = async () => {
		if (files.length < 2) {
			toast.error("Please add at least 2 PDF files to merge");
			return;
		}

		setIsMerging(true);
		setProgress(0);
		setMergedFileUrl(null);

		try {
			const progressInterval = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 90) {
						clearInterval(progressInterval);
						return 90;
					}
					return prev + 10;
				});
			}, 300);

			// Actually merge PDFs using pdf-lib
			const mergedPdf = await PDFDocument.create();
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const arrayBuffer = await file.file.arrayBuffer();
				const pdf = await PDFDocument.load(arrayBuffer);
				const copiedPages = await mergedPdf.copyPages(
					pdf,
					pdf.getPageIndices()
				);
				copiedPages.forEach((page) => mergedPdf.addPage(page));
			}
			const mergedBytes = await mergedPdf.save();
			const mergedBlob = new Blob([mergedBytes], {
				type: "application/pdf",
			});
			const downloadUrl = URL.createObjectURL(mergedBlob);

			setMergedFileUrl(downloadUrl);
			setProgress(100);
			toast.success("PDFs merged successfully!");
		} catch (error) {
			toast.error("Failed to merge PDFs. Please try again.");
		} finally {
			setIsMerging(false);
		}
	};

	const downloadMerged = () => {
		if (mergedFileUrl) {
			const link = document.createElement("a");
			link.href = mergedFileUrl;
			link.download = "merged_document.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			toast.success("Download started!");
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

	const clearAll = () => {
		setFiles([]);
		setMergedFileUrl(null);
		toast.success("All files cleared");
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='max-w-4xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold mb-4'>PDF Merger</h1>
					<p className='text-xl text-muted-foreground'>
						Combine multiple PDF files into a single document
					</p>
				</div>

				<div className='grid gap-6 lg:grid-cols-2'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Upload className='h-5 w-5' />
								Upload PDF Files
							</CardTitle>
							<CardDescription>
								Add multiple PDF files to merge (max 50MB each)
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div
								className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors'
								onDrop={handleDrop}
								onDragOver={handleDragOver}
								onClick={() => fileInputRef.current?.click()}>
								<FileText className='h-12 w-12 mx-auto mb-4 text-gray-400' />
								<p className='text-lg font-medium mb-2'>
									Drop PDF files here or click to browse
								</p>
								<p className='text-sm text-muted-foreground'>
									Select multiple files to merge them
								</p>
								<input
									ref={fileInputRef}
									type='file'
									accept='.pdf'
									multiple
									onChange={(e) =>
										e.target.files &&
										handleFileSelect(e.target.files)
									}
									className='hidden'
								/>
							</div>

							{files.length > 0 && (
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<Badge variant='outline'>
											{files.length} files selected
										</Badge>
										<Button
											onClick={clearAll}
											variant='outline'
											size='sm'>
											Clear All
										</Button>
									</div>

									<div className='max-h-64 overflow-y-auto space-y-2'>
										{files.map((file, index) => (
											<div
												key={file.id}
												className='bg-gray-50 p-3 rounded-lg'>
												<div className='flex items-center gap-3'>
													<div className='flex flex-col gap-1'>
														<Button
															onClick={() =>
																moveFile(
																	file.id,
																	"up"
																)
															}
															disabled={
																index === 0
															}
															variant='ghost'
															size='sm'
															className='h-6 w-6 p-0'>
															<ArrowUp className='h-3 w-3' />
														</Button>
														<Button
															onClick={() =>
																moveFile(
																	file.id,
																	"down"
																)
															}
															disabled={
																index ===
																files.length - 1
															}
															variant='ghost'
															size='sm'
															className='h-6 w-6 p-0'>
															<ArrowDown className='h-3 w-3' />
														</Button>
													</div>
													<FileText className='h-6 w-6 text-red-600 flex-shrink-0' />
													<div className='flex-1 min-w-0'>
														<p className='font-medium truncate'>
															{file.name}
														</p>
														<p className='text-sm text-muted-foreground'>
															{formatFileSize(
																file.size
															)}
														</p>
													</div>
													<Badge
														variant='outline'
														className='text-xs'>
														{index + 1}
													</Badge>
													<Button
														onClick={() =>
															removeFile(file.id)
														}
														variant='ghost'
														size='sm'
														className='h-8 w-8 p-0 text-red-600 hover:text-red-700'>
														<X className='h-4 w-4' />
													</Button>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							<Button
								onClick={mergePDFs}
								disabled={files.length < 2 || isMerging}
								className='w-full'>
								<Merge className='h-4 w-4 mr-2' />
								{isMerging
									? "Merging..."
									: `Merge ${files.length} PDFs`}
							</Button>

							{isMerging && (
								<div className='space-y-2'>
									<Progress value={progress} />
									<p className='text-sm text-center text-muted-foreground'>
										{progress}% complete
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Merge Results</CardTitle>
							<CardDescription>
								Download your merged PDF file
							</CardDescription>
						</CardHeader>
						<CardContent>
							{mergedFileUrl ? (
								<div className='space-y-6'>
									<div className='text-center p-6 bg-green-50 rounded-lg'>
										<FileText className='h-12 w-12 mx-auto mb-4 text-green-600' />
										<p className='font-medium text-green-800'>
											Merge Completed!
										</p>
										<p className='text-sm text-green-600 mt-1'>
											{files.length} PDFs merged
											successfully
										</p>
									</div>

									<Button
										onClick={downloadMerged}
										className='w-full'>
										<Download className='h-4 w-4 mr-2' />
										Download Merged PDF
									</Button>
								</div>
							) : (
								<div className='text-center py-12 text-muted-foreground'>
									<Merge className='h-12 w-12 mx-auto mb-4 opacity-50' />
									<p>
										Add PDF files and merge them to see
										results
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				<Card className='mt-6'>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<AlertCircle className='h-5 w-5' />
							How to Use PDF Merger
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid md:grid-cols-2 gap-6'>
							<div>
								<h4 className='font-medium mb-3'>
									Steps to Merge:
								</h4>
								<ol className='space-y-2 text-sm text-muted-foreground list-decimal list-inside'>
									<li>
										Upload multiple PDF files (drag & drop
										or click to browse)
									</li>
									<li>
										Arrange files in desired order using
										arrow buttons
									</li>
									<li>
										Click &quot;Merge PDFs&quot; to combine
										them
									</li>
									<li>Download the merged PDF file</li>
								</ol>
							</div>
							<div>
								<h4 className='font-medium mb-3'>Tips:</h4>
								<ul className='space-y-2 text-sm text-muted-foreground'>
									<li>
										• File order determines page order in
										merged PDF
									</li>
									<li>• Each file must be under 50MB</li>
									<li>
										• Remove unwanted files before merging
									</li>
									<li>• Keep original files as backup</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
