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
import {
	Copy,
	Download,
	Check,
	FileText,
	Shield,
	AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface DisclaimerData {
	companyName: string;
	websiteUrl: string;
	contactEmail: string;
	disclaimerType: string;
	hasAffiliate: boolean;
	hasMedical: boolean;
	hasFinancial: boolean;
	hasLegal: boolean;
	hasEducational: boolean;
	hasPersonalOpinions: boolean;
	hasExternalLinks: boolean;
	hasAccuracy: boolean;
	hasAvailability: boolean;
}

export default function DisclaimerGenerator() {
	const [formData, setFormData] = useState<DisclaimerData>({
		companyName: "",
		websiteUrl: "",
		contactEmail: "",
		disclaimerType: "general",
		hasAffiliate: false,
		hasMedical: false,
		hasFinancial: false,
		hasLegal: false,
		hasEducational: false,
		hasPersonalOpinions: false,
		hasExternalLinks: false,
		hasAccuracy: false,
		hasAvailability: false,
	});

	const [generatedDisclaimer, setGeneratedDisclaimer] = useState("");
	const [copied, setCopied] = useState(false);

	const generateDisclaimer = () => {
		if (!formData.companyName || !formData.websiteUrl) {
			toast.error("Missing Information", {
				description: "Please fill in the required fields",
			});
			return;
		}

		const currentDate = new Date().toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		let disclaimer = `DISCLAIMER

Last updated: ${currentDate}

The information contained on ${formData.websiteUrl} (the "Service") is for general information purposes only.

${formData.companyName} assumes no responsibility for errors or omissions in the contents of the Service.

`;

		// General disclaimer sections
		if (formData.hasAccuracy) {
			disclaimer += `ACCURACY OF INFORMATION

While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.

`;
		}

		if (formData.hasAvailability) {
			disclaimer += `WEBSITE AVAILABILITY

In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.

Through this website, you are able to link to other websites which are not under the control of ${formData.companyName}. We have no control over the nature, content, and availability of those sites.

`;
		}

		if (formData.hasExternalLinks) {
			disclaimer += `EXTERNAL LINKS

Our Service may contain links to external websites that are not provided or maintained by or in any way affiliated with ${formData.companyName}.

Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.

`;
		}

		// Specific disclaimer types
		if (formData.hasMedical) {
			disclaimer += `MEDICAL DISCLAIMER

The information on this website is not intended or implied to be a substitute for professional medical advice, diagnosis, or treatment. All content, including text, graphics, images, and information, contained on or available through this website is for general information purposes only.

${formData.companyName} makes no representation and assumes no responsibility for the accuracy of information contained on or available through this website, and such information is subject to change without notice.

You are encouraged to confirm any information obtained from or through this website with other sources, and review all information regarding any medical condition or treatment with your physician.

NEVER DISREGARD PROFESSIONAL MEDICAL ADVICE OR DELAY SEEKING MEDICAL TREATMENT BECAUSE OF SOMETHING YOU HAVE READ ON OR ACCESSED THROUGH THIS WEBSITE.

`;
		}

		if (formData.hasFinancial) {
			disclaimer += `FINANCIAL DISCLAIMER

The information provided on this website does not constitute investment advice, financial advice, trading advice, or any other sort of advice and you should not treat any of the website's content as such.

${formData.companyName} does not recommend that any cryptocurrency should be bought, sold, or held by you. Do conduct your own due diligence and consult your financial advisor before making any investment decisions.

Past performance is not indicative of future results. Any investment or trading is risky, and you may lose some or all of your money.

`;
		}

		if (formData.hasLegal) {
			disclaimer += `LEGAL DISCLAIMER

The information provided on this website is not intended as legal advice. While we strive to provide accurate and up-to-date information, laws vary by jurisdiction and change frequently.

You should not act upon this information without seeking professional legal counsel. ${formData.companyName} disclaims any liability for actions taken based on the information provided on this website.

For specific legal advice, please consult with a qualified attorney in your jurisdiction.

`;
		}

		if (formData.hasEducational) {
			disclaimer += `EDUCATIONAL DISCLAIMER

The content provided on this website is for educational and informational purposes only. It is not intended to be a substitute for professional advice, whether medical, legal, financial, or otherwise.

While we make every effort to provide accurate and up-to-date information, we make no guarantees about the completeness, accuracy, or reliability of the information provided.

`;
		}

		if (formData.hasAffiliate) {
			disclaimer += `AFFILIATE DISCLAIMER

This website contains affiliate links, which means we may receive a commission if you click a link and purchase something that we have recommended. While clicking these links won't cost you any extra money, they will help us keep this site up and running.

Please note that we only recommend products and services that we believe will add value to our readers. We are independently owned and the opinions expressed here are our own.

`;
		}

		if (formData.hasPersonalOpinions) {
			disclaimer += `PERSONAL OPINIONS

The views and opinions expressed on this website are purely those of the authors and do not necessarily reflect the official policy or position of ${formData.companyName}.

Any content provided by our bloggers or authors are of their opinion and are not intended to malign any religion, ethnic group, club, organization, company, individual, or anyone or anything.

`;
		}

		disclaimer += `LIMITATION OF LIABILITY

In no event shall ${
			formData.companyName
		}, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract.

${
	formData.companyName
}, including its officers, directors, and employees shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.

CHANGES TO DISCLAIMER

We reserve the right to update this disclaimer at any time. When we do, we will revise the updated date at the top of this page.

CONTACT INFORMATION

If you have any questions about this disclaimer, please contact us at:
${formData.contactEmail ? `Email: ${formData.contactEmail}` : ""}
Website: ${formData.websiteUrl}

This disclaimer was last updated on ${currentDate}.`;

		setGeneratedDisclaimer(disclaimer);
		toast.success("Disclaimer generated successfully");
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(generatedDisclaimer);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			toast("Disclaimer copied to clipboard");
		} catch (error) {
			toast.error("Failed to copy to clipboard");
		}
	};

	const downloadDisclaimer = () => {
		const blob = new Blob([generatedDisclaimer], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${formData.companyName.replace(
			/\s+/g,
			"_"
		)}_Disclaimer.txt`;
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
						Disclaimer Generator
					</h1>
					<p className='text-gray-600'>
						Create professional disclaimers to protect your website
						and business
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Input Section */}
					<div className='space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<FileText className='w-5 h-5' />
									Basic Information
								</CardTitle>
								<CardDescription>
									Enter your website details
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
										Contact Email (Optional)
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
									<Label htmlFor='disclaimer-type'>
										Disclaimer Type
									</Label>
									<Select
										value={formData.disclaimerType}
										onValueChange={(value) =>
											setFormData({
												...formData,
												disclaimerType: value,
											})
										}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='general'>
												General Website
											</SelectItem>
											<SelectItem value='blog'>
												Blog/Content Site
											</SelectItem>
											<SelectItem value='ecommerce'>
												E-commerce
											</SelectItem>
											<SelectItem value='service'>
												Service Provider
											</SelectItem>
											<SelectItem value='educational'>
												Educational
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Shield className='w-5 h-5' />
									Disclaimer Sections
								</CardTitle>
								<CardDescription>
									Select the sections to include in your
									disclaimer
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-1 gap-3'>
									<div className='flex items-center space-x-2'>
										<Checkbox
											id='accuracy'
											checked={formData.hasAccuracy}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													hasAccuracy:
														checked as boolean,
												})
											}
										/>
										<Label htmlFor='accuracy'>
											Information accuracy disclaimer
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Checkbox
											id='availability'
											checked={formData.hasAvailability}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													hasAvailability:
														checked as boolean,
												})
											}
										/>
										<Label htmlFor='availability'>
											Website availability disclaimer
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Checkbox
											id='external-links'
											checked={formData.hasExternalLinks}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													hasExternalLinks:
														checked as boolean,
												})
											}
										/>
										<Label htmlFor='external-links'>
											External links disclaimer
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Checkbox
											id='affiliate'
											checked={formData.hasAffiliate}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													hasAffiliate:
														checked as boolean,
												})
											}
										/>
										<Label htmlFor='affiliate'>
											Affiliate links disclaimer
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Checkbox
											id='personal-opinions'
											checked={
												formData.hasPersonalOpinions
											}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													hasPersonalOpinions:
														checked as boolean,
												})
											}
										/>
										<Label htmlFor='personal-opinions'>
											Personal opinions disclaimer
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Checkbox
											id='educational'
											checked={formData.hasEducational}
											onCheckedChange={(checked) =>
												setFormData({
													...formData,
													hasEducational:
														checked as boolean,
												})
											}
										/>
										<Label htmlFor='educational'>
											Educational content disclaimer
										</Label>
									</div>
								</div>

								<div className='border-t pt-4'>
									<h4 className='font-medium mb-3 text-red-600 flex items-center gap-2'>
										<AlertTriangle className='w-4 h-4' />
										Professional Advice Disclaimers
									</h4>
									<div className='grid grid-cols-1 gap-3'>
										<div className='flex items-center space-x-2'>
											<Checkbox
												id='medical'
												checked={formData.hasMedical}
												onCheckedChange={(checked) =>
													setFormData({
														...formData,
														hasMedical:
															checked as boolean,
													})
												}
											/>
											<Label htmlFor='medical'>
												Medical advice disclaimer
											</Label>
										</div>

										<div className='flex items-center space-x-2'>
											<Checkbox
												id='financial'
												checked={formData.hasFinancial}
												onCheckedChange={(checked) =>
													setFormData({
														...formData,
														hasFinancial:
															checked as boolean,
													})
												}
											/>
											<Label htmlFor='financial'>
												Financial advice disclaimer
											</Label>
										</div>

										<div className='flex items-center space-x-2'>
											<Checkbox
												id='legal'
												checked={formData.hasLegal}
												onCheckedChange={(checked) =>
													setFormData({
														...formData,
														hasLegal:
															checked as boolean,
													})
												}
											/>
											<Label htmlFor='legal'>
												Legal advice disclaimer
											</Label>
										</div>
									</div>
								</div>

								<Button
									onClick={generateDisclaimer}
									className='w-full'
									disabled={
										!formData.companyName ||
										!formData.websiteUrl
									}>
									Generate Disclaimer
								</Button>
							</CardContent>
						</Card>

						{/* Warning */}
						<Card className='border-orange-200 bg-orange-50'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2 text-orange-800'>
									<AlertTriangle className='w-5 h-5' />
									Important Legal Notice
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3 text-sm text-orange-700'>
								<p>
									<strong>
										This tool provides general disclaimer
										templates only.
									</strong>
								</p>
								<p>
									• Consult with a qualified attorney for
									legal advice
								</p>
								<p>• Laws vary by jurisdiction and industry</p>
								<p>
									• Review and customize the disclaimer for
									your specific needs
								</p>
								<p>
									• Update your disclaimer regularly as your
									business evolves
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Results Section */}
					<div className='space-y-6'>
						{generatedDisclaimer && (
							<Card>
								<CardHeader>
									<CardTitle className='flex items-center justify-between'>
										Generated Disclaimer
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
												onClick={downloadDisclaimer}
												size='sm'>
												<Download className='w-4 h-4 mr-2' />
												Download
											</Button>
										</div>
									</CardTitle>
									<CardDescription>
										Your customized disclaimer document
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Textarea
										value={generatedDisclaimer}
										readOnly
										className='font-mono text-sm h-96'
									/>
								</CardContent>
							</Card>
						)}

						{!generatedDisclaimer && (
							<Card>
								<CardContent className='text-center py-12'>
									<FileText className='w-12 h-12 text-gray-400 mx-auto mb-4' />
									<h3 className='text-lg font-medium text-gray-900 mb-2'>
										No Disclaimer Generated Yet
									</h3>
									<p className='text-gray-500'>
										Fill in your information to generate a
										disclaimer
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
