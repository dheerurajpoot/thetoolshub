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
	whoisServer?: string;
	domainStatus?: string[];
	registrantOrganization?: string;
	registrantCountry?: string;
	adminEmail?: string;
	techEmail?: string;
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

	const fetchDomainInfo = async (domain: string): Promise<DomainInfo> => {
		try {
			const response = await fetch(
				`/api/whois?domain=${encodeURIComponent(domain)}`,
				{
					method: "GET",
					headers: {
						Accept: "application/json",
					},
					signal: AbortSignal.timeout(15000), // 15 second timeout
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData.error ||
						`HTTP ${response.status}: ${response.statusText}`
				);
			}

			const domainData = await response.json();

			if (domainData.error) {
				throw new Error(domainData.error);
			}

			return {
				domain: domainData.domain,
				registrationDate: domainData.registrationDate,
				expirationDate: domainData.expirationDate,
				age: calculateAge(domainData.registrationDate),
				registrar: domainData.registrar,
				status: domainData.status,
				nameServers: domainData.nameServers,
				lastUpdated: domainData.lastUpdated,
				whoisServer: domainData.whoisServer,
				domainStatus: domainData.domainStatus,
				registrantOrganization: domainData.registrantOrganization,
				registrantCountry: domainData.registrantCountry,
				adminEmail: domainData.adminEmail,
				techEmail: domainData.techEmail,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to retrieve domain information";
			throw new Error(errorMessage);
		}
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
			const info = await fetchDomainInfo(cleanedDomain);
			setDomainInfo(info);

			toast.success("Success!", {
				description: `Domain information retrieved for ${cleanedDomain}`,
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to retrieve domain information. Please try again.";
			setError(errorMessage);
			toast.error("Error", {
				description: errorMessage,
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
														Registration Date
													</Label>
													<p className='text-lg font-semibold text-blue-600'>
														{formatDate(
															domainInfo.registrationDate
														)}
													</p>
												</div>
												<div>
													<Label className='text-sm font-medium text-gray-500'>
														Domain Age
													</Label>
													<p className='text-lg font-semibold text-green-600'>
														{domainInfo.age}
													</p>
												</div>
												<div>
													<Label className='text-sm font-medium text-gray-500'>
														Registrar
													</Label>
													<p className='text-lg font-semibold'>
														{domainInfo.registrar}
													</p>
												</div>
											</div>
											<div className='space-y-4'>
												<div>
													<Label className='text-sm font-medium text-gray-500'>
														Expiration Date
													</Label>
													<p className='text-lg font-semibold text-orange-600'>
														{formatDate(
															domainInfo.expirationDate
														)}
													</p>
													<p className='text-sm text-gray-500'>
														{getDaysUntilExpiration(
															domainInfo.expirationDate
														)}{" "}
														days remaining
													</p>
												</div>
												<div>
													<Label className='text-sm font-medium text-gray-500'>
														Status
													</Label>
													<div className='flex items-center gap-2'>
														<div className='w-2 h-2 bg-green-500 rounded-full'></div>
														<p className='text-lg font-semibold text-green-600'>
															{domainInfo.status}
														</p>
													</div>
												</div>
												<div>
													<Label className='text-sm font-medium text-gray-500'>
														Last Updated
													</Label>
													<p className='text-lg font-semibold'>
														{formatDate(
															domainInfo.lastUpdated
														)}
													</p>
												</div>
												{domainInfo.whoisServer && (
													<div>
														<Label className='text-sm font-medium text-gray-500'>
															WHOIS Server
														</Label>
														<p className='text-lg font-semibold'>
															{
																domainInfo.whoisServer
															}
														</p>
													</div>
												)}
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Additional Information */}
								{(domainInfo.registrantOrganization ||
									domainInfo.registrantCountry ||
									domainInfo.adminEmail ||
									domainInfo.techEmail) && (
									<Card>
										<CardHeader>
											<CardTitle className='flex items-center gap-2'>
												<Shield className='w-5 h-5' />
												Additional Information
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
												{domainInfo.registrantOrganization && (
													<div>
														<Label className='text-sm font-medium text-gray-500'>
															Registrant
															Organization
														</Label>
														<p className='text-lg font-semibold'>
															{
																domainInfo.registrantOrganization
															}
														</p>
													</div>
												)}
												{domainInfo.registrantCountry && (
													<div>
														<Label className='text-sm font-medium text-gray-500'>
															Registrant Country
														</Label>
														<p className='text-lg font-semibold'>
															{
																domainInfo.registrantCountry
															}
														</p>
													</div>
												)}
												{domainInfo.adminEmail && (
													<div>
														<Label className='text-sm font-medium text-gray-500'>
															Admin Email
														</Label>
														<p className='text-lg font-semibold'>
															{
																domainInfo.adminEmail
															}
														</p>
													</div>
												)}
												{domainInfo.techEmail && (
													<div>
														<Label className='text-sm font-medium text-gray-500'>
															Tech Email
														</Label>
														<p className='text-lg font-semibold'>
															{
																domainInfo.techEmail
															}
														</p>
													</div>
												)}
											</div>
										</CardContent>
									</Card>
								)}

								{/* Name Servers */}
								<Card>
									<CardHeader>
										<CardTitle className='flex items-center gap-2'>
											<Clock className='w-5 h-5' />
											Name Servers
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											{domainInfo.nameServers.map(
												(ns, index) => (
													<div
														key={index}
														className='bg-gray-50 p-3 rounded-lg'>
														<p className='font-medium text-gray-800'>
															NS{index + 1}: {ns}
														</p>
													</div>
												)
											)}
										</div>
									</CardContent>
								</Card>
							</div>
						)}

						{!domainInfo && !isChecking && (
							<Card>
								<CardContent className='text-center py-12'>
									<Globe className='w-16 h-16 text-gray-300 mx-auto mb-4' />
									<p className='text-gray-500'>
										Enter a domain name to check its age and
										registration information
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
