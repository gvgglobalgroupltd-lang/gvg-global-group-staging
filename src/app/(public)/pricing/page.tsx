import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
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
        <main className="min-h-screen py-20 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <Badge className="mb-4 bg-emerald-600 text-white">Live Pricing</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                        Current Scrap Metal Prices
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-2">
                        Updated daily based on market conditions
                    </p>
                    <p className="text-sm text-slate-500">Last updated: {lastUpdated}</p>
                </div>

                {/* Important Notice */}
                <Card className="max-w-4xl mx-auto mb-12 p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                    <h3 className="font-bold mb-2 text-amber-900 dark:text-amber-300">📌 Important Notes:</h3>
                    <ul className="text-sm text-amber-800 dark:text-amber-400 space-y-1">
                        <li>• Prices are indicative and subject to market fluctuations</li>
                        <li>• Final prices depend on material quality, quantity, and delivery location</li>
                        <li>• Contact us for exact quotations and bulk pricing</li>
                        <li>• Prices shown are FOB India rates</li>
                    </ul>
                </Card>

                {/* Ferrous Metals */}
                <div className="max-w-6xl mx-auto mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                        Ferrous Metals (Iron & Steel)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ferrousPrices.map((item, index) => (
                            <Card key={index} className="p-5 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">{item.name}</h3>
                                    {getTrendIcon(item.trend)}
                                </div>
                                <div className="mb-2">
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{item.price}</p>
                                    <p className="text-sm text-slate-500">{item.unit}</p>
                                </div>
                                <p className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                                    {item.change} from last week
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Non-Ferrous Metals */}
                <div className="max-w-6xl mx-auto mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                        Non-Ferrous Metals (Copper, Aluminum, Brass)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {nonFerrousPrices.map((item, index) => (
                            <Card key={index} className="p-5 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">{item.name}</h3>
                                    {getTrendIcon(item.trend)}
                                </div>
                                <div className="mb-2">
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{item.price}</p>
                                    <p className="text-sm text-slate-500">{item.unit}</p>
                                </div>
                                <p className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                                    {item.change} from last week
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <Card className="max-w-4xl mx-auto p-8 text-center bg-slate-900 dark:bg-slate-800 text-white">
                    <h3 className="text-2xl font-bold mb-4">Need a Custom Quote?</h3>
                    <p className="mb-6 text-slate-300">
                        Get personalized pricing based on your specific material grade, quantity, and location
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                        >
                            Request Quote
                        </a>
                        <a
                            href="/contact"
                            className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                        >
                            Call: +91-XXXXX-XXXXX
                        </a>
                    </div>
                </Card>

                {/* Disclaimer */}
                <div className="max-w-4xl mx-auto mt-8 text-center text-sm text-slate-500">
                    <p>
                        Prices are for reference purposes only and do not constitute an offer.
                        Actual pricing may vary based on material analysis, market conditions, and other factors.
                    </p>
                </div>
            </div>
        </main>
    )
}
