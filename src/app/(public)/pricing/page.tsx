
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'
import { ServiceQuoteForm } from '@/components/forms/ServiceQuoteForm'
import { getMetalRates, type MetalRate } from '@/app/actions/market'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Current Scrap Metal Prices | Live Market Rates - GVG Global Group',
    description: 'Real-time scrap metal pricing for ferrous and non-ferrous metals. Updated daily. Get competitive rates for HMS, copper, aluminum, brass, and more.',
    keywords: ['scrap metal prices', 'HMS rates', 'copper price', 'aluminum scrap', 'live pricing', 'metal trading rates']
}

export default async function PricingPage() {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })

    // Static fallbacks removed in favor of live data or empty state
    // If you want static fallback, uncomment original arrays

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

    // Fetch live data
    const liveRates = await getMetalRates()

    // If no live data, we could fallback, but for now we'll assume live data or empty list
    // We can merge live data with static categories if we want to ensure specific items appear
    // But better to just show what's in DB if user wants "Live"

    const displayRates = liveRates.length > 0 ? liveRates : []

    // Helper to categorize (simplistic for now, in real app needs a category field in DB)
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
        <main className="min-h-screen pt-0">
            {/* Header Section - Dark Hero to support transparent header */}
            <section className="relative pt-40 pb-20 overflow-hidden bg-slate-950">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/hero_scrap_yard.jpg"
                        alt="Global Metal Recycling"
                        className="h-full w-full object-cover opacity-40"
                    />
                </div>

                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-slate-950 z-0" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20 px-4 py-1 text-sm backdrop-blur-sm">
                            <RefreshCw className="w-3 h-3 mr-2 animate-spin-slow" />
                            Live Market Updates
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
                            Global Scrap Metal Pricing
                        </h1>
                        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Real-time indicative rates for ferrous and non-ferrous metals, updated daily based on LME and local market conditions.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-400">
                            <span className="flex items-center bg-white/5 rounded-full px-4 py-1.5 border border-white/5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
                                Last updated: {lastUpdated}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Layout Container */}
            <section className="pb-24">
                {/* Important Notice Bar */}
                <div className="border-y border-border/50 bg-muted/30 backdrop-blur-sm mb-16">
                    <div className="container mx-auto px-4 py-3">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground text-center">
                            <span className="font-semibold text-primary">Note:</span> Prices are indicative FOB India rates. Final pricing depends on grade, quantity, and location.
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4">
                    {/* Ferrous Metals */}
                    <div className="max-w-7xl mx-auto mb-20">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-border/50 pb-6">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight mb-2">Ferrous Metals</h2>
                                <p className="text-muted-foreground">Industrial Iron & Steel Grades</p>
                            </div>
                            <Badge variant="outline" className="w-fit">Updated {lastUpdated}</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ferrous.length > 0 ? ferrous.map((item, index) => (
                                <div key={index} className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {getTrendIcon(item.trend && item.trend > 0 ? 'up' : item.trend && item.trend < 0 ? 'down' : 'same')}
                                    </div>

                                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-6">Standard Grade</p>

                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-3xl font-bold tracking-tight text-foreground">${item.price}</span>
                                        <span className="text-sm font-medium text-muted-foreground">/{item.unit.replace('per ', '')}</span>
                                    </div>

                                    <div className={`flex items-center gap-2 text-sm font-medium ${getTrendColor(item.trend && item.trend > 0 ? 'up' : item.trend && item.trend < 0 ? 'down' : 'same')}`}>
                                        <span className="px-2 py-0.5 rounded-full bg-current/10">
                                            {item.trend ? (item.trend > 0 ? '+' : '') + (item.trend * 10).toFixed(2) : 0}%
                                        </span>
                                        <span className="text-muted-foreground font-normal">vs last week</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-12 text-center bg-muted/10 rounded-2xl border border-dashed border-border">
                                    <RefreshCw className="h-6 w-6 mx-auto mb-3 text-muted-foreground animate-spin" />
                                    <p className="text-muted-foreground">Loading ferrous rates...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Non-Ferrous Metals */}
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-border/50 pb-6">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight mb-2">Non-Ferrous Metals</h2>
                                <p className="text-muted-foreground">Copper, Aluminum, Brass & High-Value Alloys</p>
                            </div>
                            <Badge variant="outline" className="w-fit">Updated {lastUpdated}</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {nonFerrous.length > 0 ? nonFerrous.map((item, index) => (
                                <div key={index} className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {getTrendIcon(item.trend && item.trend > 0 ? 'up' : item.trend && item.trend < 0 ? 'down' : 'same')}
                                    </div>

                                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-6">Premium Grade</p>

                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-3xl font-bold tracking-tight text-foreground">${item.price}</span>
                                        <span className="text-sm font-medium text-muted-foreground">/{item.unit.replace('per ', '')}</span>
                                    </div>

                                    <div className={`flex items-center gap-2 text-sm font-medium ${getTrendColor(item.trend && item.trend > 0 ? 'up' : item.trend && item.trend < 0 ? 'down' : 'same')}`}>
                                        <span className="px-2 py-0.5 rounded-full bg-current/10">
                                            {item.trend ? (item.trend > 0 ? '+' : '') + (item.trend * 10).toFixed(2) : 0}%
                                        </span>
                                        <span className="text-muted-foreground font-normal">vs last week</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-12 text-center bg-muted/10 rounded-2xl border border-dashed border-border">
                                    <RefreshCw className="h-6 w-6 mx-auto mb-3 text-muted-foreground animate-spin" />
                                    <p className="text-muted-foreground">Loading non-ferrous rates...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-zinc-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <Badge className="mb-6 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20">Enterprise Solutions</Badge>
                            <h3 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Need Large Volume Pricing?</h3>
                            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                                Get personalized spot rates for bulk quantities. Our trading desk monitors LME and local markets 24/7 to secure the best margins for your materials.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="/contact" className="px-8 py-4 bg-white text-black rounded-lg font-bold hover:bg-zinc-200 transition-colors">
                                    Request Custom Quote
                                </a>
                                <a href="tel:+19059622919" className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-lg font-bold hover:bg-white/10 transition-colors backdrop-blur-sm">
                                    Call Trading Desk
                                </a>
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-blue-400" />
                                </div>
                                <h4 className="text-xl font-bold">Quick Spot Rate</h4>
                            </div>
                            <ServiceQuoteForm mode="logistics" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
