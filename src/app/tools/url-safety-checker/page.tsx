"use client";

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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	Shield,
	AlertTriangle,
	CheckCircle,
	ExternalLink,
	Globe,
} from "lucide-react";
import { toast } from "sonner";

interface SafetyResult {
	url: string;
	status: "safe" | "suspicious" | "dangerous" | "unknown";
	score: number;
	checks: {
		https: boolean;
		validDomain: boolean;
		noSuspiciousKeywords: boolean;
		notBlacklisted: boolean;
		validTLD: boolean;
		noPhishing: boolean;
	};
	details: {
		domain: string;
		protocol: string;
		tld: string;
		isShortened: boolean;
		redirects: string[];
	};
	warnings: string[];
	recommendations: string[];
}

const suspiciousKeywords = [
	"free-money",
	"click-here",
	"urgent",
	"limited-time",
	"act-now",
	"congratulations",
	"winner",
	"prize",
	"lottery",
	"inheritance",
];

const commonTLDs = [
	"com",
	"org",
	"net",
	"edu",
	"gov",
	"mil",
	"int",
	"co",
	"io",
	"ly",
	"me",
];

const shorteners = [
	"bit.ly",
	"tinyurl.com",
	"t.co",
	"goo.gl",
	"ow.ly",
	"short.link",
];

export default function URLSafetyChecker() {
	const [url, setUrl] = useState("");
	const [isChecking, setIsChecking] = useState(false);
	const [result, setResult] = useState<SafetyResult | null>(null);

	const checkURL = async () => {
		if (!url.trim()) {
			toast.error("Please enter a URL to check");
			return;
		}

		// Basic URL validation
		try {
			new URL(url.startsWith("http") ? url : `https://${url}`);
		} catch {
			toast.error("Please enter a valid URL");
			return;
		}

		setIsChecking(true);

		// Simulate checking process
		await new Promise((resolve) => setTimeout(resolve, 2000));

		try {
			const urlObj = new URL(
				url.startsWith("http") ? url : `https://${url}`
			);

			const checks = {
				https: urlObj.protocol === "https:",
				validDomain: isValidDomain(urlObj.hostname),
				noSuspiciousKeywords: !hasSuspiciousKeywords(url),
				notBlacklisted: !isBlacklisted(urlObj.hostname),
				validTLD: hasValidTLD(urlObj.hostname),
				noPhishing: !isPhishingPattern(url),
			};

			let score = 0;
			if (checks.https) score += 20;
			if (checks.validDomain) score += 15;
			if (checks.noSuspiciousKeywords) score += 15;
			if (checks.notBlacklisted) score += 25;
			if (checks.validTLD) score += 10;
			if (checks.noPhishing) score += 15;

			const status = getStatus(score);
			const warnings = generateWarnings(checks, urlObj);
			const recommendations = generateRecommendations(checks, urlObj);

			const details = {
				domain: urlObj.hostname,
				protocol: urlObj.protocol,
				tld: urlObj.hostname.split(".").pop() || "",
				isShortened: isURLShortener(urlObj.hostname),
				redirects: [], // Simplified for demo
			};

			setResult({
				url: urlObj.toString(),
				status,
				score,
				checks,
				details,
				warnings,
				recommendations,
			});

			toast.success("URL safety check completed!");
		} catch (error) {
			toast.error("Error checking URL. Please try again.");
		} finally {
			setIsChecking(false);
		}
	};

	const isValidDomain = (domain: string) => {
		const domainRegex =
			/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
		return domainRegex.test(domain);
	};

	const hasSuspiciousKeywords = (url: string) => {
		return suspiciousKeywords.some((keyword) =>
			url.toLowerCase().includes(keyword)
		);
	};

	const isBlacklisted = (domain: string) => {
		// Simplified blacklist check
		const blacklist = ["malicious-site.com", "phishing-example.net"];
		return blacklist.includes(domain.toLowerCase());
	};

	const hasValidTLD = (domain: string) => {
		const tld = domain.split(".").pop()?.toLowerCase();
		return tld ? commonTLDs.includes(tld) : false;
	};

	const isPhishingPattern = (url: string) => {
		// Check for common phishing patterns
		const phishingPatterns = [
			/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/, // IP addresses
			/[a-z]+-[a-z]+-[a-z]+\.(tk|ml|ga|cf)/, // Suspicious free domains
			/secure.*update.*account/i,
			/verify.*account.*immediately/i,
		];

		return phishingPatterns.some((pattern) => pattern.test(url));
	};

	const isURLShortener = (domain: string) => {
		return shorteners.includes(domain.toLowerCase());
	};

	const getStatus = (score: number): SafetyResult["status"] => {
		if (score >= 80) return "safe";
		if (score >= 60) return "suspicious";
		if (score >= 40) return "dangerous";
		return "unknown";
	};

	const generateWarnings = (
		checks: SafetyResult["checks"],
		urlObj: URL
	): string[] => {
		const warnings = [];

		if (!checks.https)
			warnings.push(
				"Connection is not encrypted (HTTP instead of HTTPS)"
			);
		if (!checks.validDomain) warnings.push("Domain format appears invalid");
		if (!checks.noSuspiciousKeywords)
			warnings.push("URL contains suspicious keywords");
		if (!checks.notBlacklisted)
			warnings.push("Domain is on security blacklists");
		if (!checks.validTLD)
			warnings.push("Unusual or suspicious top-level domain");
		if (!checks.noPhishing)
			warnings.push("URL matches known phishing patterns");
		if (isURLShortener(urlObj.hostname))
			warnings.push("Shortened URL - destination is hidden");

		return warnings;
	};

	const generateRecommendations = (
		checks: SafetyResult["checks"],
		urlObj: URL
	): string[] => {
		const recommendations = [];

		if (!checks.https)
			recommendations.push(
				"Only visit HTTPS websites for secure connections"
			);
		if (isURLShortener(urlObj.hostname))
			recommendations.push("Expand shortened URLs before clicking");
		if (!checks.notBlacklisted)
			recommendations.push(
				"Avoid this website - it's flagged as malicious"
			);

		recommendations.push(
			"Verify the website's legitimacy before entering personal information"
		);
		recommendations.push(
			"Use updated antivirus software and browser security features"
		);

		return recommendations;
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "safe":
				return "text-green-600";
			case "suspicious":
				return "text-yellow-600";
			case "dangerous":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "safe":
				return <CheckCircle className='h-5 w-5 text-green-600' />;
			case "suspicious":
				return <AlertTriangle className='h-5 w-5 text-yellow-600' />;
			case "dangerous":
				return <AlertTriangle className='h-5 w-5 text-red-600' />;
			default:
				return <Shield className='h-5 w-5 text-gray-600' />;
		}
	};

	const visitURL = () => {
		if (result && result.status === "safe") {
			window.open(result.url, "_blank", "noopener,noreferrer");
		} else {
			toast.error("This URL is not safe to visit");
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='max-w-4xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold mb-4'>
						URL Safety Checker
					</h1>
					<p className='text-xl text-muted-foreground'>
						Check if a website is safe to visit before clicking
					</p>
				</div>

				<div className='grid gap-6 lg:grid-cols-2'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Globe className='h-5 w-5' />
								URL to Check
							</CardTitle>
							<CardDescription>
								Enter any website URL to analyze its safety
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div>
								<Label htmlFor='url'>Website URL</Label>
								<Input
									id='url'
									placeholder='https://example.com or example.com'
									value={url}
									onChange={(e) => setUrl(e.target.value)}
								/>
								<p className='text-xs text-muted-foreground mt-1'>
									Enter the full URL or just the domain name
								</p>
							</div>

							<Button
								onClick={checkURL}
								disabled={isChecking || !url.trim()}
								className='w-full'>
								{isChecking ? (
									<>
										<Shield className='h-4 w-4 mr-2 animate-pulse' />
										Checking Safety...
									</>
								) : (
									<>
										<Shield className='h-4 w-4 mr-2' />
										Check URL Safety
									</>
								)}
							</Button>

							{isChecking && (
								<div className='space-y-2'>
									<div className='flex items-center justify-between text-sm'>
										<span>Analyzing URL...</span>
										<span>Please wait</span>
									</div>
									<Progress
										value={50}
										className='animate-pulse'
									/>
								</div>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Shield className='h-5 w-5' />
								Safety Report
							</CardTitle>
							<CardDescription>
								Detailed security analysis of the URL
							</CardDescription>
						</CardHeader>
						<CardContent>
							{result ? (
								<div className='space-y-6'>
									<div className='text-center'>
										<div className='flex items-center justify-center gap-2 mb-2'>
											{getStatusIcon(result.status)}
											<span
												className={`text-2xl font-bold ${getStatusColor(
													result.status
												)}`}>
												{result.score}/100
											</span>
										</div>
										<Badge
											variant={
												result.status === "safe"
													? "default"
													: "destructive"
											}
											className='mb-2'>
											{result.status.toUpperCase()}
										</Badge>
										<p className='text-sm text-muted-foreground'>
											Safety Score
										</p>
									</div>

									<div className='space-y-3'>
										<h4 className='font-medium'>
											Security Checks:
										</h4>
										<div className='space-y-2 text-sm'>
											<div className='flex items-center gap-2'>
												{result.checks.https ? (
													<CheckCircle className='h-4 w-4 text-green-600' />
												) : (
													<AlertTriangle className='h-4 w-4 text-red-600' />
												)}
												<span>HTTPS Encryption</span>
											</div>
											<div className='flex items-center gap-2'>
												{result.checks.validDomain ? (
													<CheckCircle className='h-4 w-4 text-green-600' />
												) : (
													<AlertTriangle className='h-4 w-4 text-red-600' />
												)}
												<span>Valid Domain Format</span>
											</div>
											<div className='flex items-center gap-2'>
												{result.checks
													.noSuspiciousKeywords ? (
													<CheckCircle className='h-4 w-4 text-green-600' />
												) : (
													<AlertTriangle className='h-4 w-4 text-red-600' />
												)}
												<span>
													No Suspicious Keywords
												</span>
											</div>
											<div className='flex items-center gap-2'>
												{result.checks
													.notBlacklisted ? (
													<CheckCircle className='h-4 w-4 text-green-600' />
												) : (
													<AlertTriangle className='h-4 w-4 text-red-600' />
												)}
												<span>Not Blacklisted</span>
											</div>
										</div>
									</div>

									{result.warnings.length > 0 && (
										<div className='space-y-2'>
											<h4 className='font-medium text-red-700'>
												Warnings:
											</h4>
											<ul className='space-y-1 text-sm text-red-600'>
												{result.warnings.map(
													(warning, index) => (
														<li
															key={index}
															className='flex items-start gap-2'>
															<AlertTriangle className='h-3 w-3 mt-1 flex-shrink-0' />
															<span>
																{warning}
															</span>
														</li>
													)
												)}
											</ul>
										</div>
									)}

									<div className='flex gap-2'>
										{result.status === "safe" && (
											<Button
												onClick={visitURL}
												className='flex-1'>
												<ExternalLink className='h-4 w-4 mr-2' />
												Visit Safely
											</Button>
										)}
										<Button
											onClick={() => setResult(null)}
											variant='outline'
											className='flex-1'>
											Check Another URL
										</Button>
									</div>
								</div>
							) : (
								<div className='text-center py-12 text-muted-foreground'>
									<Shield className='h-12 w-12 mx-auto mb-4 opacity-50' />
									<p>Enter a URL to see safety analysis</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				<Card className='mt-6'>
					<CardHeader>
						<CardTitle>Online Safety Tips</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid md:grid-cols-2 gap-6'>
							<div>
								<h4 className='font-medium mb-3'>
									Red Flags to Watch For:
								</h4>
								<ul className='space-y-2 text-sm text-muted-foreground'>
									<li>
										• URLs with suspicious keywords or
										misspellings
									</li>
									<li>
										• Non-HTTPS websites requesting personal
										info
									</li>
									<li>
										• Shortened URLs from unknown sources
									</li>
									<li>
										• Urgent messages demanding immediate
										action
									</li>
									<li>
										• Offers that seem too good to be true
									</li>
								</ul>
							</div>
							<div>
								<h4 className='font-medium mb-3'>
									Best Practices:
								</h4>
								<ul className='space-y-2 text-sm text-muted-foreground'>
									<li>
										• Always verify URLs before clicking
									</li>
									<li>
										• Look for HTTPS and valid certificates
									</li>
									<li>• Use reputable antivirus software</li>
									<li>
										• Keep browsers and security tools
										updated
									</li>
									<li>• When in doubt, don&apos;t click</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
