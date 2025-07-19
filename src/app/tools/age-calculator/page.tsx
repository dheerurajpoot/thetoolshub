"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Gift } from "lucide-react";

type AgeResult =
	| null
	| { error: string }
	| {
			years: number;
			months: number;
			days: number;
			totalDays: number;
			totalWeeks: number;
			totalMonths: number;
			totalHours: number;
			totalMinutes: number;
			totalSeconds: number;
			daysToNextBirthday: number;
			nextBirthday: string;
	  };

export default function AgeCalculator() {
	const [birthDate, setBirthDate] = useState("");
	const [targetDate, setTargetDate] = useState(
		new Date().toISOString().split("T")[0]
	);
	const [ageResult, setAgeResult] = useState<AgeResult>(null);

	const calculateAge = () => {
		if (!birthDate) return;

		const birth = new Date(birthDate);
		const target = new Date(targetDate);

		if (birth > target) {
			setAgeResult({ error: "Birth date cannot be in the future" });
			return;
		}

		// Calculate exact age
		let years = target.getFullYear() - birth.getFullYear();
		let months = target.getMonth() - birth.getMonth();
		let days = target.getDate() - birth.getDate();

		if (days < 0) {
			months--;
			const lastMonth = new Date(
				target.getFullYear(),
				target.getMonth(),
				0
			);
			days += lastMonth.getDate();
		}

		if (months < 0) {
			years--;
			months += 12;
		}

		// Calculate total days, weeks, months
		const totalDays = Math.floor(
			(target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
		);
		const totalWeeks = Math.floor(totalDays / 7);
		const totalMonths = years * 12 + months;
		const totalHours = totalDays * 24;
		const totalMinutes = totalHours * 60;
		const totalSeconds = totalMinutes * 60;

		// Next birthday
		const nextBirthday = new Date(
			target.getFullYear(),
			birth.getMonth(),
			birth.getDate()
		);
		if (nextBirthday < target) {
			nextBirthday.setFullYear(target.getFullYear() + 1);
		}
		const daysToNextBirthday = Math.ceil(
			(nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
		);

		setAgeResult({
			years,
			months,
			days,
			totalDays,
			totalWeeks,
			totalMonths,
			totalHours,
			totalMinutes,
			totalSeconds,
			daysToNextBirthday,
			nextBirthday: nextBirthday.toDateString(),
		});
	};

	const getZodiacSign = (date: Date) => {
		const month = date.getMonth() + 1;
		const day = date.getDate();

		const signs = [
			{ name: "Capricorn", start: [12, 22], end: [1, 19] },
			{ name: "Aquarius", start: [1, 20], end: [2, 18] },
			{ name: "Pisces", start: [2, 19], end: [3, 20] },
			{ name: "Aries", start: [3, 21], end: [4, 19] },
			{ name: "Taurus", start: [4, 20], end: [5, 20] },
			{ name: "Gemini", start: [5, 21], end: [6, 20] },
			{ name: "Cancer", start: [6, 21], end: [7, 22] },
			{ name: "Leo", start: [7, 23], end: [8, 22] },
			{ name: "Virgo", start: [8, 23], end: [9, 22] },
			{ name: "Libra", start: [9, 23], end: [10, 22] },
			{ name: "Scorpio", start: [10, 23], end: [11, 21] },
			{ name: "Sagittarius", start: [11, 22], end: [12, 21] },
		];

		for (const sign of signs) {
			const [startMonth, startDay] = sign.start;
			const [endMonth, endDay] = sign.end;

			if (
				(month === startMonth && day >= startDay) ||
				(month === endMonth && day <= endDay) ||
				(startMonth > endMonth &&
					(month === startMonth || month === endMonth))
			) {
				return sign.name;
			}
		}
		return "Unknown";
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Calendar className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						Age Calculator
					</h1>
					<p className='text-gray-600'>
						Calculate your exact age and get detailed information
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Input Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Calendar className='w-5 h-5' />
								Date Information
							</CardTitle>
							<CardDescription>
								Enter your birth date to calculate age
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-2'>
								<Label>Birth Date</Label>
								<Input
									type='date'
									value={birthDate}
									onChange={(e) =>
										setBirthDate(e.target.value)
									}
								/>
							</div>

							<div className='space-y-2'>
								<Label>Calculate Age On</Label>
								<Input
									type='date'
									value={targetDate}
									onChange={(e) =>
										setTargetDate(e.target.value)
									}
								/>
							</div>

							<Button
								onClick={calculateAge}
								disabled={!birthDate}
								className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
								size='lg'>
								<Clock className='w-4 h-4 mr-2' />
								Calculate Age
							</Button>
						</CardContent>
					</Card>

					{/* Results Section */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Age Results</CardTitle>
							<CardDescription>
								Your detailed age information
							</CardDescription>
						</CardHeader>
						<CardContent>
							{ageResult && "error" in ageResult ? (
								<div className='bg-red-50 border border-red-200 p-4 rounded-lg'>
									<p className='text-red-800'>
										{ageResult.error}
									</p>
								</div>
							) : ageResult ? (
								<div className='space-y-4'>
									<div className='flex items-center gap-4'>
										<Gift className='w-5 h-5 text-purple-500' />
										<span className='text-lg font-semibold'>
											{ageResult.years} years,{" "}
											{ageResult.months} months,{" "}
											{ageResult.days} days
										</span>
									</div>
									<div className='grid grid-cols-2 gap-4'>
										<div>
											<Label>Total Days</Label>
											<div className='text-xl font-bold'>
												{ageResult.totalDays}
											</div>
										</div>
										<div>
											<Label>Total Weeks</Label>
											<div className='text-xl font-bold'>
												{ageResult.totalWeeks}
											</div>
										</div>
										<div>
											<Label>Total Months</Label>
											<div className='text-xl font-bold'>
												{ageResult.totalMonths}
											</div>
										</div>
										<div>
											<Label>Total Hours</Label>
											<div className='text-xl font-bold'>
												{ageResult.totalHours}
											</div>
										</div>
										<div>
											<Label>Total Minutes</Label>
											<div className='text-xl font-bold'>
												{ageResult.totalMinutes}
											</div>
										</div>
										<div>
											<Label>Total Seconds</Label>
											<div className='text-xl font-bold'>
												{ageResult.totalSeconds}
											</div>
										</div>
									</div>
									<div className='mt-4'>
										<Label>Next Birthday</Label>
										<div className='text-lg'>
											{ageResult.nextBirthday}
										</div>
										<div className='text-sm text-gray-600'>
											{ageResult.daysToNextBirthday} days
											left
										</div>
									</div>
								</div>
							) : (
								<div className='text-gray-400'>
									No data yet.
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
