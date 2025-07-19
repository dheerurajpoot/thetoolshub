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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Check, Shield, Globe } from "lucide-react";
import { toast } from "sonner";

interface PrivacyData {
	companyName: string;
	websiteUrl: string;
	contactEmail: string;
	country: string;
	hasUserAccounts: boolean;
	hasPayments: boolean;
	hasUserContent: boolean;
	hasThirdPartyServices: boolean;
	hasAnalytics: boolean;
	hasCookies: boolean;
}

export default function PrivacyPolicyGenerator() {
	const [formData, setFormData] = useState<PrivacyData>({
		companyName: "",
		websiteUrl: "",
		contactEmail: "",
		country: "United States",
		hasUserAccounts: false,
		hasPayments: false,
		hasUserContent: false,
		hasThirdPartyServices: false,
		hasAnalytics: false,
		hasCookies: false,
	});

	const [generatedPolicy, setGeneratedPolicy] = useState("");
	const [copied, setCopied] = useState(false);

	const generatePolicy = () => {
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

		const policy = `PRIVACY POLICY\n\nLast updated: ${currentDate}\n\n1. INTRODUCTION\n\n${
			formData.companyName
		} ("we", "us", or "our") operates the website located at ${
			formData.websiteUrl
		} (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.\n\n2. INFORMATION WE COLLECT\n\nWe may collect information that you voluntarily provide to us when registering on the Service, expressing an interest in obtaining information about us or our products and services, when participating in activities on the Service, or otherwise contacting us.\n\n${
			formData.hasUserAccounts
				? `- Account Information: If you create an account, we may collect your name, email address, and other relevant information.\n`
				: ""
		}${
			formData.hasPayments
				? `- Payment Data: If you make purchases, we may collect data necessary to process your payment, such as your payment instrument number (e.g., credit card number), and the security code associated with your payment instrument.\n`
				: ""
		}${
			formData.hasUserContent
				? `- User Content: Any content you post, upload, or otherwise make available via the Service.\n`
				: ""
		}- Contact Information: Email address, country, and other information you provide.\n\n3. USE OF YOUR INFORMATION\n\nWe use the information we collect to:\n- Provide, operate, and maintain our Service\n- Improve, personalize, and expand our Service\n- Communicate with you, including for customer service, updates, and marketing\n- Process your transactions\n- Prevent fraudulent activity\n- Comply with legal obligations\n\n4. COOKIES AND TRACKING TECHNOLOGIES\n\n${
			formData.hasCookies
				? `We use cookies and similar tracking technologies to track activity on our Service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.`
				: `We do not use cookies or similar tracking technologies on our Service.`
		}\n\n5. ANALYTICS\n\n${
			formData.hasAnalytics
				? `We may use third-party analytics services to monitor and analyze the use of our Service. These services may collect information sent by your browser as part of a web page request, such as cookies or your IP address.`
				: `We do not use analytics services to track users on our Service.`
		}\n\n6. THIRD-PARTY SERVICES\n\n${
			formData.hasThirdPartyServices
				? `Our Service may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the privacy practices of such third parties.`
				: `We do not share your information with third-party services except as necessary to provide our Service or comply with the law.`
		}\n\n7. DATA SECURITY\n\nWe use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.\n\n8. CHILDREN'S PRIVACY\n\nOur Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.\n\n9. CHANGES TO THIS PRIVACY POLICY\n\nWe may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.\n\n10. CONTACT US\n\nIf you have any questions about this Privacy Policy, you can contact us at:\nEmail: ${
			formData.contactEmail
		}\nWebsite: ${
			formData.websiteUrl
		}\n\nThis document was last updated on ${currentDate}.`;

		setGeneratedPolicy(policy);
		toast.success("Privacy Policy generated successfully");
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(generatedPolicy);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			toast.success("Privacy Policy copied to clipboard");
		} catch (error) {
			toast.error("Failed to copy to clipboard");
		}
	};

	const downloadPolicy = () => {
		const blob = new Blob([generatedPolicy], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${formData.companyName.replace(
			/\s+/g,
			"_"
		)}_Privacy_Policy.txt`;
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
						Privacy Policy Generator
					</h1>
					<p className='text-gray-600'>
						Create a professional privacy policy for your website or
						business
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Input Section */}
					<div className='space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Shield className='w-5 h-5' />
									Business Information
								</CardTitle>
								<CardDescription>
									Enter your business details to generate a
									customized privacy policy
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
								<div>
									<Label htmlFor='country'>Country</Label>
									<Input
										id='country'
										value={formData.country}
										onChange={(e) =>
											setFormData({
												...formData,
												country: e.target.value,
											})
										}
										placeholder='Country'
									/>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Globe className='w-5 h-5' />
									Features
								</CardTitle>
								<CardDescription>
									Select the features relevant to your website
									or business
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex flex-col gap-2'>
									<Checkbox
										id='user-accounts'
										checked={formData.hasUserAccounts}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												hasUserAccounts: !!checked,
											})
										}
									/>
									<Label htmlFor='user-accounts'>
										User Accounts
									</Label>
									<Checkbox
										id='payments'
										checked={formData.hasPayments}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												hasPayments: !!checked,
											})
										}
									/>
									<Label htmlFor='payments'>Payments</Label>
									<Checkbox
										id='user-content'
										checked={formData.hasUserContent}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												hasUserContent: !!checked,
											})
										}
									/>
									<Label htmlFor='user-content'>
										User Content
									</Label>
									<Checkbox
										id='third-party-services'
										checked={formData.hasThirdPartyServices}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												hasThirdPartyServices:
													!!checked,
											})
										}
									/>
									<Label htmlFor='third-party-services'>
										Third-Party Services
									</Label>
									<Checkbox
										id='analytics'
										checked={formData.hasAnalytics}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												hasAnalytics: !!checked,
											})
										}
									/>
									<Label htmlFor='analytics'>Analytics</Label>
									<Checkbox
										id='cookies'
										checked={formData.hasCookies}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												hasCookies: !!checked,
											})
										}
									/>
									<Label htmlFor='cookies'>Cookies</Label>
								</div>
							</CardContent>
						</Card>
						<Button className='w-full' onClick={generatePolicy}>
							Generate Privacy Policy
						</Button>
					</div>
					{/* Output Section */}
					<div className='space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Shield className='w-5 h-5' />
									Generated Privacy Policy
								</CardTitle>
								<CardDescription>
									Copy or download your generated privacy
									policy
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Textarea
									className='w-full h-96 resize-none'
									value={generatedPolicy}
									readOnly
								/>
								<div className='flex gap-4 mt-4'>
									<Button
										onClick={copyToClipboard}
										variant='outline'
										disabled={!generatedPolicy}>
										{copied ? (
											<Check className='w-4 h-4 mr-2' />
										) : (
											<Copy className='w-4 h-4 mr-2' />
										)}
										Copy
									</Button>
									<Button
										onClick={downloadPolicy}
										variant='outline'
										disabled={!generatedPolicy}>
										<Download className='w-4 h-4 mr-2' />
										Download
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
