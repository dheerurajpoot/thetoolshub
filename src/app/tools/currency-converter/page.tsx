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
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowUpDown, TrendingUp } from "lucide-react";

export default function CurrencyConverter() {
	const [amount, setAmount] = useState("1");
	const [fromCurrency, setFromCurrency] = useState("USD");
	const [toCurrency, setToCurrency] = useState("EUR");
	const [result, setResult] = useState("");
	const [exchangeRate, setExchangeRate] = useState<number | null>(null);
	const [lastUpdated, setLastUpdated] = useState("");

	// Mock exchange rates (in a real app, you'd fetch from an API)
	const exchangeRates = {
		USD: {
			EUR: 0.85,
			GBP: 0.73,
			JPY: 110.0,
			CAD: 1.25,
			AUD: 1.35,
			CHF: 0.92,
			CNY: 6.45,
			INR: 74.5,
		},
		EUR: {
			USD: 1.18,
			GBP: 0.86,
			JPY: 129.5,
			CAD: 1.47,
			AUD: 1.59,
			CHF: 1.08,
			CNY: 7.6,
			INR: 87.8,
		},
		GBP: {
			USD: 1.37,
			EUR: 1.16,
			JPY: 150.8,
			CAD: 1.71,
			AUD: 1.85,
			CHF: 1.26,
			CNY: 8.84,
			INR: 102.1,
		},
		JPY: {
			USD: 0.0091,
			EUR: 0.0077,
			GBP: 0.0066,
			CAD: 0.0114,
			AUD: 0.0123,
			CHF: 0.0084,
			CNY: 0.0587,
			INR: 0.677,
		},
		CAD: {
			USD: 0.8,
			EUR: 0.68,
			GBP: 0.58,
			JPY: 88.0,
			AUD: 1.08,
			CHF: 0.74,
			CNY: 5.16,
			INR: 59.6,
		},
		AUD: {
			USD: 0.74,
			EUR: 0.63,
			GBP: 0.54,
			JPY: 81.5,
			CAD: 0.93,
			CHF: 0.68,
			CNY: 4.78,
			INR: 55.2,
		},
		CHF: {
			USD: 1.09,
			EUR: 0.93,
			GBP: 0.79,
			JPY: 119.6,
			CAD: 1.36,
			AUD: 1.47,
			CNY: 7.02,
			INR: 81.0,
		},
		CNY: {
			USD: 0.155,
			EUR: 0.132,
			GBP: 0.113,
			JPY: 17.04,
			CAD: 0.194,
			AUD: 0.209,
			CHF: 0.142,
			INR: 11.54,
		},
		INR: {
			USD: 0.0134,
			EUR: 0.0114,
			GBP: 0.0098,
			JPY: 1.477,
			CAD: 0.0168,
			AUD: 0.0181,
			CHF: 0.0123,
			CNY: 0.0867,
		},
	};

	const currencies = {
		USD: { name: "US Dollar", symbol: "$", flag: "🇺🇸" },
		EUR: { name: "Euro", symbol: "€", flag: "🇪🇺" },
		GBP: { name: "British Pound", symbol: "£", flag: "🇬🇧" },
		JPY: { name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
		CAD: { name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
		AUD: { name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
		CHF: { name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
		CNY: { name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
		INR: { name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
	};

	const convert = () => {
		const amountNum = Number.parseFloat(amount);
		if (isNaN(amountNum) || !fromCurrency || !toCurrency) return;

		if (fromCurrency === toCurrency) {
			setResult(amountNum.toFixed(2));
			setExchangeRate(1);
			return;
		}

		const rate =
			exchangeRates[fromCurrency as keyof typeof exchangeRates]?.[
				toCurrency as keyof (typeof exchangeRates)[keyof typeof exchangeRates]
			];
		if (rate) {
			const convertedAmount = amountNum * rate;
			setResult(convertedAmount.toFixed(2));
			setExchangeRate(rate);
			setLastUpdated(new Date().toLocaleString());
		}
	};

	const swapCurrencies = () => {
		const temp = fromCurrency;
		setFromCurrency(toCurrency);
		setToCurrency(temp);
		if (result && amount) {
			setAmount(result);
			convert();
		}
	};

	useEffect(() => {
		if (amount && fromCurrency && toCurrency) {
			convert();
		}
	}, [amount, fromCurrency, toCurrency]);

	const popularPairs = [
		{ from: "USD", to: "EUR" },
		{ from: "USD", to: "GBP" },
		{ from: "EUR", to: "GBP" },
		{ from: "USD", to: "JPY" },
		{ from: "GBP", to: "USD" },
		{ from: "EUR", to: "USD" },
	];

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<DollarSign className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						Currency Converter
					</h1>
					<p className='text-gray-600'>
						Convert between different world currencies
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Converter */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Currency Conversion</CardTitle>
							<CardDescription>
								Convert between world currencies
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-2'>
								<Label>Amount</Label>
								<Input
									type='number'
									placeholder='Enter amount'
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
								/>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-5 gap-4 items-end'>
								<div className='md:col-span-2 space-y-2'>
									<Label>From</Label>
									<Select
										value={fromCurrency}
										onValueChange={setFromCurrency}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(currencies).map(
												([code, currency]) => (
													<SelectItem
														key={code}
														value={code}>
														<span className='flex items-center gap-2'>
															<span>
																{currency.flag}
															</span>
															<span>{code}</span>
															<span className='text-gray-500'>
																-{" "}
																{currency.name}
															</span>
														</span>
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</div>

								<div className='flex justify-center'>
									<Button
										variant='outline'
										size='icon'
										onClick={swapCurrencies}>
										<ArrowUpDown className='w-4 h-4' />
									</Button>
								</div>

								<div className='md:col-span-2 space-y-2'>
									<Label>To</Label>
									<Select
										value={toCurrency}
										onValueChange={setToCurrency}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(currencies).map(
												([code, currency]) => (
													<SelectItem
														key={code}
														value={code}>
														<span className='flex items-center gap-2'>
															<span>
																{currency.flag}
															</span>
															<span>{code}</span>
															<span className='text-gray-500'>
																-{" "}
																{currency.name}
															</span>
														</span>
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</div>
							</div>

							{result && (
								<div className='bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg'>
									<div className='text-center'>
										<p className='text-sm text-gray-600 mb-2'>
											Converted Amount
										</p>
										<p className='text-3xl font-bold text-green-600 mb-2'>
											{
												currencies[
													toCurrency as keyof typeof currencies
												].symbol
											}
											{result}
										</p>
										<p className='text-sm text-gray-600'>
											{
												currencies[
													fromCurrency as keyof typeof currencies
												].symbol
											}
											{amount} {fromCurrency} ={" "}
											{
												currencies[
													toCurrency as keyof typeof currencies
												].symbol
											}
											{result} {toCurrency}
										</p>
										{exchangeRate && (
											<p className='text-xs text-gray-500 mt-2'>
												Exchange Rate: 1 {fromCurrency}{" "}
												= {exchangeRate.toFixed(4)}{" "}
												{toCurrency}
											</p>
										)}
									</div>
								</div>
							)}

							{lastUpdated && (
								<p className='text-xs text-gray-500 text-center'>
									Last updated: {lastUpdated}
								</p>
							)}
						</CardContent>
					</Card>

					{/* Popular Pairs */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<TrendingUp className='w-5 h-5' />
								Popular Currency Pairs
							</CardTitle>
							<CardDescription>
								Quick access to commonly traded pairs
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{popularPairs.map((pair, index) => {
								const rate =
									exchangeRates[
										pair.from as keyof typeof exchangeRates
									]?.[
										pair.to as keyof (typeof exchangeRates)[keyof typeof exchangeRates]
									];
								return (
									<div
										key={index}
										onClick={() => {
											setFromCurrency(pair.from);
											setToCurrency(pair.to);
											setAmount("1");
										}}
										className='flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors'>
										<div className='flex items-center gap-3'>
											<span className='text-lg'>
												{
													currencies[
														pair.from as keyof typeof currencies
													].flag
												}
											</span>
											<div>
												<p className='font-medium text-gray-800'>
													{pair.from} → {pair.to}
												</p>
												<p className='text-sm text-gray-600'>
													{
														currencies[
															pair.from as keyof typeof currencies
														].name
													}{" "}
													to{" "}
													{
														currencies[
															pair.to as keyof typeof currencies
														].name
													}
												</p>
											</div>
										</div>
										<div className='text-right'>
											<p className='font-bold text-blue-600'>
												{rate}
											</p>
											<p className='text-xs text-gray-500'>
												Rate
											</p>
										</div>
									</div>
								);
							})}

							<div className='bg-yellow-50 p-4 rounded-lg border border-yellow-200'>
								<h3 className='font-semibold text-yellow-800 mb-2'>
									💡 Note
								</h3>
								<p className='text-sm text-yellow-700'>
									Exchange rates are for demonstration
									purposes only. For real trading or financial
									decisions, please use live rates from a
									financial data provider.
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Currency Info */}
				<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 mt-8'>
					<CardContent className='p-6'>
						<h3 className='font-semibold text-gray-800 mb-4'>
							💱 Currency Exchange Tips:
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
							<ul className='space-y-2'>
								<li>
									• <strong>Exchange rates fluctuate:</strong>{" "}
									Rates change constantly during market hours
								</li>
								<li>
									• <strong>Best times to exchange:</strong>{" "}
									Avoid weekends and holidays
								</li>
								<li>
									• <strong>Compare rates:</strong> Different
									providers offer different rates
								</li>
								<li>
									• <strong>Consider fees:</strong> Factor in
									transaction and conversion fees
								</li>
							</ul>
							<ul className='space-y-2'>
								<li>
									• <strong>Major currencies:</strong> USD,
									EUR, GBP, JPY are most liquid
								</li>
								<li>
									• <strong>Economic factors:</strong>{" "}
									Interest rates and politics affect rates
								</li>
								<li>
									• <strong>Forward contracts:</strong> Lock
									in rates for future exchanges
								</li>
								<li>
									• <strong>Use alerts:</strong> Set rate
									alerts for favorable exchanges
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
