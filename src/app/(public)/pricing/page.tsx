
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, RefreshCw, ShieldCheck, Scale, Phone } from 'lucide-react'
import { ServiceQuoteForm } from '@/components/forms/ServiceQuoteForm'
import { getMetalRates } from '@/app/actions/market'
import type { Metadata } from 'next'


export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
    title: 'Market Pricing & Quotes | GVG Global Group',
    description: 'Get competitive spot rates for scrap metal recycling. Request a custom quote for ferrous and non-ferrous metals. Daily market updates.',
    keywords: ['scrap metal quotes', 'current market rates', 'copper prices', 'aluminum recycling', 'industrial metal trading']
}

export default async function PricingPage() {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })

    const liveRates = await getMetalRates()
    const displayRates = liveRates.length > 0 ? liveRates : []

    // Helper to categorize
    const ferrous = displayRates.filter(r =>
        r.name.toLowerCase().includes('steel') ||
        r.name.toLowerCase().includes('iron') ||
        r.name.toLowerCase().includes('hms')
    )
    const nonFerrous = displayRates.filter(r =>
        !r.name.toLowerCase().includes('steel') &&
        !r.name.toLowerCase().includes('iron') &&
        !r.name.toLowerCase().includes('hms')
    )

    return (
        <main className="min-h-screen pt-0 bg-slate-950" data-version="3.0-quote-focus">
            {/* Header Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/hero_scrap_yard.webp"
                        alt="Global Metal Recycling"
                        className="h-full w-full object-cover opacity-20"
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950 z-0" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20 px-4 py-1 text-sm backdrop-blur-sm">
                        <RefreshCw className="w-3 h-3 mr-2 animate-spin-slow" />
                        Live Market Updates: {lastUpdated}
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
                        Industrial Metal Pricing
                    </h1>
                    <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                        We provide competitive, LME-linked pricing for bulk scrap metal. <br className="hidden md:block" />
                        Request a personalized quote for your specific material and quantity.
                    </p>
                </div>
            </section>

            {/* Main Content Split */}
            <section className="pb-24">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-12 gap-12">

                        {/* LEFT COLUMN: Market Overview */}
                        <div className="lg:col-span-7 space-y-12">

                            {/* Intro Text */}
                            <div className="prose prose-invert max-w-none">
                                <h3 className="text-2xl font-semibold text-white mb-4">Transparent Market Rates</h3>
                                <p className="text-slate-400">
                                    Our trading desk monitors global metal exchanges (LME, COMEX) and local demands to offer the most competitive rates in the industry.
                                    Due to market volatility, we provide <strong>spot pricing</strong> upon request to ensure you get the most accurate value for your material.
                                </p>
                            </div>

                            {/* Commodities List (Indicative) */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                                    <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                                        <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                                        Ferrous Metals
                                    </h4>
                                    <ul className="space-y-3">
                                        {ferrous.slice(0, 5).map(item => (
                                            <li key={item.name} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                                <span className="text-slate-300 font-medium">{item.name}</span>
                                                <span className="text-slate-500 italic">Call for Price</span>
                                            </li>
                                        ))}
                                        {ferrous.length === 0 && <li className="text-slate-500 italic">Loading grades...</li>}
                                    </ul>
                                </Card>

                                <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                                    <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                                        <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                                        Non-Ferrous Metals
                                    </h4>
                                    <ul className="space-y-3">
                                        {nonFerrous.slice(0, 5).map(item => (
                                            <li key={item.name} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                                <span className="text-slate-300 font-medium">{item.name}</span>
                                                <span className="text-slate-500 italic">Call for Price</span>
                                            </li>
                                        ))}
                                        {nonFerrous.length === 0 && <li className="text-slate-500 italic">Loading grades...</li>}
                                    </ul>
                                </Card>
                            </div>

                            {/* Trust Signals */}
                            <div className="grid sm:grid-cols-3 gap-6 pt-8">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <Scale className="w-8 h-8 text-indigo-400 mb-3" />
                                    <h5 className="font-semibold text-white mb-1">Accurate Weights</h5>
                                    <p className="text-xs text-slate-400">Digital weighbridge transparency.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <ShieldCheck className="w-8 h-8 text-emerald-400 mb-3" />
                                    <h5 className="font-semibold text-white mb-1">Certified Buyer</h5>
                                    <p className="text-xs text-slate-400">Fully licensed and compliant.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <TrendingUp className="w-8 h-8 text-amber-400 mb-3" />
                                    <h5 className="font-semibold text-white mb-1">Top Market Rates</h5>
                                    <p className="text-xs text-slate-400">Direct-to-mill pricing power.</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Quote Form */}
                        <div id="quote" className="lg:col-span-5">
                            <div className="sticky top-24">
                                <div className="p-1 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                                    <div className="bg-slate-950 rounded-xl p-6 md:p-8 shadow-2xl">
                                        <div className="mb-8">
                                            <Badge variant="outline" className="mb-4 border-indigo-500/30 text-indigo-400">Fast Response</Badge>
                                            <h3 className="text-2xl font-bold text-white mb-2">Request Custom Quote</h3>
                                            <p className="text-slate-400 text-sm">
                                                Complete the form below for today&apos;s best rates on your specific material.
                                            </p>
                                        </div>

                                        <ServiceQuoteForm mode="logistics" />

                                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                            <p className="text-slate-500 text-sm mb-3">Prefer to speak to a trader?</p>
                                            <a href="tel:+19059622919" className="inline-flex items-center gap-2 text-white font-medium hover:text-indigo-400 transition-colors">
                                                <Phone className="w-4 h-4" />
                                                +1 (905) 962-2919
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    )
}

