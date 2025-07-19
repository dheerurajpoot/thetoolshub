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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Hash, Copy, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";

export default function UUIDGenerator() {
	const [uuidVersion, setUuidVersion] = useState("4");
	const [count, setCount] = useState("1");
	const [format, setFormat] = useState("default");
	const [generatedUUIDs, setGeneratedUUIDs] = useState<string[]>([]);

	const generateUUID = () => {
		// Simple UUID v4 generator (for demo purposes)
		const generateV4 = () => {
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
				/[xy]/g,
				(c) => {
					const r = (Math.random() * 16) | 0;
					const v = c === "x" ? r : (r & 0x3) | 0x8;
					return v.toString(16);
				}
			);
		};

		const generateV1 = () => {
			// Simplified V1 UUID (timestamp-based)
			const timestamp = Date.now().toString(16);
			const random = Math.random().toString(16).substring(2, 14);
			return `${timestamp.substring(0, 8)}-${timestamp.substring(
				8
			)}-1${random.substring(0, 3)}-${random.substring(
				3,
				7
			)}-${random.substring(7)}`;
		};

		const formatUUID = (uuid: string) => {
			switch (format) {
				case "uppercase":
					return uuid.toUpperCase();
				case "lowercase":
					return uuid.toLowerCase();
				case "nohyphens":
					return uuid.replace(/-/g, "");
				case "braces":
					return `{${uuid}}`;
				case "quotes":
					return `"${uuid}"`;
				default:
					return uuid;
			}
		};

		const uuids: string[] = [];
		const numCount = Number.parseInt(count);

		for (let i = 0; i < numCount; i++) {
			let uuid: string;
			if (uuidVersion === "1") {
				uuid = generateV1();
			} else {
				uuid = generateV4();
			}
			uuids.push(formatUUID(uuid));
		}

		setGeneratedUUIDs(uuids);
		toast.success("UUIDs Generated!", {
			description: `Generated ${numCount} UUID${numCount > 1 ? "s" : ""}`,
		});
	};

	const copyUUID = (uuid: string) => {
		navigator.clipboard.writeText(uuid);
		toast.success("Copied!", {
			description: "UUID copied to clipboard",
		});
	};

	const copyAllUUIDs = () => {
		const allUUIDs = generatedUUIDs.join("\n");
		navigator.clipboard.writeText(allUUIDs);
		toast.success("All Copied!", {
			description: "All UUIDs copied to clipboard",
		});
	};

	const downloadUUIDs = () => {
		const content = generatedUUIDs.join("\n");
		const blob = new Blob([content], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "uuids.txt";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Hash className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						UUID Generator
					</h1>
					<p className='text-gray-600'>
						Generate unique identifiers for your applications
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Settings */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Generator Settings</CardTitle>
							<CardDescription>
								Configure your UUID generation preferences
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-2'>
								<Label>UUID Version</Label>
								<Select
									value={uuidVersion}
									onValueChange={setUuidVersion}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='1'>
											Version 1 (Timestamp-based)
										</SelectItem>
										<SelectItem value='4'>
											Version 4 (Random)
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className='space-y-2'>
								<Label>Number of UUIDs</Label>
								<Input
									type='number'
									min='1'
									max='100'
									value={count}
									onChange={(e) => setCount(e.target.value)}
								/>
							</div>

							<div className='space-y-2'>
								<Label>Format</Label>
								<Select
									value={format}
									onValueChange={setFormat}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='default'>
											Default (lowercase with hyphens)
										</SelectItem>
										<SelectItem value='uppercase'>
											UPPERCASE
										</SelectItem>
										<SelectItem value='lowercase'>
											lowercase
										</SelectItem>
										<SelectItem value='nohyphens'>
											No Hyphens
										</SelectItem>
										<SelectItem value='braces'>
											With Braces {}
										</SelectItem>
										<SelectItem value='quotes'>
											With Quotes &quot;&quot;
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<Button
								onClick={generateUUID}
								className='w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
								size='lg'>
								<RefreshCw className='w-4 h-4 mr-2' />
								Generate UUIDs
							</Button>

							<div className='bg-blue-50 p-4 rounded-lg'>
								<h3 className='font-semibold text-blue-800 mb-2'>
									UUID Versions
								</h3>
								<div className='text-sm text-blue-700 space-y-1'>
									<p>
										<strong>Version 1:</strong> Timestamp
										and MAC address based
									</p>
									<p>
										<strong>Version 4:</strong> Randomly
										generated (most common)
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Generated UUIDs */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Generated UUIDs</CardTitle>
							<CardDescription>
								Click on any UUID to copy it
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{generatedUUIDs.length > 0 ? (
								<>
									<div className='space-y-2 max-h-96 overflow-y-auto'>
										{generatedUUIDs.map((uuid, index) => (
											<div
												key={index}
												onClick={() => copyUUID(uuid)}
												className='flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group font-mono text-sm'>
												<span className='text-gray-800 break-all'>
													{uuid}
												</span>
												<Copy className='w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 ml-2' />
											</div>
										))}
									</div>

									<div className='flex gap-2'>
										<Button
											onClick={copyAllUUIDs}
											variant='outline'
											className='flex-1 bg-transparent'>
											<Copy className='w-4 h-4 mr-2' />
											Copy All
										</Button>
										<Button
											onClick={downloadUUIDs}
											variant='outline'
											className='flex-1 bg-transparent'>
											<Download className='w-4 h-4 mr-2' />
											Download
										</Button>
									</div>
								</>
							) : (
								<div className='text-center py-12 text-gray-400'>
									<Hash className='w-16 h-16 mx-auto mb-4' />
									<p>
										Click &quot;Generate UUIDs&quot; to
										create unique identifiers
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Use Cases */}
				<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 mt-8'>
					<CardContent className='p-6'>
						<h3 className='font-semibold text-gray-800 mb-4'>
							💡 Common Use Cases:
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
							<ul className='space-y-2'>
								<li>
									• <strong>Database primary keys:</strong>{" "}
									Unique record identifiers
								</li>
								<li>
									• <strong>API tokens:</strong> Secure
									authentication tokens
								</li>
								<li>
									• <strong>File naming:</strong> Unique file
									identifiers
								</li>
								<li>
									• <strong>Session IDs:</strong> User session
									tracking
								</li>
							</ul>
							<ul className='space-y-2'>
								<li>
									• <strong>Transaction IDs:</strong> Payment
									and order tracking
								</li>
								<li>
									• <strong>Message IDs:</strong> Unique
									message identifiers
								</li>
								<li>
									• <strong>Resource identifiers:</strong>{" "}
									Cloud resource naming
								</li>
								<li>
									• <strong>Correlation IDs:</strong> Request
									tracing in microservices
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
