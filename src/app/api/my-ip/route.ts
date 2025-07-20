import { NextRequest, NextResponse } from "next/server";

interface IPApiResponse {
	ip?: string;
	query?: string;
	type?: string;
	version?: string;
	country_name?: string;
	country?: string;
	region_name?: string;
	region?: string;
	city?: string;
	latitude?: number;
	longitude?: number;
	org?: string;
	isp?: string;
	asn?: string;
	timezone?: string;
	continent_name?: string;
	continent?: string;
	country_code?: string;
	region_code?: string;
	zip?: string;
	connection?: { type?: string };
	[key: string]: unknown;
}

interface IPInfo {
	ip: string;
	type: string;
	country: string;
	region: string;
	city: string;
	latitude: number;
	longitude: number;
	timezone: string;
	isp: string;
	organization: string;
	asn: string;
	continent?: string;
	countryCode?: string;
	regionCode?: string;
	zip?: string;
	connection?: {
		type: string;
		isp: string;
	};
}

export async function GET(request: NextRequest) {
	try {
		// Get the client's IP address with better detection
		const forwarded = request.headers.get("x-forwarded-for");
		const realIP = request.headers.get("x-real-ip");
		const cfConnectingIP = request.headers.get("cf-connecting-ip");
		const xClientIP = request.headers.get("x-client-ip");

		let clientIP =
			forwarded?.split(",")[0] ||
			realIP ||
			cfConnectingIP ||
			xClientIP ||
			"127.0.0.1";

		// Clean the IP address
		clientIP = clientIP.trim();

		// If we're getting localhost/loopback addresses, try to get real IP
		const isLocalhost =
			clientIP === "127.0.0.1" ||
			clientIP === "::1" ||
			clientIP === "localhost" ||
			clientIP.startsWith("192.168.") ||
			clientIP.startsWith("10.") ||
			clientIP.startsWith("172.");

		if (isLocalhost) {
			console.log(
				"Detected localhost IP, attempting to get real public IP"
			);

			// Try to get real IP from external service
			try {
				const ipResponse = await fetch(
					"https://api.ipify.org?format=json",
					{
						signal: AbortSignal.timeout(5000),
					}
				);

				if (ipResponse.ok) {
					const ipData = await ipResponse.json();
					if (ipData.ip && !isLocalhost) {
						clientIP = ipData.ip;
						console.log(`Got real IP from ipify: ${clientIP}`);
					}
				}
			} catch {
				console.warn(
					"Failed to get real IP from ipify, trying alternative"
				);

				// Try alternative IP detection service
				try {
					const altResponse = await fetch("https://httpbin.org/ip", {
						signal: AbortSignal.timeout(5000),
					});

					if (altResponse.ok) {
						const altData = await altResponse.json();
						if (altData.origin && !isLocalhost) {
							clientIP = altData.origin.split(",")[0].trim();
							console.log(
								`Got real IP from httpbin: ${clientIP}`
							);
						}
					}
				} catch {
					console.warn(
						"Failed to get real IP from alternative service"
					);
				}
			}
		}

		console.log(`Using IP address: ${clientIP}`);

		// Use multiple IP geolocation APIs with different rate limits
		const ipApis = [
			{
				url: `https://ipapi.co/${clientIP}/json/`,
				name: "ipapi.co",
				timeout: 3000,
			},
			{
				url: `https://api.ipapi.com/${clientIP}?access_key=2119b2e037fe5f867dbeef865e4830fb`,
				name: "ipapi.com",
				timeout: 5000,
			},
			{
				url: `https://ipinfo.io/${clientIP}/json`,
				name: "ipinfo.io",
				timeout: 3000,
			},
		];

		let ipInfo: IPInfo | null = null;
		let lastError: string = "";

		for (const api of ipApis) {
			try {
				const response = await fetch(api.url, {
					method: "GET",
					headers: {
						Accept: "application/json",
						"User-Agent": "Mozilla/5.0 (compatible; IPLookup/1.0)",
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

				const data: IPApiResponse = await response.json();

				// Check if we got valid data
				if (data.ip || data.query || data.ipAddress) {
					// Normalize data from different APIs
					const cityName =
						typeof data.cityName === "string"
							? data.cityName
							: undefined;
					const lat =
						typeof data.lat === "number" ? data.lat : undefined;
					const lon =
						typeof data.lon === "number" ? data.lon : undefined;
					const lng =
						typeof data.lng === "number" ? data.lng : undefined;
					const continentName =
						typeof data.continentName === "string"
							? data.continentName
							: undefined;
					const countryCode =
						typeof data.countryCode === "string"
							? data.countryCode
							: undefined;
					const regionCode =
						typeof data.regionCode === "string"
							? data.regionCode
							: undefined;
					const postal =
						typeof data.postal === "string"
							? data.postal
							: undefined;
					const postalCode =
						typeof data.postalCode === "string"
							? data.postalCode
							: undefined;
					const connection_type =
						typeof data.connection_type === "string"
							? data.connection_type
							: undefined;
					const ispName =
						typeof data.ispName === "string"
							? data.ispName
							: undefined;
					const organization =
						typeof data.organization === "string"
							? data.organization
							: undefined;
					const as =
						typeof data.as === "string" ? data.as : undefined;

					ipInfo = {
						ip:
							typeof data.ip === "string"
								? data.ip
								: typeof data.query === "string"
								? data.query
								: typeof data.ipAddress === "string"
								? data.ipAddress
								: clientIP,
						type:
							typeof data.type === "string"
								? data.type
								: typeof data.version === "string"
								? data.version
								: typeof data.ip === "string" &&
								  data.ip.includes(":")
								? "IPv6"
								: "IPv4",
						country:
							typeof data.country_name === "string"
								? data.country_name
								: typeof data.country === "string"
								? data.country
								: "Unknown",
						region:
							typeof data.region_name === "string"
								? data.region_name
								: typeof data.region === "string"
								? data.region
								: "Unknown",
						city:
							typeof data.city === "string"
								? data.city
								: cityName || "Unknown",
						latitude:
							typeof data.latitude === "number"
								? data.latitude
								: lat !== undefined
								? lat
								: 0,
						longitude:
							typeof data.longitude === "number"
								? data.longitude
								: lon !== undefined
								? lon
								: lng !== undefined
								? lng
								: 0,
						timezone:
							typeof data.timezone === "string"
								? data.timezone
								: typeof data.time_zone === "string"
								? data.time_zone
								: "UTC",
						isp:
							typeof data.org === "string"
								? data.org
								: typeof data.isp === "string"
								? data.isp
								: ispName || "Unknown",
						organization:
							typeof data.org === "string"
								? data.org
								: organization ||
								  (typeof data.isp === "string"
										? data.isp
										: "Unknown"),
						asn:
							typeof data.asn === "string"
								? data.asn
								: as || "Unknown",
						continent:
							typeof data.continent_name === "string"
								? data.continent_name
								: typeof data.continent === "string"
								? data.continent
								: continentName || undefined,
						countryCode:
							typeof data.country_code === "string"
								? data.country_code
								: countryCode ||
								  (typeof data.country === "string"
										? data.country
										: undefined),
						regionCode:
							typeof data.region_code === "string"
								? data.region_code
								: regionCode ||
								  (typeof data.region === "string"
										? data.region
										: undefined),
						zip:
							typeof data.zip === "string"
								? data.zip
								: postal || postalCode || undefined,
						connection: {
							type:
								data.connection &&
								typeof data.connection === "object" &&
								typeof data.connection.type === "string"
									? data.connection.type
									: connection_type || "Unknown",
							isp:
								typeof data.org === "string"
									? data.org
									: typeof data.isp === "string"
									? data.isp
									: ispName || "Unknown",
						},
					};

					// Validate that we have at least basic location data
					if (ipInfo.country && ipInfo.country !== "Unknown") {
						console.log(`Successfully got data from ${api.name}`);
						break;
					}
				} else if (data.error) {
					console.warn(`${api.name} returned error:`, data.error);
					continue;
				}
			} catch (err) {
				lastError =
					err instanceof Error ? err.message : "Unknown error";
				console.warn(`${api.name} failed:`, lastError);
				continue;
			}
		}

		// If no IP info from APIs, create basic info with fallback
		if (!ipInfo || !ipInfo.country || ipInfo.country === "Unknown") {
			console.log("Using fallback IP information");
			ipInfo = {
				ip: clientIP,
				type: clientIP.includes(":") ? "IPv6" : "IPv4",
				country: "Unknown",
				region: "Unknown",
				city: "Unknown",
				latitude: 0,
				longitude: 0,
				timezone: "UTC",
				isp: "Unknown",
				organization: "Unknown",
				asn: "Unknown",
				continent: "Unknown",
				countryCode: "Unknown",
				regionCode: "Unknown",
				zip: "Unknown",
				connection: {
					type: "Unknown",
					isp: "Unknown",
				},
			};
		}

		// Check for proxy/VPN indicators
		const proxyIndicators = {
			proxy: false,
			vpn: false,
			tor: false,
			hosting: false,
		};

		// Simple heuristic checks
		const hostingKeywords = [
			"amazon",
			"aws",
			"google",
			"cloud",
			"digitalocean",
			"linode",
			"vultr",
			"hetzner",
			"ovh",
			"rackspace",
			"azure",
			"heroku",
			"cloudflare",
			"fastly",
			"akamai",
			"cdn",
			"hosting",
			"server",
		];

		const ispLower = (ipInfo.isp || "").toLowerCase();
		const orgLower = (ipInfo.organization || "").toLowerCase();

		proxyIndicators.hosting = hostingKeywords.some(
			(keyword) =>
				ispLower.includes(keyword) || orgLower.includes(keyword)
		);

		// Check for common VPN/Proxy ASNs
		const vpnAsns = [
			"AS16276",
			"AS14061",
			"AS16509",
			"AS14618",
			"AS20473",
			"AS60068",
			"AS31133",
			"AS60781",
			"AS19994",
			"AS36351",
			"AS45102",
			"AS45103",
			"AS45104",
			"AS45105",
			"AS45106",
		];

		if (vpnAsns.includes(ipInfo.asn)) {
			proxyIndicators.vpn = true;
		}

		// Check for localhost or private IP ranges
		if (
			clientIP === "127.0.0.1" ||
			clientIP === "::1" ||
			clientIP.startsWith("192.168.") ||
			clientIP.startsWith("10.")
		) {
			proxyIndicators.proxy = true;
		}

		const result = {
			ip: ipInfo.ip,
			type: ipInfo.type,
			location: {
				country: ipInfo.country || "Unknown",
				region: ipInfo.region || "Unknown",
				city: ipInfo.city || "Unknown",
				latitude: ipInfo.latitude || 0,
				longitude: ipInfo.longitude || 0,
				timezone: ipInfo.timezone || "UTC",
			},
			isp: ipInfo.isp || "Unknown",
			organization: ipInfo.organization || "Unknown",
			asn: ipInfo.asn || "Unknown",
			continent: ipInfo.continent || "Unknown",
			countryCode: ipInfo.countryCode || "Unknown",
			regionCode: ipInfo.regionCode || "Unknown",
			zip: ipInfo.zip || "Unknown",
			connection: ipInfo.connection,
			proxy: proxyIndicators.proxy,
			vpn: proxyIndicators.vpn,
			tor: proxyIndicators.tor,
			hosting: proxyIndicators.hosting,
		};

		return NextResponse.json(result);
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "Failed to retrieve IP information";
		console.error("IP lookup error:", errorMessage);
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
