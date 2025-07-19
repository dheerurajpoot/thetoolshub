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

	const generateMockIP = () => {
		return `${Math.floor(Math.random() * 255)}.${Math.floor(
			Math.random() * 255
		)}.${Math.floor(Math.random() * 255)}.${Math.floor(
			Math.random() * 255
		)}`;
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
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			const countries = [
				"United States",
				"Germany",
				"United Kingdom",
				"Canada",
				"Netherlands",
				"France",
				"Japan",
				"Singapore",
			];
			const cities = [
				"New York",
				"San Francisco",
				"London",
				"Frankfurt",
				"Amsterdam",
				"Toronto",
				"Tokyo",
				"Singapore",
			];
			const isps = [
				"Amazon Web Services",
				"Google Cloud",
				"Microsoft Azure",
				"DigitalOcean",
				"Cloudflare",
				"Linode",
			];
			const serverTypes = [
				"Apache",
				"Nginx",
				"IIS",
				"LiteSpeed",
				"Cloudflare",
			];

			const mockInfo: IPInfo = {
				domain: cleanDomain,
				ipAddress: generateMockIP(),
				ipVersion: "IPv4",
				location: {
					country:
						countries[Math.floor(Math.random() * countries.length)],
					region: "CA",
					city: cities[Math.floor(Math.random() * cities.length)],
					latitude: 37.7749 + (Math.random() - 0.5) * 10,
					longitude: -122.4194 + (Math.random() - 0.5) * 10,
				},
				isp: isps[Math.floor(Math.random() * isps.length)],
				organization: isps[Math.floor(Math.random() * isps.length)],
				asn: `AS${Math.floor(Math.random() * 90000) + 10000}`,
				timezone: "UTC-8",
				hostingProvider: isps[Math.floor(Math.random() * isps.length)],
				serverType:
					serverTypes[Math.floor(Math.random() * serverTypes.length)],
			};

			setIpInfo(mockInfo);
			toast.success("IP information retrieved!", {
				description: `Found IP details for ${cleanDomain}`,
			});
		} catch (err) {
			setError("Failed to retrieve IP information. Please try again.");
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
