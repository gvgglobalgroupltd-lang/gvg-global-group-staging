import { PNPFinder } from '@/components/immigration/tools/PNPFinder'
import { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
    title: 'PNP Finder | Find Provincial Nominee Programs - GVG Global',
    description: 'Find Canadian Provincial Nominee Programs (PNP) that match your occupation and skills. Explore streams in Ontario, BC, Alberta, Saskatchewan, and more.',
}

export default function PNPFinderPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-black">
            {/* Header */}
            <div className="bg-slate-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <Button asChild variant="ghost" size="sm" className="mb-4 text-slate-400 hover:text-white pl-0 hover:bg-transparent">
                        <Link href="/immigration"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Immigration</Link>
                    </Button>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">PNP Finder Tool</h1>
                    <p className="text-xl text-slate-300 max-w-2xl">
                        Discover which Canadian provinces are looking for skills like yours.
                    </p>
                </div>
            </div>

            {/* Tool Container */}
            <div className="container mx-auto px-4 py-12">
                <PNPFinder />
            </div>

            {/* SEO Content */}
            <section className="bg-white dark:bg-slate-900 py-12 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 max-w-4xl text-slate-600 dark:text-slate-400 leading-relaxed">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Why Consider a PNP?</h2>
                    <p className="mb-4">
                        Provincial Nominee Programs (PNPs) are a great way to obtain Canadian Permanent Residency if you have skills that are in demand in a specific province.
                    </p>
                    <p>
                        Getting a nomination adds <strong>600 points</strong> to your Express Entry CRS score, virtually guaranteeing an Invitation to Apply (ITA). Each province has its own streams targeting tech, healthcare, trades, and international graduates.
                    </p>
                </div>
            </section>
        </main>
    )
}
