'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Phone,
    Mail,
    Menu,
    X,
    ChevronDown,
    Package,
    Code,
    Building2,
    MapPin
} from 'lucide-react'

import { MarketTicker } from '@/components/dashboard/MarketTicker'

export function SiteHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [servicesOpen, setServicesOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Live Market Ticker */}
            <MarketTicker />

            {/* Top Bar - Contact Info */}
            <div className="bg-slate-900 dark:bg-slate-950 text-white py-2 hidden md:block">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex gap-6">
                            <a href="tel:+19059622919" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                                <Phone className="h-3.5 w-3.5" />
                                +1 (905) 962-2919
                            </a>
                            <a href="mailto:info@gvgglobal.com" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                                <Mail className="h-3.5 w-3.5" />
                                info@gvgglobal.com
                            </a>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/locations" className="hover:text-emerald-400 transition-colors">
                                <MapPin className="h-3.5 w-3.5 inline mr-1" />
                                Our Locations
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">GVG</span>
                        </div>
                        <div>
                            <div className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                                GVG Global Group
                            </div>
                            <div className="text-xs text-slate-500">Metals • IT • Trade</div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
                        >
                            Home
                        </Link>

                        <Link
                            href="/about"
                            className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
                        >
                            About
                        </Link>

                        {/* Services Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setServicesOpen(true)}
                            onMouseLeave={() => setServicesOpen(false)}
                        >
                            <button className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                                Services
                                <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {servicesOpen && (
                                <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2">
                                    <Link
                                        href="/pricing"
                                        className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                            <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900 dark:text-white">Metals Trading</div>
                                            <div className="text-xs text-slate-500">Scrap metal sourcing & import</div>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/tech"
                                        className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                            <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900 dark:text-white">IT Consulting</div>
                                            <div className="text-xs text-slate-500">Custom software & ERP systems</div>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/pricing"
                            className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
                        >
                            Pricing
                        </Link>

                        <Link
                            href="/locations"
                            className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
                        >
                            Locations
                        </Link>

                        <Link
                            href="/contact"
                            className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* CTA Buttons - Desktop */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Button asChild variant="outline" size="sm" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                            <a href="tel:+19059622919">
                                <Phone className="h-4 w-4 mr-2" />
                                Call Us
                            </a>
                        </Button>
                        <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Link href="/contact">Get Quote</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-slate-700 dark:text-slate-300"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 py-4">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/about"
                                className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About
                            </Link>

                            <div className="pl-4 space-y-3 border-l-2 border-emerald-600">
                                <Link
                                    href="/pricing"
                                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Package className="h-4 w-4" />
                                    Metals Trading
                                </Link>
                                <Link
                                    href="/tech"
                                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Code className="h-4 w-4" />
                                    IT Consulting
                                </Link>
                            </div>

                            <Link
                                href="/pricing"
                                className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Pricing
                            </Link>
                            <Link
                                href="/locations"
                                className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Locations
                            </Link>
                            <Link
                                href="/contact"
                                className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>

                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                                <Button asChild variant="outline" className="w-full border-emerald-600 text-emerald-600">
                                    <a href="tel:+19059622919">
                                        <Phone className="h-4 w-4 mr-2" />
                                        +1 (905) 962-2919
                                    </a>
                                </Button>
                                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                                    <Link href="/contact">Get Quote</Link>
                                </Button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
