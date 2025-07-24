import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Database } from "lucide-react";
import { email, siteName } from "@/lib/constant";

export const metadata = {
	title: "Privacy Policy | SMM Garden",
	description:
		"Your privacy is our priority. Learn how we protect your data.",
};

export default function PrivacyPage() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-12'>
					<div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Shield className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-4xl font-bold mb-4 text-gray-800'>
						Privacy Policy
					</h1>
					<p className='text-xl text-gray-600'>
						Your privacy is our priority. Learn how we protect your
						data.
					</p>
				</div>

				<div className='space-y-8'>
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Eye className='w-5 h-5 text-blue-600' />
								Information We Collect
							</CardTitle>
						</CardHeader>
						<CardContent className='prose prose-gray max-w-none'>
							<p className='text-gray-600 mb-4'>
								{siteName} is designed with privacy in mind. We
								collect minimal information to provide our
								services:
							</p>
							<ul className='text-gray-600 space-y-2'>
								<li>
									<strong>Usage Analytics:</strong> We collect
									anonymous usage statistics to improve our
									tools and user experience.
								</li>
								<li>
									<strong>Technical Data:</strong> Basic
									technical information like browser type,
									device type, and IP address for security and
									optimization purposes.
								</li>
								<li>
									<strong>Contact Information:</strong> When
									you contact us, we collect the information
									you provide in your message.
								</li>
							</ul>
							<p className='text-gray-600 mt-4'>
								<strong>Important:</strong> We do NOT collect,
								store, or process any data you input into our
								tools. All tool processing happens locally in
								your browser.
							</p>
						</CardContent>
					</Card>

					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Database className='w-5 h-5 text-green-600' />
								How We Use Your Information
							</CardTitle>
						</CardHeader>
						<CardContent className='prose prose-gray max-w-none'>
							<p className='text-gray-600 mb-4'>
								The limited information we collect is used
								solely for:
							</p>
							<ul className='text-gray-600 space-y-2'>
								<li>Improving our tools and user experience</li>
								<li>
									Analyzing usage patterns to identify popular
									tools and features
								</li>
								<li>
									Ensuring the security and stability of our
									platform
								</li>
								<li>
									Responding to your inquiries and support
									requests
								</li>
								<li>Complying with legal obligations</li>
							</ul>
							<p className='text-gray-600 mt-4'>
								We never sell, rent, or share your personal
								information with third parties for marketing
								purposes.
							</p>
						</CardContent>
					</Card>

					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Lock className='w-5 h-5 text-purple-600' />
								Data Security
							</CardTitle>
						</CardHeader>
						<CardContent className='prose prose-gray max-w-none'>
							<p className='text-gray-600 mb-4'>
								We implement industry-standard security measures
								to protect your information:
							</p>
							<ul className='text-gray-600 space-y-2'>
								<li>
									<strong>Encryption:</strong> All data
									transmission is encrypted using HTTPS/TLS
								</li>
								<li>
									<strong>Local Processing:</strong> Tool data
									is processed entirely in your browser
								</li>
								<li>
									<strong>No Data Storage:</strong> We
									don&apos;t store any content you input into
									our tools
								</li>
								<li>
									<strong>Regular Security Audits:</strong> We
									regularly review and update our security
									practices
								</li>
								<li>
									<strong>Access Controls:</strong> Limited
									access to any collected data with strict
									authentication
								</li>
							</ul>
						</CardContent>
					</Card>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<Card className='shadow-xl border-0'>
							<CardHeader>
								<CardTitle>Cookies and Tracking</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600 mb-3'>
									We use minimal cookies and tracking
									technologies:
								</p>
								<ul className='text-gray-600 space-y-1 text-sm'>
									<li>
										• Essential cookies for basic
										functionality
									</li>
									<li>• Analytics cookies (anonymous)</li>
									<li>
										• No advertising or tracking cookies
									</li>
									<li>
										• You can disable cookies in your
										browser
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card className='shadow-xl border-0'>
							<CardHeader>
								<CardTitle>Your Rights</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600 mb-3'>
									You have the right to:
								</p>
								<ul className='text-gray-600 space-y-1 text-sm'>
									<li>• Access your personal information</li>
									<li>• Request deletion of your data</li>
									<li>• Opt-out of analytics tracking</li>
									<li>• Contact us about privacy concerns</li>
								</ul>
							</CardContent>
						</Card>
					</div>

					<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50'>
						<CardHeader>
							<CardTitle>Contact Us About Privacy</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 mb-4'>
								If you have any questions about this Privacy
								Policy or our data practices, please contact us:
							</p>
							<div className='text-gray-600'>
								<p>
									<strong>Email:</strong> {email}
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
