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
import {
	DollarSign,
	ArrowUpDown,
	TrendingUp,
	Loader2,
	AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface ExchangeRate {
	from: string;
	to: string;
	rate: number;
	amount: number | null;
	convertedAmount: number | null;
	date: string;
	lastUpdated: string;
	error?: string;
}

export default function CurrencyConverter() {
	const [amount, setAmount] = useState("1");
	const [fromCurrency, setFromCurrency] = useState("USD");
	const [toCurrency, setToCurrency] = useState("EUR");
	const [result, setResult] = useState("");
	const [exchangeRate, setExchangeRate] = useState<number | null>(null);
	const [lastUpdated, setLastUpdated] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

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
		BRL: { name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
		MXN: { name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
		KRW: { name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
		SGD: { name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
		HKD: { name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
		NZD: { name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
		SEK: { name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
		NOK: { name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
		DKK: { name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
		PLN: { name: "Polish Złoty", symbol: "zł", flag: "🇵🇱" },
		CZK: { name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿" },
		HUF: { name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
		RUB: { name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
		TRY: { name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
		ZAR: { name: "South African Rand", symbol: "R", flag: "🇿🇦" },
	};

	const convert = async () => {
		const amountNum = Number.parseFloat(amount);
		if (isNaN(amountNum) || !fromCurrency || !toCurrency) return;

		if (fromCurrency === toCurrency) {
			setResult(amountNum.toFixed(2));
			setExchangeRate(1);
			setLastUpdated(new Date().toLocaleString());
			setError("");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response = await fetch(
				`/api/currency?from=${fromCurrency}&to=${toCurrency}&amount=${amountNum}`,
				{
					method: "GET",
					headers: {
						Accept: "application/json",
					},
					signal: AbortSignal.timeout(15000),
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData.error ||
						`HTTP ${response.status}: ${response.statusText}`
				);
			}

			const data: ExchangeRate = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			if (data.convertedAmount !== null) {
				setResult(data.convertedAmount.toFixed(2));
				setExchangeRate(data.rate);
				setLastUpdated(new Date(data.lastUpdated).toLocaleString());
				toast.success("Currency converted!", {
					description: `Live rate: 1 ${fromCurrency} = ${data.rate.toFixed(
						4
					)} ${toCurrency}`,
				});
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to convert currency. Please try again.";
			setError(errorMessage);
			toast.error("Conversion Error", {
				description: errorMessage,
			});
		} finally {
			setLoading(false);
		}
	};

	const swapCurrencies = () => {
		const temp = fromCurrency;
		setFromCurrency(toCurrency);
		setToCurrency(temp);
		if (result && amount) {
			setAmount(result);
			// Trigger conversion after state updates
			setTimeout(() => convert(), 100);
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
						Convert between different world currencies with live
						rates
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Converter */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Currency Conversion</CardTitle>
							<CardDescription>
								Convert between world currencies with live
								exchange rates
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
										onClick={swapCurrencies}
										disabled={loading}>
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

							{loading && (
								<div className='bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg'>
									<div className='text-center'>
										<Loader2 className='w-8 h-8 mx-auto mb-2 animate-spin text-blue-500' />
										<p className='text-gray-600'>
											Fetching live exchange rates...
										</p>
									</div>
								</div>
							)}

							{error && (
								<div className='bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg'>
									<div className='text-center'>
										<AlertCircle className='w-8 h-8 mx-auto mb-2 text-red-500' />
										<p className='text-red-600 mb-2'>
											Conversion Error
										</p>
										<p className='text-sm text-red-500'>
											{error}
										</p>
									</div>
								</div>
							)}

							{result && !loading && !error && (
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
												Live Rate: 1 {fromCurrency} ={" "}
												{exchangeRate.toFixed(4)}{" "}
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
							{popularPairs.map((pair, index) => (
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
											Live Rate
										</p>
										<p className='text-xs text-gray-500'>
											Click to convert
										</p>
									</div>
								</div>
							))}

							<div className='bg-green-50 p-4 rounded-lg border border-green-200'>
								<h3 className='font-semibold text-green-800 mb-2'>
									✅ Live Rates
								</h3>
								<p className='text-sm text-green-700'>
									All exchange rates are fetched in real-time
									from reliable financial APIs. Rates are
									updated throughout the day as markets
									fluctuate.
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
									• <strong>Live rates:</strong> Rates are
									updated in real-time from financial markets
								</li>
								<li>
									• <strong>Market hours:</strong> Rates are
									most active during market trading hours
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
									• <strong>Volatility:</strong> Some
									currencies are more volatile than others
								</li>
								<li>
									• <strong>Economic factors:</strong> Rates
									affected by economic news and events
								</li>
								<li>
									• <strong>Best practices:</strong> Monitor
									rates before making large conversions
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
