import { siteName } from "@/lib/constant";
import { Zap } from "lucide-react";
import Link from "next/link";

import React from "react";

const header = () => {
	return (
		<header className='border-b bg-white sticky top-0 z-50 shadow-sm'>
			<div className='container mx-auto px-4 py-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-2'>
						<div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
							<Zap className='w-5 h-5 text-white' />
						</div>
						<span className='text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent'>
							{siteName}
						</span>
					</div>
					<nav className='hidden md:flex items-center space-x-6'>
						<Link
							href='/about'
							className='text-gray-600 hover:text-blue-600 transition-colors'>
							About
						</Link>
						<Link
							href='/disclaimer'
							className='text-gray-600 hover:text-blue-600 transition-colors'>
							Disclaimer
						</Link>
						<Link
							href='/privacy-policy'
							className='text-gray-600 hover:text-blue-600 transition-colors'>
							Privacy Policy
						</Link>
						<Link
							href='/terms'
							className='text-gray-600 hover:text-blue-600 transition-colors'>
							Terms of Service
						</Link>
					</nav>
				</div>
			</div>
		</header>
	);
};

export default header;
