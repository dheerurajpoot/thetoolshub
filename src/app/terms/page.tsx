import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { email, siteName } from "@/lib/constant";
import { FileText, Scale, AlertTriangle, Users } from "lucide-react";

export default function TermsPage() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-12'>
					<div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Scale className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-4xl font-bold mb-4 text-gray-800'>
						Terms of Service
					</h1>
					<p className='text-xl text-gray-600'>
						Please read these terms carefully before using our
						services.
					</p>
				</div>

				<div className='space-y-8'>
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<FileText className='w-5 h-5 text-blue-600' />
								Acceptance of Terms
							</CardTitle>
						</CardHeader>
						<CardContent className='prose prose-gray max-w-none'>
							<p className='text-gray-600 mb-4'>
								By accessing and using {siteName} (&quot;the
								Service&quot;), you accept and agree to be bound
								by the terms and provisions of this agreement.
								If you do not agree to abide by the above,
								please do not use this service.
							</p>
							<p className='text-gray-600'>
								These Terms of Service (&quot;Terms&quot;)
								govern your use of our website and tools. We
								reserve the right to update these terms at any
								time without prior notice. Your continued use of
								the service constitutes acceptance of any
								changes.
							</p>
						</CardContent>
					</Card>

					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Users className='w-5 h-5 text-green-600' />
								Use License
							</CardTitle>
						</CardHeader>
						<CardContent className='prose prose-gray max-w-none'>
							<p className='text-gray-600 mb-4'>
								Permission is granted to temporarily use ToolBox
								Pro for personal and commercial purposes. This
								is the grant of a license, not a transfer of
								title, and under this license you may not:
							</p>
							<ul className='text-gray-600 space-y-2'>
								<li>• Modify or copy the materials</li>
								<li>
									• Use the materials for any commercial
									purpose or for any public display
								</li>
								<li>
									• Attempt to reverse engineer any software
									contained on the website
								</li>
								<li>
									• Remove any copyright or other proprietary
									notations from the materials
								</li>
								<li>
									• Use the service to violate any applicable
									laws or regulations
								</li>
							</ul>
							<p className='text-gray-600 mt-4'>
								This license shall automatically terminate if
								you violate any of these restrictions and may be
								terminated by us at any time.
							</p>
						</CardContent>
					</Card>

					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<AlertTriangle className='w-5 h-5 text-orange-600' />
								Disclaimer
							</CardTitle>
						</CardHeader>
						<CardContent className='prose prose-gray max-w-none'>
							<p className='text-gray-600 mb-4'>
								The materials on {siteName} are provided on an
								&apos;as is&apos; basis. {siteName} makes no
								warranties, expressed or implied, and hereby
								disclaims and negates all other warranties
								including without limitation, implied warranties
								or conditions of merchantability, fitness for a
								particular purpose, or non-infringement of
								intellectual property or other violation of
								rights.
							</p>
							<p className='text-gray-600'>
								Further, {siteName} does not warrant or make any
								representations concerning the accuracy, likely
								results, or reliability of the use of the
								materials on its website or otherwise relating
								to such materials or on any sites linked to this
								site.
							</p>
						</CardContent>
					</Card>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<Card className='shadow-xl border-0'>
							<CardHeader>
								<CardTitle>Limitations</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600 mb-3'>
									In no event shall ToolBox Pro or its
									suppliers be liable for any damages
									including:
								</p>
								<ul className='text-gray-600 space-y-1 text-sm'>
									<li>• Loss of data or profit</li>
									<li>• Business interruption</li>
									<li>• Personal injury</li>
									<li>• Privacy loss</li>
								</ul>
							</CardContent>
						</Card>

						<Card className='shadow-xl border-0'>
							<CardHeader>
								<CardTitle>Accuracy of Materials</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600 mb-3'>
									The materials on {siteName} may include
									technical, typographical, or photographic
									errors:
								</p>
								<ul className='text-gray-600 space-y-1 text-sm'>
									<li>• We do not warrant accuracy</li>
									<li>• Materials may be outdated</li>
									<li>• We may make changes anytime</li>
									<li>• No commitment to update materials</li>
								</ul>
							</CardContent>
						</Card>
					</div>

					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Prohibited Uses</CardTitle>
						</CardHeader>
						<CardContent className='prose prose-gray max-w-none'>
							<p className='text-gray-600 mb-4'>
								You may not use our service:
							</p>
							<ul className='text-gray-600 space-y-2'>
								<li>
									• For any unlawful purpose or to solicit
									others to perform unlawful acts
								</li>
								<li>
									• To violate any international, federal,
									provincial, or state regulations, rules,
									laws, or local ordinances
								</li>
								<li>
									• To infringe upon or violate our
									intellectual property rights or the
									intellectual property rights of others
								</li>
								<li>
									• To harass, abuse, insult, harm, defame,
									slander, disparage, intimidate, or
									discriminate
								</li>
								<li>
									• To submit false or misleading information
								</li>
								<li>
									• To upload or transmit viruses or any other
									type of malicious code
								</li>
								<li>
									• To spam, phish, pharm, pretext, spider,
									crawl, or scrape
								</li>
								<li>• For any obscene or immoral purpose</li>
							</ul>
						</CardContent>
					</Card>

					<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50'>
						<CardHeader>
							<CardTitle>Contact Information</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 mb-4'>
								If you have any questions about these Terms of
								Service, please contact us:
							</p>
							<div className='text-gray-600'>
								<p>
									<strong>Email:</strong> {email}
								</p>
								<p>
									<strong>Last Updated:</strong> July 2025
								</p>
								<p>
									<strong>Effective Date:</strong> July 1,
									2025
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
