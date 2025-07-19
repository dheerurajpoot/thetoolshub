"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Copy, Download, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UserAgent {
	agent: string;
	allow: string[];
	disallow: string[];
}

export default function RobotsGenerator() {
	const [sitemap, setSitemap] = useState("");
	const [crawlDelay, setCrawlDelay] = useState("");
	const [userAgents, setUserAgents] = useState<UserAgent[]>([
		{ agent: "*", allow: ["/"], disallow: [] },
	]);
	const [generatedRobots, setGeneratedRobots] = useState("");

	const addUserAgent = () => {
		setUserAgents([...userAgents, { agent: "", allow: [], disallow: [] }]);
	};

	const removeUserAgent = (index: number) => {
		setUserAgents(userAgents.filter((_, i) => i !== index));
	};

	const updateUserAgent = (index: number, field: string, value: any) => {
		const updated = [...userAgents];
		updated[index] = { ...updated[index], [field]: value };
		setUserAgents(updated);
	};

	const addRule = (userAgentIndex: number, type: "allow" | "disallow") => {
		const updated = [...userAgents];
		updated[userAgentIndex][type].push("");
		setUserAgents(updated);
	};

	const updateRule = (
		userAgentIndex: number,
		type: "allow" | "disallow",
		ruleIndex: number,
		value: string
	) => {
		const updated = [...userAgents];
		updated[userAgentIndex][type][ruleIndex] = value;
		setUserAgents(updated);
	};

	const removeRule = (
		userAgentIndex: number,
		type: "allow" | "disallow",
		ruleIndex: number
	) => {
		const updated = [...userAgents];
		updated[userAgentIndex][type].splice(ruleIndex, 1);
		setUserAgents(updated);
	};

	const generateRobotsTxt = () => {
		let robotsContent = "";

		userAgents.forEach((ua) => {
			if (ua.agent) {
				robotsContent += `User-agent: ${ua.agent}\n`;

				ua.allow.forEach((rule) => {
					if (rule.trim()) {
						robotsContent += `Allow: ${rule}\n`;
					}
				});

				ua.disallow.forEach((rule) => {
					if (rule.trim()) {
						robotsContent += `Disallow: ${rule}\n`;
					}
				});

				if (crawlDelay && ua.agent !== "*") {
					robotsContent += `Crawl-delay: ${crawlDelay}\n`;
				}

				robotsContent += "\n";
			}
		});

		if (sitemap) {
			robotsContent += `Sitemap: ${sitemap}\n`;
		}

		setGeneratedRobots(robotsContent.trim());
		toast.success("Robots.txt file generated successfully");
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(generatedRobots);
		toast.success("Robots.txt content copied to clipboard");
	};

	const downloadRobots = () => {
		const blob = new Blob([generatedRobots], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "robots.txt";
		a.click();
		URL.revokeObjectURL(url);
	};

	const loadTemplate = (template: string) => {
		switch (template) {
			case "allow-all":
				setUserAgents([{ agent: "*", allow: ["/"], disallow: [] }]);
				break;
			case "block-all":
				setUserAgents([{ agent: "*", allow: [], disallow: ["/"] }]);
				break;
			case "block-admin":
				setUserAgents([
					{
						agent: "*",
						allow: ["/"],
						disallow: ["/admin/", "/private/", "/wp-admin/"],
					},
				]);
				break;
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-6xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Shield className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						Robots.txt Generator
					</h1>
					<p className='text-gray-600'>
						Generate robots.txt file to control search engine
						crawling
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Configuration Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Robots.txt Configuration</CardTitle>
							<CardDescription>
								Configure crawling rules for search engines
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* Quick Templates */}
							<div className='space-y-2'>
								<Label>Quick Templates</Label>
								<div className='flex gap-2 flex-wrap'>
									<Button
										size='sm'
										variant='outline'
										onClick={() =>
											loadTemplate("allow-all")
										}>
										Allow All
									</Button>
									<Button
										size='sm'
										variant='outline'
										onClick={() =>
											loadTemplate("block-all")
										}>
										Block All
									</Button>
									<Button
										size='sm'
										variant='outline'
										onClick={() =>
											loadTemplate("block-admin")
										}>
										Block Admin
									</Button>
								</div>
							</div>

							{/* User Agents */}
							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<Label>User Agents</Label>
									<Button size='sm' onClick={addUserAgent}>
										<Plus className='w-4 h-4 mr-2' />
										Add User Agent
									</Button>
								</div>

								{userAgents.map((ua, uaIndex) => (
									<Card key={uaIndex} className='p-4'>
										<div className='space-y-4'>
											<div className='flex items-center gap-2'>
												<Input
													placeholder='User-agent (e.g., *, Googlebot)'
													value={ua.agent}
													onChange={(e) =>
														updateUserAgent(
															uaIndex,
															"agent",
															e.target.value
														)
													}
													className='flex-1'
												/>
												{userAgents.length > 1 && (
													<Button
														size='sm'
														variant='outline'
														onClick={() =>
															removeUserAgent(
																uaIndex
															)
														}>
														<Trash2 className='w-4 h-4' />
													</Button>
												)}
											</div>

											{/* Allow Rules */}
											<div className='space-y-2'>
												<div className='flex items-center justify-between'>
													<Label className='text-sm text-green-600'>
														Allow Rules
													</Label>
													<Button
														size='sm'
														variant='outline'
														onClick={() =>
															addRule(
																uaIndex,
																"allow"
															)
														}>
														<Plus className='w-3 h-3' />
													</Button>
												</div>
												{ua.allow.map(
													(rule, ruleIndex) => (
														<div
															key={ruleIndex}
															className='flex items-center gap-2'>
															<Input
																placeholder='/path/'
																value={rule}
																onChange={(e) =>
																	updateRule(
																		uaIndex,
																		"allow",
																		ruleIndex,
																		e.target
																			.value
																	)
																}
																className='flex-1'
															/>
															<Button
																size='sm'
																variant='outline'
																onClick={() =>
																	removeRule(
																		uaIndex,
																		"allow",
																		ruleIndex
																	)
																}>
																<Trash2 className='w-3 h-3' />
															</Button>
														</div>
													)
												)}
											</div>

											{/* Disallow Rules */}
											<div className='space-y-2'>
												<div className='flex items-center justify-between'>
													<Label className='text-sm text-red-600'>
														Disallow Rules
													</Label>
													<Button
														size='sm'
														variant='outline'
														onClick={() =>
															addRule(
																uaIndex,
																"disallow"
															)
														}>
														<Plus className='w-3 h-3' />
													</Button>
												</div>
												{ua.disallow.map(
													(rule, ruleIndex) => (
														<div
															key={ruleIndex}
															className='flex items-center gap-2'>
															<Input
																placeholder='/private/'
																value={rule}
																onChange={(e) =>
																	updateRule(
																		uaIndex,
																		"disallow",
																		ruleIndex,
																		e.target
																			.value
																	)
																}
																className='flex-1'
															/>
															<Button
																size='sm'
																variant='outline'
																onClick={() =>
																	removeRule(
																		uaIndex,
																		"disallow",
																		ruleIndex
																	)
																}>
																<Trash2 className='w-3 h-3' />
															</Button>
														</div>
													)
												)}
											</div>
										</div>
									</Card>
								))}
							</div>

							{/* Additional Settings */}
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Crawl Delay (seconds)</Label>
									<Input
										type='number'
										placeholder='10'
										value={crawlDelay}
										onChange={(e) =>
											setCrawlDelay(e.target.value)
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label>Sitemap URL</Label>
									<Input
										placeholder='https://example.com/sitemap.xml'
										value={sitemap}
										onChange={(e) =>
											setSitemap(e.target.value)
										}
									/>
								</div>
							</div>

							<Button
								onClick={generateRobotsTxt}
								className='w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
								size='lg'>
								<Shield className='w-4 h-4 mr-2' />
								Generate Robots.txt
							</Button>
						</CardContent>
					</Card>

					{/* Generated Output */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Generated Robots.txt</CardTitle>
							<CardDescription>
								Your robots.txt file content
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<Textarea
								value={generatedRobots}
								readOnly
								placeholder='Generated robots.txt content will appear here...'
								className='min-h-96 font-mono text-sm bg-gray-50'
							/>

							<div className='flex gap-2'>
								<Button
									onClick={copyToClipboard}
									disabled={!generatedRobots}
									variant='outline'
									className='flex-1 bg-transparent'>
									<Copy className='w-4 h-4 mr-2' />
									Copy
								</Button>
								<Button
									onClick={downloadRobots}
									disabled={!generatedRobots}
									variant='outline'
									className='flex-1 bg-transparent'>
									<Download className='w-4 h-4 mr-2' />
									Download
								</Button>
							</div>

							<div className='bg-blue-50 p-4 rounded-lg'>
								<h3 className='font-semibold text-blue-800 mb-2'>
									📝 Usage Instructions:
								</h3>
								<ol className='text-sm text-blue-700 space-y-1'>
									<li>
										1. Upload the robots.txt file to your
										website's root directory
									</li>
									<li>
										2. Make it accessible at:
										https://yoursite.com/robots.txt
									</li>
									<li>3. Test using Google Search Console</li>
									<li>
										4. Monitor crawl behavior and adjust as
										needed
									</li>
								</ol>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Best Practices */}
				<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 mt-8'>
					<CardContent className='p-6'>
						<h3 className='font-semibold text-gray-800 mb-4'>
							🤖 Robots.txt Best Practices:
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
							<ul className='space-y-2'>
								<li>
									• <strong>Use "*" for all bots:</strong>{" "}
									Most common user-agent
								</li>
								<li>
									• <strong>Block sensitive areas:</strong>{" "}
									Admin panels, private folders
								</li>
								<li>
									• <strong>Include sitemap:</strong> Help
									search engines find content
								</li>
								<li>
									• <strong>Test regularly:</strong> Use
									Google Search Console
								</li>
							</ul>
							<ul className='space-y-2'>
								<li>
									• <strong>Case sensitive:</strong> Paths are
									case-sensitive
								</li>
								<li>
									• <strong>Wildcards work:</strong> Use * for
									pattern matching
								</li>
								<li>
									• <strong>Comments allowed:</strong> Use #
									for comments
								</li>
								<li>
									• <strong>One per domain:</strong> Only one
									robots.txt per domain
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
