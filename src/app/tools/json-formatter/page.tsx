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
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Code,
	Copy,
	Download,
	Upload,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function JSONFormatter() {
	const [inputJSON, setInputJSON] = useState("");
	const [outputJSON, setOutputJSON] = useState("");
	const [indentSize, setIndentSize] = useState("2");
	const [isValid, setIsValid] = useState<boolean | null>(null);
	const [error, setError] = useState("");

	const formatJSON = () => {
		try {
			const parsed = JSON.parse(inputJSON);
			const formatted = JSON.stringify(
				parsed,
				null,
				Number.parseInt(indentSize)
			);
			setOutputJSON(formatted);
			setIsValid(true);
			setError("");
			toast.success("JSON formatted successfully");
		} catch (err) {
			setIsValid(false);
			setError(err instanceof Error ? err.message : "Invalid JSON");
			setOutputJSON("");
			toast.error("Invalid JSON");
		}
	};

	const minifyJSON = () => {
		try {
			const parsed = JSON.parse(inputJSON);
			const minified = JSON.stringify(parsed);
			setOutputJSON(minified);
			setIsValid(true);
			setError("");
			toast.success("JSON minified successfully");
		} catch (err) {
			setIsValid(false);
			setError(err instanceof Error ? err.message : "Invalid JSON");
			setOutputJSON("");
			toast.error("Invalid JSON");
		}
	};

	const validateJSON = () => {
		try {
			JSON.parse(inputJSON);
			setIsValid(true);
			setError("");
			toast.success("Valid JSON");
		} catch (err) {
			setIsValid(false);
			setError(err instanceof Error ? err.message : "Invalid JSON");
			toast.error("Invalid JSON");
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(outputJSON);
		toast.success("Formatted JSON copied to clipboard");
	};

	const downloadJSON = () => {
		const blob = new Blob([outputJSON], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "formatted.json";
		a.click();
		URL.revokeObjectURL(url);
		toast.success("JSON downloaded successfully");
	};

	const loadSampleJSON = () => {
		const sample = {
			name: "John Doe",
			age: 30,
			email: "john.doe@example.com",
			address: {
				street: "123 Main St",
				city: "New York",
				zipCode: "10001",
			},
			hobbies: ["reading", "swimming", "coding"],
			isActive: true,
			balance: 1250.5,
		};
		setInputJSON(JSON.stringify(sample));
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-6xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Code className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						JSON Formatter
					</h1>
					<p className='text-gray-600'>
						Format, validate, and minify JSON data
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Input Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center justify-between'>
								<span>Input JSON</span>
								<div className='flex items-center gap-2'>
									{isValid === true && (
										<CheckCircle className='w-5 h-5 text-green-500' />
									)}
									{isValid === false && (
										<XCircle className='w-5 h-5 text-red-500' />
									)}
								</div>
							</CardTitle>
							<CardDescription>
								Paste your JSON data here
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<Textarea
								placeholder='Paste your JSON here...'
								value={inputJSON}
								onChange={(e) => {
									setInputJSON(e.target.value);
									setIsValid(null);
									setError("");
								}}
								className='min-h-96 font-mono text-sm resize-none'
							/>

							{error && (
								<div className='bg-red-50 border border-red-200 p-3 rounded-lg'>
									<p className='text-red-800 text-sm font-medium'>
										Error:
									</p>
									<p className='text-red-700 text-sm'>
										{error}
									</p>
								</div>
							)}

							<div className='flex flex-wrap gap-2'>
								<Button
									onClick={loadSampleJSON}
									variant='outline'
									size='sm'>
									<Upload className='w-4 h-4 mr-2' />
									Load Sample
								</Button>
								<Button
									onClick={validateJSON}
									variant='outline'
									size='sm'
									disabled={!inputJSON}>
									Validate
								</Button>
								<div className='flex items-center gap-2'>
									<span className='text-sm text-gray-600'>
										Indent:
									</span>
									<Select
										value={indentSize}
										onValueChange={setIndentSize}>
										<SelectTrigger className='w-16 h-8'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='2'>2</SelectItem>
											<SelectItem value='4'>4</SelectItem>
											<SelectItem value='8'>8</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className='flex gap-2'>
								<Button
									onClick={formatJSON}
									disabled={!inputJSON}
									className='flex-1'>
									Format JSON
								</Button>
								<Button
									onClick={minifyJSON}
									disabled={!inputJSON}
									variant='outline'
									className='flex-1 bg-transparent'>
									Minify JSON
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Output Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Formatted JSON</CardTitle>
							<CardDescription>
								Your formatted JSON will appear here
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<Textarea
								value={outputJSON}
								readOnly
								placeholder='Formatted JSON will appear here...'
								className='min-h-96 font-mono text-sm resize-none bg-gray-50'
							/>

							{outputJSON && (
								<div className='bg-green-50 p-3 rounded-lg'>
									<div className='grid grid-cols-2 gap-4 text-sm'>
										<div>
											<p className='text-green-600 font-medium'>
												Characters
											</p>
											<p className='text-green-800 font-bold'>
												{outputJSON.length}
											</p>
										</div>
										<div>
											<p className='text-green-600 font-medium'>
												Lines
											</p>
											<p className='text-green-800 font-bold'>
												{outputJSON.split("\n").length}
											</p>
										</div>
									</div>
								</div>
							)}

							<div className='flex gap-2'>
								<Button
									onClick={copyToClipboard}
									disabled={!outputJSON}
									variant='outline'
									className='flex-1 bg-transparent'>
									<Copy className='w-4 h-4 mr-2' />
									Copy
								</Button>
								<Button
									onClick={downloadJSON}
									disabled={!outputJSON}
									variant='outline'
									className='flex-1 bg-transparent'>
									<Download className='w-4 h-4 mr-2' />
									Download
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Features */}
				<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 mt-8'>
					<CardContent className='p-6'>
						<h3 className='font-semibold text-gray-800 mb-4'>
							🚀 Features:
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
							<ul className='space-y-2'>
								<li>
									• <strong>Format JSON:</strong> Pretty print
									with proper indentation
								</li>
								<li>
									• <strong>Minify JSON:</strong> Remove
									whitespace to reduce size
								</li>
								<li>
									• <strong>Validate JSON:</strong> Check for
									syntax errors
								</li>
								<li>
									• <strong>Customizable indentation:</strong>{" "}
									2, 4, or 8 spaces
								</li>
							</ul>
							<ul className='space-y-2'>
								<li>
									• <strong>Error highlighting:</strong> Clear
									error messages
								</li>
								<li>
									• <strong>Copy to clipboard:</strong> Easy
									sharing
								</li>
								<li>
									• <strong>Download formatted JSON:</strong>{" "}
									Save as file
								</li>
								<li>
									• <strong>Sample data:</strong> Test with
									example JSON
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
