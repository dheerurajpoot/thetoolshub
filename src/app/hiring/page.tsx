"use client";

import type React from "react";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Phone,
	Mail,
	MapPin,
	Clock,
	DollarSign,
	CheckCircle,
	Star,
	ArrowRight,
	Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface FormData {
	name: string;
	email: string;
	phone: string;
	address: string;
	experience: string;
	company: string;
}

export default function HiringPage() {
	const router = useRouter();
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		phone: "",
		address: "",
		experience: "",
		company: "",
	});
	const [loading, setLoading] = useState(false);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const apiKey = "06dca582-c4d4-40f1-a3af-194beb5c2200";
	const formId = "46122254";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Prepare form data
			const data = {
				fields: [
					{ name: "firstname", value: formData.name },
					{ name: "email", value: formData.email },
					{ name: "phone", value: formData.phone },
					{ name: "address", value: formData.address },
					{ name: "experience", value: formData.experience },
					{ name: "company", value: formData.company },
				],
			};

			const response = await axios.post(
				`https://api.hsforms.com/submissions/v3/integration/submit/${formId}/${apiKey}`,
				data,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.status === 200 || response.status === 204) {
				// Redirect to thank you page
				router.push("/hiring/thank-you");
			} else {
				throw new Error("Failed to submit application");
			}
		} catch (error) {
			console.error("Submission error:", error);
			toast.error("Failed to submit application", {
				description: "Please try again or contact us directly.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Head>
				<title>Telecaller Jobs - Join Our Team | SMM Garden</title>
				<meta
					name='description'
					content='Exciting telecaller job opportunity for experienced professionals. 2+ years experience required. Competitive salary, remote work options. Apply now!'
				/>
				<meta
					name='keywords'
					content='telecaller jobs, telecalling jobs, customer service jobs, sales jobs, remote jobs, telecaller careers'
				/>
				<meta
					property='og:title'
					content='Telecaller Jobs - Join Our Team | SMM Garden'
				/>
				<meta
					property='og:description'
					content='Exciting telecaller job opportunity for experienced professionals. 2+ years experience required. Competitive salary, remote work options.'
				/>
				<meta property='og:type' content='website' />
				<meta
					property='og:url'
					content='https://www.smmgarden.com/hiring'
				/>
				<meta name='twitter:card' content='summary_large_image' />
				<meta
					name='twitter:title'
					content='Telecaller Jobs - Join Our Team | SMM Garden'
				/>
				<meta
					name='twitter:description'
					content='Exciting telecaller job opportunity for experienced professionals. 2+ years experience required. Competitive salary, remote work options.'
				/>
			</Head>
			<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
				{/* Hero Section */}
				<div className='bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16'>
					<div className='max-w-6xl mx-auto px-4 text-center'>
						<h1 className='text-3xl md:text-5xl font-bold mb-4'>
							Join Our Team as a Telecaller
						</h1>
						<p className='text-xl md:text-2xl mb-6 opacity-90'>
							Exciting opportunity for experienced telecallers to
							grow with us
						</p>
						<div className='flex flex-wrap justify-center gap-4 mb-8'>
							<Badge
								variant='secondary'
								className='bg-white/20 text-white'>
								<Briefcase className='w-4 h-4 mr-2' />
								2+ Years Experience Required
							</Badge>
							<Badge
								variant='secondary'
								className='bg-white/20 text-white'>
								<MapPin className='w-4 h-4 mr-2' />
								Remote Work Available
							</Badge>
							<Badge
								variant='secondary'
								className='bg-white/20 text-white'>
								<DollarSign className='w-4 h-4 mr-2' />
								Competitive Salary
							</Badge>
						</div>
						<Button
							size='lg'
							className='bg-white text-blue-600 hover:bg-gray-100'
							onClick={() =>
								document
									.getElementById("application-form")
									?.scrollIntoView({ behavior: "smooth" })
							}>
							Apply Now
							<ArrowRight className='w-4 h-4 ml-2' />
						</Button>
					</div>
				</div>

				<div className='max-w-6xl mx-auto px-4 py-12'>
					{/* Job Details */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Briefcase className='w-5 h-5' />
									Job Description
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<h4 className='font-semibold text-gray-900 mb-2'>
										Responsibilities:
									</h4>
									<ul className='text-sm text-gray-600 space-y-1'>
										<li>
											• Make outbound calls to potential
											customers
										</li>
										<li>
											• Follow up on leads and inquiries
										</li>
										<li>
											• Maintain accurate records of all
											interactions
										</li>
										<li>
											• Achieve daily/weekly call targets
										</li>
										<li>
											• Provide excellent customer service
										</li>
										<li>• Collaborate with sales team</li>
									</ul>
								</div>
								<div>
									<h4 className='font-semibold text-gray-900 mb-2'>
										Requirements:
									</h4>
									<ul className='text-sm text-gray-600 space-y-1'>
										<li>
											• Minimum 2 years of telecalling
											experience
										</li>
										<li>
											• Excellent communication skills
										</li>
										<li>
											• Proficiency in English and Hindi
										</li>
										<li>• Basic computer knowledge</li>
										<li>
											• Self-motivated and target-oriented
										</li>
										<li>
											• Good listening and problem-solving
											skills
										</li>
									</ul>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Star className='w-5 h-5' />
									Why Join Us?
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-start gap-3'>
									<CheckCircle className='w-5 h-5 text-green-600 mt-0.5' />
									<div>
										<h4 className='font-semibold text-gray-900'>
											Competitive Salary
										</h4>
										<p className='text-sm text-gray-600'>
											₹25,000 - ₹40,000 per month based on
											experience
										</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<CheckCircle className='w-5 h-5 text-green-600 mt-0.5' />
									<div>
										<h4 className='font-semibold text-gray-900'>
											Flexible Working
										</h4>
										<p className='text-sm text-gray-600'>
											Remote work options available
										</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<CheckCircle className='w-5 h-5 text-green-600 mt-0.5' />
									<div>
										<h4 className='font-semibold text-gray-900'>
											Growth Opportunities
										</h4>
										<p className='text-sm text-gray-600'>
											Clear career progression path
										</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<CheckCircle className='w-5 h-5 text-green-600 mt-0.5' />
									<div>
										<h4 className='font-semibold text-gray-900'>
											Training & Support
										</h4>
										<p className='text-sm text-gray-600'>
											Comprehensive onboarding and ongoing
											training
										</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<CheckCircle className='w-5 h-5 text-green-600 mt-0.5' />
									<div>
										<h4 className='font-semibold text-gray-900'>
											Performance Incentives
										</h4>
										<p className='text-sm text-gray-600'>
											Bonus structure for exceeding
											targets
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Application Form */}
					<Card id='application-form'>
						<CardHeader>
							<CardTitle className='text-center'>
								Apply for Telecaller Position
							</CardTitle>
							<CardDescription className='text-center'>
								Fill out the form below and we'll get back to
								you within 24 hours
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className='space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div>
										<Label htmlFor='name'>
											Full Name *
										</Label>
										<Input
											id='name'
											name='name'
											value={formData.name}
											onChange={handleInputChange}
											required
											placeholder='Enter your full name'
										/>
									</div>
									<div>
										<Label htmlFor='email'>
											Email Address *
										</Label>
										<Input
											id='email'
											name='email'
											type='email'
											value={formData.email}
											onChange={handleInputChange}
											required
											placeholder='your.email@example.com'
										/>
									</div>
									<div>
										<Label htmlFor='phone'>
											Phone Number *
										</Label>
										<Input
											id='phone'
											name='phone'
											type='tel'
											value={formData.phone}
											onChange={handleInputChange}
											required
											placeholder='+91 9876543210'
										/>
									</div>
									<div>
										<Label htmlFor='address'>
											Address *
										</Label>
										<Input
											id='address'
											name='address'
											value={formData.address}
											onChange={handleInputChange}
											required
											placeholder='Your complete address'
										/>
									</div>
									<div>
										<Label htmlFor='experience'>
											Years of Experience *
										</Label>
										<Input
											id='experience'
											name='experience'
											value={formData.experience}
											onChange={handleInputChange}
											required
											placeholder='e.g., 2 years'
										/>
									</div>
									<div>
										<Label htmlFor='company'>
											Current Company *
										</Label>
										<Input
											id='company'
											name='company'
											value={formData.company}
											onChange={handleInputChange}
											required
											placeholder='Your current company name'
										/>
									</div>
								</div>

								<Button
									type='submit'
									className='w-full'
									size='lg'
									disabled={loading}>
									{loading
										? "Submitting..."
										: "Submit Application"}
								</Button>
							</form>
						</CardContent>
					</Card>

					{/* Contact Information */}
					<Card className='mt-8'>
						<CardHeader>
							<CardTitle className='text-center'>
								Have Questions?
							</CardTitle>
							<CardDescription className='text-center'>
								Contact us directly for more information
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
								<div className='flex flex-col items-center gap-2'>
									<Phone className='w-6 h-6 text-blue-600' />
									<h4 className='font-semibold'>Phone</h4>
									<p className='text-sm text-gray-600'>
										+91 7755089819
									</p>
								</div>
								<div className='flex flex-col items-center gap-2'>
									<Mail className='w-6 h-6 text-blue-600' />
									<h4 className='font-semibold'>Email</h4>
									<p className='text-sm text-gray-600'>
										drexpress90@gmail.com
									</p>
								</div>
								<div className='flex flex-col items-center gap-2'>
									<Clock className='w-6 h-6 text-blue-600' />
									<h4 className='font-semibold'>
										Response Time
									</h4>
									<p className='text-sm text-gray-600'>
										Within 24 hours
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}
