import { NextRequest, NextResponse } from "next/server";

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
			} catch (ipErr) {
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
				} catch (altErr) {
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

		let ipInfo: any = null;
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

				const data = await response.json();

				// Check if we got valid data
				if (data.ip || data.query || data.ipAddress) {
					// Normalize data from different APIs
					ipInfo = {
						ip: data.ip || data.query || data.ipAddress || clientIP,
						type:
							data.type ||
							data.version ||
							(data.ip?.includes(":") ? "IPv6" : "IPv4"),
						country:
							data.country_name ||
							data.country ||
							data.countryName,
						region:
							data.region_name || data.region || data.regionName,
						city: data.city || data.cityName,
						latitude: data.latitude || data.lat,
						longitude: data.longitude || data.lon || data.lng,
						timezone: data.timezone || data.time_zone,
						isp: data.org || data.isp || data.ispName,
						organization:
							data.org ||
							data.organization ||
							data.isp ||
							"Unknown",
						asn: data.asn || data.as,
						continent:
							data.continent_name ||
							data.continent ||
							data.continentName,
						countryCode:
							data.country_code ||
							data.countryCode ||
							data.country,
						regionCode:
							data.region_code || data.regionCode || data.region,
						zip: data.zip || data.postal || data.postalCode,
						connection: {
							type:
								data.connection?.type ||
								data.connection_type ||
								"Unknown",
							isp:
								data.org ||
								data.isp ||
								data.ispName ||
								"Unknown",
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
