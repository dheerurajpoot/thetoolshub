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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Copy, RefreshCw, FileText, Zap } from "lucide-react";
import { toast } from "sonner";

const synonymDatabase: { [key: string]: string[] } = {
	good: [
		"excellent",
		"great",
		"outstanding",
		"superb",
		"wonderful",
		"fantastic",
		"fine",
		"positive",
		"favorable",
		"commendable",
		"admirable",
	],
	bad: [
		"poor",
		"terrible",
		"awful",
		"horrible",
		"dreadful",
		"unacceptable",
		"inferior",
		"subpar",
		"unpleasant",
		"deficient",
		"unsatisfactory",
	],
	big: [
		"large",
		"huge",
		"enormous",
		"massive",
		"gigantic",
		"substantial",
		"immense",
		"colossal",
		"vast",
		"grand",
		"sizable",
	],
	small: [
		"tiny",
		"little",
		"miniature",
		"compact",
		"petite",
		"minor",
		"modest",
		"minute",
		"slight",
		"diminutive",
		"narrow",
	],
	important: [
		"crucial",
		"vital",
		"essential",
		"significant",
		"critical",
		"key",
		"notable",
		"major",
		"meaningful",
		"imperative",
		"pivotal",
	],
	easy: [
		"simple",
		"effortless",
		"straightforward",
		"uncomplicated",
		"basic",
		"elementary",
		"smooth",
		"clear",
		"undemanding",
		"manageable",
		"light",
	],
	difficult: [
		"challenging",
		"complex",
		"complicated",
		"tough",
		"demanding",
		"intricate",
		"arduous",
		"hard",
		"tricky",
		"problematic",
		"laborious",
	],
	fast: [
		"quick",
		"rapid",
		"swift",
		"speedy",
		"hasty",
		"prompt",
		"brisk",
		"expeditious",
		"fleet",
		"nimble",
		"immediate",
	],
	slow: [
		"gradual",
		"leisurely",
		"unhurried",
		"deliberate",
		"sluggish",
		"steady",
		"lagging",
		"slothful",
		"languid",
		"tardy",
		"plodding",
	],
	new: [
		"fresh",
		"recent",
		"modern",
		"contemporary",
		"latest",
		"current",
		"novel",
		"up-to-date",
		"innovative",
		"brand-new",
		"cutting-edge",
	],
	old: [
		"ancient",
		"vintage",
		"traditional",
		"classic",
		"aged",
		"mature",
		"antique",
		"outdated",
		"obsolete",
		"timeworn",
		"historic",
	],
	help: [
		"assist",
		"support",
		"aid",
		"facilitate",
		"contribute",
		"enable",
		"back",
		"serve",
		"guide",
		"lend a hand",
		"cooperate",
	],
	make: [
		"create",
		"produce",
		"generate",
		"construct",
		"build",
		"develop",
		"form",
		"compose",
		"manufacture",
		"assemble",
		"craft",
	],
	use: [
		"utilize",
		"employ",
		"apply",
		"implement",
		"operate",
		"leverage",
		"exploit",
		"adopt",
		"exercise",
		"put to use",
		"deploy",
	],
	get: [
		"obtain",
		"acquire",
		"receive",
		"gain",
		"secure",
		"attain",
		"fetch",
		"procure",
		"collect",
		"earn",
		"derive",
	],
	show: [
		"display",
		"demonstrate",
		"reveal",
		"exhibit",
		"present",
		"illustrate",
		"indicate",
		"manifest",
		"unveil",
		"expose",
		"depict",
	],
	think: [
		"believe",
		"consider",
		"contemplate",
		"reflect",
		"ponder",
		"assume",
		"suppose",
		"deem",
		"regard",
		"reckon",
		"envision",
	],
	know: [
		"understand",
		"comprehend",
		"realize",
		"recognize",
		"acknowledge",
		"grasp",
		"perceive",
		"discern",
		"be aware",
		"be familiar",
		"identify",
	],
	work: [
		"function",
		"operate",
		"perform",
		"execute",
		"labor",
		"toil",
		"act",
		"serve",
		"run",
		"engage",
		"undertake",
	],
	find: [
		"discover",
		"locate",
		"identify",
		"uncover",
		"detect",
		"spot",
		"come across",
		"encounter",
		"track down",
		"unearth",
		"ascertain",
	],
	give: [
		"provide",
		"offer",
		"supply",
		"deliver",
		"present",
		"grant",
		"bestow",
		"furnish",
		"confer",
		"allocate",
		"impart",
	],
	start: [
		"begin",
		"commence",
		"initiate",
		"launch",
		"embark",
		"originate",
		"set out",
		"inaugurate",
		"open",
		"kick off",
		"commence",
	],
	end: [
		"finish",
		"conclude",
		"terminate",
		"complete",
		"close",
		"wrap up",
		"finalize",
		"cease",
		"culminate",
		"wind up",
		"bring to a close",
	],
	happy: [
		"joyful",
		"cheerful",
		"content",
		"delighted",
		"pleased",
		"elated",
		"glad",
		"satisfied",
		"jovial",
		"merry",
		"upbeat",
	],
	sad: [
		"unhappy",
		"sorrowful",
		"dejected",
		"downcast",
		"mournful",
		"gloomy",
		"melancholy",
		"despondent",
		"blue",
		"dispirited",
		"dismal",
	],
	strong: [
		"powerful",
		"sturdy",
		"robust",
		"solid",
		"tough",
		"resilient",
		"forceful",
		"mighty",
		"potent",
		"vigorous",
		"stalwart",
	],
	weak: [
		"fragile",
		"frail",
		"feeble",
		"delicate",
		"brittle",
		"vulnerable",
		"infirm",
		"slight",
		"debilitated",
		"languid",
		"impotent",
	],
	beautiful: [
		"attractive",
		"lovely",
		"pretty",
		"charming",
		"gorgeous",
		"stunning",
		"elegant",
		"appealing",
		"alluring",
		"radiant",
		"picturesque",
	],
	ugly: [
		"unattractive",
		"unsightly",
		"hideous",
		"repulsive",
		"plain",
		"displeasing",
		"grotesque",
		"unappealing",
		"homely",
		"ghastly",
		"offensive",
	],
	hard: [
		"difficult",
		"challenging",
		"tough",
		"arduous",
		"demanding",
		"complicated",
		"tricky",
		"problematic",
		"laborious",
		"grueling",
		"strenuous",
	],
	always: [
		"constantly",
		"continually",
		"invariably",
		"perpetually",
		"forever",
		"eternally",
		"unceasingly",
		"persistently",
		"habitually",
		"regularly",
		"repeatedly",
	],
	never: [
		"not ever",
		"at no time",
		"on no occasion",
		"under no circumstances",
		"not once",
		"by no means",
		"in no way",
		"not at all",
		"no way",
		"not ever once",
		"not for a moment",
	],
	before: [
		"prior to",
		"ahead of",
		"in advance of",
		"previously",
		"earlier",
		"formerly",
		"preceding",
		"in anticipation of",
		"sooner than",
		"in front of",
		"in readiness for",
	],
	after: [
		"following",
		"subsequent to",
		"later",
		"next",
		"in the wake of",
		"behind",
		"since",
		"as soon as",
		"in succession to",
		"in the aftermath of",
		"post",
	],
	because: [
		"since",
		"as",
		"for the reason that",
		"due to",
		"owing to",
		"in view of",
		"considering",
		"seeing that",
		"inasmuch as",
		"on account of",
		"by reason of",
	],
	very: [
		"extremely",
		"highly",
		"remarkably",
		"exceptionally",
		"tremendously",
		"exceedingly",
		"incredibly",
		"immensely",
		"extraordinarily",
		"supremely",
		"particularly",
	],
	really: [
		"truly",
		"genuinely",
		"actually",
		"indeed",
		"certainly",
		"surely",
		"undoubtedly",
		"veritably",
		"positively",
		"authentically",
		"absolutely",
	],
	like: [
		"enjoy",
		"prefer",
		"fancy",
		"appreciate",
		"relish",
		"adore",
		"cherish",
		"delight in",
		"take pleasure in",
		"be fond of",
		"be keen on",
		"be partial to",
	],
	dislike: [
		"hate",
		"detest",
		"loathe",
		"despise",
		"abhor",
		"resent",
		"be averse to",
		"be hostile to",
		"be against",
		"be repelled by",
		"be disinclined to",
	],
	// --- New high-frequency words and synonyms ---
	see: [
		"observe",
		"notice",
		"view",
		"witness",
		"spot",
		"detect",
		"perceive",
		"discern",
		"behold",
		"glimpse",
		"regard",
	],
	say: [
		"state",
		"declare",
		"mention",
		"remark",
		"assert",
		"announce",
		"proclaim",
		"utter",
		"voice",
		"express",
		"articulate",
	],
	tell: [
		"inform",
		"notify",
		"advise",
		"explain",
		"reveal",
		"disclose",
		"communicate",
		"report",
		"relate",
		"divulge",
		"impart",
	],
	ask: [
		"inquire",
		"question",
		"query",
		"request",
		"demand",
		"seek",
		"interrogate",
		"probe",
		"solicit",
		"petition",
		"consult",
	],
	want: [
		"desire",
		"wish",
		"crave",
		"yearn",
		"aspire",
		"long for",
		"hope for",
		"covet",
		"fancy",
		"require",
		"need",
	],
	need: [
		"require",
		"necessitate",
		"demand",
		"want",
		"must have",
		"be obliged",
		"be compelled",
		"be in need of",
		"call for",
		"entail",
		"depend on",
	],
	feel: [
		"sense",
		"perceive",
		"experience",
		"undergo",
		"suffer",
		"endure",
		"be aware of",
		"detect",
		"notice",
		"discern",
		"comprehend",
	],
	try: [
		"attempt",
		"endeavor",
		"strive",
		"seek",
		"aim",
		"undertake",
		"venture",
		"experiment",
		"pursue",
		"test",
		"make an effort",
	],
	call: [
		"name",
		"label",
		"refer to",
		"summon",
		"contact",
		"phone",
		"ring",
		"reach",
		"address",
		"designate",
		"term",
	],
	put: [
		"place",
		"set",
		"position",
		"lay",
		"deposit",
		"assign",
		"insert",
		"establish",
		"install",
		"situate",
		"arrange",
	],
	keep: [
		"retain",
		"hold",
		"preserve",
		"maintain",
		"save",
		"store",
		"safeguard",
		"continue",
		"sustain",
		"protect",
		"cling to",
	],
	let: [
		"allow",
		"permit",
		"enable",
		"authorize",
		"grant",
		"consent",
		"empower",
		"give leave",
		"sanction",
		"approve",
		"tolerate",
	],
	begin: [
		"start",
		"commence",
		"initiate",
		"launch",
		"originate",
		"embark",
		"open",
		"set about",
		"undertake",
		"inaugurate",
		"kick off",
	],
	move: [
		"shift",
		"transfer",
		"relocate",
		"transport",
		"advance",
		"proceed",
		"progress",
		"travel",
		"go",
		"change position",
		"budge",
	],
	play: [
		"perform",
		"participate",
		"engage",
		"compete",
		"act",
		"take part",
		"execute",
		"enact",
		"portray",
		"recreate",
		"frolic",
	],
	run: [
		"jog",
		"sprint",
		"dash",
		"race",
		"hurry",
		"rush",
		"scurry",
		"scamper",
		"bolt",
		"charge",
		"operate",
	],
	walk: [
		"stroll",
		"saunter",
		"amble",
		"wander",
		"march",
		"stride",
		"trek",
		"trudge",
		"meander",
		"perambulate",
		"roam",
	],
	talk: [
		"speak",
		"converse",
		"chat",
		"discuss",
		"communicate",
		"articulate",
		"address",
		"debate",
		"confer",
		"gossip",
		"chatter",
	],
	turn: [
		"rotate",
		"spin",
		"twist",
		"revolve",
		"pivot",
		"veer",
		"swivel",
		"wheel",
		"change direction",
		"divert",
		"swerve",
	],
	bring: [
		"carry",
		"fetch",
		"deliver",
		"convey",
		"transport",
		"transfer",
		"take",
		"provide",
		"supply",
		"bestow",
		"yield",
	],
	write: [
		"compose",
		"pen",
		"author",
		"draft",
		"record",
		"inscribe",
		"note",
		"jot",
		"scribble",
		"document",
		"transcribe",
	],
	read: [
		"peruse",
		"scan",
		"study",
		"examine",
		"review",
		"browse",
		"inspect",
		"look over",
		"skim",
		"interpret",
		"decipher",
	],
	live: [
		"reside",
		"dwell",
		"inhabit",
		"occupy",
		"exist",
		"survive",
		"subsist",
		"remain",
		"stay",
		"abide",
		"be alive",
	],
	house: [
		"home",
		"residence",
		"dwelling",
		"abode",
		"habitation",
		"lodging",
		"quarters",
		"domicile",
		"place",
		"apartment",
		"flat",
	],
	man: [
		"male",
		"gentleman",
		"guy",
		"fellow",
		"chap",
		"bloke",
		"dude",
		"individual",
		"person",
		"human",
		"adult",
	],
	woman: [
		"female",
		"lady",
		"girl",
		"gal",
		"madam",
		"miss",
		"maiden",
		"dame",
		"individual",
		"person",
		"adult",
	],
	child: [
		"kid",
		"youth",
		"minor",
		"youngster",
		"juvenile",
		"toddler",
		"infant",
		"adolescent",
		"teenager",
		"boy",
		"girl",
	],
	day: [
		"date",
		"period",
		"time",
		"occasion",
		"moment",
		"instance",
		"epoch",
		"era",
		"interval",
		"span",
		"phase",
	],
	year: [
		"twelve months",
		"calendar year",
		"fiscal year",
		"annum",
		"period",
		"term",
		"season",
		"cycle",
		"span",
		"era",
		"epoch",
	],
	thing: [
		"object",
		"item",
		"entity",
		"article",
		"device",
		"gadget",
		"instrument",
		"tool",
		"implement",
		"apparatus",
		"contraption",
	],
	place: [
		"location",
		"site",
		"area",
		"spot",
		"venue",
		"region",
		"zone",
		"setting",
		"locale",
		"position",
		"point",
	],
	world: [
		"earth",
		"globe",
		"planet",
		"universe",
		"sphere",
		"realm",
		"domain",
		"cosmos",
		"creation",
		"existence",
		"life",
	],
	hand: [
		"palm",
		"mitt",
		"paw",
		"grip",
		"clutch",
		"hold",
		"fist",
		"appendage",
		"manus",
		"extremity",
		"digit",
	],
	part: [
		"portion",
		"section",
		"segment",
		"piece",
		"fragment",
		"component",
		"element",
		"division",
		"share",
		"bit",
		"slice",
	],
	case: [
		"instance",
		"example",
		"situation",
		"circumstance",
		"event",
		"occurrence",
		"episode",
		"affair",
		"matter",
		"condition",
		"scenario",
	],
	point: [
		"tip",
		"dot",
		"mark",
		"moment",
		"stage",
		"aspect",
		"detail",
		"element",
		"feature",
		"factor",
		"argument",
	],
	company: [
		"business",
		"firm",
		"corporation",
		"enterprise",
		"organization",
		"agency",
		"association",
		"group",
		"outfit",
		"institution",
		"establishment",
	],
	group: [
		"team",
		"party",
		"band",
		"squad",
		"crew",
		"gang",
		"faction",
		"circle",
		"clique",
		"assembly",
		"gathering",
	],
	problem: [
		"issue",
		"difficulty",
		"trouble",
		"complication",
		"obstacle",
		"challenge",
		"dilemma",
		"setback",
		"hurdle",
		"predicament",
		"concern",
	],
	fact: [
		"reality",
		"truth",
		"certainty",
		"actuality",
		"veracity",
		"evidence",
		"detail",
		"information",
		"data",
		"circumstance",
		"event",
	],
};

export default function ArticleRewriter() {
	const [originalText, setOriginalText] = useState("");
	const [rewrittenText, setRewrittenText] = useState("");
	const [rewriteMode, setRewriteMode] = useState("standard");
	const [isProcessing, setIsProcessing] = useState(false);

	const rewriteText = async () => {
		if (!originalText.trim()) {
			toast.error("Please enter some text to rewrite");
			return;
		}

		setIsProcessing(true);

		// Simulate processing time
		await new Promise((resolve) => setTimeout(resolve, 1500));

		try {
			const rewritten = originalText;

			// Split into sentences
			const sentences = rewritten.split(/[.!?]+/).filter((s) => s.trim());

			const rewrittenSentences = sentences.map((sentence) => {
				let newSentence = sentence.trim();

				// Replace words with synonyms
				Object.keys(synonymDatabase).forEach((word) => {
					const synonyms = synonymDatabase[word];
					const regex = new RegExp(`\\b${word}\\b`, "gi");

					if (regex.test(newSentence)) {
						const randomSynonym =
							synonyms[
								Math.floor(Math.random() * synonyms.length)
							];
						newSentence = newSentence.replace(regex, randomSynonym);
					}
				});

				// Apply different rewriting strategies based on mode
				switch (rewriteMode) {
					case "creative":
						newSentence = rewriteCreatively(newSentence);
						break;
					case "formal":
						newSentence = rewriteFormally(newSentence);
						break;
					case "simple":
						newSentence = rewriteSimply(newSentence);
						break;
					default:
						// Standard rewriting
						break;
				}

				return newSentence;
			});

			const finalText = rewrittenSentences.join(". ") + ".";
			setRewrittenText(finalText);
			toast.success("Text rewritten successfully!");
		} catch (error) {
			toast.error("Error rewriting text. Please try again.");
		} finally {
			setIsProcessing(false);
		}
	};

	const rewriteCreatively = (sentence: string) => {
		// Add creative variations
		const creativeStarters = [
			"Interestingly,",
			"Remarkably,",
			"Notably,",
			"Surprisingly,",
		];
		if (Math.random() > 0.7) {
			const starter =
				creativeStarters[
					Math.floor(Math.random() * creativeStarters.length)
				];
			return `${starter} ${sentence.toLowerCase()}`;
		}
		return sentence;
	};

	const rewriteFormally = (sentence: string) => {
		// Make more formal
		return sentence
			.replace(/don't/g, "do not")
			.replace(/can't/g, "cannot")
			.replace(/won't/g, "will not")
			.replace(/it's/g, "it is")
			.replace(/that's/g, "that is");
	};

	const rewriteSimply = (sentence: string) => {
		// Simplify complex words
		return sentence
			.replace(/utilize/g, "use")
			.replace(/demonstrate/g, "show")
			.replace(/facilitate/g, "help")
			.replace(/approximately/g, "about")
			.replace(/consequently/g, "so");
	};

	const copyRewritten = () => {
		if (!rewrittenText) {
			toast.error("No rewritten text to copy");
			return;
		}
		navigator.clipboard.writeText(rewrittenText);
		toast.success("Rewritten text copied to clipboard!");
	};

	const clearAll = () => {
		setOriginalText("");
		setRewrittenText("");
		toast.success("All text cleared");
	};

	const getWordCount = (text: string) => {
		return text
			.trim()
			.split(/\s+/)
			.filter((word) => word.length > 0).length;
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='max-w-6xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold mb-4'>
						Article Rewriter
					</h1>
					<p className='text-xl text-muted-foreground'>
						Rewrite your content while maintaining the original
						meaning
					</p>
				</div>

				<div className='grid gap-6 lg:grid-cols-2'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<FileText className='h-5 w-5' />
								Original Text
							</CardTitle>
							<CardDescription>
								Paste your content here to rewrite it
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div>
								<Label htmlFor='rewrite-mode'>
									Rewriting Mode
								</Label>
								<Select
									value={rewriteMode}
									onValueChange={setRewriteMode}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='standard'>
											Standard
										</SelectItem>
										<SelectItem value='creative'>
											Creative
										</SelectItem>
										<SelectItem value='formal'>
											Formal
										</SelectItem>
										<SelectItem value='simple'>
											Simple
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor='original'>Original Text</Label>
								<Textarea
									id='original'
									placeholder='Paste your article or text here...'
									value={originalText}
									onChange={(e) =>
										setOriginalText(e.target.value)
									}
									rows={12}
									className='resize-none'
								/>
								<p className='text-xs text-muted-foreground mt-1'>
									Words: {getWordCount(originalText)}
								</p>
							</div>

							<div className='flex gap-2'>
								<Button
									onClick={rewriteText}
									disabled={
										isProcessing || !originalText.trim()
									}
									className='flex-1'>
									{isProcessing ? (
										<>
											<RefreshCw className='h-4 w-4 mr-2 animate-spin' />
											Rewriting...
										</>
									) : (
										<>
											<Zap className='h-4 w-4 mr-2' />
											Rewrite Text
										</>
									)}
								</Button>
								<Button onClick={clearAll} variant='outline'>
									Clear
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Zap className='h-5 w-5' />
								Rewritten Text
							</CardTitle>
							<CardDescription>
								Your rewritten content with improved readability
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{rewrittenText ? (
								<>
									<Textarea
										value={rewrittenText}
										onChange={(e) =>
											setRewrittenText(e.target.value)
										}
										rows={12}
										className='resize-none'
									/>
									<p className='text-xs text-muted-foreground'>
										Words: {getWordCount(rewrittenText)}
									</p>
									<Button
										onClick={copyRewritten}
										className='w-full'>
										<Copy className='h-4 w-4 mr-2' />
										Copy Rewritten Text
									</Button>
								</>
							) : (
								<div className='text-center py-12 text-muted-foreground'>
									<Zap className='h-12 w-12 mx-auto mb-4 opacity-50' />
									<p>Rewritten text will appear here</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				<Card className='mt-6'>
					<CardHeader>
						<CardTitle>Rewriting Modes</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid md:grid-cols-2 gap-6'>
							<div>
								<h4 className='font-medium mb-3'>
									Mode Descriptions:
								</h4>
								<ul className='space-y-2 text-sm text-muted-foreground'>
									<li>
										• <strong>Standard:</strong> Balanced
										rewriting with synonym replacement
									</li>
									<li>
										• <strong>Creative:</strong> Adds
										creative elements and varied sentence
										structures
									</li>
									<li>
										• <strong>Formal:</strong> Professional
										tone with formal language
									</li>
									<li>
										• <strong>Simple:</strong> Simplified
										language for better readability
									</li>
								</ul>
							</div>
							<div>
								<h4 className='font-medium mb-3'>
									Best Practices:
								</h4>
								<ul className='space-y-2 text-sm text-muted-foreground'>
									<li>
										• Always review rewritten content for
										accuracy
									</li>
									<li>
										• Ensure the meaning remains unchanged
									</li>
									<li>• Check for proper grammar and flow</li>
									<li>
										• Use for inspiration, not final copy
									</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
