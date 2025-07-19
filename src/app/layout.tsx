import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "ToolBox Pro - 60+ Free Online Tools",
	description:
		"Boost your productivity with our collection of 60+ powerful, free online tools. From SEO optimization to development utilities, password generators to calculators - all in one place.",
	keywords:
		"online tools, free tools, SEO tools, calculators, generators, text tools, image tools, developer tools, password generator, QR code generator",
	authors: [{ name: "ToolBox Pro Team" }],
	creator: "ToolBox Pro",
	publisher: "ToolBox Pro",
	robots: "index, follow",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://toolboxpro.com",
		title: "ToolBox Pro - 50+ Free Online Tools",
		description:
			"Boost your productivity with our collection of powerful, free online tools.",
		siteName: "ToolBox Pro",
	},
	twitter: {
		card: "summary_large_image",
		title: "ToolBox Pro - 50+ Free Online Tools",
		description:
			"Boost your productivity with our collection of powerful, free online tools.",
		creator: "@toolboxpro",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Header />
				{children}
				<Toaster />
				<Footer />
			</body>
		</html>
	);
}
