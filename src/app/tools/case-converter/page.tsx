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
import { Type, Copy } from "lucide-react";
import { toast } from "sonner";

export default function CaseConverter() {
	const [inputText, setInputText] = useState("");

	const conversions = [
		{
			name: "UPPERCASE",
			description: "Convert text to all uppercase letters",
			convert: (text: string) => text.toUpperCase(),
			example: "HELLO WORLD",
		},
		{
			name: "lowercase",
			description: "Convert text to all lowercase letters",
			convert: (text: string) => text.toLowerCase(),
			example: "hello world",
		},
		{
			name: "Title Case",
			description: "Capitalize the first letter of each word",
			convert: (text: string) =>
				text.replace(
					/\w\S*/g,
					(txt) =>
						txt.charAt(0).toUpperCase() +
						txt.substr(1).toLowerCase()
				),
			example: "Hello World",
		},
		{
			name: "Sentence case",
			description: "Capitalize only the first letter of each sentence",
			convert: (text: string) =>
				text
					.toLowerCase()
					.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
			example: "Hello world. This is a sentence.",
		},
		{
			name: "camelCase",
			description:
				"Remove spaces and capitalize each word except the first",
			convert: (text: string) => {
				const words = text.toLowerCase().split(/\s+/);
				return (
					words[0] +
					words
						.slice(1)
						.map(
							(word) =>
								word.charAt(0).toUpperCase() + word.slice(1)
						)
						.join("")
				);
			},
			example: "helloWorld",
		},
		{
			name: "PascalCase",
			description:
				"Remove spaces and capitalize each word including the first",
			convert: (text: string) => {
				return text
					.toLowerCase()
					.split(/\s+/)
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join("");
			},
			example: "HelloWorld",
		},
		{
			name: "snake_case",
			description:
				"Replace spaces with underscores and convert to lowercase",
			convert: (text: string) => text.toLowerCase().replace(/\s+/g, "_"),
			example: "hello_world",
		},
		{
			name: "kebab-case",
			description: "Replace spaces with hyphens and convert to lowercase",
			convert: (text: string) => text.toLowerCase().replace(/\s+/g, "-"),
			example: "hello-world",
		},
		{
			name: "CONSTANT_CASE",
			description:
				"Replace spaces with underscores and convert to uppercase",
			convert: (text: string) => text.toUpperCase().replace(/\s+/g, "_"),
			example: "HELLO_WORLD",
		},
		{
			name: "aLtErNaTiNg CaSe",
			description: "Alternate between uppercase and lowercase letters",
			convert: (text: string) => {
				return text
					.split("")
					.map((char, index) =>
						index % 2 === 0
							? char.toLowerCase()
							: char.toUpperCase()
					)
					.join("");
			},
			example: "hElLo WoRlD",
		},
		{
			name: "InVeRsE CaSe",
			description: "Swap uppercase and lowercase letters",
			convert: (text: string) => {
				return text
					.split("")
					.map((char) =>
						char === char.toUpperCase()
							? char.toLowerCase()
							: char.toUpperCase()
					)
					.join("");
			},
			example: "hELLO wORLD",
		},
		{
			name: "Reverse Text",
			description: "Reverse the order of characters",
			convert: (text: string) => text.split("").reverse().join(""),
			example: "dlroW olleH",
		},
	];

	const copyToClipboard = (text: string, name: string) => {
		navigator.clipboard.writeText(text);
		toast.success(`Copied! ${name} text copied to clipboard`);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-6xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Type className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						Case Converter
					</h1>
					<p className='text-gray-600'>
						Convert text between different case formats
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Input Section */}
					<Card className='shadow-xl border-0 lg:col-span-1'>
						<CardHeader>
							<CardTitle>Input Text</CardTitle>
							<CardDescription>
								Enter the text you want to convert
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Textarea
								placeholder='Enter your text here...'
								value={inputText}
								onChange={(e) => setInputText(e.target.value)}
								className='min-h-32 resize-none'
							/>
							{inputText && (
								<div className='mt-4 text-sm text-gray-600'>
									<p>Characters: {inputText.length}</p>
									<p>
										Words:{" "}
										{
											inputText
												.trim()
												.split(/\s+/)
												.filter(
													(word) => word.length > 0
												).length
										}
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Conversions */}
					<div className='lg:col-span-2'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							{conversions.map((conversion, index) => {
								const convertedText = inputText
									? conversion.convert(inputText)
									: "";
								return (
									<Card
										key={index}
										className='shadow-lg border-0'>
										<CardHeader className='pb-3'>
											<div className='flex items-center justify-between'>
												<CardTitle className='text-lg'>
													{conversion.name}
												</CardTitle>
												<Button
													size='sm'
													variant='outline'
													onClick={() =>
														copyToClipboard(
															convertedText,
															conversion.name
														)
													}
													disabled={!inputText}>
													<Copy className='w-3 h-3' />
												</Button>
											</div>
											<CardDescription className='text-xs'>
												{conversion.description}
											</CardDescription>
										</CardHeader>
										<CardContent className='pt-0'>
											<div className='bg-gray-50 p-3 rounded-lg min-h-16 border'>
												<p className='text-sm font-mono break-all'>
													{convertedText || (
														<span className='text-gray-400 italic'>
															{conversion.example}
														</span>
													)}
												</p>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</div>
				</div>

				{/* Tips */}
				<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 mt-8'>
					<CardContent className='p-6'>
						<h3 className='font-semibold text-gray-800 mb-4'>
							💡 Case Conversion Tips:
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
							<ul className='space-y-2'>
								<li>
									• <strong>camelCase:</strong> Common in
									JavaScript and Java
								</li>
								<li>
									• <strong>PascalCase:</strong> Used for
									class names in many languages
								</li>
								<li>
									• <strong>snake_case:</strong> Popular in
									Python and Ruby
								</li>
								<li>
									• <strong>kebab-case:</strong> Used in URLs
									and CSS classes
								</li>
							</ul>
							<ul className='space-y-2'>
								<li>
									• <strong>CONSTANT_CASE:</strong> For
									constants and environment variables
								</li>
								<li>
									• <strong>Title Case:</strong> For headings
									and titles
								</li>
								<li>
									• <strong>Sentence case:</strong> For
									regular text and descriptions
								</li>
								<li>
									• Choose the right case for your specific
									use case
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
