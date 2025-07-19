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
import { Textarea } from "@/components/ui/textarea";
import { Code, Copy } from "lucide-react";
import { toast } from "sonner";

export default function MetaTagGenerator() {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		keywords: "",
		author: "",
		viewport: "width=device-width, initial-scale=1",
		robots: "index, follow",
		ogTitle: "",
		ogDescription: "",
		ogImage: "",
		ogUrl: "",
		twitterCard: "summary_large_image",
		twitterTitle: "",
		twitterDescription: "",
		twitterImage: "",
	});

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const generateMetaTags = () => {
		const tags = [];

		if (formData.title) tags.push(`<title>${formData.title}</title>`);
		if (formData.description)
			tags.push(
				`<meta name="description" content="${formData.description}">`
			);
		if (formData.keywords)
			tags.push(`<meta name="keywords" content="${formData.keywords}">`);
		if (formData.author)
			tags.push(`<meta name="author" content="${formData.author}">`);
		if (formData.viewport)
			tags.push(`<meta name="viewport" content="${formData.viewport}">`);
		if (formData.robots)
			tags.push(`<meta name="robots" content="${formData.robots}">`);

		// Open Graph tags
		if (formData.ogTitle)
			tags.push(
				`<meta property="og:title" content="${formData.ogTitle}">`
			);
		if (formData.ogDescription)
			tags.push(
				`<meta property="og:description" content="${formData.ogDescription}">`
			);
		if (formData.ogImage)
			tags.push(
				`<meta property="og:image" content="${formData.ogImage}">`
			);
		if (formData.ogUrl)
			tags.push(`<meta property="og:url" content="${formData.ogUrl}">`);
		tags.push(`<meta property="og:type" content="website">`);

		// Twitter tags
		if (formData.twitterCard)
			tags.push(
				`<meta name="twitter:card" content="${formData.twitterCard}">`
			);
		if (formData.twitterTitle)
			tags.push(
				`<meta name="twitter:title" content="${formData.twitterTitle}">`
			);
		if (formData.twitterDescription)
			tags.push(
				`<meta name="twitter:description" content="${formData.twitterDescription}">`
			);
		if (formData.twitterImage)
			tags.push(
				`<meta name="twitter:image" content="${formData.twitterImage}">`
			);

		return tags.join("\n");
	};

	const copyToClipboard = () => {
		const metaTags = generateMetaTags();
		navigator.clipboard.writeText(metaTags);
		toast.success("Meta tags copied to clipboard");
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-6xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Code className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						Meta Tag Generator
					</h1>
					<p className='text-gray-600'>
						Generate SEO-friendly meta tags for your website
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Input Form */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Website Information</CardTitle>
							<CardDescription>
								Enter your website details to generate meta tags
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<Label>Page Title</Label>
								<Input
									placeholder='Your page title (50-60 characters)'
									value={formData.title}
									onChange={(e) =>
										handleChange("title", e.target.value)
									}
								/>
							</div>

							<div className='space-y-2'>
								<Label>Meta Description</Label>
								<Textarea
									placeholder='Brief description of your page (150-160 characters)'
									value={formData.description}
									onChange={(e) =>
										handleChange(
											"description",
											e.target.value
										)
									}
									rows={3}
								/>
							</div>

							<div className='space-y-2'>
								<Label>Keywords</Label>
								<Input
									placeholder='keyword1, keyword2, keyword3'
									value={formData.keywords}
									onChange={(e) =>
										handleChange("keywords", e.target.value)
									}
								/>
							</div>

							<div className='space-y-2'>
								<Label>Author</Label>
								<Input
									placeholder='Your name or company'
									value={formData.author}
									onChange={(e) =>
										handleChange("author", e.target.value)
									}
								/>
							</div>

							<div className='space-y-2'>
								<Label>Open Graph Title</Label>
								<Input
									placeholder='Title for social media sharing'
									value={formData.ogTitle}
									onChange={(e) =>
										handleChange("ogTitle", e.target.value)
									}
								/>
							</div>

							<div className='space-y-2'>
								<Label>Open Graph Description</Label>
								<Textarea
									placeholder='Description for social media sharing'
									value={formData.ogDescription}
									onChange={(e) =>
										handleChange(
											"ogDescription",
											e.target.value
										)
									}
									rows={2}
								/>
							</div>

							<div className='space-y-2'>
								<Label>Open Graph Image URL</Label>
								<Input
									placeholder='https://example.com/image.jpg'
									value={formData.ogImage}
									onChange={(e) =>
										handleChange("ogImage", e.target.value)
									}
								/>
							</div>

							<div className='space-y-2'>
								<Label>Website URL</Label>
								<Input
									placeholder='https://example.com'
									value={formData.ogUrl}
									onChange={(e) =>
										handleChange("ogUrl", e.target.value)
									}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Generated Meta Tags */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Generated Meta Tags</CardTitle>
							<CardDescription>
								Copy and paste these tags into your HTML head
								section
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96'>
								<pre>
									{generateMetaTags() ||
										"Enter website information to generate meta tags..."}
								</pre>
							</div>

							<Button
								onClick={copyToClipboard}
								className='w-full'
								disabled={!formData.title}>
								<Copy className='w-4 h-4 mr-2' />
								Copy Meta Tags
							</Button>

							<div className='bg-blue-50 p-4 rounded-lg'>
								<h3 className='font-semibold text-blue-800 mb-2'>
									SEO Tips:
								</h3>
								<ul className='text-sm text-blue-700 space-y-1'>
									<li>• Keep titles under 60 characters</li>
									<li>
										• Meta descriptions should be 150-160
										characters
									</li>
									<li>• Use relevant keywords naturally</li>
									<li>
										• Include Open Graph tags for social
										sharing
									</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
