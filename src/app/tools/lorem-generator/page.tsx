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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Type, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function LoremGenerator() {
	const [count, setCount] = useState("5");
	const [type, setType] = useState("paragraphs");
	const [startWithLorem, setStartWithLorem] = useState(true);
	const [generatedText, setGeneratedText] = useState("");

	const loremWords = [
		"lorem",
		"ipsum",
		"dolor",
		"sit",
		"amet",
		"consectetur",
		"adipiscing",
		"elit",
		"sed",
		"do",
		"eiusmod",
		"tempor",
		"incididunt",
		"ut",
		"labore",
		"et",
		"dolore",
		"magna",
		"aliqua",
		"enim",
		"ad",
		"minim",
		"veniam",
		"quis",
		"nostrud",
		"exercitation",
		"ullamco",
		"laboris",
		"nisi",
		"aliquip",
		"ex",
		"ea",
		"commodo",
		"consequat",
		"duis",
		"aute",
		"irure",
		"in",
		"reprehenderit",
		"voluptate",
		"velit",
		"esse",
		"cillum",
		"fugiat",
		"nulla",
		"pariatur",
		"excepteur",
		"sint",
		"occaecat",
		"cupidatat",
		"non",
		"proident",
		"sunt",
		"culpa",
		"qui",
		"officia",
		"deserunt",
		"mollit",
		"anim",
		"id",
		"est",
		"laborum",
		"at",
		"vero",
		"eos",
		"accusamus",
		"accusantium",
		"doloremque",
		"laudantium",
		"totam",
		"rem",
		"aperiam",
		"eaque",
		"ipsa",
		"quae",
		"ab",
		"illo",
		"inventore",
		"veritatis",
		"et",
		"quasi",
		"architecto",
		"beatae",
		"vitae",
		"dicta",
		"sunt",
		"explicabo",
		"nemo",
		"ipsam",
		"voluptatem",
		"quia",
		"voluptas",
		"aspernatur",
		"aut",
		"odit",
		"fugit",
		"sed",
		"quia",
		"consequuntur",
		"magni",
		"dolores",
		"ratione",
		"sequi",
		"nesciunt",
	];

	const generateSentence = () => {
		const sentenceLength = Math.floor(Math.random() * 10) + 8; // 8-17 words
		const words = [];

		for (let i = 0; i < sentenceLength; i++) {
			const randomWord =
				loremWords[Math.floor(Math.random() * loremWords.length)];
			words.push(randomWord);
		}

		// Capitalize first word
		words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

		return words.join(" ") + ".";
	};

	const generateParagraph = () => {
		const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 sentences
		const sentences = [];

		for (let i = 0; i < sentenceCount; i++) {
			sentences.push(generateSentence());
		}

		return sentences.join(" ");
	};

	const generateText = () => {
		const numCount = Number.parseInt(count);
		let result = [];

		if (type === "words") {
			const words = [];
			for (let i = 0; i < numCount; i++) {
				words.push(
					loremWords[Math.floor(Math.random() * loremWords.length)]
				);
			}
			if (startWithLorem && numCount > 0) {
				words[0] = "Lorem";
				if (numCount > 1) words[1] = "ipsum";
			}
			result = [words.join(" ")];
		} else if (type === "sentences") {
			for (let i = 0; i < numCount; i++) {
				let sentence = generateSentence();
				if (i === 0 && startWithLorem) {
					sentence =
						"Lorem ipsum " +
						sentence.substring(sentence.indexOf(" ") + 1);
				}
				result.push(sentence);
			}
		} else if (type === "paragraphs") {
			for (let i = 0; i < numCount; i++) {
				let paragraph = generateParagraph();
				if (i === 0 && startWithLorem) {
					paragraph =
						"Lorem ipsum " +
						paragraph.substring(paragraph.indexOf(" ") + 1);
				}
				result.push(paragraph);
			}
		}

		setGeneratedText(result.join(type === "paragraphs" ? "\n\n" : " "));
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(generatedText);
		toast.success("Lorem ipsum text copied to clipboard");
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Type className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						Lorem Ipsum Generator
					</h1>
					<p className='text-gray-600'>
						Generate placeholder text for your designs and layouts
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Settings */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Generator Settings</CardTitle>
							<CardDescription>
								Customize your Lorem Ipsum text generation
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Count</Label>
									<Input
										type='number'
										min='1'
										max='100'
										value={count}
										onChange={(e) =>
											setCount(e.target.value)
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label>Type</Label>
									<Select
										value={type}
										onValueChange={setType}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='words'>
												Words
											</SelectItem>
											<SelectItem value='sentences'>
												Sentences
											</SelectItem>
											<SelectItem value='paragraphs'>
												Paragraphs
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className='flex items-center space-x-2'>
								<input
									type='checkbox'
									id='start-lorem'
									checked={startWithLorem}
									onChange={(e) =>
										setStartWithLorem(e.target.checked)
									}
									className='rounded'
								/>
								<Label htmlFor='start-lorem'>
									Start with &quot;Lorem ipsum&quot;
								</Label>
							</div>

							<Button
								onClick={generateText}
								className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
								size='lg'>
								<RefreshCw className='w-4 h-4 mr-2' />
								Generate Lorem Ipsum
							</Button>

							<div className='bg-blue-50 p-4 rounded-lg'>
								<h3 className='font-semibold text-blue-800 mb-2'>
									About Lorem Ipsum
								</h3>
								<p className='text-sm text-blue-700'>
									Lorem Ipsum is simply dummy text of the
									printing and typesetting industry. It has
									been the industry&apos;s standard dummy text
									ever since the 1500s, when an unknown
									printer took a galley of type and scrambled
									it to make a type specimen book.
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Generated Text */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Generated Text</CardTitle>
							<CardDescription>
								Your Lorem Ipsum placeholder text
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<Textarea
								value={generatedText}
								readOnly
								placeholder="Click 'Generate Lorem Ipsum' to create placeholder text..."
								className='min-h-96 resize-none'
							/>

							<div className='flex gap-2'>
								<Button
									onClick={copyToClipboard}
									disabled={!generatedText}
									className='flex-1 bg-transparent'
									variant='outline'>
									<Copy className='w-4 h-4 mr-2' />
									Copy Text
								</Button>
								<Button
									onClick={generateText}
									disabled={!count}
									className='flex-1'>
									<RefreshCw className='w-4 h-4 mr-2' />
									Regenerate
								</Button>
							</div>

							{generatedText && (
								<div className='bg-green-50 p-4 rounded-lg'>
									<div className='grid grid-cols-3 gap-4 text-center'>
										<div>
											<p className='text-sm text-green-600'>
												Characters
											</p>
											<p className='text-lg font-bold text-green-800'>
												{generatedText.length}
											</p>
										</div>
										<div>
											<p className='text-sm text-green-600'>
												Words
											</p>
											<p className='text-lg font-bold text-green-800'>
												{
													generatedText
														.split(/\s+/)
														.filter(
															(word) =>
																word.length > 0
														).length
												}
											</p>
										</div>
										<div>
											<p className='text-sm text-green-600'>
												Paragraphs
											</p>
											<p className='text-lg font-bold text-green-800'>
												{
													generatedText
														.split(/\n\s*\n/)
														.filter(
															(p) =>
																p.trim()
																	.length > 0
														).length
												}
											</p>
										</div>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
