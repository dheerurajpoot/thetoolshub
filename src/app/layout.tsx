import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "SMM Garden - 60+ Free Online Tools",
	description:
		"Boost your productivity with our collection of 60+ powerful, free online tools. From SEO optimization to development utilities, password generators to calculators - all in one place.",
	keywords:
		"online tools, free tools, SEO tools, calculators, generators, text tools, image tools, developer tools, password generator, QR code generator, smmgarden, smmgarden.com, smmgarden.in",
	authors: [{ name: "SMM Garden Team" }],
	creator: "SMM Garden",
	publisher: "SMM Garden",
	robots: "index, follow",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://www.smmgarden.com",
		title: "SMM Garden - 60+ Free Online Tools",
		description:
			"Boost your productivity with our collection of powerful, free online tools.",
		siteName: "SMM Garden",
	},
	twitter: {
		card: "summary_large_image",
		title: "SMM Garden - 60+ Free Online Tools",
		description:
			"Boost your productivity with our collection of powerful, free online tools.",
		creator: "@smmgarden",
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
				<script
					async
					src='https://www.googletagmanager.com/gtag/js?id=AW-329773482'
				/>
				<script
					dangerouslySetInnerHTML={{
						__html: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'AW-329773482');
					`,
					}}
				/>
				<script
					async
					src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8783459202982334'
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
