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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Copy, RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";
import type { CheckedState } from "@radix-ui/react-checkbox";

export default function PasswordGenerator() {
	const [password, setPassword] = useState("");
	const [length, setLength] = useState([12]);
	const [includeUppercase, setIncludeUppercase] = useState(true);
	const [includeLowercase, setIncludeLowercase] = useState(true);
	const [includeNumbers, setIncludeNumbers] = useState(true);
	const [includeSymbols, setIncludeSymbols] = useState(false);

	// Helper function to convert CheckedState to boolean
	const handleCheckboxChange =
		(setter: React.Dispatch<React.SetStateAction<boolean>>) =>
		(checked: CheckedState) => {
			setter(checked === true);
		};

	const generatePassword = () => {
		let charset = "";
		if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
		if (includeNumbers) charset += "0123456789";
		if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

		if (charset === "") {
			toast.error("Please select at least one character type");
			return;
		}

		let result = "";
		for (let i = 0; i < length[0]; i++) {
			result += charset.charAt(
				Math.floor(Math.random() * charset.length)
			);
		}
		setPassword(result);
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(password);
		toast.success("Password copied to clipboard");
	};

	const getStrengthColor = () => {
		if (length[0] < 8) return "text-red-500";
		if (length[0] < 12) return "text-yellow-500";
		return "text-green-500";
	};

	const getStrengthText = () => {
		if (length[0] < 8) return "Weak";
		if (length[0] < 12) return "Medium";
		return "Strong";
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-2xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Shield className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						Password Generator
					</h1>
					<p className='text-gray-600'>
						Generate secure, random passwords for your accounts
					</p>
				</div>

				<Card className='shadow-xl border-0'>
					<CardHeader>
						<CardTitle>Generate Password</CardTitle>
						<CardDescription>
							Customize your password settings and generate a
							secure password
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-6'>
						{/* Generated Password */}
						<div className='space-y-2'>
							<Label>Generated Password</Label>
							<div className='flex gap-2'>
								<Input
									value={password}
									readOnly
									placeholder='Click generate to create a password'
									className='font-mono'
								/>
								<Button
									onClick={copyToClipboard}
									disabled={!password}
									variant='outline'
									size='icon'>
									<Copy className='w-4 h-4' />
								</Button>
							</div>
							{password && (
								<div className='flex items-center gap-2'>
									<span className='text-sm text-gray-600'>
										Strength:
									</span>
									<span
										className={`text-sm font-medium ${getStrengthColor()}`}>
										{getStrengthText()}
									</span>
								</div>
							)}
						</div>

						{/* Password Length */}
						<div className='space-y-3'>
							<div className='flex items-center justify-between'>
								<Label>Password Length</Label>
								<span className='text-sm font-medium'>
									{length[0]} characters
								</span>
							</div>
							<Slider
								value={length}
								onValueChange={setLength}
								max={50}
								min={4}
								step={1}
								className='w-full'
							/>
						</div>

						{/* Character Options */}
						<div className='space-y-4'>
							<Label>Include Characters</Label>
							<div className='grid grid-cols-1 gap-4'>
								<div className='flex items-center space-x-2'>
									<Checkbox
										id='uppercase'
										checked={includeUppercase}
										onCheckedChange={handleCheckboxChange(
											setIncludeUppercase
										)}
									/>
									<Label htmlFor='uppercase'>
										Uppercase Letters (A-Z)
									</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<Checkbox
										id='lowercase'
										checked={includeLowercase}
										onCheckedChange={handleCheckboxChange(
											setIncludeLowercase
										)}
									/>
									<Label htmlFor='lowercase'>
										Lowercase Letters (a-z)
									</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<Checkbox
										id='numbers'
										checked={includeNumbers}
										onCheckedChange={handleCheckboxChange(
											setIncludeNumbers
										)}
									/>
									<Label htmlFor='numbers'>
										Numbers (0-9)
									</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<Checkbox
										id='symbols'
										checked={includeSymbols}
										onCheckedChange={handleCheckboxChange(
											setIncludeSymbols
										)}
									/>
									<Label htmlFor='symbols'>
										Symbols (!@#$%^&*)
									</Label>
								</div>
							</div>
						</div>

						{/* Generate Button */}
						<Button
							onClick={generatePassword}
							className='w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
							size='lg'>
							<RefreshCw className='w-4 h-4 mr-2' />
							Generate Password
						</Button>

						{/* Security Tips */}
						<div className='bg-blue-50 p-4 rounded-lg'>
							<h3 className='font-semibold text-blue-800 mb-2'>
								Security Tips:
							</h3>
							<ul className='text-sm text-blue-700 space-y-1'>
								<li>
									• Use at least 12 characters for better
									security
								</li>
								<li>
									• Include a mix of uppercase, lowercase,
									numbers, and symbols
								</li>
								<li>
									• Don&apos;t reuse passwords across multiple
									accounts
								</li>
								<li>• Consider using a password manager</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
