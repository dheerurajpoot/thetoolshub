"use client";
import { SITE_NAME } from "@/lib/constant";
import { Zap, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const navLinks = [
	{ href: "/about", label: "About" },
	{ href: "/contact", label: "Contact" },
	{ href: "/disclaimer", label: "Disclaimer" },
	{ href: "/privacy", label: "Privacy Policy" },
	{ href: "/terms", label: "Terms" },
];

const Header = () => {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<header className='border-b bg-white sticky top-0 z-50 shadow-sm'>
			<div className='container mx-auto px-4 py-4'>
				<div className='flex items-center justify-between'>
					<Link href='/' className='flex items-center space-x-2'>
						<div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg'>
							<Zap className='w-6 h-6 text-white' />
						</div>
						<span className='text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent'>
							{SITE_NAME}
						</span>
					</Link>
					{/* Desktop Nav */}
					<nav className='hidden md:flex items-center space-x-1'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className='px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium rounded-md'>
								{link.label}
							</Link>
						))}
					</nav>
					{/* Mobile Hamburger */}
					<button
						className='md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
						aria-label={mobileOpen ? "Close menu" : "Open menu"}
						onClick={() => setMobileOpen((open) => !open)}>
						{mobileOpen ? (
							<X className='w-6 h-6 text-gray-700' />
						) : (
							<Menu className='w-6 h-6 text-gray-700' />
						)}
					</button>
				</div>
			</div>
			{/* Mobile Menu */}
			<div
				className={`md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
					mobileOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				aria-hidden={!mobileOpen}
				onClick={() => setMobileOpen(false)}
			/>
			<nav
				className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
					mobileOpen ? "translate-x-0" : "translate-x-full"
				}`}
				aria-label='Mobile menu'>
				<div className='flex flex-col p-6 space-y-2 pt-16'>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className='px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 text-lg font-medium transition-colors rounded-lg'
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
