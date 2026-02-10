"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Package, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ServicesSelectorSection() {
    return (
        <section className="h-[500px] md:h-[450px] w-full flex flex-col md:flex-row bg-slate-950 relative overflow-hidden">
            {/* PANEL 1: METALS TRADING */}
            <div className="group relative flex-1 h-1/2 md:h-full md:hover:flex-[1.5] transition-all duration-700 ease-in-out overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/services/metals_bg.webp"
                        alt="Global Metal Trading"
                        fill
                        className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-20">
                    <div className="transform md:group-hover:-translate-y-4 transition-transform duration-500">
                        <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 text-emerald-400">
                            <Package className="h-6 w-6" />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-2">Metals Trading</h3>
                        <p className="text-emerald-400 font-medium tracking-wider uppercase text-sm mb-4 opacity-0 md:opacity-100 md:group-hover:opacity-100 transition-opacity duration-500">
                            Global Sourcing & Supply
                        </p>

                        <div className="max-h-0 md:group-hover:max-h-40 overflow-hidden transition-all duration-700">
                            <p className="text-slate-300 mb-6 max-w-md">
                                Bringing the world's finest recycled metals to India's growing industries.
                                Ferrous, Non-Ferrous, and Certified Scrap.
                            </p>
                            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
                                <Link href="/pricing">
                                    View Live Rates <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* PANEL 2: IT SERVICES */}
            <div className="group relative flex-1 h-1/2 md:h-full md:hover:flex-[1.5] transition-all duration-700 ease-in-out overflow-hidden bg-slate-950">
                {/* Background Pattern (CSS Grid + Glow) */}
                <div className="absolute inset-0">
                    {/* Digital Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f61a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f61a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
                    {/* Cyber Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#1d4ed840,transparent)]"></div>
                    {/* Floating Particles (Simulated) */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-20">
                    <div className="transform md:group-hover:-translate-y-4 transition-transform duration-500">
                        <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 text-blue-400">
                            <Code className="h-6 w-6" />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-2">IT Solutions</h3>
                        <p className="text-blue-400 font-medium tracking-wider uppercase text-sm mb-4 opacity-0 md:opacity-100 md:group-hover:opacity-100 transition-opacity duration-500">
                            Digital Transformation
                        </p>

                        <div className="max-h-0 md:group-hover:max-h-40 overflow-hidden transition-all duration-700">
                            <p className="text-slate-300 mb-6 max-w-md">
                                Custom ERPs, Web Applications, and Digital Infrastructure for modern businesses.
                            </p>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                                <Link href="/tech">
                                    Explore Solutions <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
