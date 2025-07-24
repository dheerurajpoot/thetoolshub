import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Settings, Shield, Info } from "lucide-react";
import { email, siteName } from "@/lib/constant";

export const metadata = {
	title: "Cookie Policy | SMM Garden",
	description: "Learn about how we use cookies and similar technologies.",
};

export default function CookiesPage() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-12'>
					<div className='w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Cookie className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-4xl font-bold mb-4 text-gray-800'>
						Cookie Policy
					</h1>
					<p className='text-xl text-gray-600'>
						Learn about how we use cookies and similar technologies.
					</p>
				</div>

				<div className='space-y-8'>
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Info className='w-5 h-5 text-blue-600' />
								What Are Cookies?
							</CardTitle>
						</CardHeader>
						<CardContent className='prose prose-gray max-w-none'>
							<p className='text-gray-600 mb-4'>
								Cookies are small text files that are stored on
								your computer or mobile device when you visit a
								website. They help websites remember information
								about your visit, which can make it easier to
								visit the site again and make the site more
								useful to you.
							</p>
							<p className='text-gray-600'>
								{siteName} uses cookies responsibly and
								minimally to enhance your experience while
								respecting your privacy.
							</p>
						</CardContent>
					</Card>

					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Settings className='w-5 h-5 text-green-600' />
								Types of Cookies We Use
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-6'>
								<div className='border-l-4 border-blue-500 pl-4'>
									<h3 className='font-semibold text-gray-800 mb-2'>
										Essential Cookies
									</h3>
									<p className='text-gray-600 text-sm mb-2'>
										These cookies are necessary for the
										website to function properly. They
										enable basic functions like page
										navigation and access to secure areas.
									</p>
									<ul className='text-gray-600 text-sm space-y-1'>
										<li>• Session management</li>
										<li>• Security features</li>
										<li>• Basic functionality</li>
									</ul>
								</div>

								<div className='border-l-4 border-green-500 pl-4'>
									<h3 className='font-semibold text-gray-800 mb-2'>
										Analytics Cookies
									</h3>
									<p className='text-gray-600 text-sm mb-2'>
										These cookies help us understand how
										visitors interact with our website by
										collecting and reporting information
										anonymously.
									</p>
									<ul className='text-gray-600 text-sm space-y-1'>
										<li>
											• Page views and traffic sources
										</li>
										<li>• Popular tools and features</li>
										<li>
											• User behavior patterns (anonymous)
										</li>
									</ul>
								</div>

								<div className='border-l-4 border-purple-500 pl-4'>
									<h3 className='font-semibold text-gray-800 mb-2'>
										Preference Cookies
									</h3>
									<p className='text-gray-600 text-sm mb-2'>
										These cookies remember your preferences
										and settings to provide a more
										personalized experience.
									</p>
									<ul className='text-gray-600 text-sm space-y-1'>
										<li>
											• Theme preferences (dark/light
											mode)
										</li>
										<li>• Language settings</li>
										<li>• Tool configurations</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<Card className='shadow-xl border-0'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Shield className='w-5 h-5 text-blue-600' />
									Third-Party Cookies
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600 mb-3'>
									We use minimal third-party services that may
									set cookies:
								</p>
								<ul className='text-gray-600 space-y-2 text-sm'>
									<li>
										<strong>Google Analytics:</strong> For
										anonymous usage statistics
									</li>
									<li>
										<strong>CDN Services:</strong> For
										faster content delivery
									</li>
									<li>
										<strong>Security Services:</strong> For
										protection against threats
									</li>
								</ul>
								<p className='text-gray-600 text-sm mt-3'>
									We carefully vet all third-party services to
									ensure they meet our privacy standards.
								</p>
							</CardContent>
						</Card>

						<Card className='shadow-xl border-0'>
							<CardHeader>
								<CardTitle>Managing Cookies</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600 mb-3'>
									You have control over cookies:
								</p>
								<ul className='text-gray-600 space-y-2 text-sm'>
									<li>
										<strong>Browser Settings:</strong>{" "}
										Disable cookies in your browser
									</li>
									<li>
										<strong>Selective Blocking:</strong>{" "}
										Block specific types of cookies
									</li>
									<li>
										<strong>Clear Cookies:</strong> Delete
										existing cookies anytime
									</li>
									<li>
										<strong>Opt-out Tools:</strong> Use
										browser extensions for privacy
									</li>
								</ul>
								<p className='text-gray-600 text-sm mt-3'>
									Note: Disabling essential cookies may affect
									website functionality.
								</p>
							</CardContent>
						</Card>
					</div>

					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Cookie Retention</CardTitle>
						</CardHeader>
						<CardContent className='prose prose-gray max-w-none'>
							<p className='text-gray-600 mb-4'>
								Different cookies have different lifespans:
							</p>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								<div className='bg-blue-50 p-4 rounded-lg'>
									<h4 className='font-semibold text-blue-800 mb-2'>
										Session Cookies
									</h4>
									<p className='text-blue-700 text-sm'>
										Deleted when you close your browser
									</p>
								</div>
								<div className='bg-green-50 p-4 rounded-lg'>
									<h4 className='font-semibold text-green-800 mb-2'>
										Short-term Cookies
									</h4>
									<p className='text-green-700 text-sm'>
										Expire within 30 days
									</p>
								</div>
								<div className='bg-purple-50 p-4 rounded-lg'>
									<h4 className='font-semibold text-purple-800 mb-2'>
										Long-term Cookies
									</h4>
									<p className='text-purple-700 text-sm'>
										Expire within 2 years (preferences only)
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50'>
						<CardHeader>
							<CardTitle>Contact Us About Cookies</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 mb-4'>
								If you have any questions about our use of
								cookies, please contact us:
							</p>
							<div className='text-gray-600'>
								<p>
									<strong>Email:</strong> {email}
								</p>
								<p>
									<strong>Subject:</strong> Cookie Policy
									Inquiry
								</p>
								<p>
									<strong>Last Updated:</strong> July 2025
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
