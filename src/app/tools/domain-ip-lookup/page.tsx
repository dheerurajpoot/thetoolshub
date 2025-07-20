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
import { Badge } from "@/components/ui/badge";
import {
	Globe,
	MapPin,
	Server,
	Search,
	AlertCircle,
	Copy,
	ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface IPInfo {
	domain: string;
	ipAddress: string;
	ipVersion: string;
	location: {
		country: string;
		region: string;
		city: string;
		latitude: number;
		longitude: number;
	};
	isp: string;
	organization: string;
	asn: string;
	timezone: string;
	hostingProvider: string;
	serverType: string;
	dnsRecords?: Array<{
		type: number;
		data: string;
		ttl: number;
	}>;
}

export default function DomainIPLookup() {
	const [domain, setDomain] = useState("");
	const [loading, setLoading] = useState(false);
	const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
	const [error, setError] = useState("");

	const validateDomain = (domain: string) => {
		const domainRegex =
			/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
		return domainRegex.test(domain);
	};

	const lookupDomainIP = async () => {
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
		setIpInfo(null);

		try {
			const response = await fetch(
				`/api/ip-lookup?domain=${encodeURIComponent(cleanDomain)}`,
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

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			setIpInfo(data);
			toast.success("IP information retrieved!", {
				description: `Found IP details for ${cleanDomain}`,
			});
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to retrieve IP information. Please try again.";
			setError(errorMessage);
			toast.error("Error", {
				description: errorMessage,
			});
		} finally {
			setLoading(false);
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Copied!", {
			description: "IP address copied to clipboard.",
		});
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			lookupDomainIP();
		}
	};

	const getDNSRecordType = (type: number): string => {
		const types: { [key: number]: string } = {
			1: "A",
			2: "NS",
			5: "CNAME",
			6: "SOA",
			15: "MX",
			16: "TXT",
			28: "AAAA",
		};
		return types[type] || `Type ${type}`;
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4'>
			<div className='max-w-4xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-gray-900 mb-4'>
						Domain IP Lookup
					</h1>
					<p className='text-xl text-gray-600'>
						Find the IP address and location of any domain
					</p>
				</div>

				<Card className='mb-6'>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Globe className='w-5 h-5' />
							IP Address Lookup
						</CardTitle>
						<CardDescription>
							Enter a domain name to find its IP address and
							server information
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
									onClick={lookupDomainIP}
									disabled={loading}>
									{loading ? (
										<Server className='w-4 h-4 mr-2 animate-pulse' />
									) : (
										<Search className='w-4 h-4 mr-2' />
									)}
									Lookup
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

				{ipInfo && (
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Server className='w-5 h-5' />
									IP Information
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<Label className='text-sm font-medium text-gray-500'>
										Domain
									</Label>
									<p className='text-lg font-semibold'>
										{ipInfo.domain}
									</p>
								</div>

								<div>
									<Label className='text-sm font-medium text-gray-500'>
										IP Address
									</Label>
									<div className='flex items-center gap-2'>
										<p className='text-lg font-mono bg-gray-100 px-3 py-1 rounded'>
											{ipInfo.ipAddress}
										</p>
										<Button
											size='sm'
											variant='outline'
											onClick={() =>
												copyToClipboard(
													ipInfo.ipAddress
												)
											}>
											<Copy className='w-3 h-3' />
										</Button>
									</div>
								</div>

								<div>
									<Label className='text-sm font-medium text-gray-500'>
										IP Version
									</Label>
									<Badge variant='secondary'>
										{ipInfo.ipVersion}
									</Badge>
								</div>

								<div>
									<Label className='text-sm font-medium text-gray-500'>
										ASN
									</Label>
									<p className='text-lg'>{ipInfo.asn}</p>
								</div>

								<div>
									<Label className='text-sm font-medium text-gray-500'>
										Server Type
									</Label>
									<p className='text-lg'>
										{ipInfo.serverType}
									</p>
								</div>

								{ipInfo.dnsRecords &&
									ipInfo.dnsRecords.length > 0 && (
										<div>
											<Label className='text-sm font-medium text-gray-500'>
												DNS Records
											</Label>
											<div className='space-y-2'>
												{ipInfo.dnsRecords.map(
													(record, index) => (
														<div
															key={index}
															className='text-sm bg-gray-50 p-2 rounded'>
															<span className='font-medium'>
																{getDNSRecordType(
																	record.type
																)}
																:
															</span>{" "}
															{record.data}
															<span className='text-gray-500 ml-2'>
																(TTL:{" "}
																{record.ttl}s)
															</span>
														</div>
													)
												)}
											</div>
										</div>
									)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<MapPin className='w-5 h-5' />
									Location & Hosting
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<Label className='text-sm font-medium text-gray-500'>
										Country
									</Label>
									<p className='text-lg'>
										{ipInfo.location.country}
									</p>
								</div>

								<div>
									<Label className='text-sm font-medium text-gray-500'>
										Region
									</Label>
									<p className='text-lg'>
										{ipInfo.location.region}
									</p>
								</div>

								<div>
									<Label className='text-sm font-medium text-gray-500'>
										City
									</Label>
									<p className='text-lg'>
										{ipInfo.location.city}
									</p>
								</div>

								<div>
									<Label className='text-sm font-medium text-gray-500'>
										Coordinates
									</Label>
									<p className='text-sm font-mono bg-gray-100 px-2 py-1 rounded'>
										{ipInfo.location.latitude.toFixed(4)},{" "}
										{ipInfo.location.longitude.toFixed(4)}
									</p>
								</div>

								<div>
									<Label className='text-sm font-medium text-gray-500'>
										ISP
									</Label>
									<p className='text-lg'>{ipInfo.isp}</p>
								</div>

								<div>
									<Label className='text-sm font-medium text-gray-500'>
										Hosting Provider
									</Label>
									<p className='text-lg'>
										{ipInfo.hostingProvider}
									</p>
								</div>

								<div>
									<Label className='text-sm font-medium text-gray-500'>
										Timezone
									</Label>
									<p className='text-lg'>{ipInfo.timezone}</p>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{ipInfo && (
					<Card className='mt-6'>
						<CardHeader>
							<CardTitle>Additional Tools</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								<Button
									variant='outline'
									className='justify-start bg-transparent'>
									<ExternalLink className='w-4 h-4 mr-2' />
									Ping Test
								</Button>
								<Button
									variant='outline'
									className='justify-start bg-transparent'>
									<ExternalLink className='w-4 h-4 mr-2' />
									Traceroute
								</Button>
								<Button
									variant='outline'
									className='justify-start bg-transparent'>
									<ExternalLink className='w-4 h-4 mr-2' />
									Port Scanner
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Tips */}
				<Card className='mt-6'>
					<CardHeader>
						<CardTitle>Understanding IP Lookup Results</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									IP Address Types
								</h4>
								<ul className='space-y-1'>
									<li>
										• <strong>IPv4:</strong> Traditional
										32-bit addresses
									</li>
									<li>
										• <strong>IPv6:</strong> Newer 128-bit
										addresses
									</li>
									<li>
										• <strong>Shared:</strong> Multiple
										domains on same IP
									</li>
									<li>
										• <strong>Dedicated:</strong> Single
										domain per IP
									</li>
								</ul>
							</div>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Location Accuracy
								</h4>
								<ul className='space-y-1'>
									<li>• Country-level: Very accurate</li>
									<li>• City-level: Generally accurate</li>
									<li>• Coordinates: Approximate location</li>
									<li>
										• CDNs may show edge server location
									</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
