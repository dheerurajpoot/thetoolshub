import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info, Shield, FileText } from "lucide-react";
import { SITE_EMAIL, SITE_NAME } from "@/lib/constant";

export const metadata = {
	title: `Disclaimer - ${SITE_NAME}`,
	description:
		"Important information about the use of our tools and services on ${SITE_NAME}.",
};

export default function DisclaimerPage() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-12'>
					<div className='w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4'>
						<AlertTriangle className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-4xl font-bold mb-4 text-gray-800'>
						Disclaimer
					</h1>
					<p className='text-xl text-gray-600'>
						Important information about the use of our tools and
						services.
					</p>
				</div>

				<div className='space-y-8'>
					<Card className='shadow-xl border-0 border-l-4 border-l-red-500'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<AlertTriangle className='w-5 h-5 text-red-600' />
								General Disclaimer
							</CardTitle>
						</CardHeader>
						<CardContent className='prose prose-gray max-w-none'>
							<p className='text-gray-600 mb-4'>
								The information and tools provided by {SITE_NAME}{" "}
								are for general informational and utility
								purposes only. While we strive to provide
								accurate and up-to-date tools, we make no
								representations or warranties of any kind,
								express or implied, about the completeness,
								accuracy, reliability, suitability, or
								availability of the tools or information
								contained on the website.
							</p>
							<p className='text-gray-600'>
								Any reliance you place on such information or
								tools is therefore strictly at your own risk. In
								no event will we be liable for any loss or
								damage including without limitation, indirect or
								consequential loss or damage, or any loss or
								damage whatsoever arising from loss of data or
								profits arising out of, or in connection with,
								the use of this website or its tools.
							</p>
						</CardContent>
					</Card>

					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<FileText className='w-5 h-5 text-blue-600' />
								Tool Accuracy and Results
							</CardTitle>
						</CardHeader>
						<CardContent className='prose prose-gray max-w-none'>
							<p className='text-gray-600 mb-4'>
								While our tools are designed to provide accurate
								results, we cannot guarantee:
							</p>
							<ul className='text-gray-600 space-y-2'>
								<li>
									• The absolute accuracy of calculations or
									conversions
								</li>
								<li>• The completeness of generated content</li>
								<li>
									• The suitability of results for specific
									use cases
								</li>
								<li>
									• The compliance of generated content with
									specific regulations or standards
								</li>
								<li>
									• The security or uniqueness of generated
									passwords or codes
								</li>
							</ul>
							<p className='text-gray-600 mt-4'>
								Users should verify critical results
								independently and use professional judgment when
								applying tool outputs to important decisions or
								projects.
							</p>
						</CardContent>
					</Card>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<Card className='shadow-xl border-0'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Shield className='w-5 h-5 text-green-600' />
									Security Considerations
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600 mb-3'>
									Important security reminders:
								</p>
								<ul className='text-gray-600 space-y-2 text-sm'>
									<li>
										• Generated passwords should be tested
										for strength
									</li>
									<li>
										• QR codes should be verified before
										distribution
									</li>
									<li>
										• Sensitive data should not be processed
										online
									</li>
									<li>
										• Always use HTTPS for sensitive
										operations
									</li>
									<li>
										• Verify tool outputs for
										security-critical applications
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card className='shadow-xl border-0'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Info className='w-5 h-5 text-purple-600' />
									Professional Advice
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600 mb-3'>
									Our tools are not substitutes for:
								</p>
								<ul className='text-gray-600 space-y-2 text-sm'>
									<li>• Professional financial advice</li>
									<li>• Medical or health consultations</li>
									<li>• Legal counsel or advice</li>
									<li>
										• Technical or engineering expertise
									</li>
									<li>
										• Professional SEO or marketing services
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>

					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>
								Third-Party Links and Services
							</CardTitle>
						</CardHeader>
						<CardContent className='prose prose-gray max-w-none'>
							<p className='text-gray-600 mb-4'>
								Our website may contain links to third-party
								websites or services that are not owned or
								controlled by {SITE_NAME}. We have no control
								over, and assume no responsibility for:
							</p>
							<ul className='text-gray-600 space-y-2'>
								<li>
									• The content, privacy policies, or
									practices of any third-party websites or
									services
								</li>
								<li>
									• The accuracy or reliability of information
									provided by external sources
								</li>
								<li>
									• The security of data transmitted to
									third-party services
								</li>
								<li>
									• The availability or functionality of
									external tools or services
								</li>
							</ul>
							<p className='text-gray-600 mt-4'>
								You acknowledge and agree that {SITE_NAME} shall
								not be responsible or liable for any damage or
								loss caused by your use of any third-party
								content, goods, or services.
							</p>
						</CardContent>
					</Card>

					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Limitation of Liability</CardTitle>
						</CardHeader>
						<CardContent className='prose prose-gray max-w-none'>
							<p className='text-gray-600 mb-4'>
								To the fullest extent permitted by applicable
								law, {SITE_NAME} shall not be liable for any
								indirect, incidental, special, consequential, or
								punitive damages, including without limitation:
							</p>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<ul className='text-gray-600 space-y-1 text-sm'>
									<li>• Loss of profits or revenue</li>
									<li>• Loss of data or information</li>
									<li>• Business interruption</li>
									<li>• Loss of business opportunities</li>
								</ul>
								<ul className='text-gray-600 space-y-1 text-sm'>
									<li>• Damage to reputation</li>
									<li>• Cost of substitute services</li>
									<li>• Personal injury</li>
									<li>• Property damage</li>
								</ul>
							</div>
						</CardContent>
					</Card>

					<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50'>
						<CardHeader>
							<CardTitle>Updates to This Disclaimer</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 mb-4'>
								We reserve the right to update or modify this
								disclaimer at any time without prior notice.
								Changes will be effective immediately upon
								posting on this page.
							</p>
							<div className='text-gray-600'>
								<p>
									<strong>Last Updated:</strong> Jan 19, 2026
								</p>
								<p>
									<strong>Effective Date:</strong> Jan 19,
									2026
								</p>
								<p>
									<strong>Contact:</strong> {SITE_EMAIL}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
