import { siteName } from "@/lib/constant";
import { Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

const footer = () => {
	return (
		<footer className='bg-gray-900 text-white py-8 px-4 mt-16'>
			<div className='container mx-auto'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					<div>
						<div className='flex items-center space-x-2 mb-4'>
							<div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
								<Zap className='w-5 h-5 text-white' />
							</div>
							<span className='text-xl font-bold'>
								{siteName}
							</span>
						</div>
						<p className='text-gray-400'>
							Your one-stop destination for powerful online tools.
						</p>
					</div>
					<div>
						<h4 className='font-semibold mb-4'>Popular Tools</h4>
						<ul className='space-y-2 text-gray-400 text-sm'>
							<li>
								<Link
									href='/tools/password-generator'
									className='hover:text-white transition-colors'>
									Password Generator
								</Link>
							</li>
							<li>
								<Link
									href='/tools/qr-generator'
									className='hover:text-white transition-colors'>
									QR Code Generator
								</Link>
							</li>
							<li>
								<Link
									href='/tools/image-compressor'
									className='hover:text-white transition-colors'>
									Image Compressor
								</Link>
							</li>
							<li>
								<Link
									href='/tools/word-counter'
									className='hover:text-white transition-colors'>
									Word Counter
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className='font-semibold mb-4'>Company</h4>
						<ul className='space-y-2 text-gray-400 text-sm'>
							<li>
								<Link
									href='/about'
									className='hover:text-white transition-colors'>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href='/contact'
									className='hover:text-white transition-colors'>
									Contact
								</Link>
							</li>
							<li>
								<Link
									href='/privacy'
									className='hover:text-white transition-colors'>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href='/terms'
									className='hover:text-white transition-colors'>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className='font-semibold mb-4'>Legal</h4>
						<ul className='space-y-2 text-gray-400 text-sm'>
							<li>
								<Link
									href='/cookies'
									className='hover:text-white transition-colors'>
									Cookie Policy
								</Link>
							</li>
							<li>
								<Link
									href='/disclaimer'
									className='hover:text-white transition-colors'>
									Disclaimer
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
					<p>&copy; 2025 {siteName}. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default footer;
