"use client";

import { useState, useEffect } from "react";
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
import { Calculator, Activity, TrendingUp } from "lucide-react";

export default function BMICalculator() {
	const [height, setHeight] = useState("");
	const [weight, setWeight] = useState("");
	const [unit, setUnit] = useState("metric");
	const [bmi, setBmi] = useState<number | null>(null);
	const [category, setCategory] = useState("");
	const [categoryColor, setCategoryColor] = useState("");

	const calculateBMI = () => {
		const weightNum = Number.parseFloat(weight);
		const heightNum = Number.parseFloat(height);

		if (!weightNum || !heightNum) return;

		let bmiValue: number;

		if (unit === "metric") {
			// BMI = weight (kg) / height (m)²
			const heightInMeters = heightNum / 100;
			bmiValue = weightNum / (heightInMeters * heightInMeters);
		} else {
			// BMI = (weight (lbs) / height (inches)²) × 703
			bmiValue = (weightNum / (heightNum * heightNum)) * 703;
		}

		setBmi(Math.round(bmiValue * 10) / 10);

		// Determine category
		if (bmiValue < 18.5) {
			setCategory("Underweight");
			setCategoryColor("text-blue-600");
		} else if (bmiValue < 25) {
			setCategory("Normal weight");
			setCategoryColor("text-green-600");
		} else if (bmiValue < 30) {
			setCategory("Overweight");
			setCategoryColor("text-yellow-600");
		} else {
			setCategory("Obese");
			setCategoryColor("text-red-600");
		}
	};

	useEffect(() => {
		calculateBMI();
	}, [height, weight, unit]);

	const getBMIRanges = () => [
		{
			range: "Below 18.5",
			category: "Underweight",
			color: "bg-blue-100 text-blue-800",
			active: bmi && bmi < 18.5,
		},
		{
			range: "18.5 - 24.9",
			category: "Normal weight",
			color: "bg-green-100 text-green-800",
			active: bmi && bmi >= 18.5 && bmi < 25,
		},
		{
			range: "25.0 - 29.9",
			category: "Overweight",
			color: "bg-yellow-100 text-yellow-800",
			active: bmi && bmi >= 25 && bmi < 30,
		},
		{
			range: "30.0 and above",
			category: "Obese",
			color: "bg-red-100 text-red-800",
			active: bmi && bmi >= 30,
		},
	];

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Activity className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						BMI Calculator
					</h1>
					<p className='text-gray-600'>
						Calculate your Body Mass Index and health category
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Calculator */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Calculator className='w-5 h-5' />
								BMI Calculator
							</CardTitle>
							<CardDescription>
								Enter your height and weight to calculate BMI
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-2'>
								<Label>Unit System</Label>
								<Select value={unit} onValueChange={setUnit}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='metric'>
											Metric (kg, cm)
										</SelectItem>
										<SelectItem value='imperial'>
											Imperial (lbs, inches)
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>
										Height (
										{unit === "metric" ? "cm" : "inches"})
									</Label>
									<Input
										type='number'
										placeholder={
											unit === "metric" ? "170" : "67"
										}
										value={height}
										onChange={(e) =>
											setHeight(e.target.value)
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label>
										Weight (
										{unit === "metric" ? "kg" : "lbs"})
									</Label>
									<Input
										type='number'
										placeholder={
											unit === "metric" ? "70" : "154"
										}
										value={weight}
										onChange={(e) =>
											setWeight(e.target.value)
										}
									/>
								</div>
							</div>

							{bmi && (
								<div className='bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg text-center'>
									<p className='text-sm text-gray-600 mb-2'>
										Your BMI is
									</p>
									<p className='text-4xl font-bold text-blue-600 mb-2'>
										{bmi}
									</p>
									<p
										className={`text-lg font-semibold ${categoryColor}`}>
										{category}
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* BMI Chart */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<TrendingUp className='w-5 h-5' />
								BMI Categories
							</CardTitle>
							<CardDescription>
								Understanding BMI ranges and health categories
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{getBMIRanges().map((range, index) => (
								<div
									key={index}
									className={`p-4 rounded-lg border-2 transition-all ${
										range.active
											? "border-blue-500 shadow-md scale-105"
											: "border-gray-200"
									}`}>
									<div className='flex justify-between items-center'>
										<div>
											<p className='font-semibold text-gray-800'>
												{range.category}
											</p>
											<p className='text-sm text-gray-600'>
												BMI {range.range}
											</p>
										</div>
										<span
											className={`px-3 py-1 rounded-full text-sm font-medium ${range.color}`}>
											{range.category}
										</span>
									</div>
								</div>
							))}

							<div className='bg-yellow-50 p-4 rounded-lg border border-yellow-200'>
								<h3 className='font-semibold text-yellow-800 mb-2'>
									⚠️ Important Note
								</h3>
								<p className='text-sm text-yellow-700'>
									BMI is a screening tool and doesn&apos;t
									diagnose body fatness or health. Consult
									healthcare professionals for comprehensive
									health assessment.
								</p>
							</div>

							<div className='bg-blue-50 p-4 rounded-lg'>
								<h3 className='font-semibold text-blue-800 mb-2'>
									💡 Health Tips
								</h3>
								<ul className='text-sm text-blue-700 space-y-1'>
									<li>
										• Maintain a balanced diet with fruits
										and vegetables
									</li>
									<li>
										• Exercise regularly (150 minutes
										moderate activity/week)
									</li>
									<li>
										• Stay hydrated and get adequate sleep
									</li>
									<li>
										• Consult healthcare providers for
										personalized advice
									</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
