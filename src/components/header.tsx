"use client";
import { siteName } from "@/lib/constant";
import { Zap, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const navLinks = [
	{ href: "/about", label: "About" },
	{ href: "/disclaimer", label: "Disclaimer" },
	{ href: "/privacy-policy", label: "Privacy Policy" },
	{ href: "/terms", label: "Terms of Service" },
];

const Header = () => {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<header className='border-b bg-white sticky top-0 z-50 shadow-sm'>
			<div className='container mx-auto px-4 py-4'>
				<div className='flex items-center justify-between'>
					<Link href='/' className='flex items-center space-x-2'>
						<div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
							<Zap className='w-5 h-5 text-white' />
						</div>
						<span className='text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent'>
							{siteName}
						</span>
					</Link>
					{/* Desktop Nav */}
					<nav className='hidden md:flex items-center space-x-6'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className='text-gray-600 hover:text-blue-600 transition-colors font-medium'>
								{link.label}
							</Link>
						))}
					</nav>
					{/* Mobile Hamburger */}
					<button
						className='md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
						aria-label={mobileOpen ? "Close menu" : "Open menu"}
						onClick={() => setMobileOpen((open) => !open)}>
						{mobileOpen ? (
							<X className='w-6 h-6' />
						) : (
							<Menu className='w-6 h-6' />
						)}
					</button>
				</div>
			</div>
			{/* Mobile Menu */}
			<div
				className={`md:hidden fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-300 ${
					mobileOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				aria-hidden={!mobileOpen}
				onClick={() => setMobileOpen(false)}
			/>
			<nav
				className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
					mobileOpen ? "translate-x-0" : "translate-x-full"
				}`}
				aria-label='Mobile menu'>
				<div className='flex flex-col p-6 space-y-4'>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className='text-gray-700 hover:text-blue-600 text-lg font-medium transition-colors'
							onClick={() => setMobileOpen(false)}>
							{link.label}
						</Link>
					))}
				</div>
			</nav>
		</header>
	);
};

export default Header;
