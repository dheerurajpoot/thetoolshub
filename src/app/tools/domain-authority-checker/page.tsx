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
	TrendingUp,
	Search,
	AlertCircle,
	ExternalLink,
	BarChart3,
} from "lucide-react";
import { toast } from "sonner";

interface DomainAuthority {
	domain: string;
	domainAuthority: number;
	pageAuthority: number;
	spamScore: number;
	linkingDomains: number;
	totalBacklinks: number;
	organicKeywords: number;
	organicTraffic: number;
	lastUpdated: string;
	trustFlow: number;
	citationFlow: number;
}

export default function DomainAuthorityChecker() {
	const [domain, setDomain] = useState("");
	const [loading, setLoading] = useState(false);
	const [authorityData, setAuthorityData] = useState<DomainAuthority | null>(
		null
	);
	const [error, setError] = useState("");

	const validateDomain = (domain: string) => {
		const domainRegex =
			/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
		return domainRegex.test(domain);
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

	const checkDomainAuthority = async () => {
		if (!domain.trim()) {
			setError("Please enter a domain name");
			return;
		}

		const cleanDomain = domain
			.trim()
			.toLowerCase()
			.replace(/^https?:\/\//, "")
			.replace(/^www\./, "");

		if (!validateDomain(cleanDomain)) {
			setError("Please enter a valid domain name (e.g., example.com)");
			return;
		}

		setLoading(true);
		setError("");
		setAuthorityData(null);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2500));

			// Generate realistic mock data based on domain
			const baseScore = Math.floor(Math.random() * 100);

			const mockData: DomainAuthority = {
				domain: cleanDomain,
				domainAuthority: baseScore,
				pageAuthority: Math.max(
					10,
					baseScore + Math.floor(Math.random() * 20) - 10
				),
				spamScore: Math.floor(Math.random() * 30),
				linkingDomains: Math.floor(Math.random() * 10000) + 100,
				totalBacklinks: Math.floor(Math.random() * 100000) + 1000,
				organicKeywords: Math.floor(Math.random() * 50000) + 500,
				organicTraffic: Math.floor(Math.random() * 1000000) + 1000,
				lastUpdated: new Date().toISOString().split("T")[0],
				trustFlow: Math.floor(Math.random() * 100),
				citationFlow: Math.floor(Math.random() * 100),
			};

			setAuthorityData(mockData);
			toast("Domain authority checked!", {
				description: `Analysis complete for ${cleanDomain}`,
			});
		} catch (err) {
			setError("Failed to check domain authority. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			checkDomainAuthority();
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4'>
			<div className='max-w-6xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-gray-900 mb-4'>
						Domain Authority Checker
					</h1>
					<p className='text-xl text-gray-600'>
						Check domain authority, page authority, and SEO metrics
					</p>
				</div>

				<Card className='mb-6'>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<TrendingUp className='w-5 h-5' />
							Domain Authority Analysis
						</CardTitle>
						<CardDescription>
							Enter a domain name to check its authority and SEO
							metrics
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<Label htmlFor='domain'>Domain Name</Label>
							<div className='flex gap-2 mt-1'>
								<Input
									id='domain'
									value={domain}
									onChange={(e) => setDomain(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder='example.com'
									className='flex-1'
								/>
								<Button
									onClick={checkDomainAuthority}
									disabled={loading}>
									{loading ? (
										<BarChart3 className='w-4 h-4 mr-2 animate-pulse' />
									) : (
										<Search className='w-4 h-4 mr-2' />
									)}
									Check Authority
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

				{authorityData && (
					<div className='space-y-6'>
						{/* Main Metrics */}
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							<Card>
								<CardHeader className='pb-3'>
									<CardTitle className='text-lg'>
										Domain Authority
									</CardTitle>
									<CardDescription>
										Overall domain strength (0-100)
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='text-center'>
										<div
											className={`text-4xl font-bold ${getScoreColor(
												authorityData.domainAuthority
											)}`}>
											{authorityData.domainAuthority}
										</div>
										<Progress
											value={
												authorityData.domainAuthority
											}
											className='mt-2'
										/>
										<Badge
											variant='secondary'
											className='mt-2'>
											{getScoreLabel(
												authorityData.domainAuthority
											)}
										</Badge>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className='pb-3'>
									<CardTitle className='text-lg'>
										Page Authority
									</CardTitle>
									<CardDescription>
										Homepage ranking strength
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='text-center'>
										<div
											className={`text-4xl font-bold ${getScoreColor(
												authorityData.pageAuthority
											)}`}>
											{authorityData.pageAuthority}
										</div>
										<Progress
											value={authorityData.pageAuthority}
											className='mt-2'
										/>
										<Badge
											variant='secondary'
											className='mt-2'>
											{getScoreLabel(
												authorityData.pageAuthority
											)}
										</Badge>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className='pb-3'>
									<CardTitle className='text-lg'>
										Spam Score
									</CardTitle>
									<CardDescription>
										Likelihood of being penalized
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='text-center'>
										<div
											className={`text-4xl font-bold ${
												authorityData.spamScore > 20
													? "text-red-600"
													: authorityData.spamScore >
													  10
													? "text-yellow-600"
													: "text-green-600"
											}`}>
											{authorityData.spamScore}%
										</div>
										<Progress
											value={authorityData.spamScore}
											className='mt-2'
										/>
										<Badge
											variant={
												authorityData.spamScore > 20
													? "destructive"
													: "secondary"
											}
											className='mt-2'>
											{authorityData.spamScore > 20
												? "High Risk"
												: authorityData.spamScore > 10
												? "Medium Risk"
												: "Low Risk"}
										</Badge>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Detailed Metrics */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							<Card>
								<CardHeader>
									<CardTitle>Backlink Profile</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											Linking Domains
										</Label>
										<span className='text-lg font-semibold'>
											{authorityData.linkingDomains.toLocaleString()}
										</span>
									</div>

									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											Total Backlinks
										</Label>
										<span className='text-lg font-semibold'>
											{authorityData.totalBacklinks.toLocaleString()}
										</span>
									</div>

									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											Trust Flow
										</Label>
										<div className='flex items-center gap-2'>
											<span className='text-lg font-semibold'>
												{authorityData.trustFlow}
											</span>
											<Progress
												value={authorityData.trustFlow}
												className='w-20'
											/>
										</div>
									</div>

									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											Citation Flow
										</Label>
										<div className='flex items-center gap-2'>
											<span className='text-lg font-semibold'>
												{authorityData.citationFlow}
											</span>
											<Progress
												value={
													authorityData.citationFlow
												}
												className='w-20'
											/>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Organic Performance</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											Organic Keywords
										</Label>
										<span className='text-lg font-semibold'>
											{authorityData.organicKeywords.toLocaleString()}
										</span>
									</div>

									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											Organic Traffic
										</Label>
										<span className='text-lg font-semibold'>
											{authorityData.organicTraffic.toLocaleString()}
										</span>
									</div>

									<div className='flex justify-between items-center'>
										<Label className='text-sm font-medium text-gray-500'>
											Last Updated
										</Label>
										<span className='text-lg'>
											{new Date(
												authorityData.lastUpdated
											).toLocaleDateString()}
										</span>
									</div>

									<div className='pt-2'>
										<Button
											variant='outline'
											className='w-full bg-transparent'>
											<ExternalLink className='w-4 h-4 mr-2' />
											View Detailed Report
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>

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
											To Improve Domain Authority:
										</h4>
										<ul className='text-sm text-gray-600 space-y-1'>
											<li>
												• Build high-quality backlinks
												from authoritative sites
											</li>
											<li>
												• Create valuable, shareable
												content
											</li>
											<li>
												• Improve internal linking
												structure
											</li>
											<li>
												• Remove or disavow toxic
												backlinks
											</li>
										</ul>
									</div>
									<div className='space-y-2'>
										<h4 className='font-semibold text-gray-900'>
											To Reduce Spam Score:
										</h4>
										<ul className='text-sm text-gray-600 space-y-1'>
											<li>
												• Audit and clean up backlink
												profile
											</li>
											<li>
												• Avoid link schemes and paid
												links
											</li>
											<li>
												• Focus on earning natural,
												editorial links
											</li>
											<li>
												• Monitor for negative SEO
												attacks
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
						<CardTitle>Understanding Domain Authority</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600'>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Domain Authority (DA)
								</h4>
								<p>
									Predicts how well a domain will rank on
									search engines. Scale of 1-100, with higher
									scores indicating greater ranking potential.
								</p>
							</div>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Page Authority (PA)
								</h4>
								<p>
									Predicts how well a specific page will rank.
									Similar to DA but focuses on individual page
									strength rather than entire domain.
								</p>
							</div>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Spam Score
								</h4>
								<p>
									Percentage representing the likelihood that
									a domain may be penalized by search engines
									for spammy practices.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
