"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
	Search,
	Calculator,
	Code,
	ImageIcon as LucideImageIcon,
	Type,
	Shield,
	Zap,
	TrendingUp,
	FileText,
	Hash,
	User,
	Repeat,
	MessageSquare,
	Eye,
	Lock,
	Database,
	Globe,
	Ruler,
	Keyboard,
	GraduationCap,
	MessageCircle,
	FileArchiveIcon as Compress,
	Scissors,
	Calendar,
	DollarSign,
	MapIcon as Sitemap,
	Camera,
	FileImage,
	ArrowUpDown,
	ImageIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const allTools = [
	// SEO Tools
	{
		name: "Meta Tag Generator",
		icon: Code,
		category: "SEO",
		href: "/tools/meta-tag-generator",
	},
	{
		name: "Favicon Generator",
		icon: ImageIcon,
		category: "SEO",
		href: "/tools/favicon-generator",
	},
	{
		name: "Domain Age Checker",
		icon: Calendar,
		category: "SEO",
		href: "/tools/domain-age-checker",
	},
	{
		name: "Domain IP Lookup",
		icon: Globe,
		category: "SEO",
		href: "/tools/domain-ip-lookup",
	},
	{
		name: "Domain Authority Checker",
		icon: TrendingUp,
		category: "SEO",
		href: "/tools/domain-authority-checker",
	},
	{
		name: "Page Authority Checker",
		icon: TrendingUp,
		category: "SEO",
		href: "/tools/page-authority-checker",
	},
	{
		name: "WordPress Detector",
		icon: Search,
		category: "SEO",
		href: "/tools/wordpress-detector",
	},
	{
		name: "My IP Address",
		icon: Globe,
		category: "SEO",
		href: "/tools/my-ip-address",
	},
	{
		name: "Keyword Density Checker",
		icon: TrendingUp,
		category: "SEO",
		href: "/tools/keyword-density-checker",
	},
	{
		name: "Robots.txt Generator",
		icon: Shield,
		category: "SEO",
		href: "/tools/robots-generator",
	},
	{
		name: "Sitemap Generator",
		icon: Sitemap,
		category: "SEO",
		href: "/tools/sitemap-generator",
	},
	{
		name: "Open Graph Generator",
		icon: Globe,
		category: "SEO",
		href: "/tools/og-generator",
	},
	{
		name: "Schema Markup Generator",
		icon: Code,
		category: "SEO",
		href: "/tools/schema-generator",
	},
	{
		name: "Hashtag Generator",
		icon: Hash,
		category: "SEO",
		href: "/tools/hashtag-generator",
	},
	{
		name: "WhatsApp Chat Link Generator",
		icon: MessageCircle,
		category: "SEO",
		href: "/tools/whatsapp-link-generator",
	},

	// Calculators
	{
		name: "Percentage Calculator",
		icon: Calculator,
		category: "Calculator",
		href: "/tools/percentage-calculator",
	},
	{
		name: "BMI Calculator",
		icon: Calculator,
		category: "Calculator",
		href: "/tools/bmi-calculator",
	},
	{
		name: "EMI Calculator",
		icon: DollarSign,
		category: "Calculator",
		href: "/tools/emi-calculator",
	},
	{
		name: "Age Calculator",
		icon: Calendar,
		category: "Calculator",
		href: "/tools/age-calculator",
	},
	{
		name: "DOB Calculator",
		icon: Calendar,
		category: "Calculator",
		href: "/tools/dob-calculator",
	},
	{
		name: "Unit Converter",
		icon: Ruler,
		category: "Calculator",
		href: "/tools/unit-converter",
	},
	{
		name: "GPA Converter",
		icon: GraduationCap,
		category: "Calculator",
		href: "/tools/gpa-converter",
	},
	{
		name: "Currency Converter",
		icon: DollarSign,
		category: "Calculator",
		href: "/tools/currency-converter",
	},
	{
		name: "AdSense Revenue Calculator",
		icon: DollarSign,
		category: "Calculator",
		href: "/tools/adsense-calculator",
	},

	// Generators
	{
		name: "Password Generator",
		icon: Shield,
		category: "Generator",
		href: "/tools/password-generator",
	},
	{
		name: "QR Code Generator",
		icon: Code,
		category: "Generator",
		href: "/tools/qr-generator",
	},
	{
		name: "Username Generator",
		icon: User,
		category: "Generator",
		href: "/tools/username-generator",
	},
	{
		name: "Lorem Ipsum Generator",
		icon: Type,
		category: "Generator",
		href: "/tools/lorem-generator",
	},
	{
		name: "UUID Generator",
		icon: Hash,
		category: "Generator",
		href: "/tools/uuid-generator",
	},
	{
		name: "Fake Data Generator",
		icon: Database,
		category: "Generator",
		href: "/tools/fake-data-generator",
	},
	{
		name: "Caption Generator",
		icon: MessageSquare,
		category: "Generator",
		href: "/tools/caption-generator",
	},
	{
		name: "Color Palette Generator",
		icon: LucideImageIcon,
		category: "Generator",
		href: "/tools/color-generator",
	},
	{
		name: "Privacy Policy Generator",
		icon: Shield,
		category: "Generator",
		href: "/tools/privacy-policy-generator",
	},
	{
		name: "Terms & Conditions Generator",
		icon: FileText,
		category: "Generator",
		href: "/tools/terms-conditions-generator",
	},
	{
		name: "Disclaimer Generator",
		icon: FileText,
		category: "Generator",
		href: "/tools/disclaimer-generator",
	},

	// Text Tools
	{
		name: "Word Counter",
		icon: Type,
		category: "Text",
		href: "/tools/word-counter",
	},
	{
		name: "Article Rewriter",
		icon: Repeat,
		category: "Text",
		href: "/tools/article-rewriter",
	},
	{
		name: "Plagiarism Checker",
		icon: Eye,
		category: "Text",
		href: "/tools/plagiarism-checker",
	},
	{
		name: "Case Converter",
		icon: Type,
		category: "Text",
		href: "/tools/case-converter",
	},
	{
		name: "Text Diff Checker",
		icon: FileText,
		category: "Text",
		href: "/tools/text-diff-checker",
	},
	{
		name: "Password Strength Checker",
		icon: Lock,
		category: "Text",
		href: "/tools/password-strength-checker",
	},
	{
		name: "Typing Speed Test",
		icon: Keyboard,
		category: "Text",
		href: "/tools/typing-test",
	},
	{
		name: "URL Safety Checker",
		icon: Shield,
		category: "Text",
		href: "/tools/url-safety-checker",
	},

	// Image Tools
	{
		name: "Image Compressor",
		icon: Compress,
		category: "Image",
		href: "/tools/image-compressor",
	},
	{
		name: "Image Resizer",
		icon: Scissors,
		category: "Image",
		href: "/tools/image-resizer",
	},
	{
		name: "JPG to PNG Converter",
		icon: ArrowUpDown,
		category: "Image",
		href: "/tools/jpg-to-png",
	},
	{
		name: "PNG to JPG Converter",
		icon: ArrowUpDown,
		category: "Image",
		href: "/tools/png-to-jpg",
	},
	{
		name: "PNG to WebP Converter",
		icon: ArrowUpDown,
		category: "Image",
		href: "/tools/png-to-webp",
	},
	{
		name: "PDF to Image Converter",
		icon: FileImage,
		category: "Image",
		href: "/tools/pdf-to-image",
	},
	{
		name: "Image Background Remover",
		icon: Scissors,
		category: "Image",
		href: "/tools/bg-remover",
	},
	{
		name: "Image Filter",
		icon: Camera,
		category: "Image",
		href: "/tools/image-filter",
	},

	// Developer Tools
	{
		name: "JSON Formatter",
		icon: Code,
		category: "Developer",
		href: "/tools/json-formatter",
	},
	{
		name: "Base64 Encoder/Decoder",
		icon: Code,
		category: "Developer",
		href: "/tools/base64",
	},
	{
		name: "URL Encoder/Decoder",
		icon: Globe,
		category: "Developer",
		href: "/tools/url-encoder",
	},
	{
		name: "HTML Encoder/Decoder",
		icon: Code,
		category: "Developer",
		href: "/tools/html-encoder",
	},
	{
		name: "CSS Minifier",
		icon: Code,
		category: "Developer",
		href: "/tools/css-minifier",
	},
	{
		name: "JavaScript Minifier",
		icon: Code,
		category: "Developer",
		href: "/tools/js-minifier",
	},
	{
		name: "SQL Formatter",
		icon: Database,
		category: "Developer",
		href: "/tools/sql-formatter",
	},
	{
		name: "Regex Tester",
		icon: Code,
		category: "Developer",
		href: "/tools/regex-tester",
	},

	// PDF Tools
	{
		name: "PDF Compressor",
		icon: Compress,
		category: "PDF",
		href: "/tools/pdf-compressor",
	},
	{
		name: "PDF Merger",
		icon: FileText,
		category: "PDF",
		href: "/tools/pdf-merger",
	},
	{
		name: "PDF Splitter",
		icon: Scissors,
		category: "PDF",
		href: "/tools/pdf-splitter",
	},
	{
		name: "PDF to Word",
		icon: FileText,
		category: "PDF",
		href: "/tools/pdf-to-word",
	},
];

const categories = [
	"All",
	"SEO",
	"Calculator",
	"Generator",
	"Text",
	"Image",
	"Developer",
	"PDF",
];

export default function HomePage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");

	// Filter tools based on search query and selected category
	const filteredTools = useMemo(() => {
		let filtered = allTools;

		// Filter by category
		if (selectedCategory !== "All") {
			filtered = filtered.filter(
				(tool) => tool.category === selectedCategory
			);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			filtered = filtered.filter(
				(tool) =>
					tool.name.toLowerCase().includes(query) ||
					tool.category.toLowerCase().includes(query)
			);
		}

		return filtered;
	}, [searchQuery, selectedCategory]);

	// Group filtered tools by category
	const groupedTools = useMemo(() => {
		const groups: { [key: string]: typeof allTools } = {};

		filteredTools.forEach((tool) => {
			if (!groups[tool.category]) {
				groups[tool.category] = [];
			}
			groups[tool.category].push(tool);
		});

		return groups;
	}, [filteredTools]);

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Hero Section */}
			<section className='py-12 px-4 bg-white'>
				<div className='container mx-auto text-center'>
					<h1 className='text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent'>
						Free Online Tools
					</h1>
					<p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
						65+ powerful tools to boost your productivity. All free,
						no registration required.
					</p>

					{/* Search Bar */}
					<div className='max-w-md mx-auto mb-8'>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
							<Input
								placeholder='Search tools...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='pl-10 py-3 border-gray-300 focus:border-blue-500 rounded-lg'
							/>
						</div>
						{searchQuery && (
							<div className='mt-2 text-sm text-gray-600'>
								Found {filteredTools.length} tool
								{filteredTools.length !== 1 ? "s" : ""} matching
								&quot;{searchQuery}&quot;
							</div>
						)}
					</div>

					{/* Category Filters */}
					<div className='flex flex-wrap justify-center gap-2 mb-8'>
						{categories.map((cat) => (
							<button
								key={cat}
								onClick={() => setSelectedCategory(cat)}
								className={`px-4 py-2 rounded-full border transition-colors text-sm ${
									selectedCategory === cat
										? "border-blue-500 bg-blue-50 text-blue-600"
										: "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
								}`}>
								{cat}
								{cat !== "All" && (
									<span className='ml-1 text-xs opacity-70'>
										(
										{
											allTools.filter(
												(tool) => tool.category === cat
											).length
										}
										)
									</span>
								)}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Tools Section with Sidebar */}
			<section className='py-8 px-4'>
				<div className='container mx-auto'>
					<div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
						{/* Main Tools Area */}
						<div className='lg:col-span-3'>
							{/* Show message if no tools found */}
							{filteredTools.length === 0 ? (
								<div className='text-center py-12'>
									<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
										<Search className='w-8 h-8 text-gray-400' />
									</div>
									<h3 className='text-xl font-semibold text-gray-800 mb-2'>
										No tools found
									</h3>
									<p className='text-gray-600 mb-4'>
										Try adjusting your search or selecting a
										different category.
									</p>
									<button
										onClick={() => {
											setSearchQuery("");
											setSelectedCategory("All");
										}}
										className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
										Clear filters
									</button>
								</div>
							) : (
								/* Category Sections */
								Object.entries(groupedTools).map(
									([category, categoryTools]) => (
										<div key={category} className='mb-12'>
											<div className='flex items-center gap-3 mb-6'>
												<div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center'>
													{category === "SEO" && (
														<TrendingUp className='w-4 h-4 text-white' />
													)}
													{category ===
														"Calculator" && (
														<Calculator className='w-4 h-4 text-white' />
													)}
													{category ===
														"Generator" && (
														<Zap className='w-4 h-4 text-white' />
													)}
													{category === "Text" && (
														<Type className='w-4 h-4 text-white' />
													)}
													{category === "Image" && (
														<LucideImageIcon className='w-4 h-4 text-white' />
													)}
													{category ===
														"Developer" && (
														<Code className='w-4 h-4 text-white' />
													)}
													{category === "PDF" && (
														<FileText className='w-4 h-4 text-white' />
													)}
												</div>
												<h2 className='text-2xl font-bold text-gray-800'>
													{category} Tools
												</h2>
												<span className='text-sm text-gray-500'>
													({categoryTools.length}{" "}
													tools)
												</span>
											</div>

											<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4'>
												{categoryTools.map(
													(tool, index) => {
														const IconComponent =
															tool.icon;
														return (
															<Link
																key={index}
																href={
																	tool.href
																}>
																<div className='group bg-white rounded-lg p-4 hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300'>
																	<div className='flex flex-col items-center text-center space-y-3'>
																		<div className='w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform'>
																			<IconComponent className='w-6 h-6 text-blue-600' />
																		</div>
																		<div>
																			<h3 className='font-medium text-gray-800 text-sm leading-tight'>
																				{
																					tool.name
																				}
																			</h3>
																		</div>
																	</div>
																</div>
															</Link>
														);
													}
												)}
											</div>
										</div>
									)
								)
							)}
						</div>

						{/* Right Sidebar - Trending Tools */}
						<div className='lg:col-span-1'>
							<div className='sticky top-24'>
								<Card className='shadow-xl border-0 bg-gradient-to-br from-orange-50 to-red-50'>
									<CardHeader>
										<CardTitle className='flex items-center gap-2 text-orange-800'>
											<span className='text-lg'>🔥</span>
											Trending Tools
										</CardTitle>
										<CardDescription>
											Most popular tools this week
										</CardDescription>
									</CardHeader>
									<CardContent className='space-y-3'>
										{[
											{
												name: "Password Generator",
												href: "/tools/password-generator",
												icon: Shield,
											},
											{
												name: "QR Code Generator",
												href: "/tools/qr-generator",
												icon: Code,
											},
											{
												name: "Image Compressor",
												href: "/tools/image-compressor",
												icon: Compress,
											},
											{
												name: "Username Generator",
												href: "/tools/username-generator",
												icon: User,
											},
											{
												name: "EMI Calculator",
												href: "/tools/emi-calculator",
												icon: DollarSign,
											},
											{
												name: "Typing Speed Test",
												href: "/tools/typing-test",
												icon: Keyboard,
											},
											{
												name: "JPG to PNG Converter",
												href: "/tools/jpg-to-png",
												icon: ArrowUpDown,
											},
											{
												name: "Image Resizer",
												href: "/tools/image-resizer",
												icon: Scissors,
											},
										].map((tool, index) => {
											const IconComponent = tool.icon;
											return (
												<Link
													key={index}
													href={tool.href}>
													<div className='flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all duration-200 border border-orange-200 hover:border-orange-300'>
														<div className='w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center'>
															<IconComponent className='w-4 h-4 text-orange-600' />
														</div>
														<div className='flex-1'>
															<p className='font-medium text-gray-800 text-sm leading-tight'>
																{tool.name}
															</p>
														</div>
														<div className='text-orange-500 text-xs font-bold'>
															#{index + 1}
														</div>
													</div>
												</Link>
											);
										})}
									</CardContent>
								</Card>

								{/* Quick Stats */}
								<Card className='shadow-xl border-0 mt-6 bg-gradient-to-br from-blue-50 to-purple-50'>
									<CardContent className='p-4'>
										<h3 className='font-semibold text-gray-800 mb-3'>
											📊 Platform Stats
										</h3>
										<div className='space-y-3 text-sm'>
											<div className='flex justify-between'>
												<span className='text-gray-600'>
													Total Tools
												</span>
												<span className='font-bold text-blue-600'>
													65+
												</span>
											</div>
											<div className='flex justify-between'>
												<span className='text-gray-600'>
													Categories
												</span>
												<span className='font-bold text-purple-600'>
													7
												</span>
											</div>
											<div className='flex justify-between'>
												<span className='text-gray-600'>
													Users This Month
												</span>
												<span className='font-bold text-green-600'>
													10K+
												</span>
											</div>
											<div className='flex justify-between'>
												<span className='text-gray-600'>
													Tools Used Today
												</span>
												<span className='font-bold text-orange-600'>
													2.5K+
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
