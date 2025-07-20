import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	let url = searchParams.get("url");

	if (!url) {
		return NextResponse.json(
			{ error: "Missing url parameter" },
			{ status: 400 }
		);
	}

	if (!/^https?:\/\//.test(url)) {
		url = "https://" + url;
	}

	try {
		// Fetch the HTML of the target site
		const res = await fetch(url, {
			headers: { "User-Agent": "Mozilla/5.0 (WordPressDetector)" },
			next: { revalidate: 60 },
		});
		if (!res.ok) {
			return NextResponse.json(
				{ error: `Failed to fetch site: ${res.status}` },
				{ status: 500 }
			);
		}
		const html = await res.text();

		// Detect WordPress markers
		const isWordPress =
			/\/wp-content\//.test(html) ||
			/\/wp-includes\//.test(html) ||
			/generator\s*content=["']WordPress/i.test(html) ||
			/<meta[^>]+name=["']generator["'][^>]+WordPress/i.test(html);

		let version = "";
		// Try to extract version from meta tag
		const metaMatch = html.match(
			/<meta[^>]+name=["']generator["'][^>]+content=["']WordPress\s*([\d.]+)["']/i
		);
		if (metaMatch) {
			version = metaMatch[1];
		}

		// Try to fetch /readme.html for version
		if (!version) {
			try {
				const readmeRes = await fetch(
					url.replace(/\/$/, "") + "/readme.html",
					{
						headers: {
							"User-Agent": "Mozilla/5.0 (WordPressDetector)",
						},
						next: { revalidate: 60 },
					}
				);
				if (readmeRes.ok) {
					const readme = await readmeRes.text();
					const vMatch = readme.match(/Version\s*([\d.]+)/i);
					if (vMatch) version = vMatch[1];
				}
			} catch {}
		}

		// Try to fetch /wp-json/ for version
		if (!version) {
			try {
				const apiRes = await fetch(
					url.replace(/\/$/, "") + "/wp-json/",
					{
						headers: {
							"User-Agent": "Mozilla/5.0 (WordPressDetector)",
						},
						next: { revalidate: 60 },
					}
				);
				if (apiRes.ok) {
					const json = await apiRes.json();
					if (
						json &&
						json?.generator &&
						typeof json.generator === "string"
					) {
						const vMatch =
							json.generator.match(/WordPress\s*([\d.]+)/i);
						if (vMatch) version = vMatch[1];
					}
				}
			} catch {}
		}

		// Detect theme from HTML
		const theme = {
			name: "",
			version: "",
			author: "",
			description: "",
			url: "",
		};
		const themeMatch = html.match(/\/wp-content\/themes\/([a-zA-Z0-9_-]+)/);
		if (themeMatch) {
			theme.name = themeMatch[1];
			theme.url =
				url.replace(/\/$/, "") + `/wp-content/themes/${theme.name}/`;
		}

		// Try to fetch style.css for theme details
		if (theme.name) {
			try {
				const styleRes = await fetch(theme.url + "style.css", {
					headers: {
						"User-Agent": "Mozilla/5.0 (WordPressDetector)",
					},
					next: { revalidate: 60 },
				});
				if (styleRes.ok) {
					const style = await styleRes.text();
					const nameMatch = style.match(/Theme Name:\s*(.+)/i);
					const authorMatch = style.match(/Author:\s*(.+)/i);
					const descMatch = style.match(/Description:\s*(.+)/i);
					const verMatch = style.match(/Version:\s*([\d.]+)/i);
					if (nameMatch) theme.name = nameMatch[1].trim();
					if (authorMatch) theme.author = authorMatch[1].trim();
					if (descMatch) theme.description = descMatch[1].trim();
					if (verMatch) theme.version = verMatch[1].trim();
				}
			} catch {}
		}

		// Detect plugins from HTML (best effort)
		const pluginRegex = /\/wp-content\/plugins\/([a-zA-Z0-9_-]+)/g;
		const pluginsSet = new Set<string>();
		let match;
		while ((match = pluginRegex.exec(html))) {
			pluginsSet.add(match[1]);
		}
		const plugins = Array.from(pluginsSet).map((name) => ({
			name,
			version: "",
			description: "",
			active: true,
		}));

		// Detect server from headers
		let server = "";
		if (res.headers.get("server")) server = res.headers.get("server")!;

		return NextResponse.json({
			url,
			isWordPress,
			version,
			theme,
			plugins,
			server,
			lastUpdated: new Date().toISOString().split("T")[0],
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch or parse site." },
			{ status: 500 }
		);
	}
}
