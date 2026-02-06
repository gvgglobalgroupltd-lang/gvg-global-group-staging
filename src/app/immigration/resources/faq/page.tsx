import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button'
import { ArrowLeft, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Immigration FAQ | GVG Global Immigration',
    description: 'Answers to common questions about Canada PR, Study Visas, Work Permits, and Provincial Nominee Programs (PNP).',
}

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-black">
            {/* Header */}
            <div className="bg-slate-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <Button asChild variant="ghost" size="sm" className="mb-4 text-slate-400 hover:text-white pl-0 hover:bg-transparent">
                        <Link href="/immigration"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Immigration</Link>
                    </Button>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                            <HelpCircle className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold">Frequently Asked Questions</h1>
                    </div>
                    <p className="text-xl text-slate-300 max-w-2xl">
                        Common queries about moving to, studying in, and working in Canada.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">

                {/* SECTION 1: Permanent Residency (Express Entry) */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                        Express Entry & PR
                    </h2>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        <AccordionItem value="pr-1" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 px-4">
                            <AccordionTrigger className="text-lg font-medium">What is Express Entry?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Express Entry is an online system used by the Canadian government to manage applications for permanent residence for skilled workers. It manages three main programs:
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Federal Skilled Worker Program (FSWP)</li>
                                    <li>Federal Skilled Trades Program (FSTP)</li>
                                    <li>Canadian Experience Class (CEC)</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="pr-2" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 px-4">
                            <AccordionTrigger className="text-lg font-medium">How is the CRS score calculated?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Your Comprehensive Ranking System (CRS) score (out of 1200) is based on:
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li><strong>Core/Human Capital:</strong> Age, Education, Language Skills, and Canadian Work Experience.</li>
                                    <li><strong>Skill Transferability:</strong> Combinations of education/experience and language.</li>
                                    <li><strong>Additional Points:</strong> Provincial Nomination (+600), Job Offer (+50/200), Canadian education, etc.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="pr-3" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 px-4">
                            <AccordionTrigger className="text-lg font-medium">Do I need a job offer for Express Entry?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                No, a job offer is not mandatory for the Federal Skilled Worker or Canadian Experience Class programs. However, having a valid job offer can award you 50 to 200 additional CRS points.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* SECTION 2: Study Visas */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                        Study Visas
                    </h2>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        <AccordionItem value="study-1" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 px-4">
                            <AccordionTrigger className="text-lg font-medium">Can I work while studying in Canada?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Yes, most study permit holders can work off-campus for up to <strong>24 hours per week</strong> (as of late 2024 policy updates) during regular academic sessions and full-time during scheduled breaks like summer or winter holidays.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="study-2" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 px-4">
                            <AccordionTrigger className="text-lg font-medium">What is the Proof of Funds requirement?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                As of January 1, 2024, the cost-of-living financial requirement for study permit applicants is <strong>$20,635</strong> per year (for a single applicant), in addition to first-year tuition and travel costs.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="study-3" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 px-4">
                            <AccordionTrigger className="text-lg font-medium">Why are study visas rejected?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Common reasons include:
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Insufficient financial resources.</li>
                                    <li>Lack of clear "ties to home country" (officer doubts you will leave).</li>
                                    <li>Proposed studies do not match academic/career history (logical progression).</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* SECTION 3: Provincial Nominee Programs (PNP) */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                        Provincial Nominee Programs (PNP)
                    </h2>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        <AccordionItem value="pnp-1" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 px-4">
                            <AccordionTrigger className="text-lg font-medium">What are the benefits of a PNP nomination?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                If you receive a provincial nomination through an Express Entry-aligned stream, you get <strong>600 additional CRS points</strong>. This effectively guarantees you will receive an Invitation to Apply (ITA) in the next draw.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="pnp-2" className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 px-4">
                            <AccordionTrigger className="text-lg font-medium">Do I have to live in the nominating province?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Yes. When you apply for a PNP, you sign a declaration of intent to reside in that province. Moving to another province shortly after landing can impact your permanent residency status or future citizenship applications due to misrepresentation of intent.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

            </div>
        </main>
    )
}
