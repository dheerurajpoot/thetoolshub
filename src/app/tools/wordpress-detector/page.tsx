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
	WorkflowIcon as Wordpress,
	Search,
	AlertCircle,
	ExternalLink,
	Package,
	Palette,
} from "lucide-react";
import { toast } from "sonner";

interface WordPressInfo {
	url: string;
	isWordPress: boolean;
	version: string;
	theme: {
		name: string;
		version: string;
		author: string;
		description: string;
		url: string;
	};
	plugins: Array<{
		name: string;
		version: string;
		description: string;
		active: boolean;
	}>;
	server: string;
	lastUpdated: string;
}

export default function WordPressDetector() {
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [wpInfo, setWpInfo] = useState<WordPressInfo | null>(null);
	const [error, setError] = useState("");

	const validateUrl = (url: string) => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const detectWordPress = async () => {
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
			setError("Please enter a valid URL (e.g., https://example.com)");
			return;
		}

		setLoading(true);
		setError("");
		setWpInfo(null);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const isWP = Math.random() > 0.3; // 70% chance it's WordPress

			if (!isWP) {
				setWpInfo({
					url: cleanUrl,
					isWordPress: false,
					version: "",
					theme: {
						name: "",
						version: "",
						author: "",
						description: "",
						url: "",
					},
					plugins: [],
					server: "",
					lastUpdated: "",
				});
				toast.success(
					"This site doesn't appear to be using WordPress."
				);
				return;
			}

			const themes = [
				{
					name: "Astra",
					author: "Brainstorm Force",
					description: "Fast, lightweight & customizable theme",
				},
				{
					name: "OceanWP",
					author: "OceanWP",
					description: "Multipurpose WordPress theme",
				},
				{
					name: "GeneratePress",
					author: "Tom Usborne",
					description: "Lightweight and fast theme",
				},
				{
					name: "Neve",
					author: "ThemeIsle",
					description: "Multipurpose WordPress theme",
				},
				{
					name: "Kadence",
					author: "Kadence WP",
					description: "Performance focused theme",
				},
				{
					name: "Twenty Twenty-Four",
					author: "WordPress.org",
					description: "Default WordPress theme",
				},
			];

			const pluginsList = [
				{ name: "Yoast SEO", description: "SEO optimization plugin" },
				{ name: "WooCommerce", description: "E-commerce platform" },
				{ name: "Contact Form 7", description: "Contact form plugin" },
				{ name: "Elementor", description: "Page builder plugin" },
				{ name: "Jetpack", description: "WordPress.com features" },
				{ name: "WP Rocket", description: "Caching plugin" },
				{ name: "Akismet", description: "Spam protection" },
				{ name: "UpdraftPlus", description: "Backup plugin" },
				{ name: "MonsterInsights", description: "Google Analytics" },
				{ name: "WP Super Cache", description: "Caching plugin" },
			];

			const selectedTheme =
				themes[Math.floor(Math.random() * themes.length)];
			const numPlugins = Math.floor(Math.random() * 8) + 3;
			const selectedPlugins = pluginsList
				.sort(() => 0.5 - Math.random())
				.slice(0, numPlugins)
				.map((plugin) => ({
					...plugin,
					version: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(
						Math.random() * 10
					)}.${Math.floor(Math.random() * 10)}`,
					active: Math.random() > 0.2,
				}));

			const mockInfo: WordPressInfo = {
				url: cleanUrl,
				isWordPress: true,
				version: `6.${Math.floor(Math.random() * 4)}.${Math.floor(
					Math.random() * 10
				)}`,
				theme: {
					...selectedTheme,
					version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(
						Math.random() * 10
					)}.${Math.floor(Math.random() * 10)}`,
					url: `https://wordpress.org/themes/${selectedTheme.name
						.toLowerCase()
						.replace(/\s+/g, "-")}/`,
				},
				plugins: selectedPlugins,
				server: ["Apache", "Nginx", "LiteSpeed"][
					Math.floor(Math.random() * 3)
				],
				lastUpdated: new Date(
					Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
				)
					.toISOString()
					.split("T")[0],
			};

			setWpInfo(mockInfo);
			toast("WordPress detected!", {
				description: `Found WordPress ${mockInfo.version} with ${mockInfo.plugins.length} plugins`,
			});
		} catch (err) {
			setError("Failed to analyze the website. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			detectWordPress();
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4'>
			<div className='max-w-6xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-gray-900 mb-4'>
						WordPress Theme & Plugin Detector
					</h1>
					<p className='text-xl text-gray-600'>
						Detect WordPress themes, plugins, and version
						information
					</p>
				</div>

				<Card className='mb-6'>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Wordpress className='w-5 h-5' />
							WordPress Detection
						</CardTitle>
						<CardDescription>
							Enter a website URL to detect if it&apos;s using
							WordPress and what theme/plugins it uses
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<Label htmlFor='url'>Website URL</Label>
							<div className='flex gap-2 mt-1'>
								<Input
									id='url'
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder='https://example.com'
									className='flex-1'
								/>
								<Button
									onClick={detectWordPress}
									disabled={loading}>
									{loading ? (
										<Wordpress className='w-4 h-4 mr-2 animate-spin' />
									) : (
										<Search className='w-4 h-4 mr-2' />
									)}
									Detect
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

				{wpInfo && (
					<div className='space-y-6'>
						{/* WordPress Status */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Wordpress className='w-5 h-5' />
									WordPress Status
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-lg font-semibold'>
											{wpInfo.isWordPress
												? "WordPress Detected"
												: "Not WordPress"}
										</p>
										<p className='text-gray-600'>
											{wpInfo.url}
										</p>
									</div>
									<Badge
										variant={
											wpInfo.isWordPress
												? "default"
												: "secondary"
										}
										className='text-lg px-4 py-2'>
										{wpInfo.isWordPress
											? `v${wpInfo.version}`
											: "Not WP"}
									</Badge>
								</div>
								{wpInfo.isWordPress && (
									<div className='mt-4 grid grid-cols-2 gap-4 text-sm'>
										<div>
											<Label className='text-gray-500'>
												Server
											</Label>
											<p className='font-semibold'>
												{wpInfo.server}
											</p>
										</div>
										<div>
											<Label className='text-gray-500'>
												Last Updated
											</Label>
											<p className='font-semibold'>
												{new Date(
													wpInfo.lastUpdated
												).toLocaleDateString()}
											</p>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{wpInfo.isWordPress && (
							<>
								{/* Theme Information */}
								<Card>
									<CardHeader>
										<CardTitle className='flex items-center gap-2'>
											<Palette className='w-5 h-5' />
											Active Theme
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='space-y-4'>
											<div className='flex items-start justify-between'>
												<div className='flex-1'>
													<h3 className='text-xl font-semibold'>
														{wpInfo.theme.name}
													</h3>
													<p className='text-gray-600 mb-2'>
														{
															wpInfo.theme
																.description
														}
													</p>
													<div className='flex items-center gap-4 text-sm text-gray-500'>
														<span>
															by{" "}
															{
																wpInfo.theme
																	.author
															}
														</span>
														<span>
															v
															{
																wpInfo.theme
																	.version
															}
														</span>
													</div>
												</div>
												<Button
													variant='outline'
													size='sm'>
													<ExternalLink className='w-4 h-4 mr-2' />
													View Theme
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Plugins */}
								<Card>
									<CardHeader>
										<CardTitle className='flex items-center gap-2'>
											<Package className='w-5 h-5' />
											Detected Plugins (
											{wpInfo.plugins.length})
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											{wpInfo.plugins.map(
												(plugin, index) => (
													<div
														key={index}
														className='border rounded-lg p-4'>
														<div className='flex items-start justify-between mb-2'>
															<h4 className='font-semibold'>
																{plugin.name}
															</h4>
															<div className='flex gap-2'>
																<Badge
																	variant={
																		plugin.active
																			? "default"
																			: "secondary"
																	}>
																	{plugin.active
																		? "Active"
																		: "Inactive"}
																</Badge>
																<Badge variant='outline'>
																	v
																	{
																		plugin.version
																	}
																</Badge>
															</div>
														</div>
														<p className='text-sm text-gray-600'>
															{plugin.description}
														</p>
													</div>
												)
											)}
										</div>
									</CardContent>
								</Card>

								{/* Security & Performance */}
								<Card>
									<CardHeader>
										<CardTitle>
											Security & Performance Insights
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
											<div>
												<h4 className='font-semibold text-gray-900 mb-3'>
													Security Recommendations
												</h4>
												<ul className='space-y-2 text-sm text-gray-600'>
													<li>
														• Keep WordPress core
														updated to latest
														version
													</li>
													<li>
														• Update all plugins and
														themes regularly
													</li>
													<li>
														• Use strong passwords
														and 2FA
													</li>
													<li>
														• Install a security
														plugin like Wordfence
													</li>
													<li>
														• Hide WordPress version
														information
													</li>
												</ul>
											</div>
											<div>
												<h4 className='font-semibold text-gray-900 mb-3'>
													Performance Tips
												</h4>
												<ul className='space-y-2 text-sm text-gray-600'>
													<li>
														• Use a caching plugin
														(WP Rocket, W3 Total
														Cache)
													</li>
													<li>
														• Optimize images and
														use WebP format
													</li>
													<li>
														• Minimize plugins and
														remove unused ones
													</li>
													<li>
														• Use a CDN for faster
														content delivery
													</li>
													<li>
														• Choose a fast,
														reliable hosting
														provider
													</li>
												</ul>
											</div>
										</div>
									</CardContent>
								</Card>
							</>
						)}
					</div>
				)}

				{/* Information */}
				<Card className='mt-6'>
					<CardHeader>
						<CardTitle>How WordPress Detection Works</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600'>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Detection Methods
								</h4>
								<ul className='space-y-1'>
									<li>• WordPress generator meta tag</li>
									<li>• wp-content directory structure</li>
									<li>• WordPress-specific file paths</li>
									<li>• Theme and plugin signatures</li>
								</ul>
							</div>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Theme Detection
								</h4>
								<ul className='space-y-1'>
									<li>• Stylesheet link analysis</li>
									<li>• Theme directory paths</li>
									<li>• CSS class patterns</li>
									<li>• Template file structure</li>
								</ul>
							</div>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Plugin Detection
								</h4>
								<ul className='space-y-1'>
									<li>• JavaScript file paths</li>
									<li>• CSS file references</li>
									<li>• HTML comments and meta tags</li>
									<li>• Plugin-specific markup</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
