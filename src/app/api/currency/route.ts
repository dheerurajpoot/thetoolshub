import { NextRequest, NextResponse } from "next/server";

interface ExchangeRateApiResponse {
	rates: Record<string, number>;
	base: string;
	date: string;
}
interface OpenErApiResponse {
	rates: Record<string, number>;
	base_code: string;
	time_last_update_utc: string;
}
interface FrankfurterApiResponse {
	rates: Record<string, number>;
	base: string;
	date: string;
}

type ExchangeData = {
	rate: number;
	base: string;
	target: string;
	date: string;
	lastUpdated: string;
};

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const from = searchParams.get("from");
	const to = searchParams.get("to");
	const amount = searchParams.get("amount");

	if (!from || !to) {
		return NextResponse.json(
			{ error: "From and to currency parameters are required" },
			{ status: 400 }
		);
	}

	try {
		// Try multiple free currency APIs for better reliability
		const apis = [
			{
				url: `https://api.exchangerate-api.com/v4/latest/${from}`,
				name: "exchangerate-api.com",
				timeout: 5000,
			},
			{
				url: `https://open.er-api.com/v6/latest/${from}`,
				name: "open.er-api.com",
				timeout: 5000,
			},
			{
				url: `https://api.frankfurter.app/latest?from=${from}&to=${to}`,
				name: "frankfurter.app",
				timeout: 5000,
			},
		];

		let exchangeData: ExchangeData | null = null;
		let lastError: string = "";

		for (const api of apis) {
			try {
				const response = await fetch(api.url, {
					method: "GET",
					headers: {
						Accept: "application/json",
						"User-Agent":
							"Mozilla/5.0 (compatible; CurrencyConverter/1.0)",
					},
					signal: AbortSignal.timeout(api.timeout),
				});

				if (!response.ok) {
					if (response.status === 429) {
						console.warn(
							`${api.name} rate limited, trying next API`
						);
						continue;
					}
					throw new Error(
						`HTTP ${response.status}: ${response.statusText}`
					);
				}

				if (api.name === "exchangerate-api.com") {
					const data: ExchangeRateApiResponse = await response.json();
					if (data.rates && data.rates[to]) {
						exchangeData = {
							rate: data.rates[to],
							base: data.base,
							target: to,
							date: data.date,
							lastUpdated: new Date().toISOString(),
						};
						break;
					}
				} else if (api.name === "open.er-api.com") {
					const data: OpenErApiResponse = await response.json();
					if (data.rates && data.rates[to]) {
						exchangeData = {
							rate: data.rates[to],
							base: data.base_code,
							target: to,
							date: data.time_last_update_utc,
							lastUpdated: new Date().toISOString(),
						};
						break;
					}
				} else if (api.name === "frankfurter.app") {
					const data: FrankfurterApiResponse = await response.json();
					if (data.rates && data.rates[to]) {
						exchangeData = {
							rate: data.rates[to],
							base: data.base,
							target: to,
							date: data.date,
							lastUpdated: new Date().toISOString(),
						};
						break;
					}
				}
			} catch (err) {
				lastError =
					err instanceof Error ? err.message : "Unknown error";
				console.warn(`${api.name} failed:`, lastError);
				continue;
			}
		}

		if (!exchangeData) {
			return NextResponse.json(
				{
					error: "Failed to fetch exchange rate from all available APIs",
				},
				{ status: 500 }
			);
		}

		// Calculate converted amount if provided
		let convertedAmount: number | null = null;
		if (amount) {
			const amountNum = parseFloat(amount);
			if (!isNaN(amountNum)) {
				convertedAmount = amountNum * exchangeData.rate;
			}
		}

		const result = {
			from: exchangeData.base,
			to: exchangeData.target,
			rate: exchangeData.rate,
			amount: amount ? parseFloat(amount) : null,
			convertedAmount: convertedAmount,
			date: exchangeData.date,
			lastUpdated: exchangeData.lastUpdated,
		};

		return NextResponse.json(result);
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "Failed to retrieve exchange rate";
		console.error("Currency conversion error:", errorMessage);
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
