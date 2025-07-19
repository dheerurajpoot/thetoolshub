"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Globe, MapPin, Copy, RefreshCw, Shield, Wifi } from "lucide-react";
import { toast } from "sonner";

interface IPDetails {
	ip: string;
	type: string;
	location: {
		country: string;
		region: string;
		city: string;
		latitude: number;
		longitude: number;
		timezone: string;
	};
	isp: string;
	organization: string;
	asn: string;
	proxy: boolean;
	vpn: boolean;
	tor: boolean;
	hosting: boolean;
}

export default function MyIPAddress() {
	const [ipDetails, setIpDetails] = useState<IPDetails | null>(null);
	const [loading, setLoading] = useState(true);

	const generateMockIP = () => {
		return `${Math.floor(Math.random() * 255)}.${Math.floor(
			Math.random() * 255
		)}.${Math.floor(Math.random() * 255)}.${Math.floor(
			Math.random() * 255
		)}`;
	};

	const fetchIPDetails = async () => {
		setLoading(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			const countries = [
				"United States",
				"Canada",
				"United Kingdom",
				"Germany",
				"France",
				"Australia",
				"Japan",
			];
			const cities = [
				"New York",
				"Los Angeles",
				"London",
				"Toronto",
				"Berlin",
				"Paris",
				"Sydney",
				"Tokyo",
			];
			const isps = [
				"Comcast",
				"Verizon",
				"AT&T",
				"Charter Communications",
				"Cox Communications",
				"Spectrum",
			];

			const mockDetails: IPDetails = {
				ip: generateMockIP(),
				type: Math.random() > 0.8 ? "IPv6" : "IPv4",
				location: {
					country:
						countries[Math.floor(Math.random() * countries.length)],
					region: "CA",
					city: cities[Math.floor(Math.random() * cities.length)],
					latitude: 37.7749 + (Math.random() - 0.5) * 10,
					longitude: -122.4194 + (Math.random() - 0.5) * 10,
					timezone: "America/Los_Angeles",
				},
				isp: isps[Math.floor(Math.random() * isps.length)],
				organization: isps[Math.floor(Math.random() * isps.length)],
				asn: `AS${Math.floor(Math.random() * 90000) + 10000}`,
				proxy: Math.random() > 0.9,
				vpn: Math.random() > 0.8,
				tor: Math.random() > 0.95,
				hosting: Math.random() > 0.85,
			};

			setIpDetails(mockDetails);
		} catch (error) {
			toast("Failed to fetch IP details");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchIPDetails();
	}, []);

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("IP address copied to clipboard.");
	};

	const refreshIP = () => {
		fetchIPDetails();
		toast.success("Fetching latest IP information");
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4'>
			<div className='max-w-4xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-gray-900 mb-4'>
						My IP Address
					</h1>
					<p className='text-xl text-gray-600'>
						Find your public IP address and location information
					</p>
				</div>

				{loading ? (
					<Card>
						<CardContent className='flex items-center justify-center py-12'>
							<div className='text-center'>
								<Globe className='w-12 h-12 mx-auto mb-4 animate-spin text-blue-500' />
								<p className='text-gray-600'>
									Detecting your IP address...
								</p>
							</div>
						</CardContent>
					</Card>
				) : ipDetails ? (
					<div className='space-y-6'>
						{/* Main IP Display */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center justify-between'>
									<span className='flex items-center gap-2'>
										<Globe className='w-5 h-5' />
										Your IP Address
									</span>
									<Button
										onClick={refreshIP}
										variant='outline'
										size='sm'>
										<RefreshCw className='w-4 h-4 mr-2' />
										Refresh
									</Button>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='text-center'>
									<div className='text-4xl font-mono font-bold text-blue-600 mb-4'>
										{ipDetails.ip}
									</div>
									<div className='flex items-center justify-center gap-4 mb-4'>
										<Badge variant='secondary'>
											{ipDetails.type}
										</Badge>
										<Button
											onClick={() =>
												copyToClipboard(ipDetails.ip)
											}
											variant='outline'
											size='sm'>
											<Copy className='w-4 h-4 mr-2' />
											Copy IP
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Location Information */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							<Card>
								<CardHeader>
									<CardTitle className='flex items-center gap-2'>
										<MapPin className='w-5 h-5' />
										Location Information
									</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div>
										<Label className='text-sm font-medium text-gray-500'>
											Country
										</Label>
										<p className='text-lg font-semibold'>
											{ipDetails.location.country}
										</p>
									</div>

									<div>
										<Label className='text-sm font-medium text-gray-500'>
											Region
										</Label>
										<p className='text-lg'>
											{ipDetails.location.region}
										</p>
									</div>

									<div>
										<Label className='text-sm font-medium text-gray-500'>
											City
										</Label>
										<p className='text-lg'>
											{ipDetails.location.city}
										</p>
									</div>

									<div>
										<Label className='text-sm font-medium text-gray-500'>
											Coordinates
										</Label>
										<p className='text-sm font-mono bg-gray-100 px-2 py-1 rounded'>
											{ipDetails.location.latitude.toFixed(
												4
											)}
											,{" "}
											{ipDetails.location.longitude.toFixed(
												4
											)}
										</p>
									</div>

									<div>
										<Label className='text-sm font-medium text-gray-500'>
											Timezone
										</Label>
										<p className='text-lg'>
											{ipDetails.location.timezone}
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className='flex items-center gap-2'>
										<Wifi className='w-5 h-5' />
										Network Information
									</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div>
										<Label className='text-sm font-medium text-gray-500'>
											ISP
										</Label>
										<p className='text-lg font-semibold'>
											{ipDetails.isp}
										</p>
									</div>

									<div>
										<Label className='text-sm font-medium text-gray-500'>
											Organization
										</Label>
										<p className='text-lg'>
											{ipDetails.organization}
										</p>
									</div>

									<div>
										<Label className='text-sm font-medium text-gray-500'>
											ASN
										</Label>
										<p className='text-lg'>
											{ipDetails.asn}
										</p>
									</div>

									<div>
										<Label className='text-sm font-medium text-gray-500'>
											Connection Type
										</Label>
										<div className='flex flex-wrap gap-2 mt-1'>
											{ipDetails.proxy && (
												<Badge variant='destructive'>
													Proxy
												</Badge>
											)}
											{ipDetails.vpn && (
												<Badge variant='secondary'>
													VPN
												</Badge>
											)}
											{ipDetails.tor && (
												<Badge variant='destructive'>
													Tor
												</Badge>
											)}
											{ipDetails.hosting && (
												<Badge variant='outline'>
													Hosting
												</Badge>
											)}
											{!ipDetails.proxy &&
												!ipDetails.vpn &&
												!ipDetails.tor &&
												!ipDetails.hosting && (
													<Badge variant='default'>
														Direct
													</Badge>
												)}
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Security Information */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Shield className='w-5 h-5' />
									Security & Privacy Information
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div>
										<h4 className='font-semibold text-gray-900 mb-3'>
											What Others Can See
										</h4>
										<ul className='space-y-2 text-sm text-gray-600'>
											<li>• Your public IP address</li>
											<li>
												• Approximate location
												(city/region)
											</li>
											<li>• Internet service provider</li>
											<li>• Connection type and speed</li>
											<li>
												• Device and browser information
											</li>
										</ul>
									</div>
									<div>
										<h4 className='font-semibold text-gray-900 mb-3'>
											Privacy Protection Tips
										</h4>
										<ul className='space-y-2 text-sm text-gray-600'>
											<li>
												• Use a VPN to hide your real IP
											</li>
											<li>
												• Enable private browsing mode
											</li>
											<li>
												• Use Tor browser for anonymity
											</li>
											<li>• Disable location services</li>
											<li>
												• Use privacy-focused DNS
												servers
											</li>
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Additional Tools */}
						<Card>
							<CardHeader>
								<CardTitle>Related Tools</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
									<Button
										variant='outline'
										className='justify-start h-auto p-4 bg-transparent'>
										<div className='text-left'>
											<div className='font-semibold'>
												Speed Test
											</div>
											<div className='text-sm text-gray-500'>
												Test your internet speed
											</div>
										</div>
									</Button>
									<Button
										variant='outline'
										className='justify-start h-auto p-4 bg-transparent'>
										<div className='text-left'>
											<div className='font-semibold'>
												DNS Lookup
											</div>
											<div className='text-sm text-gray-500'>
												Check DNS records
											</div>
										</div>
									</Button>
									<Button
										variant='outline'
										className='justify-start h-auto p-4 bg-transparent'>
										<div className='text-left'>
											<div className='font-semibold'>
												Port Scanner
											</div>
											<div className='text-sm text-gray-500'>
												Scan open ports
											</div>
										</div>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				) : null}

				{/* Information */}
				<Card className='mt-6'>
					<CardHeader>
						<CardTitle>Understanding Your IP Address</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600'>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									What is an IP Address?
								</h4>
								<p>
									An IP address is a unique identifier
									assigned to your device when connected to
									the internet. It allows other devices to
									find and communicate with yours.
								</p>
							</div>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Public vs Private IP
								</h4>
								<p>
									Your public IP is visible to websites you
									visit. Your private IP is used within your
									local network and is not visible externally.
								</p>
							</div>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Dynamic vs Static IP
								</h4>
								<p>
									Most home users have dynamic IPs that change
									periodically. Static IPs remain constant and
									are typically used by businesses.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
