import { CRSCalculator } from '@/components/immigration/CRSCalculator'
import { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
    title: 'CRS Score Calculator | Canada Permanent Residency - GVG Global',
    description: 'Calculate your Comprehensive Ranking System (CRS) score for Canada Express Entry. Instant estimation based on age, education, language, and work experience.',
}

export default function CRSCalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-black">
            {/* Header */}
            <div className="bg-slate-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <Button asChild variant="ghost" size="sm" className="mb-4 text-slate-400 hover:text-white pl-0 hover:bg-transparent">
                        <Link href="/immigration"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Immigration</Link>
                    </Button>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">CRS Score Calculator</h1>
                    <p className="text-xl text-slate-300 max-w-2xl">
                        Check your eligibility for Canada Express Entry. Estimate your ranking score instantly.
                    </p>
                </div>
            </div>

            {/* Calculator Container */}
            <div className="container mx-auto px-4 py-12">
                <CRSCalculator />
            </div>

            {/* SEO Content / Info */}
            <section className="bg-white dark:bg-slate-900 py-12 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 max-w-4xl text-slate-600 dark:text-slate-400 leading-relaxed">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What is a Good CRS Score?</h2>
                    <p className="mb-4">
                        The Comprehensive Ranking System (CRS) is a points-based system that the Canadian government uses to assess and score your profile and rank it in the Express Entry pool.
                    </p>
                    <p className="mb-4">
                        Recent cut-off scores have typically ranged between <strong>480 and 530</strong>. However, scores can fluctuate based on the specific draw type (e.g., STEM, French, Healthcare categories).
                    </p>
                    <p>
                        Need to improve your score? Improving your language test (IELTS/CELPIP) results or gaining valid Canadian experience are the most effective ways to boost your ranking.
                    </p>
                </div>
            </section>
        </main>
    )
}
