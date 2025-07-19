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
import {
	Calendar,
	Globe,
	Search,
	Clock,
	TrendingUp,
	Shield,
} from "lucide-react";
import { toast } from "sonner";

interface DomainInfo {
	domain: string;
	registrationDate: string;
	expirationDate: string;
	age: string;
	registrar: string;
	status: string;
	nameServers: string[];
	lastUpdated: string;
}

export default function DomainAgeChecker() {
	const [domain, setDomain] = useState("");
	const [isChecking, setIsChecking] = useState(false);
	const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null);
	const [error, setError] = useState("");

	const validateDomain = (domain: string): boolean => {
		const domainRegex =
			/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
		return domainRegex.test(domain);
	};

	const cleanDomain = (input: string): string => {
		let cleaned = input.toLowerCase().trim();
		cleaned = cleaned.replace(/^https?:\/\//, "");
		cleaned = cleaned.replace(/^www\./, "");
		cleaned = cleaned.split("/")[0];
		return cleaned;
	};

	const calculateAge = (registrationDate: string): string => {
		const regDate = new Date(registrationDate);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - regDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		const years = Math.floor(diffDays / 365);
		const months = Math.floor((diffDays % 365) / 30);
		const days = diffDays % 30;

		if (years > 0) {
			return `${years} year${years > 1 ? "s" : ""}, ${months} month${
				months > 1 ? "s" : ""
			}`;
		} else if (months > 0) {
			return `${months} month${months > 1 ? "s" : ""}, ${days} day${
				days > 1 ? "s" : ""
			}`;
		} else {
			return `${days} day${days > 1 ? "s" : ""}`;
		}
	};

	const generateMockDomainInfo = (domain: string): DomainInfo => {
		// Generate realistic mock data
		const registrationYear = 1995 + Math.floor(Math.random() * 25);
		const registrationMonth = Math.floor(Math.random() * 12) + 1;
		const registrationDay = Math.floor(Math.random() * 28) + 1;

		const registrationDate = `${registrationYear}-${registrationMonth
			.toString()
			.padStart(2, "0")}-${registrationDay.toString().padStart(2, "0")}`;
		const expirationYear =
			new Date().getFullYear() + Math.floor(Math.random() * 3) + 1;
		const expirationDate = `${expirationYear}-${registrationMonth
			.toString()
			.padStart(2, "0")}-${registrationDay.toString().padStart(2, "0")}`;

		const registrars = [
			"GoDaddy.com, LLC",
			"Namecheap, Inc.",
			"Google Domains LLC",
			"Network Solutions, LLC",
			"Tucows Domains Inc.",
			"MarkMonitor Inc.",
			"Amazon Registrar, Inc.",
			"Cloudflare, Inc.",
		];

		const statuses = ["Active", "Registered", "Protected", "Premium"];

		return {
			domain,
			registrationDate,
			expirationDate,
			age: calculateAge(registrationDate),
			registrar:
				registrars[Math.floor(Math.random() * registrars.length)],
			status: statuses[Math.floor(Math.random() * statuses.length)],
			nameServers: [
				`ns1.${domain}`,
				`ns2.${domain}`,
				`ns3.${domain}`,
				`ns4.${domain}`,
			],
			lastUpdated: new Date(
				Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
			)
				.toISOString()
				.split("T")[0],
		};
	};

	const checkDomainAge = async () => {
		if (!domain.trim()) {
			setError("Please enter a domain name");
			return;
		}

		const cleanedDomain = cleanDomain(domain);

		if (!validateDomain(cleanedDomain)) {
			setError("Please enter a valid domain name (e.g., example.com)");
			return;
		}

		setIsChecking(true);
		setError("");
		setDomainInfo(null);

		try {
			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Generate mock data (in real implementation, this would be an API call)
			const info = generateMockDomainInfo(cleanedDomain);
			setDomainInfo(info);

			toast.success("Success!", {
				description: `Domain information retrieved for ${cleanedDomain}`,
			});
		} catch (error) {
			setError(
				"Failed to retrieve domain information. Please try again."
			);
			toast.error("Error", {
				description: "Failed to check domain age",
			});
		} finally {
			setIsChecking(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			checkDomainAge();
		}
	};

	const formatDate = (dateString: string): string => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getDaysUntilExpiration = (expirationDate: string): number => {
		const expDate = new Date(expirationDate);
		const now = new Date();
		const diffTime = expDate.getTime() - now.getTime();
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	};

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4'>
			<div className='max-w-4xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Domain Age Checker
					</h1>
					<p className='text-gray-600'>
						Check when a domain was registered and get detailed
						WHOIS information
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Input Section */}
					<div className='lg:col-span-1'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Globe className='w-5 h-5' />
									Domain Lookup
								</CardTitle>
								<CardDescription>
									Enter a domain name to check its age and
									registration details
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<Label htmlFor='domain'>Domain Name</Label>
									<Input
										id='domain'
										value={domain}
										onChange={(e) =>
											setDomain(e.target.value)
										}
										onKeyPress={handleKeyPress}
										placeholder='example.com'
										className='mt-1'
									/>
									{error && (
										<p className='text-red-500 text-sm mt-1'>
											{error}
										</p>
									)}
								</div>

								<Button
									onClick={checkDomainAge}
									disabled={isChecking}
									className='w-full'>
									{isChecking ? (
										<>
											<Search className='w-4 h-4 mr-2 animate-spin' />
											Checking...
										</>
									) : (
										<>
											<Search className='w-4 h-4 mr-2' />
											Check Domain Age
										</>
									)}
								</Button>
							</CardContent>
						</Card>

						{/* Tips */}
						<Card className='mt-6'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<TrendingUp className='w-5 h-5' />
									Why Domain Age Matters
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3 text-sm'>
								<div className='flex items-start gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
									<p>
										<strong>SEO Benefits:</strong> Older
										domains may have better search rankings
									</p>
								</div>
								<div className='flex items-start gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
									<p>
										<strong>Trust Factor:</strong>{" "}
										Established domains appear more
										trustworthy
									</p>
								</div>
								<div className='flex items-start gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
									<p>
										<strong>Link Authority:</strong> Older
										domains may have accumulated backlinks
									</p>
								</div>
								<div className='flex items-start gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
									<p>
										<strong>Brand History:</strong> Check if
										domain has previous ownership
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Results Section */}
					<div className='lg:col-span-2'>
						{domainInfo && (
							<div className='space-y-6'>
								{/* Domain Overview */}
								<Card>
									<CardHeader>
										<CardTitle className='flex items-center gap-2'>
											<Calendar className='w-5 h-5' />
											Domain Overview
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
											<div className='space-y-4'>
												<div>
													<Label className='text-sm font-medium text-gray-500'>
														Domain Name
													</Label>
													<p className='text-lg font-semibold'>
														{domainInfo.domain}
													</p>
												</div>
												<div>
													<Label className='text-sm font-medium text-gray-500'>
														Domain Age
													</Label>
													<p className='text-lg font-semibold text-blue-600'>
														{domainInfo.age}
													</p>
												</div>
												<div>
													<Label className='text-sm font-medium text-gray-500'>
														Status
													</Label>
													<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
														{domainInfo.status}
													</span>
												</div>
											</div>
											<div className='space-y-4'>
												<div>
													<Label className='text-sm font-medium text-gray-500'>
														Registration Date
													</Label>
													<p className='text-lg'>
														{formatDate(
															domainInfo.registrationDate
														)}
													</p>
												</div>
												<div>
													<Label className='text-sm font-medium text-gray-500'>
														Expiration Date
													</Label>
													<p className='text-lg'>
														{formatDate(
															domainInfo.expirationDate
														)}
													</p>
													<p className='text-sm text-gray-500'>
														(
														{getDaysUntilExpiration(
															domainInfo.expirationDate
														)}{" "}
														days remaining)
													</p>
												</div>
												<div>
													<Label className='text-sm font-medium text-gray-500'>
														Registrar
													</Label>
													<p className='text-lg'>
														{domainInfo.registrar}
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Technical Details */}
								<Card>
									<CardHeader>
										<CardTitle className='flex items-center gap-2'>
											<Shield className='w-5 h-5' />
											Technical Details
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='space-y-4'>
											<div>
												<Label className='text-sm font-medium text-gray-500'>
													Last Updated
												</Label>
												<p>
													{formatDate(
														domainInfo.lastUpdated
													)}
												</p>
											</div>
											<div>
												<Label className='text-sm font-medium text-gray-500'>
													Name Servers
												</Label>
												<div className='mt-2 space-y-1'>
													{domainInfo.nameServers.map(
														(ns, index) => (
															<p
																key={index}
																className='font-mono text-sm bg-gray-100 px-2 py-1 rounded'>
																{ns}
															</p>
														)
													)}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Age Analysis */}
								<Card>
									<CardHeader>
										<CardTitle className='flex items-center gap-2'>
											<Clock className='w-5 h-5' />
											Age Analysis
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='space-y-4'>
											{(() => {
												const regDate = new Date(
													domainInfo.registrationDate
												);
												const years =
													new Date().getFullYear() -
													regDate.getFullYear();

												if (years >= 10) {
													return (
														<div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
															<h4 className='font-semibold text-green-800'>
																Mature Domain
															</h4>
															<p className='text-green-700 text-sm mt-1'>
																This domain is
																well-established
																and likely has
																good authority
																and trust
																signals.
															</p>
														</div>
													);
												} else if (years >= 5) {
													return (
														<div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
															<h4 className='font-semibold text-blue-800'>
																Established
																Domain
															</h4>
															<p className='text-blue-700 text-sm mt-1'>
																This domain has
																been around for
																a while and
																should have
																decent search
																engine trust.
															</p>
														</div>
													);
												} else if (years >= 2) {
													return (
														<div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
															<h4 className='font-semibold text-yellow-800'>
																Developing
																Domain
															</h4>
															<p className='text-yellow-700 text-sm mt-1'>
																This domain is
																building
																authority.
																Continue
																creating quality
																content for
																better rankings.
															</p>
														</div>
													);
												} else {
													return (
														<div className='p-4 bg-orange-50 border border-orange-200 rounded-lg'>
															<h4 className='font-semibold text-orange-800'>
																New Domain
															</h4>
															<p className='text-orange-700 text-sm mt-1'>
																This is a
																relatively new
																domain. Focus on
																building quality
																content and
																backlinks.
															</p>
														</div>
													);
												}
											})()}
										</div>
									</CardContent>
								</Card>
							</div>
						)}

						{!domainInfo && !isChecking && (
							<Card>
								<CardContent className='text-center py-12'>
									<Globe className='w-12 h-12 text-gray-400 mx-auto mb-4' />
									<h3 className='text-lg font-medium text-gray-900 mb-2'>
										No Domain Checked Yet
									</h3>
									<p className='text-gray-500'>
										Enter a domain name to see its age and
										registration details
									</p>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
