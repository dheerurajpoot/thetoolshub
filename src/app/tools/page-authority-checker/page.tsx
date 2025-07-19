"use client";

import type React from "react";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
	FileText,
	Search,
	AlertCircle,
	ExternalLink,
	BarChart3,
	Globe,
} from "lucide-react";
import { toast } from "sonner";

interface PageAuthority {
	url: string;
	pageAuthority: number;
	domainAuthority: number;
	linkingDomains: number;
	totalLinks: number;
	internalLinks: number;
	externalLinks: number;
	socialShares: number;
	loadTime: number;
	mobileScore: number;
	seoScore: number;
	lastCrawled: string;
}

export default function PageAuthorityChecker() {
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [pageData, setPageData] = useState<PageAuthority | null>(null);
	const [error, setError] = useState("");

	const validateUrl = (url: string) => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const getScoreColor = (score: number) => {
		if (score >= 70) return "text-green-600";
		if (score >= 50) return "text-yellow-600";
		if (score >= 30) return "text-orange-600";
		return "text-red-600";
	};

	const getScoreLabel = (score: number) => {
		if (score >= 70) return "Excellent";
		if (score >= 50) return "Good";
		if (score >= 30) return "Average";
		return "Poor";
	};

	const checkPageAuthority = async () => {
		if (!url.trim()) {
			setError("Please enter a URL");
			return;
		}

		let cleanUrl = url.trim();
		if (
			!cleanUrl.startsWith("http://") &&
			!cleanUrl.startsWith("https://")
		) {
			cleanUrl = "https://" + cleanUrl;
		}

		if (!validateUrl(cleanUrl)) {
			setError(
				"Please enter a valid URL (e.g., https://example.com/page)"
			);
			return;
		}

		setLoading(true);
		setError("");
		setPageData(null);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2500));

			// Generate realistic mock data
			const baseScore = Math.floor(Math.random() * 100);

			const mockData: PageAuthority = {
				url: cleanUrl,
				pageAuthority: baseScore,
				domainAuthority: Math.max(
					10,
					baseScore + Math.floor(Math.random() * 30) - 15
				),
				linkingDomains: Math.floor(Math.random() * 5000) + 50,
				totalLinks: Math.floor(Math.random() * 50000) + 500,
				internalLinks: Math.floor(Math.random() * 100) + 10,
				externalLinks: Math.floor(Math.random() * 50) + 5,
				socialShares: Math.floor(Math.random() * 10000) + 100,
				loadTime: Math.random() * 3 + 0.5,
				mobileScore: Math.floor(Math.random() * 40) + 60,
				seoScore: Math.floor(Math.random() * 40) + 50,
				lastCrawled: new Date().toISOString().split("T")[0],
			};

			setPageData(mockData);
			toast.success("Page authority checked!");
		} catch (err) {
			setError("Failed to check page authority. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			checkPageAuthority();
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4'>
			<div className='max-w-6xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-gray-900 mb-4'>
						Page Authority Checker
					</h1>
					<p className='text-xl text-gray-600'>
						Analyze page authority and SEO metrics for any URL
					</p>
				</div>

				<Card className='mb-6'>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<FileText className='w-5 h-5' />
							Page Authority Analysis
						</CardTitle>
						<CardDescription>
							Enter a URL to check its page authority and SEO
							performance
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<Label htmlFor='url'>Page URL</Label>
							<div className='flex gap-2 mt-1'>
								<Input
									id='url'
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder='https://example.com/page'
									className='flex-1'
								/>
								<Button
									onClick={checkPageAuthority}
									disabled={loading}>
									{loading ? (
										<BarChart3 className='w-4 h-4 mr-2 animate-pulse' />
									) : (
										<Search className='w-4 h-4 mr-2' />
									)}
									Check Page
								</Button>
							</div>
							{error && (
								<p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
									<AlertCircle className='w-4 h-4' />
									{error}
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				{pageData && (
					<div className='space-y-6'>
						{/* Main Metrics */}
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							<Card>
								<CardHeader className='pb-3'>
									<CardTitle className='text-lg'>
										Page Authority
									</CardTitle>
									<CardDescription>
										Individual page ranking strength
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='text-center'>
										<div
											className={`text-4xl font-bold ${getScoreColor(
												pageData.pageAuthority
											)}`}>
											{pageData.pageAuthority}
										</div>
										<Progress
											value={pageData.pageAuthority}
											className='mt-2'
										/>
										<Badge
											variant='secondary'
											className='mt-2'>
											{getScoreLabel(
												pageData.pageAuthority
											)}
										</Badge>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className='pb-3'>
									<CardTitle className='text-lg'>
										Domain Authority
									</CardTitle>
									<CardDescription>
										Overall domain strength
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='text-center'>
										<div
											className={`text-4xl font-bold ${getScoreColor(
												pageData.domainAuthority
											)}`}>
											{pageData.domainAuthority}
										</div>
										<Progress
											value={pageData.domainAuthority}
											className='mt-2'
										/>
										<Badge
											variant='secondary'
											className='mt-2'>
											{getScoreLabel(
												pageData.domainAuthority
											)}
										</Badge>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className='pb-3'>
									<CardTitle className='text-lg'>
										SEO Score
									</CardTitle>
									<CardDescription>
										Overall SEO performance
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='text-center'>
										<div
											className={`text-4xl font-bold ${getScoreColor(
												pageData.seoScore
											)}`}>
											{pageData.seoScore}
										</div>
										<Progress
											value={pageData.seoScore}
											className='mt-2'
										/>
										<Badge
											variant='secondary'
											className='mt-2'>
											{getScoreLabel(pageData.seoScore)}
										</Badge>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Detailed Metrics */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							<Card>
								<CardHeader>
									<CardTitle>Link Profile</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											Linking Domains
										</Label>
										<span className='text-lg font-semibold'>
											{pageData.linkingDomains.toLocaleString()}
										</span>
									</div>

									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											Total Links
										</Label>
										<span className='text-lg font-semibold'>
											{pageData.totalLinks.toLocaleString()}
										</span>
									</div>

									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											Internal Links
										</Label>
										<span className='text-lg font-semibold'>
											{pageData.internalLinks}
										</span>
									</div>

									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											External Links
										</Label>
										<span className='text-lg font-semibold'>
											{pageData.externalLinks}
										</span>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Performance Metrics</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											Social Shares
										</Label>
										<span className='text-lg font-semibold'>
											{pageData.socialShares.toLocaleString()}
										</span>
									</div>

									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											Load Time
										</Label>
										<span className='text-lg font-semibold'>
											{pageData.loadTime.toFixed(2)}s
										</span>
									</div>

									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											Mobile Score
										</Label>
										<div className='flex items-center gap-2'>
											<span className='text-lg font-semibold'>
												{pageData.mobileScore}
											</span>
											<Progress
												value={pageData.mobileScore}
												className='w-20'
											/>
										</div>
									</div>

									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											Last Crawled
										</Label>
										<span className='text-lg'>
											{new Date(
												pageData.lastCrawled
											).toLocaleDateString()}
										</span>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* URL Display */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Globe className='w-5 h-5' />
									Analyzed URL
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='bg-gray-100 p-3 rounded-lg'>
									<p className='font-mono text-sm break-all'>
										{pageData.url}
									</p>
								</div>
								<div className='mt-4 flex gap-2'>
									<Button variant='outline' size='sm'>
										<ExternalLink className='w-4 h-4 mr-2' />
										Visit Page
									</Button>
									<Button variant='outline' size='sm'>
										<BarChart3 className='w-4 h-4 mr-2' />
										Detailed Analysis
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Recommendations */}
						<Card>
							<CardHeader>
								<CardTitle>
									Improvement Recommendations
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<h4 className='font-semibold text-gray-900'>
											To Improve Page Authority:
										</h4>
										<ul className='text-sm text-gray-600 space-y-1'>
											<li>
												• Build high-quality backlinks
												to this specific page
											</li>
											<li>
												• Optimize internal linking to
												this page
											</li>
											<li>
												• Improve content quality and
												relevance
											</li>
											<li>
												• Increase social media
												engagement
											</li>
										</ul>
									</div>
									<div className='space-y-2'>
										<h4 className='font-semibold text-gray-900'>
											Technical Improvements:
										</h4>
										<ul className='text-sm text-gray-600 space-y-1'>
											<li>
												• Optimize page loading speed
											</li>
											<li>
												• Improve mobile responsiveness
											</li>
											<li>
												• Add structured data markup
											</li>
											<li>
												• Optimize meta tags and
												headings
											</li>
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Information */}
				<Card className='mt-6'>
					<CardHeader>
						<CardTitle>Understanding Page Authority</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600'>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Page Authority
								</h4>
								<p>
									Predicts how well a specific page will rank
									in search results. Based on link data and
									other factors that influence search
									rankings.
								</p>
							</div>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Factors Affecting PA
								</h4>
								<p>
									Quality and quantity of links, content
									relevance, user engagement, technical SEO,
									and social signals all contribute to page
									authority.
								</p>
							</div>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Improvement Tips
								</h4>
								<p>
									Focus on earning quality backlinks, creating
									valuable content, optimizing for user
									experience, and building topical authority.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
