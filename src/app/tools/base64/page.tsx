"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, Upload, Download } from "lucide-react";
import { toast } from "sonner";

export default function Base64Tool() {
	const [inputText, setInputText] = useState("");
	const [outputText, setOutputText] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");

	const encodeBase64 = () => {
		try {
			const encoded = btoa(inputText);
			setOutputText(encoded);
			toast.success("Encoded", {
				description: "Text encoded to Base64 successfully",
			});
		} catch (error) {
			toast.error("Error", {
				description: "Failed to encode text",
			});
		}
	};

	const decodeBase64 = () => {
		try {
			const decoded = atob(inputText);
			setOutputText(decoded);
			toast.success("Decoded", {
				description: "Base64 decoded successfully",
			});
		} catch (error) {
			toast.error("Error", {
				description: "Invalid Base64 string",
			});
		}
	};

	const handleProcess = () => {
		if (mode === "encode") {
			encodeBase64();
		} else {
			decodeBase64();
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(outputText);
		toast.success("Copied", {
			description: "Result copied to clipboard",
		});
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const content = e.target?.result as string;
				setInputText(content);
			};
			reader.readAsText(file);
		}
	};

	const downloadResult = () => {
		const blob = new Blob([outputText], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = mode === "encode" ? "encoded.txt" : "decoded.txt";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-6xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Code className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						Base64 Encoder/Decoder
					</h1>
					<p className='text-gray-600'>
						Encode and decode text using Base64 encoding
					</p>
				</div>

				<Tabs
					value={mode}
					onValueChange={(value) =>
						setMode(value as "encode" | "decode")
					}
					className='w-full'>
					<TabsList className='grid w-full grid-cols-2 mb-8'>
						<TabsTrigger value='encode'>Encode</TabsTrigger>
						<TabsTrigger value='decode'>Decode</TabsTrigger>
					</TabsList>

					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
						{/* Input Section */}
						<Card className='shadow-xl border-0'>
							<CardHeader>
								<CardTitle>
									{mode === "encode"
										? "Text to Encode"
										: "Base64 to Decode"}
								</CardTitle>
								<CardDescription>
									{mode === "encode"
										? "Enter plain text to convert to Base64"
										: "Enter Base64 encoded text to decode"}
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<Textarea
									placeholder={
										mode === "encode"
											? "Enter your text here..."
											: "Enter Base64 encoded text here..."
									}
									value={inputText}
									onChange={(e) =>
										setInputText(e.target.value)
									}
									className='min-h-64 resize-none font-mono text-sm'
								/>

								<div className='flex items-center gap-2'>
									<input
										type='file'
										accept='.txt'
										onChange={handleFileUpload}
										className='hidden'
										id='file-upload'
									/>
									<Button
										onClick={() =>
											document
												.getElementById("file-upload")
												?.click()
										}
										variant='outline'
										size='sm'>
										<Upload className='w-4 h-4 mr-2' />
										Upload File
									</Button>
									<Button
										onClick={() => {
											setInputText("");
											setOutputText("");
										}}
										variant='outline'
										size='sm'>
										Clear
									</Button>
								</div>

								<Button
									onClick={handleProcess}
									disabled={!inputText}
									className='w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
									size='lg'>
									{mode === "encode"
										? "Encode to Base64"
										: "Decode from Base64"}
								</Button>
							</CardContent>
						</Card>

						{/* Output Section */}
						<Card className='shadow-xl border-0'>
							<CardHeader>
								<CardTitle>
									{mode === "encode"
										? "Base64 Encoded"
										: "Decoded Text"}
								</CardTitle>
								<CardDescription>
									{mode === "encode"
										? "Your Base64 encoded result"
										: "Your decoded text result"}
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<Textarea
									value={outputText}
									readOnly
									placeholder={`${
										mode === "encode"
											? "Base64 encoded"
											: "Decoded"
									} text will appear here...`}
									className='min-h-64 resize-none font-mono text-sm bg-gray-50'
								/>

								{outputText && (
									<div className='bg-green-50 p-3 rounded-lg'>
										<div className='grid grid-cols-2 gap-4 text-sm'>
											<div>
												<p className='text-green-600 font-medium'>
													Input Length
												</p>
												<p className='text-green-800 font-bold'>
													{inputText.length}
												</p>
											</div>
											<div>
												<p className='text-green-600 font-medium'>
													Output Length
												</p>
												<p className='text-green-800 font-bold'>
													{outputText.length}
												</p>
											</div>
										</div>
									</div>
								)}

								<div className='flex gap-2'>
									<Button
										onClick={copyToClipboard}
										disabled={!outputText}
										variant='outline'
										className='flex-1 bg-transparent'>
										<Copy className='w-4 h-4 mr-2' />
										Copy
									</Button>
									<Button
										onClick={downloadResult}
										disabled={!outputText}
										variant='outline'
										className='flex-1 bg-transparent'>
										<Download className='w-4 h-4 mr-2' />
										Download
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</Tabs>

				{/* Information */}
				<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 mt-8'>
					<CardContent className='p-6'>
						<h3 className='font-semibold text-gray-800 mb-4'>
							📚 About Base64:
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600'>
							<div>
								<h4 className='font-medium text-gray-800 mb-2'>
									What is Base64?
								</h4>
								<p className='mb-3'>
									Base64 is a binary-to-text encoding scheme
									that represents binary data in an ASCII
									string format. It&apos;s commonly used to
									encode data that needs to be stored or
									transmitted over media designed for text.
								</p>
								<h4 className='font-medium text-gray-800 mb-2'>
									Common Uses:
								</h4>
								<ul className='space-y-1'>
									<li>• Email attachments (MIME)</li>
									<li>• Data URLs in web development</li>
									<li>• API authentication tokens</li>
									<li>• Storing binary data in JSON/XML</li>
								</ul>
							</div>
							<div>
								<h4 className='font-medium text-gray-800 mb-2'>
									Characteristics:
								</h4>
								<ul className='space-y-1 mb-3'>
									<li>
										• Uses 64 characters: A-Z, a-z, 0-9, +,
										/
									</li>
									<li>
										• Padding character: = (for alignment)
									</li>
									<li>• Output is ~33% larger than input</li>
									<li>• Safe for text-based protocols</li>
								</ul>
								<h4 className='font-medium text-gray-800 mb-2'>
									Security Note:
								</h4>
								<p className='text-yellow-700 bg-yellow-50 p-2 rounded'>
									⚠️ Base64 is encoding, not encryption. It
									doesn&apos;t provide security - anyone can
									decode Base64 text.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
