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
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { User, RefreshCw, Copy, Wand2 } from "lucide-react";
import { toast } from "sonner";

export default function UsernameGenerator() {
	const [baseName, setBaseName] = useState("");
	const [includeNumbers, setIncludeNumbers] = useState(true);
	const [includeSymbols, setIncludeSymbols] = useState(false);
	const [usernameStyle, setUsernameStyle] = useState("random");
	const [generatedUsernames, setGeneratedUsernames] = useState<string[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);

	const adjectives = [
		"Amazing",
		"Brilliant",
		"Creative",
		"Dynamic",
		"Epic",
		"Fantastic",
		"Great",
		"Happy",
		"Incredible",
		"Joyful",
		"Kind",
		"Lucky",
		"Marvelous",
		"Noble",
		"Outstanding",
		"Perfect",
		"Quick",
		"Radiant",
		"Super",
		"Terrific",
		"Ultimate",
		"Vibrant",
		"Wonderful",
		"Xtreme",
		"Young",
		"Zealous",
		"Swift",
		"Bold",
		"Clever",
		"Daring",
		"Elite",
		"Fierce",
		"Golden",
		"Heroic",
		"Intense",
		"Mighty",
		"Ninja",
		"Omega",
		"Prime",
		"Quantum",
		"Rapid",
		"Silent",
	];

	const nouns = [
		"Tiger",
		"Eagle",
		"Dragon",
		"Phoenix",
		"Wolf",
		"Lion",
		"Falcon",
		"Shark",
		"Panther",
		"Viper",
		"Thunder",
		"Lightning",
		"Storm",
		"Blaze",
		"Frost",
		"Shadow",
		"Ghost",
		"Warrior",
		"Knight",
		"Samurai",
		"Ninja",
		"Hunter",
		"Ranger",
		"Mage",
		"Wizard",
		"Archer",
		"Scout",
		"Pilot",
		"Racer",
		"Player",
		"Gamer",
		"Coder",
		"Hacker",
		"Master",
		"Legend",
		"Hero",
		"Champion",
		"Winner",
		"Star",
		"Comet",
		"Nova",
		"Galaxy",
		"Cosmos",
		"Atom",
		"Quantum",
	];

	const generateUsernames = () => {
		setIsGenerating(true);
		const usernames: string[] = [];

		// Generate 12 different usernames
		for (let i = 0; i < 12; i++) {
			let username = "";

			if (baseName.trim()) {
				// Use base name as starting point
				username = baseName.trim().replace(/\s+/g, "");
			} else {
				// Generate random combination
				const adj =
					adjectives[Math.floor(Math.random() * adjectives.length)];
				const noun = nouns[Math.floor(Math.random() * nouns.length)];

				switch (usernameStyle) {
					case "adjective-noun":
						username = adj + noun;
						break;
					case "noun-adjective":
						username = noun + adj;
						break;
					case "mixed":
						username =
							Math.random() > 0.5 ? adj + noun : noun + adj;
						break;
					default:
						username = adj + noun;
				}
			}

			// Add numbers if enabled
			if (includeNumbers) {
				const numbers = Math.floor(Math.random() * 9999) + 1;
				username += numbers;
			}

			// Add symbols if enabled
			if (includeSymbols) {
				const symbols = ["_", "-", ".", "x", "X"];
				const symbol =
					symbols[Math.floor(Math.random() * symbols.length)];
				// Insert symbol at random position
				const insertPos = Math.floor(Math.random() * username.length);
				username =
					username.slice(0, insertPos) +
					symbol +
					username.slice(insertPos);
			}

			// Ensure uniqueness
			if (!usernames.includes(username)) {
				usernames.push(username);
			} else {
				i--; // Retry if duplicate
			}
		}

		setTimeout(() => {
			setGeneratedUsernames(usernames);
			setIsGenerating(false);
			toast.success("Usernames Generated!", {
				description: `Generated ${usernames.length} unique usernames`,
			});
		}, 1000);
	};

	const copyUsername = (username: string) => {
		navigator.clipboard.writeText(username);
		toast.success("Copied!", {
			description: `Username "${username}" copied to clipboard`,
		});
	};

	const copyAllUsernames = () => {
		const allUsernames = generatedUsernames.join("\n");
		navigator.clipboard.writeText(allUsernames);
		toast.success("All Copied!", {
			description: "All usernames copied to clipboard",
		});
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<User className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						Username Generator
					</h1>
					<p className='text-gray-600'>
						Generate unique and creative usernames for your accounts
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Settings Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Wand2 className='w-5 h-5' />
								Username Settings
							</CardTitle>
							<CardDescription>
								Customize your username generation preferences
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* Base Name */}
							<div className='space-y-2'>
								<Label>Base Name (Optional)</Label>
								<Input
									placeholder='Enter your name or keyword'
									value={baseName}
									onChange={(e) =>
										setBaseName(e.target.value)
									}
								/>
								<p className='text-sm text-gray-500'>
									Leave empty for completely random usernames
								</p>
							</div>

							{/* Username Style */}
							<div className='space-y-2'>
								<Label>Username Style</Label>
								<Select
									value={usernameStyle}
									onValueChange={setUsernameStyle}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='adjective-noun'>
											Adjective + Noun (e.g., SwiftTiger)
										</SelectItem>
										<SelectItem value='noun-adjective'>
											Noun + Adjective (e.g., TigerSwift)
										</SelectItem>
										<SelectItem value='mixed'>
											Mixed Style
										</SelectItem>
										<SelectItem value='random'>
											Random Combination
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Options */}
							<div className='space-y-4'>
								<Label>Include in Username:</Label>
								<div className='space-y-3'>
									<div className='flex items-center space-x-2'>
										<Checkbox
											id='numbers'
											checked={includeNumbers}
											onCheckedChange={(checked) =>
												setIncludeNumbers(
													checked === true
												)
											}
										/>
										<Label htmlFor='numbers'>
											Numbers (123, 4567)
										</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<Checkbox
											id='symbols'
											checked={includeSymbols}
											onCheckedChange={(checked) =>
												setIncludeSymbols(
													checked === true
												)
											}
										/>
										<Label htmlFor='symbols'>
											Symbols (_, -, ., x)
										</Label>
									</div>
								</div>
							</div>

							<Button
								onClick={generateUsernames}
								disabled={isGenerating}
								className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
								size='lg'>
								<RefreshCw
									className={`w-4 h-4 mr-2 ${
										isGenerating ? "animate-spin" : ""
									}`}
								/>
								{isGenerating
									? "Generating..."
									: "Generate Usernames"}
							</Button>
						</CardContent>
					</Card>

					{/* Results Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Generated Usernames</CardTitle>
							<CardDescription>
								Click on any username to copy it
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{generatedUsernames.length > 0 ? (
								<>
									<div className='grid grid-cols-1 gap-2 max-h-96 overflow-y-auto'>
										{generatedUsernames.map(
											(username, index) => (
												<div
													key={index}
													onClick={() =>
														copyUsername(username)
													}
													className='flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group'>
													<span className='font-mono font-medium text-gray-800'>
														{username}
													</span>
													<Copy className='w-4 h-4 text-gray-400 group-hover:text-blue-600' />
												</div>
											)
										)}
									</div>

									<Button
										onClick={copyAllUsernames}
										variant='outline'
										className='w-full bg-transparent'>
										<Copy className='w-4 h-4 mr-2' />
										Copy All Usernames
									</Button>
								</>
							) : (
								<div className='text-center py-12 text-gray-400'>
									<User className='w-16 h-16 mx-auto mb-4' />
									<p>
										Click &quot;Generate Usernames&quot; to
										see results
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Tips */}
				<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 mt-8'>
					<CardContent className='p-6'>
						<h3 className='font-semibold text-gray-800 mb-4'>
							💡 Username Tips:
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
							<ul className='space-y-2'>
								<li>• Keep it memorable and easy to type</li>
								<li>• Avoid using personal information</li>
								<li>
									• Check availability on your target
									platforms
								</li>
								<li>
									• Consider using the same username across
									platforms
								</li>
							</ul>
							<ul className='space-y-2'>
								<li>• Numbers can help with uniqueness</li>
								<li>
									• Symbols may not be allowed on all
									platforms
								</li>
								<li>• Shorter usernames are often better</li>
								<li>• Test pronunciation with friends</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
