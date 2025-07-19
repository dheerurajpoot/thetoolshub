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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Ruler, ArrowUpDown } from "lucide-react";

export default function UnitConverter() {
	const [category, setCategory] = useState("length");
	
	// Define type for unit keys
	type UnitKey = keyof typeof conversions.length.units;
	
	// Initialize with valid unit keys
	const [fromUnit, setFromUnit] = useState<UnitKey>("m");
	const [toUnit, setToUnit] = useState<UnitKey>("m");
	const [inputValue, setInputValue] = useState("");
	const [result, setResult] = useState("");

	interface Unit {
		name: string;
		factor: number;
	}

	interface Category {
		name: string;
		units: Record<string, Unit>;
	}

	// Type the conversions object
	const conversions: Record<string, Category> = {
		length: {
			name: "Length",
			units: {
				mm: { name: "Millimeter", factor: 0.001 },
				cm: { name: "Centimeter", factor: 0.01 },
				m: { name: "Meter", factor: 1 },
				km: { name: "Kilometer", factor: 1000 },
				in: { name: "Inch", factor: 0.0254 },
				ft: { name: "Foot", factor: 0.3048 },
				yd: { name: "Yard", factor: 0.9144 },
				mi: { name: "Mile", factor: 1609.34 },
			},
		},
		weight: {
			name: "Weight",
			units: {
				mg: { name: "Milligram", factor: 0.000001 },
				g: { name: "Gram", factor: 0.001 },
				kg: { name: "Kilogram", factor: 1 },
				oz: { name: "Ounce", factor: 0.0283495 },
				lb: { name: "Pound", factor: 0.453592 },
				ton: { name: "Metric Ton", factor: 1000 },
			},
		},
		temperature: {
			name: "Temperature",
			units: {
				c: { name: "Celsius", factor: 1 },
				f: { name: "Fahrenheit", factor: 1 },
				k: { name: "Kelvin", factor: 1 },
			},
		},
		volume: {
			name: "Volume",
			units: {
				ml: { name: "Milliliter", factor: 0.001 },
				l: { name: "Liter", factor: 1 },
				gal: { name: "Gallon (US)", factor: 3.78541 },
				qt: { name: "Quart", factor: 0.946353 },
				pt: { name: "Pint", factor: 0.473176 },
				cup: { name: "Cup", factor: 0.236588 },
				floz: { name: "Fluid Ounce", factor: 0.0295735 },
			},
		},
		area: {
			name: "Area",
			units: {
				sqmm: { name: "Square Millimeter", factor: 0.000001 },
				sqcm: { name: "Square Centimeter", factor: 0.0001 },
				sqm: { name: "Square Meter", factor: 1 },
				sqkm: { name: "Square Kilometer", factor: 1000000 },
				sqin: { name: "Square Inch", factor: 0.00064516 },
				sqft: { name: "Square Foot", factor: 0.092903 },
				acre: { name: "Acre", factor: 4046.86 },
			},
		},
		speed: {
			name: "Speed",
			units: {
				mps: { name: "Meters per Second", factor: 1 },
				kph: { name: "Kilometers per Hour", factor: 0.277778 },
				mph: { name: "Miles per Hour", factor: 0.44704 },
				fps: { name: "Feet per Second", factor: 0.3048 },
				knot: { name: "Knot", factor: 0.514444 },
			},
		},
	};

	const convertTemperature = (value: number, from: string, to: string) => {
		let celsius: number;

		// Convert to Celsius first
		switch (from) {
			case "c":
				celsius = value;
				break;
			case "f":
				celsius = ((value - 32) * 5) / 9;
				break;
			case "k":
				celsius = value - 273.15;
				break;
			default:
				celsius = value;
		}

		// Convert from Celsius to target
		switch (to) {
			case "c":
				return celsius;
			case "f":
				return (celsius * 9) / 5 + 32;
			case "k":
				return celsius + 273.15;
			default:
				return celsius;
		}
	};

	const convert = () => {
		const value = Number.parseFloat(inputValue);
		if (isNaN(value) || !fromUnit || !toUnit) return;

		let convertedValue: number;

		if (category === "temperature") {
			convertedValue = convertTemperature(value, fromUnit, toUnit);
		} else {
			const categoryData = conversions[
				category as keyof typeof conversions
			] as Category;
			const fromFactor =
				categoryData.units[fromUnit as keyof Category["units"]].factor;
			const toFactor =
				categoryData.units[toUnit as keyof Category["units"]].factor;

			// Convert to base unit, then to target unit
			const baseValue = value * fromFactor;
			convertedValue = baseValue / toFactor;
		}

		setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ""));
	};

	const swapUnits = () => {
		const temp = fromUnit;
		setFromUnit(toUnit);
		setToUnit(temp);
		if (result && inputValue) {
			setInputValue(result);
			setResult(inputValue);
		}
	};

	const currentCategory = conversions[category as keyof typeof conversions];

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Ruler className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						Unit Converter
					</h1>
					<p className='text-gray-600'>
						Convert between different units of measurement
					</p>
				</div>

				<Card className='shadow-xl border-0 max-w-2xl mx-auto'>
					<CardHeader>
						<CardTitle>Unit Conversion</CardTitle>
						<CardDescription>
							Select category and units to convert between
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-6'>
						{/* Category Selection */}
						<div className='space-y-2'>
							<Label>Category</Label>
							<Select
								value={category}
								onValueChange={(value) => {
									setCategory(value);
									setFromUnit("");
									setToUnit("");
									setResult("");
								}}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(conversions).map(
										([key, cat]) => (
											<SelectItem key={key} value={key}>
												{cat.name}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>
						</div>

						{/* From Unit */}
						<div className='grid grid-cols-1 md:grid-cols-5 gap-4 items-end'>
							<div className='md:col-span-2 space-y-2'>
								<Label>From</Label>
								<Select
									value={fromUnit}
									onValueChange={setFromUnit}>
									<SelectTrigger>
										<SelectValue placeholder='Select unit' />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(
											currentCategory.units
										).map(([key, unit]) => (
											<SelectItem key={key} value={key}>
												{unit.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className='flex justify-center'>
								<Button
									variant='outline'
									size='icon'
									onClick={swapUnits}
									disabled={!fromUnit || !toUnit}>
									<ArrowUpDown className='w-4 h-4' />
								</Button>
							</div>

							<div className='md:col-span-2 space-y-2'>
								<Label>To</Label>
								<Select
									value={toUnit}
									onValueChange={setToUnit}>
									<SelectTrigger>
										<SelectValue placeholder='Select unit' />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(
											currentCategory.units
										).map(([key, unit]) => (
											<SelectItem key={key} value={key}>
												{unit.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Input and Result */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label>Value</Label>
								<Input
									type='number'
									placeholder='Enter value'
									value={inputValue}
									onChange={(e) =>
										setInputValue(e.target.value)
									}
								/>
							</div>
							<div className='space-y-2'>
								<Label>Result</Label>
								<Input
									value={result}
									readOnly
									placeholder='Converted value'
									className='bg-gray-50'
								/>
							</div>
						</div>

						<Button
							onClick={convert}
							disabled={!inputValue || !fromUnit || !toUnit}
							className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
							size='lg'>
							Convert
						</Button>

						{/* Quick Conversions */}
						{result && (
							<div className='bg-green-50 p-4 rounded-lg'>
								<h3 className='font-semibold text-green-800 mb-2'>
									Conversion Result
								</h3>
								<p className='text-green-700'>
									<span className='font-bold'>
										{inputValue}
									</span>{" "}
									{
										currentCategory.units[
											fromUnit as keyof typeof currentCategory.units
										]?.name
									}{" "}
									=
									<span className='font-bold'> {result}</span>{" "}
									{
										currentCategory.units[
											toUnit as keyof typeof currentCategory.units
										]?.name
									}
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Common Conversions */}
				<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 mt-8'>
					<CardContent className='p-6'>
						<h3 className='font-semibold text-gray-800 mb-4'>
							📏 Common Conversions:
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
							<ul className='space-y-2'>
								<li>
									• <strong>1 meter</strong> = 3.28084 feet
								</li>
								<li>
									• <strong>1 kilogram</strong> = 2.20462
									pounds
								</li>
								<li>
									• <strong>1 liter</strong> = 0.264172
									gallons (US)
								</li>
								<li>
									• <strong>0°C</strong> = 32°F = 273.15K
								</li>
							</ul>
							<ul className='space-y-2'>
								<li>
									• <strong>1 mile</strong> = 1.60934
									kilometers
								</li>
								<li>
									• <strong>1 inch</strong> = 2.54 centimeters
								</li>
								<li>
									• <strong>1 acre</strong> = 4,047 square
									meters
								</li>
								<li>
									• <strong>1 mph</strong> = 1.60934 km/h
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
