"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Copy, Download, Check, FileText, Shield, Globe } from "lucide-react";
import { toast } from "sonner";

interface TermsData {
	companyName: string;
	websiteUrl: string;
	contactEmail: string;
	country: string;
	businessType: string;
	hasUserAccounts: boolean;
	hasPayments: boolean;
	hasSubscriptions: boolean;
	hasUserContent: boolean;
	hasThirdPartyServices: boolean;
	hasAnalytics: boolean;
	hasCookies: boolean;
	hasAgeRestriction: boolean;
	minAge: string;
}

export default function TermsConditionsGenerator() {
	const [formData, setFormData] = useState<TermsData>({
		companyName: "",
		websiteUrl: "",
		contactEmail: "",
		country: "United States",
		businessType: "website",
		hasUserAccounts: false,
		hasPayments: false,
		hasSubscriptions: false,
		hasUserContent: false,
		hasThirdPartyServices: false,
		hasAnalytics: false,
		hasCookies: false,
		hasAgeRestriction: false,
		minAge: "13",
	});

	const [generatedTerms, setGeneratedTerms] = useState("");
	const [copied, setCopied] = useState(false);

	const generateTerms = () => {
		if (
			!formData.companyName ||
			!formData.websiteUrl ||
			!formData.contactEmail
		) {
			toast.error("Please fill in all required fields");
			return;
		}

		const currentDate = new Date().toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		const terms = `TERMS AND CONDITIONS

Last updated: ${currentDate}

1. AGREEMENT TO TERMS

These Terms and Conditions ("Terms") govern your use of the ${
			formData.businessType
		} operated by ${
			formData.companyName
		} ("we," "us," or "our") located at ${
			formData.websiteUrl
		} (the "Service").

By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.

2. ACCEPTANCE OF TERMS

By accessing and using this ${
			formData.businessType
		}, you accept and agree to be bound by the terms and provision of this agreement.

3. DESCRIPTION OF SERVICE

${formData.companyName} provides ${
			formData.businessType === "ecommerce"
				? "an online marketplace for purchasing products and services"
				: formData.businessType === "saas"
				? "software as a service solutions"
				: formData.businessType === "blog"
				? "informational content and articles"
				: "online services and content"
		} through our platform.

${
	formData.hasUserAccounts
		? `
4. USER ACCOUNTS

When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.

You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.`
		: ""
}

${
	formData.hasPayments
		? `
${formData.hasUserAccounts ? "5" : "4"}. PAYMENTS AND BILLING

${
	formData.hasSubscriptions
		? "Our Service may include subscription-based features. By subscribing, you agree to pay the applicable fees on a recurring basis."
		: "Payment is required for certain features of our Service."
}

All payments are processed securely through third-party payment processors. We do not store your payment information on our servers.

Refunds may be available in accordance with our refund policy. Please contact us for specific refund requests.`
		: ""
}

${
	formData.hasUserContent
		? `
${
	formData.hasPayments
		? formData.hasUserAccounts
			? "6"
			: "5"
		: formData.hasUserAccounts
		? "5"
		: "4"
}. USER CONTENT

Our Service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content").

You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.

By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.`
		: ""
}

6. PROHIBITED USES

You may not use our Service:
- For any unlawful purpose or to solicit others to perform unlawful acts
- To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
- To infringe upon or violate our intellectual property rights or the intellectual property rights of others
- To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
- To submit false or misleading information
- To upload or transmit viruses or any other type of malicious code

7. INTELLECTUAL PROPERTY RIGHTS

The Service and its original content, features, and functionality are and will remain the exclusive property of ${
			formData.companyName
		} and its licensors. The Service is protected by copyright, trademark, and other laws.

8. TERMINATION

We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

Upon termination, your right to use the Service will cease immediately.

${
	formData.hasAgeRestriction
		? `
9. AGE RESTRICTIONS

Our Service is intended for users who are at least ${formData.minAge} years of age. By using our Service, you represent and warrant that you are at least ${formData.minAge} years old.`
		: ""
}

${
	formData.hasThirdPartyServices
		? `
${formData.hasAgeRestriction ? "10" : "9"}. THIRD-PARTY SERVICES

Our Service may contain links to third-party websites or services that are not owned or controlled by ${
				formData.companyName
		  }.

We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.`
		: ""
}

${
	formData.hasAnalytics || formData.hasCookies
		? `
${
	formData.hasThirdPartyServices
		? formData.hasAgeRestriction
			? "11"
			: "10"
		: formData.hasAgeRestriction
		? "10"
		: "9"
}. ANALYTICS AND COOKIES

${
	formData.hasAnalytics
		? "We use analytics services to help analyze how users use the Service. These services may collect information about your use of the Service and other websites."
		: ""
}

${
	formData.hasCookies
		? "We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
		: ""
}`
		: ""
}

10. DISCLAIMER

The information on this ${
			formData.businessType
		} is provided on an "as is" basis. To the fullest extent permitted by law, this Company:

- Excludes all representations and warranties relating to this website and its contents
- Excludes all liability for damages arising out of or in connection with your use of this website

11. LIMITATION OF LIABILITY

In no event shall ${
			formData.companyName
		}, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.

12. GOVERNING LAW

These Terms shall be interpreted and governed by the laws of ${
			formData.country
		}, without regard to its conflict of law provisions.

Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.

13. CHANGES TO TERMS

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.

14. CONTACT INFORMATION

If you have any questions about these Terms and Conditions, please contact us at:

Email: ${formData.contactEmail}
Website: ${formData.websiteUrl}

This document was last updated on ${currentDate}.`;

		setGeneratedTerms(terms);
		toast.success("Terms and Conditions generated successfully");
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(generatedTerms);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			toast.success("Terms and Conditions copied to clipboard");
		} catch (error) {
			toast.error("Failed to copy to clipboard");
		}
	};

	const downloadTerms = () => {
		const blob = new Blob([generatedTerms], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${formData.companyName.replace(
			/\s+/g,
			"_"
		)}_Terms_and_Conditions.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4'>
			<div className='max-w-6xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Terms & Conditions Generator
					</h1>
					<p className='text-gray-600'>
						Create professional terms and conditions for your
						website or business
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Input Section */}
					<div className='space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<FileText className='w-5 h-5' />
									Business Information
								</CardTitle>
								<CardDescription>
									Enter your business details to generate
									customized terms
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<Label htmlFor='company-name'>
										Company/Website Name *
									</Label>
									<Input
										id='company-name'
										value={formData.companyName}
										onChange={(e) =>
											setFormData({
												...formData,
												companyName: e.target.value,
											})
										}
										placeholder='Your Company Name'
									/>
								</div>

								<div>
									<Label htmlFor='website-url'>
										Website URL *
									</Label>
									<Input
										id='website-url'
										value={formData.websiteUrl}
										onChange={(e) =>
											setFormData({
												...formData,
												websiteUrl: e.target.value,
											})
										}
										placeholder='https://yourwebsite.com'
									/>
								</div>

								<div>
									<Label htmlFor='contact-email'>
										Contact Email *
									</Label>
									<Input
										id='contact-email'
										type='email'
										value={formData.contactEmail}
										onChange={(e) =>
											setFormData({
												...formData,
												contactEmail: e.target.value,
											})
										}
										placeholder='contact@yourcompany.com'
									/>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label htmlFor='country'>Country</Label>
										<Select
											value={formData.country}
											onValueChange={(value) =>
												setFormData({
													...formData,
													country: value,
												})
											}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='United States'>
													United States
												</SelectItem>
												<SelectItem value='Canada'>
													Canada
												</SelectItem>
												<SelectItem value='United Kingdom'>
													United Kingdom
												</SelectItem>
												<SelectItem value='Australia'>
													Australia
												</SelectItem>
												<SelectItem value='Germany'>
													Germany
												</SelectItem>
												<SelectItem value='France'>
													France
												</SelectItem>
												<SelectItem value='Other'>
													Other
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor='business-type'>
											Business Type
										</Label>
										<Select
											value={formData.businessType}
											onValueChange={(value) =>
												setFormData({
													...formData,
													businessType: value,
												})
											}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='website'>
													Website
												</SelectItem>
												<SelectItem value='ecommerce'>
													E-commerce
												</SelectItem>
												<SelectItem value='saas'>
													SaaS
												</SelectItem>
												<SelectItem value='blog'>
													Blog
												</SelectItem>
												<SelectItem value='marketplace'>
													Marketplace
												</SelectItem>
												<SelectItem value='mobile app'>
													Mobile App
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Shield className='w-5 h-5' />
									Service Features
								</CardTitle>
								<CardDescription>
									Select the features your service includes
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-1 gap-3'>
									<div className='flex items-center space-x-2'>
										<Checkbox
											id='user-accounts'
											checked={formData.hasUserAccounts}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													hasUserAccounts:
														checked as boolean,
												})
											}
										/>
										<Label htmlFor='user-accounts'>
											User accounts/registration
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Checkbox
											id='payments'
											checked={formData.hasPayments}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													hasPayments:
														checked as boolean,
												})
											}
										/>
										<Label htmlFor='payments'>
											Payment processing
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Checkbox
											id='subscriptions'
											checked={formData.hasSubscriptions}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													hasSubscriptions:
														checked as boolean,
												})
											}
										/>
										<Label htmlFor='subscriptions'>
											Subscription services
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Checkbox
											id='user-content'
											checked={formData.hasUserContent}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													hasUserContent:
														checked as boolean,
												})
											}
										/>
										<Label htmlFor='user-content'>
											User-generated content
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Checkbox
											id='third-party'
											checked={
												formData.hasThirdPartyServices
											}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													hasThirdPartyServices:
														checked as boolean,
												})
											}
										/>
										<Label htmlFor='third-party'>
											Third-party services
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Checkbox
											id='analytics'
											checked={formData.hasAnalytics}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													hasAnalytics:
														checked as boolean,
												})
											}
										/>
										<Label htmlFor='analytics'>
											Analytics tracking
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Checkbox
											id='cookies'
											checked={formData.hasCookies}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													hasCookies:
														checked as boolean,
												})
											}
										/>
										<Label htmlFor='cookies'>Cookies</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Checkbox
											id='age-restriction'
											checked={formData.hasAgeRestriction}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													hasAgeRestriction:
														checked as boolean,
												})
											}
										/>
										<Label htmlFor='age-restriction'>
											Age restrictions
										</Label>
									</div>

									{formData.hasAgeRestriction && (
										<div className='ml-6'>
											<Label htmlFor='min-age'>
												Minimum Age
											</Label>
											<Select
												value={formData.minAge}
												onValueChange={(value) =>
													setFormData({
														...formData,
														minAge: value,
													})
												}>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='13'>
														13 years
													</SelectItem>
													<SelectItem value='16'>
														16 years
													</SelectItem>
													<SelectItem value='18'>
														18 years
													</SelectItem>
													<SelectItem value='21'>
														21 years
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									)}
								</div>

								<Button
									onClick={generateTerms}
									className='w-full'
									disabled={
										!formData.companyName ||
										!formData.websiteUrl ||
										!formData.contactEmail
									}>
									Generate Terms & Conditions
								</Button>
							</CardContent>
						</Card>

						{/* Tips */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Globe className='w-5 h-5' />
									Important Notes
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3 text-sm'>
								<div className='flex items-start gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
									<p>
										<strong>Legal Review:</strong> Have a
										lawyer review your terms before
										publishing
									</p>
								</div>
								<div className='flex items-start gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
									<p>
										<strong>Regular Updates:</strong> Review
										and update your terms regularly
									</p>
								</div>
								<div className='flex items-start gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
									<p>
										<strong>Clear Display:</strong> Make
										terms easily accessible on your website
									</p>
								</div>
								<div className='flex items-start gap-2'>
									<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
									<p>
										<strong>User Acceptance:</strong>{" "}
										Require users to accept terms before
										using your service
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Results Section */}
					<div className='space-y-6'>
						{generatedTerms && (
							<Card>
								<CardHeader>
									<CardTitle className='flex items-center justify-between'>
										Generated Terms & Conditions
										<div className='flex gap-2'>
											<Button
												onClick={copyToClipboard}
												size='sm'
												variant='outline'>
												{copied ? (
													<Check className='w-4 h-4 mr-2' />
												) : (
													<Copy className='w-4 h-4 mr-2' />
												)}
												{copied ? "Copied!" : "Copy"}
											</Button>
											<Button
												onClick={downloadTerms}
												size='sm'>
												<Download className='w-4 h-4 mr-2' />
												Download
											</Button>
										</div>
									</CardTitle>
									<CardDescription>
										Your customized terms and conditions
										document
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Textarea
										value={generatedTerms}
										readOnly
										className='font-mono text-sm h-96'
									/>
								</CardContent>
							</Card>
						)}

						{!generatedTerms && (
							<Card>
								<CardContent className='text-center py-12'>
									<FileText className='w-12 h-12 text-gray-400 mx-auto mb-4' />
									<h3 className='text-lg font-medium text-gray-900 mb-2'>
										No Terms Generated Yet
									</h3>
									<p className='text-gray-500'>
										Fill in your business information to
										generate terms and conditions
									</p>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
