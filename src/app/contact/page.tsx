import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Clock, MapPin } from "lucide-react";
import { email, location } from "@/lib/constant";

export const metadata = {
	title: "Contact Us | SMM Garden",
	description:
		"Have a question, suggestion, or need help? We'll love to hear from you!",
};

export default function ContactPage() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-4xl'>
				<div className='text-center mb-12'>
					<h1 className='text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
						Contact Us
					</h1>
					<p className='text-xl text-gray-600 max-w-2xl mx-auto'>
						Have a question, suggestion, or need help? We&apos;ll
						love to hear from you!
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					<div className='space-y-6'>
						<Card className='shadow-xl border-0'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Mail className='w-5 h-5' />
									Get in Touch
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-start gap-3'>
									<Mail className='w-5 h-5 text-blue-600 mt-1' />
									<div>
										<p className='font-medium'>Email</p>
										<p className='text-gray-600'>{email}</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<Clock className='w-5 h-5 text-green-600 mt-1' />
									<div>
										<p className='font-medium'>
											Response Time
										</p>
										<p className='text-gray-600'>
											Usually within 24 hours
										</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<MapPin className='w-5 h-5 text-purple-600 mt-1' />
									<div>
										<p className='font-medium'>Location</p>
										<p className='text-gray-600'>
											{location}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50'>
							<CardHeader>
								<CardTitle>Frequently Asked</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3'>
								<div>
									<p className='font-medium text-sm'>
										Are the tools really free?
									</p>
									<p className='text-sm text-gray-600'>
										Yes, all our tools are completely free
										to use with no hidden charges.
									</p>
								</div>
								<div>
									<p className='font-medium text-sm'>
										Do you store my data?
									</p>
									<p className='text-sm text-gray-600'>
										No, all processing happens in your
										browser. We don&apos;t store any user
										data.
									</p>
								</div>
								<div>
									<p className='font-medium text-sm'>
										Can I suggest new tools?
									</p>
									<p className='text-sm text-gray-600'>
										We love hearing suggestions for new
										tools to add.
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
