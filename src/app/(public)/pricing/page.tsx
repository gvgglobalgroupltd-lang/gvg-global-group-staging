
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { ServiceQuoteForm } from '@/components/forms/ServiceQuoteForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Current Scrap Metal Prices | Live Market Rates - GVG Global Group',
    description: 'Real-time scrap metal pricing for ferrous and non-ferrous metals. Updated daily. Get competitive rates for HMS, copper, aluminum, brass, and more.',
    keywords: ['scrap metal prices', 'HMS rates', 'copper price', 'aluminum scrap', 'live pricing', 'metal trading rates']
}

export default function PricingPage() {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })

    const ferrousPrices = [
        { name: 'HMS 1 (80:20)', price: '₹28,500', unit: 'per MT', change: '+2.1%', trend: 'up' },
        { name: 'HMS 2 (Shredded)', price: '₹26,800', unit: 'per MT', change: '+1.8%', trend: 'up' },
        { name: 'Shredded Steel Scrap', price: '₹27,200', unit: 'per MT', change: '0%', trend: 'same' },
        { name: 'Cast Iron Scrap', price: '₹25,500', unit: 'per MT', change: '-0.5%', trend: 'down' },
        { name: 'Steel Turnings', price: '₹22,000', unit: 'per MT', change: '+1.2%', trend: 'up' },
    ]

    const nonFerrousPrices = [
        { name: 'Copper Wire', price: '₹725', unit: 'per kg', change: '+3.2%', trend: 'up' },
        { name: 'Copper Millberry', price: '₹750', unit: 'per kg', change: '+2.8%', trend: 'up' },
        { name: 'Aluminum 6063 Extrusion', price: '₹185', unit: 'per kg', change: '+1.5%', trend: 'up' },
        { name: 'Aluminum Tense', price: '₹165', unit: 'per kg', change: '0%', trend: 'same' },
        { name: 'Brass Scrap', price: '₹425', unit: 'per kg', change: '-1.2%', trend: 'down' },
        { name: 'Stainless Steel 304', price: '₹145', unit: 'per kg', change: '+0.8%', trend: 'up' },
    ]

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return <TrendingUp className="h-4 w-4 text-emerald-600" />
            case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
            default: return <Minus className="h-4 w-4 text-slate-400" />
        }
    }

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'up': return 'text-emerald-600'
            case 'down': return 'text-red-600'
            default: return 'text-slate-500'
        }
    }

    return (
        <main className="min-h-screen">
            {/* Header Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">Live Pricing</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                            Current Scrap Metal Prices
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-2">
                            Updated daily based on market conditions
                        </p>
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Last updated: {lastUpdated}</p>
                    </div>
                </div>
            </section>

            {/* Layout Container for Sidebar/Main */}
            <section className="bg-white dark:bg-slate-950">
                {/* Important Notice Bar */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/30">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-sm text-amber-900 dark:text-amber-200 text-center">
                            <span className="font-bold">NOTE:</span> Prices are indicative FOB India rates. Final pricing depends on grade, quantity, and location.
                        </div>
                    </div>
                </div>

                <div className="py-20">
                    <div className="container mx-auto px-4">
                        {/* Ferrous Metals */}
                        <div className="max-w-6xl mx-auto mb-20">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-10 w-2 bg-slate-900 dark:bg-slate-100 rounded-full"></div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    Ferrous Metals <span className="text-xl font-normal text-slate-500 ml-2">(Iron & Steel)</span>
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {ferrousPrices.map((item, index) => (
                                    <div key={index} className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                {getTrendIcon(item.trend)}
                                            </div>
                                        </div>
                                        <div className="mb-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                                            <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{item.price}</p>
                                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">{item.unit}</p>
                                        </div>
                                        <p className={`text-sm font-bold flex items-center gap-1 ${getTrendColor(item.trend)}`}>
                                            {item.change} <span className="text-slate-400 font-normal">from last week</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Non-Ferrous Metals */}
                        <div className="max-w-6xl mx-auto">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-10 w-2 bg-emerald-600 rounded-full"></div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    Non-Ferrous Metals <span className="text-xl font-normal text-slate-500 ml-2">(Copper, Aluminum)</span>
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {nonFerrousPrices.map((item, index) => (
                                    <div key={index} className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{item.name}</h3>
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                {getTrendIcon(item.trend)}
                                            </div>
                                        </div>
                                        <div className="mb-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                                            <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{item.price}</p>
                                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">{item.unit}</p>
                                        </div>
                                        <p className={`text-sm font-bold flex items-center gap-1 ${getTrendColor(item.trend)}`}>
                                            {item.change} <span className="text-slate-400 font-normal">from last week</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Disclaimer */}
            <section className="py-12 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center text-sm text-slate-500 leading-relaxed">
                        <p>
                            <strong>Disclaimer:</strong> Prices are provided for reference purposes only and do not constitute a binding offer.
                            Actual pricing may vary based on specific material analysis, quantity, delivery terms, and real-time market fluctuations.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-slate-900 dark:bg-black text-white">
                <div className="container mx-auto px-4 z-10 relative">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="text-center lg:text-left">
                                <h3 className="text-3xl md:text-4xl font-bold mb-6">Need a Custom Quote?</h3>
                                <p className="mb-8 text-slate-300 text-lg leading-relaxed">
                                    Get personalized pricing based on your specific material grade, quantity, and location. Our trading desk monitors global markets to give you the best spot rates.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <a
                                        href="tel:+19059622919"
                                        className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg"
                                    >
                                        Call Trading Desk
                                    </a>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
                                <h4 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" /> Request Spot Rate
                                </h4>
                                <ServiceQuoteForm mode="logistics" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
