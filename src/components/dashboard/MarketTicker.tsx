'use client'

import { useEffect, useState } from 'react'
import { getMetalRates, getCurrencyRates, MetalRate, CurrencyRate } from '@/app/actions/market'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

export function MarketTicker() {
    const [metals, setMetals] = useState<MetalRate[]>([])
    const [currencies, setCurrencies] = useState<CurrencyRate[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const [metalData, currencyData] = await Promise.all([
                    getMetalRates(),
                    getCurrencyRates()
                ])
                setMetals(metalData)
                setCurrencies(currencyData)
            } catch (error) {
                console.error("Failed to load market data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Simulate "Live" ticks
    useEffect(() => {
        const interval = setInterval(() => {
            setMetals(current =>
                current.map(m => ({
                    ...m,
                    // Fluctuate by +/- 0.05%
                    price: m.price * (1 + (Math.random() * 0.001 - 0.0005))
                }))
            )
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    if (loading) return <div className="h-8 bg-black/90 w-full animate-pulse" />

    return (
        <div className="w-full bg-black text-white overflow-hidden whitespace-nowrap border-b border-white/10 h-8 flex items-center box-border relative">
            {/* Gradient Overlays for smooth fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee inline-block px-4">
                {/* Metals */}
                {metals.map((m) => (
                    <span key={m.symbol} className="mx-6 text-xs font-mono tracking-wider inline-flex items-center">
                        <span className="font-bold text-amber-500 mr-2">{m.name}</span>
                        <span className="mr-1">${m.price.toFixed(2)}</span>
                        {Math.random() > 0.5 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                    </span>
                ))}

                {/* Separator */}
                <span className="mx-4 text-gray-600">|</span>

                {/* Currencies */}
                {currencies.map((c) => (
                    <span key={c.code} className="mx-6 text-xs font-mono tracking-wider inline-flex items-center">
                        <span className="font-bold text-blue-400 mr-2">1 USD =</span>
                        <span className="mr-1">{c.rate.toFixed(2)} {c.code}</span>
                    </span>
                ))}
            </div>

            {/* Duplicate for seamless loop */}
            <div className="animate-marquee inline-block px-4" aria-hidden="true">
                {metals.map((m) => (
                    <span key={`${m.symbol}-duplicate`} className="mx-6 text-xs font-mono tracking-wider inline-flex items-center">
                        <span className="font-bold text-amber-500 mr-2">{m.name}</span>
                        <span className="mr-1">${m.price.toFixed(2)}</span>
                        {Math.random() > 0.5 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                    </span>
                ))}
                <span className="mx-4 text-gray-600">|</span>
                {currencies.map((c) => (
                    <span key={`${c.code}-dup`} className="mx-6 text-xs font-mono tracking-wider inline-flex items-center">
                        <span className="font-bold text-blue-400 mr-2">1 USD =</span>
                        <span className="mr-1">{c.rate.toFixed(2)} {c.code}</span>
                    </span>
                ))}
            </div>

            <style jsx>{`
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    )
}
