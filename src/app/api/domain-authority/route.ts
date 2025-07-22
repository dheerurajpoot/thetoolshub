import { NextRequest, NextResponse } from "next/server";

const OPENPAGERANK_API_KEY = "wk0c8000oo08o0c0ggcwo80oow0sgcgg8s8gc8gc";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const domain = searchParams.get("domain");

	if (!domain) {
		return NextResponse.json(
			{ error: "Missing domain parameter" },
			{ status: 400 }
		);
	}

	if (!OPENPAGERANK_API_KEY) {
		return NextResponse.json(
			{ error: "Missing Open PageRank API key" },
			{ status: 500 }
		);
	}

	try {
		const response = await fetch(
			`https://openpagerank.com/api/v1.0/getPageRank?domains%5B0%5D=${encodeURIComponent(
				domain
			)}`,
			{
				headers: {
					"API-OPR": OPENPAGERANK_API_KEY,
				},
			}
		);
		if (!response.ok) {
			const err = await response.text();
			return NextResponse.json({ error: err }, { status: 500 });
		}
		const data = await response.json();
		console.log("data", data);
		// The API returns an array of results
		const result = data.response?.[0];
		if (!result) {
			return NextResponse.json(
				{ error: "No data found for domain" },
				{ status: 404 }
			);
		}
		return NextResponse.json({
			domain: result.domain,
			page_rank_integer: result.page_rank_integer,
			page_rank_decimal: result.page_rank_decimal,
			rank: result.rank,
			// Add more fields as needed from the API response
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch domain authority" },
			{ status: 500 }
		);
	}
}
