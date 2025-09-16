"use client";

import type React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, Clock } from "lucide-react";

export default function ThankYouPage() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex  justify-center p-4'>
			<div className='max-w-2xl w-full'>
				<Card className='text-center'>
					<CardHeader className='pb-4'>
						<div className='flex justify-center mb-4'>
							<div className='bg-green-100 rounded-full p-4'>
								<CheckCircle className='w-12 h-12 text-green-600' />
							</div>
						</div>
						<CardTitle className='text-xl font-bold text-gray-900 mb-2'>
							Application Submitted Successfully!
						</CardTitle>
						<CardDescription className='text-lg text-gray-600'>
							Thank you for your interest in joining our team as a
							telecaller.
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-6'>
						<div className='bg-blue-50 rounded-lg p-4'>
							<h3 className='font-semibold text-blue-900 mb-2'>
								What happens next?
							</h3>
							<div className='text-sm text-blue-800 space-y-1'>
								<p>
									• We'll review your application within 24
									hours
								</p>
								<p>
									• If shortlisted, we'll contact you for an
									interview
								</p>
								<p>
									• You'll receive updates via email or phone
								</p>
							</div>
						</div>

						<div className='flex flex-wrap justify-center gap-3'>
							<Badge
								variant='secondary'
								className='bg-green-100 text-green-800'>
								<Clock className='w-4 h-4 mr-2' />
								Response within 24 hours
							</Badge>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
