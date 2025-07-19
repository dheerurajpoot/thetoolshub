"use client";

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DollarSign, Calculator, TrendingUp, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface RevenueCalculation {
	dailyRevenue: number;
	weeklyRevenue: number;
	monthlyRevenue: number;
	yearlyRevenue: number;
	ctr: number;
	cpc: number;
	rpm: number;
	impressions: number;
	clicks: number;
}

export default function AdSenseCalculator() {
	const [pageViews, setPageViews] = useState("");
	const [ctr, setCtr] = useState("");
	const [cpc, setCpc] = useState("");
	const [niche, setNiche] = useState("");
	const [country, setCountry] = useState("");
	const [calculation, setCalculation] = useState<RevenueCalculation | null>(
		null
	);

	const niches = [
		{ value: "finance", label: "Finance & Insurance", multiplier: 1.5 },
		{ value: "health", label: "Health & Medical", multiplier: 1.3 },
		{ value: "technology", label: "Technology", multiplier: 1.2 },
		{ value: "business", label: "Business", multiplier: 1.1 },
		{ value: "education", label: "Education", multiplier: 1.0 },
		{ value: "lifestyle", label: "Lifestyle", multiplier: 0.9 },
		{ value: "entertainment", label: "Entertainment", multiplier: 0.8 },
		{ value: "gaming", label: "Gaming", multiplier: 0.7 },
		{ value: "general", label: "General", multiplier: 0.8 },
	];

	const countries = [
		{ value: "us", label: "United States", multiplier: 1.0 },
		{ value: "uk", label: "United Kingdom", multiplier: 0.9 },
		{ value: "ca", label: "Canada", multiplier: 0.8 },
		{ value: "au", label: "Australia", multiplier: 0.8 },
		{ value: "de", label: "Germany", multiplier: 0.7 },
		{ value: "fr", label: "France", multiplier: 0.6 },
		{ value: "in", label: "India", multiplier: 0.3 },
		{ value: "br", label: "Brazil", multiplier: 0.4 },
		{ value: "other", label: "Other", multiplier: 0.5 },
	];

	const calculateRevenue = () => {
		const views = Number.parseInt(pageViews);
		const clickRate = Number.parseFloat(ctr) || 2.0;
		const costPerClick = Number.parseFloat(cpc) || 0.5;

		if (!views || views <= 0) {
			toast.error("Invalid Input", {
				description: "Please enter valid page views",
			});
			return;
		}

		// Apply niche and country multipliers
		const nicheMultiplier =
			niches.find((n) => n.value === niche)?.multiplier || 1.0;
		const countryMultiplier =
			countries.find((c) => c.value === country)?.multiplier || 1.0;

		const adjustedCPC = costPerClick * nicheMultiplier * countryMultiplier;
		const adjustedCTR = clickRate;

		// Calculate daily metrics
		const dailyImpressions = views;
		const dailyClicks = (dailyImpressions * adjustedCTR) / 100;
		const dailyRevenue = dailyClicks * adjustedCPC;
		const rpm = (dailyRevenue / dailyImpressions) * 1000;

		const result: RevenueCalculation = {
			dailyRevenue: dailyRevenue,
			weeklyRevenue: dailyRevenue * 7,
			monthlyRevenue: dailyRevenue * 30,
			yearlyRevenue: dailyRevenue * 365,
			ctr: adjustedCTR,
			cpc: adjustedCPC,
			rpm: rpm,
			impressions: dailyImpressions,
			clicks: dailyClicks,
		};

		setCalculation(result);
		toast("Revenue calculated!", {
			description: `Estimated daily revenue: $${dailyRevenue.toFixed(2)}`,
		});
	};

	const resetCalculator = () => {
		setPageViews("");
		setCtr("");
		setCpc("");
		setNiche("");
		setCountry("");
		setCalculation(null);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4'>
			<div className='max-w-6xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-gray-900 mb-4'>
						AdSense Revenue Calculator
					</h1>
					<p className='text-xl text-gray-600'>
						Estimate your potential AdSense earnings
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					{/* Input Section */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Calculator className='w-5 h-5' />
								Revenue Calculator
							</CardTitle>
							<CardDescription>
								Enter your website metrics to estimate AdSense
								revenue
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div>
								<Label htmlFor='pageviews'>
									Daily Page Views
								</Label>
								<Input
									id='pageviews'
									type='number'
									value={pageViews}
									onChange={(e) =>
										setPageViews(e.target.value)
									}
									placeholder='10000'
								/>
							</div>

							<div>
								<Label htmlFor='ctr'>
									CTR (Click Through Rate) %
								</Label>
								<Input
									id='ctr'
									type='number'
									step='0.1'
									value={ctr}
									onChange={(e) => setCtr(e.target.value)}
									placeholder='2.0 (leave empty for default)'
								/>
							</div>

							<div>
								<Label htmlFor='cpc'>
									CPC (Cost Per Click) $
								</Label>
								<Input
									id='cpc'
									type='number'
									step='0.01'
									value={cpc}
									onChange={(e) => setCpc(e.target.value)}
									placeholder='0.50 (leave empty for default)'
								/>
							</div>

							<div>
								<Label htmlFor='niche'>Website Niche</Label>
								<Select value={niche} onValueChange={setNiche}>
									<SelectTrigger>
										<SelectValue placeholder='Select your niche' />
									</SelectTrigger>
									<SelectContent>
										{niches.map((n) => (
											<SelectItem
												key={n.value}
												value={n.value}>
												{n.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor='country'>
									Primary Traffic Country
								</Label>
								<Select
									value={country}
									onValueChange={setCountry}>
									<SelectTrigger>
										<SelectValue placeholder='Select primary country' />
									</SelectTrigger>
									<SelectContent>
										{countries.map((c) => (
											<SelectItem
												key={c.value}
												value={c.value}>
												{c.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className='flex gap-2'>
								<Button
									onClick={calculateRevenue}
									className='flex-1'>
									<DollarSign className='w-4 h-4 mr-2' />
									Calculate Revenue
								</Button>
								<Button
									onClick={resetCalculator}
									variant='outline'>
									Reset
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Results Section */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<TrendingUp className='w-5 h-5' />
								Revenue Estimates
							</CardTitle>
							<CardDescription>
								Projected AdSense earnings based on your inputs
							</CardDescription>
						</CardHeader>
						<CardContent>
							{calculation ? (
								<div className='space-y-6'>
									{/* Revenue Breakdown */}
									<div className='grid grid-cols-2 gap-4'>
										<div className='text-center p-4 bg-green-50 rounded-lg'>
											<div className='text-2xl font-bold text-green-600'>
												$
												{calculation.dailyRevenue.toFixed(
													2
												)}
											</div>
											<div className='text-sm text-gray-600'>
												Daily
											</div>
										</div>
										<div className='text-center p-4 bg-blue-50 rounded-lg'>
											<div className='text-2xl font-bold text-blue-600'>
												$
												{calculation.weeklyRevenue.toFixed(
													2
												)}
											</div>
											<div className='text-sm text-gray-600'>
												Weekly
											</div>
										</div>
										<div className='text-center p-4 bg-purple-50 rounded-lg'>
											<div className='text-2xl font-bold text-purple-600'>
												$
												{calculation.monthlyRevenue.toFixed(
													2
												)}
											</div>
											<div className='text-sm text-gray-600'>
												Monthly
											</div>
										</div>
										<div className='text-center p-4 bg-orange-50 rounded-lg'>
											<div className='text-2xl font-bold text-orange-600'>
												$
												{calculation.yearlyRevenue.toFixed(
													2
												)}
											</div>
											<div className='text-sm text-gray-600'>
												Yearly
											</div>
										</div>
									</div>

									{/* Metrics */}
									<div className='space-y-3'>
										<div className='flex justify-between items-center'>
											<Label className='text-sm font-medium text-gray-500'>
												Daily Impressions
											</Label>
											<span className='font-semibold'>
												{calculation.impressions.toLocaleString()}
											</span>
										</div>
										<div className='flex justify-between items-center'>
											<Label className='text-sm font-medium text-gray-500'>
												Daily Clicks
											</Label>
											<span className='font-semibold'>
												{calculation.clicks.toFixed(0)}
											</span>
										</div>
										<div className='flex justify-between items-center'>
											<Label className='text-sm font-medium text-gray-500'>
												CTR
											</Label>
											<span className='font-semibold'>
												{calculation.ctr.toFixed(2)}%
											</span>
										</div>
										<div className='flex justify-between items-center'>
											<Label className='text-sm font-medium text-gray-500'>
												CPC
											</Label>
											<span className='font-semibold'>
												${calculation.cpc.toFixed(2)}
											</span>
										</div>
										<div className='flex justify-between items-center'>
											<Label className='text-sm font-medium text-gray-500'>
												RPM
											</Label>
											<span className='font-semibold'>
												${calculation.rpm.toFixed(2)}
											</span>
										</div>
									</div>
								</div>
							) : (
								<div className='text-center py-8 text-gray-500'>
									<BarChart3 className='w-12 h-12 mx-auto mb-4 opacity-50' />
									<p>
										Enter your website metrics to see
										revenue estimates
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Tips and Information */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>
								Tips to Increase AdSense Revenue
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className='space-y-2 text-sm text-gray-600'>
								<li>
									• <strong>Optimize ad placement:</strong>{" "}
									Place ads above the fold and within content
								</li>
								<li>
									• <strong>Improve CTR:</strong> Use
									responsive ad units and experiment with
									sizes
								</li>
								<li>
									•{" "}
									<strong>
										Target high-paying keywords:
									</strong>{" "}
									Focus on finance, insurance, and business
									topics
								</li>
								<li>
									• <strong>Increase traffic:</strong> Create
									quality content and improve SEO
								</li>
								<li>
									• <strong>Geographic targeting:</strong>{" "}
									Target traffic from high-paying countries
								</li>
								<li>
									• <strong>Page speed:</strong> Faster
									loading pages improve user experience and ad
									performance
								</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Understanding AdSense Metrics</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className='space-y-2 text-sm text-gray-600'>
								<li>
									• <strong>CTR:</strong> Percentage of
									visitors who click on ads (typical: 1-3%)
								</li>
								<li>
									• <strong>CPC:</strong> Amount earned per
									click (varies by niche and location)
								</li>
								<li>
									• <strong>RPM:</strong> Revenue per 1000
									impressions
								</li>
								<li>
									• <strong>Impressions:</strong> Number of
									times ads are displayed
								</li>
								<li>
									• <strong>Fill Rate:</strong> Percentage of
									ad requests that show ads
								</li>
								<li>
									• <strong>Viewability:</strong> Percentage
									of ads that are actually seen by users
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>

				{/* Disclaimer */}
				<Card className='mt-6'>
					<CardHeader>
						<CardTitle>Important Disclaimer</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-sm text-gray-600'>
							These calculations are estimates based on industry
							averages and your inputs. Actual AdSense revenue can
							vary significantly based on many factors including
							content quality, user engagement, seasonal trends,
							ad inventory, and Google&apos;s algorithms. This
							tool is for educational purposes only and should not
							be considered as guaranteed earnings projections.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
