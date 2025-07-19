"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Palette, Copy, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";

export default function ColorPaletteGenerator() {
	const [baseColor, setBaseColor] = useState("#3B82F6");
	const [paletteType, setPaletteType] = useState("complementary");
	const [colorCount, setColorCount] = useState("5");
	const [palette, setPalette] = useState<string[]>([]);

	const hexToHsl = (hex: string) => {
		const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
		const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
		const b = Number.parseInt(hex.slice(5, 7), 16) / 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0,
			s = 0;
		const l = (max + min) / 2;

		if (max !== min) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}

		return [h * 360, s * 100, l * 100];
	};

	const hslToHex = (h: number, s: number, l: number) => {
		h /= 360;
		s /= 100;
		l /= 100;

		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		let r, g, b;
		if (s === 0) {
			r = g = b = l;
		} else {
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		const toHex = (c: number) => {
			const hex = Math.round(c * 255).toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		};

		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	};

	const generatePalette = () => {
		const [h, s, l] = hexToHsl(baseColor);
		const count = Number.parseInt(colorCount);
		const colors: string[] = [];

		switch (paletteType) {
			case "monochromatic":
				for (let i = 0; i < count; i++) {
					const newL = Math.max(
						10,
						Math.min(90, l + (i - Math.floor(count / 2)) * 15)
					);
					colors.push(hslToHex(h, s, newL));
				}
				break;

			case "analogous":
				for (let i = 0; i < count; i++) {
					const newH = (h + (i - Math.floor(count / 2)) * 30) % 360;
					colors.push(hslToHex(newH < 0 ? newH + 360 : newH, s, l));
				}
				break;

			case "complementary":
				colors.push(baseColor);
				colors.push(hslToHex((h + 180) % 360, s, l));
				for (let i = 2; i < count; i++) {
					const newH = (h + (i - 1) * 60) % 360;
					colors.push(hslToHex(newH, s * 0.8, l));
				}
				break;

			case "triadic":
				colors.push(baseColor);
				colors.push(hslToHex((h + 120) % 360, s, l));
				colors.push(hslToHex((h + 240) % 360, s, l));
				for (let i = 3; i < count; i++) {
					const newH = (h + i * 72) % 360;
					colors.push(hslToHex(newH, s * 0.7, l));
				}
				break;

			case "tetradic":
				colors.push(baseColor);
				colors.push(hslToHex((h + 90) % 360, s, l));
				colors.push(hslToHex((h + 180) % 360, s, l));
				colors.push(hslToHex((h + 270) % 360, s, l));
				for (let i = 4; i < count; i++) {
					const newH = (h + i * 45) % 360;
					colors.push(hslToHex(newH, s * 0.6, l));
				}
				break;

			case "random":
				colors.push(baseColor);
				for (let i = 1; i < count; i++) {
					const newH = Math.random() * 360;
					const newS = 40 + Math.random() * 40;
					const newL = 30 + Math.random() * 40;
					colors.push(hslToHex(newH, newS, newL));
				}
				break;
		}

		setPalette(colors.slice(0, count));
		toast.success("Palette Generated", {
			description: `Generated ${count} colors using ${paletteType} harmony`,
		});
	};

	const copyColor = (color: string) => {
		navigator.clipboard.writeText(color);
		toast("Copied!", {
			description: `Color ${color} copied to clipboard`,
		});
	};

	const copyAllColors = () => {
		const colorString = palette.join(", ");
		navigator.clipboard.writeText(colorString);
		toast("All Colors Copied!", {
			description: "All colors copied to clipboard",
		});
	};

	const downloadPalette = () => {
		const css = palette
			.map((color, index) => `--color-${index + 1}: ${color};`)
			.join("\n");

		const content = `:root {\n${css}\n}`;
		const blob = new Blob([content], { type: "text/css" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "color-palette.css";
		a.click();
		URL.revokeObjectURL(url);
	};

	const getContrastColor = (hexColor: string) => {
		const r = Number.parseInt(hexColor.slice(1, 3), 16);
		const g = Number.parseInt(hexColor.slice(3, 5), 16);
		const b = Number.parseInt(hexColor.slice(5, 7), 16);
		const brightness = (r * 299 + g * 587 + b * 114) / 1000;
		return brightness > 128 ? "#000000" : "#FFFFFF";
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4'>
			<div className='container mx-auto max-w-6xl'>
				<div className='text-center mb-8'>
					<div className='w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Palette className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold mb-2 text-gray-800'>
						Color Palette Generator
					</h1>
					<p className='text-gray-600'>
						Generate beautiful color palettes for your designs
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Settings */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Palette Settings</CardTitle>
							<CardDescription>
								Configure your color palette generation
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-2'>
								<Label>Base Color</Label>
								<div className='flex gap-2'>
									<Input
										type='color'
										value={baseColor}
										onChange={(e) =>
											setBaseColor(e.target.value)
										}
										className='w-16 h-10 p-1 border rounded'
									/>
									<Input
										value={baseColor}
										onChange={(e) =>
											setBaseColor(e.target.value)
										}
										placeholder='#3B82F6'
										className='flex-1'
									/>
								</div>
							</div>

							<div className='space-y-2'>
								<Label>Color Harmony</Label>
								<Select
									value={paletteType}
									onValueChange={setPaletteType}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='monochromatic'>
											Monochromatic
										</SelectItem>
										<SelectItem value='analogous'>
											Analogous
										</SelectItem>
										<SelectItem value='complementary'>
											Complementary
										</SelectItem>
										<SelectItem value='triadic'>
											Triadic
										</SelectItem>
										<SelectItem value='tetradic'>
											Tetradic
										</SelectItem>
										<SelectItem value='random'>
											Random
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className='space-y-2'>
								<Label>Number of Colors</Label>
								<Select
									value={colorCount}
									onValueChange={setColorCount}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='3'>
											3 Colors
										</SelectItem>
										<SelectItem value='5'>
											5 Colors
										</SelectItem>
										<SelectItem value='7'>
											7 Colors
										</SelectItem>
										<SelectItem value='10'>
											10 Colors
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<Button
								onClick={generatePalette}
								className='w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
								size='lg'>
								<RefreshCw className='w-4 h-4 mr-2' />
								Generate Palette
							</Button>

							<div className='bg-blue-50 p-4 rounded-lg'>
								<h3 className='font-semibold text-blue-800 mb-2'>
									Color Harmony Types:
								</h3>
								<div className='text-sm text-blue-700 space-y-1'>
									<p>
										<strong>Monochromatic:</strong>{" "}
										Different shades of the same color
									</p>
									<p>
										<strong>Analogous:</strong> Colors next
										to each other on color wheel
									</p>
									<p>
										<strong>Complementary:</strong> Colors
										opposite on color wheel
									</p>
									<p>
										<strong>Triadic:</strong> Three colors
										evenly spaced on color wheel
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Generated Palette */}
					<Card className='shadow-xl border-0'>
						<CardHeader>
							<CardTitle>Generated Palette</CardTitle>
							<CardDescription>
								Click on any color to copy its hex code
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{palette.length > 0 ? (
								<>
									<div className='grid grid-cols-1 gap-3'>
										{palette.map((color, index) => (
											<div
												key={index}
												onClick={() => copyColor(color)}
												className='flex items-center gap-4 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow border'
												style={{
													backgroundColor: color,
												}}>
												<div
													className='w-16 h-16 rounded-lg border-2 border-white shadow-sm'
													style={{
														backgroundColor: color,
													}}
												/>
												<div className='flex-1'>
													<p
														className='font-mono font-bold text-lg'
														style={{
															color: getContrastColor(
																color
															),
														}}>
														{color.toUpperCase()}
													</p>
													<p
														className='text-sm opacity-75'
														style={{
															color: getContrastColor(
																color
															),
														}}>
														Click to copy
													</p>
												</div>
												<Copy
													className='w-5 h-5'
													style={{
														color: getContrastColor(
															color
														),
													}}
												/>
											</div>
										))}
									</div>

									<div className='flex gap-2'>
										<Button
											onClick={copyAllColors}
											variant='outline'
											className='flex-1 bg-transparent'>
											<Copy className='w-4 h-4 mr-2' />
											Copy All
										</Button>
										<Button
											onClick={downloadPalette}
											variant='outline'
											className='flex-1 bg-transparent'>
											<Download className='w-4 h-4 mr-2' />
											Download CSS
										</Button>
									</div>
								</>
							) : (
								<div className='text-center py-12 text-gray-400'>
									<Palette className='w-16 h-16 mx-auto mb-4' />
									<p>
										Click &quot;Generate Palette&quot; to
										create colors
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Color Theory Tips */}
				<Card className='shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 mt-8'>
					<CardContent className='p-6'>
						<h3 className='font-semibold text-gray-800 mb-4'>
							🎨 Color Theory Tips:
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
							<ul className='space-y-2'>
								<li>
									• <strong>60-30-10 Rule:</strong> Use 60%
									dominant, 30% secondary, 10% accent
								</li>
								<li>
									• <strong>Contrast is key:</strong> Ensure
									readability with sufficient contrast
								</li>
								<li>
									• <strong>Test accessibility:</strong> Check
									WCAG compliance for text colors
								</li>
								<li>
									• <strong>Consider context:</strong> Colors
									have different meanings in cultures
								</li>
							</ul>
							<ul className='space-y-2'>
								<li>
									• <strong>Warm vs Cool:</strong> Warm colors
									advance, cool colors recede
								</li>
								<li>
									• <strong>Saturation matters:</strong> High
									saturation draws attention
								</li>
								<li>
									• <strong>Brand consistency:</strong>{" "}
									Maintain color consistency across designs
								</li>
								<li>
									• <strong>Print vs Digital:</strong> Colors
									may appear different in print
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
