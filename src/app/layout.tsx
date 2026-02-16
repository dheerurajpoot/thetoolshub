import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "sonner";
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/constant";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: SITE_TITLE,
	description: SITE_DESCRIPTION,
	keywords:
		"online tools, free tools, SEO tools, calculators, generators, text tools, image tools, developer tools, password generator, QR code generator, smmgarden, smmgarden.com, smmgarden.in",
	authors: [{ name: SITE_AUTHOR }],
	creator: SITE_AUTHOR,
	publisher: SITE_AUTHOR,
	robots: "index, follow",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: SITE_URL,
		title: SITE_TITLE,
		description:
			"Boost your productivity with our collection of powerful, free online tools.",
		siteName: SITE_NAME,
	},
	twitter: {
		card: "summary_large_image",
		title: SITE_TITLE,
		description:
			"Boost your productivity with our collection of powerful, free online tools.",
		creator: `@${SITE_AUTHOR}`,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head suppressHydrationWarning>

				{/* google analytics code */}
				<script
					async
					src='https://www.googletagmanager.com/gtag/js?id=XXXXXXXXXXXX'
				/>
				<script
					dangerouslySetInnerHTML={{
						__html: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'XXXXXXXXXXXX');
					`,
					}}
				/>

				{/* Google AdSense Code */}
				<script
					async
					src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX'
					crossOrigin='anonymous'
				/>
			</head>
			<body className={inter.className} suppressHydrationWarning>
				<Header />
				{children}
				<Toaster />
				<Footer />
			</body>
		</html>
	);
}
