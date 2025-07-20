import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	let domain = searchParams.get("domain");

	if (!domain) {
		return NextResponse.json(
			{ error: "Domain parameter is required" },
			{ status: 400 }
		);
	}

	// Clean domain input
	domain = domain.toLowerCase().trim();
	domain = domain.replace(/^https?:\/\//, "");
	domain = domain.replace(/^www\./, "");
	domain = domain.split("/")[0];
	domain = domain.split("?")[0];
	domain = domain.split("#")[0];

	// Validate domain format
	const domainRegex =
		/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
	if (!domainRegex.test(domain)) {
		return NextResponse.json(
			{ error: "Invalid domain format" },
			{ status: 400 }
		);
	}

	try {
		// First, resolve domain to IP using DNS
		const dnsResponse = await fetch(
			`https://dns.google/resolve?name=${domain}&type=A`,
			{ signal: AbortSignal.timeout(5000) }
		);

		if (!dnsResponse.ok) {
			throw new Error("Failed to resolve domain");
		}

		const dnsData = await dnsResponse.json();

		if (
			dnsData.Status !== 0 ||
			!dnsData.Answer ||
			dnsData.Answer.length === 0
		) {
			throw new Error("Domain not found or not accessible");
		}

		const ipAddress = dnsData.Answer[0].data;

		// Get IP geolocation and ISP information
		const ipApis = [
			`https://api.ipapi.com/${ipAddress}?access_key=2119b2e037fe5f867dbeef865e4830fb`,
			`https://ipapi.co/${ipAddress}/json/`,
		];

		let ipInfo: any = null;
		let lastError: string = "";

		for (const apiUrl of ipApis) {
			try {
				const response = await fetch(apiUrl, {
					method: "GET",
					headers: {
						Accept: "application/json",
						"User-Agent": "Mozilla/5.0 (compatible; IPLookup/1.0)",
					},
					signal: AbortSignal.timeout(5000),
				});

				if (!response.ok) {
					throw new Error(
						`HTTP ${response.status}: ${response.statusText}`
					);
				}

				const data = await response.json();

				if (data.ip || data.query) {
					// ipapi.com format
					ipInfo = {
						ip: data.ip || data.query,
						country: data.country_name || data.country,
						region: data.region_name || data.region,
						city: data.city,
						latitude: data.latitude,
						longitude: data.longitude,
						isp: data.org || data.isp,
						asn: data.asn,
						timezone: data.timezone,
						hosting: data.org || "Unknown",
					};
					break;
				} else if (data.error) {
					continue;
				}
			} catch (err) {
				lastError =
					err instanceof Error ? err.message : "Unknown error";
				console.warn(`IP API failed:`, lastError);
				continue;
			}
		}

		// If no IP info, create basic info
		if (!ipInfo) {
			ipInfo = {
				ip: ipAddress,
				country: "Unknown",
				region: "Unknown",
				city: "Unknown",
				latitude: 0,
				longitude: 0,
				isp: "Unknown",
				asn: "Unknown",
				timezone: "UTC",
				hosting: "Unknown",
			};
		}

		// Try to get server information
		let serverType = "Unknown";
		try {
			const serverResponse = await fetch(`https://${domain}`, {
				method: "HEAD",
				signal: AbortSignal.timeout(3000),
			});

			if (serverResponse.ok) {
				const serverHeader = serverResponse.headers.get("server");
				if (serverHeader) {
					serverType = serverHeader;
				}
			}
		} catch (serverErr) {
			// Server detection failed, keep default
		}

		// Determine IP version
		const ipVersion = ipAddress.includes(":") ? "IPv6" : "IPv4";

		const result = {
			domain,
			ipAddress: ipInfo.ip,
			ipVersion,
			location: {
				country: ipInfo.country || "Unknown",
				region: ipInfo.region || "Unknown",
				city: ipInfo.city || "Unknown",
				latitude: ipInfo.latitude || 0,
				longitude: ipInfo.longitude || 0,
			},
			isp: ipInfo.isp || "Unknown",
			organization: ipInfo.hosting || "Unknown",
			asn: ipInfo.asn || "Unknown",
			timezone: ipInfo.timezone || "UTC",
			hostingProvider: ipInfo.hosting || "Unknown",
			serverType: serverType,
			dnsRecords: dnsData.Answer.map((record: any) => ({
				type: record.type,
				data: record.data,
				ttl: record.TTL,
			})),
		};

		return NextResponse.json(result);
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "Failed to retrieve IP information";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
