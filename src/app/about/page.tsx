import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Zap, Shield } from "lucide-react";
import { siteName } from "@/lib/constant";

export default function AboutPage() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-12'>
					<h1 className='text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
						About {siteName}
					</h1>
					<p className='text-xl text-gray-600 max-w-2xl mx-auto'>
						We&apos;re on a mission to provide the most
						comprehensive collection of free online tools to boost
						productivity and simplify digital tasks.
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<Target className='w-12 h-12 text-blue-600 mb-4' />
							<CardTitle>Our Mission</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600'>
								To democratize access to powerful digital tools
								by providing a comprehensive, free platform that
								empowers users to accomplish their tasks
								efficiently and securely.
							</p>
						</CardContent>
					</Card>

					<Card className='shadow-xl border-0'>
						<CardHeader>
							<Users className='w-12 h-12 text-purple-600 mb-4' />
							<CardTitle>Our Team</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600'>
								We&apos;re a passionate team of developers,
								designers, and digital enthusiasts committed to
								creating tools that make a real difference in
								people&apos;s daily workflows.
							</p>
						</CardContent>
					</Card>
				</div>

				<div className='mb-12'>
					<h2 className='text-3xl font-bold text-center mb-8 text-gray-800'>
						Why Choose {siteName}?
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='text-center'>
							<div className='w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4'>
								<Zap className='w-8 h-8 text-white' />
							</div>
							<h3 className='text-xl font-semibold mb-2'>
								Lightning Fast
							</h3>
							<p className='text-gray-600'>
								All our tools are optimized for speed and
								performance, ensuring you get results instantly.
							</p>
						</div>
						<div className='text-center'>
							<div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4'>
								<Shield className='w-8 h-8 text-white' />
							</div>
							<h3 className='text-xl font-semibold mb-2'>
								Privacy First
							</h3>
							<p className='text-gray-600'>
								Your data is processed locally in your browser.
								We never store or share your information.
							</p>
						</div>
						<div className='text-center'>
							<div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
								<Users className='w-8 h-8 text-white' />
							</div>
							<h3 className='text-xl font-semibold mb-2'>
								User-Centric
							</h3>
							<p className='text-gray-600'>
								Every tool is designed with user experience in
								mind, making complex tasks simple and intuitive.
							</p>
						</div>
					</div>
				</div>

				<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50'>
					<CardHeader>
						<CardTitle className='text-center'>Our Story</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='prose prose-gray max-w-none'>
							<p className='text-gray-600 mb-4'>
								{siteName} was born out of frustration with
								scattered, unreliable online tools. As
								developers and content creators ourselves, we
								found ourselves constantly searching for
								reliable tools to help with everyday tasks -
								from generating secure passwords to optimizing
								content for SEO.
							</p>
							<p className='text-gray-600 mb-4'>
								We realized there was a need for a centralized
								platform that offered high-quality, fast, and
								secure tools without the hassle of ads,
								registration requirements, or privacy concerns.
								That&apos;s when {siteName} was created.
							</p>
							<p className='text-gray-600'>
								Today, we&apos;re proud to serve thousands of
								users worldwide with our growing collection of
								50+ tools, and we&apos;re constantly working to
								add new features and improve existing ones based
								on user feedback and emerging needs.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
