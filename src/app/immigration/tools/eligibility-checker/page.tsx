import { UnifiedEligibilityCalculator } from '@/components/immigration/tools/UnifiedEligibilityCalculator'
import { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
    title: 'Canada Immigration Eligibility Checker | PR & PNP - GVG Global',
    description: 'Check your eligibility for Canada Permanent Residency (PR) and Provincial Nominee Programs (PNP). Unified calculator for Express Entry, OINP, BC PNP, SINP, and AAIP.',
}

export default function EligibilityCheckerPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-black">
            {/* Header */}
            <div className="bg-slate-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <Button asChild variant="ghost" size="sm" className="mb-4 text-slate-400 hover:text-white pl-0 hover:bg-transparent">
                        <Link href="/immigration"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Immigration</Link>
                    </Button>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Initial Eligibility Assessment</h1>
                    <p className="text-xl text-slate-300 max-w-2xl">
                        Find out which Canadian immigration programs you may qualify for.
                        We analyze Federal Express Entry and major Provincial Nominee Programs.
                    </p>
                </div>
            </div>

            {/* Tool Container */}
            <div className="container mx-auto px-4 py-12">
                <UnifiedEligibilityCalculator />
            </div>

            {/* SEO Content */}
            <section className="bg-white dark:bg-slate-900 py-12 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 max-w-4xl text-slate-600 dark:text-slate-400 leading-relaxed">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">How This Assessment Works</h2>
                    <p className="mb-4">
                        Canada has over 80 immigration programs. This tool checks your profile against the most popular economic pathways:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li><strong>Federal Skilled Worker (FSW):</strong> The main pathway for Express Entry.</li>
                        <li><strong>OINP (Ontario):</strong> Checks for Tech and Healthcare draws eligibility.</li>
                        <li><strong>BC PNP:</strong> Assesses eligibility based on Tech stream and Job offers.</li>
                        <li><strong>SINP (Saskatchewan):</strong> Checks against the 60/100 points grid.</li>
                    </ul>
                    <p>
                        This assessment provides a preliminary evaluation. For a legal opinion and full file review, please contact our regulated consultants.
                    </p>
                </div>
            </section>
        </main>
    )
}
