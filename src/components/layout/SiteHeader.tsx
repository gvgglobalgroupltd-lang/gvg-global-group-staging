'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Phone,
    Menu,
    X,
    ChevronDown,
    Package,
    Code,
    Plane,
    FileText,
    MapPin,
    Stamp,
    Building2,
    HelpCircle
} from 'lucide-react'

import { MarketTicker } from '@/components/dashboard/MarketTicker'

export function SiteHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const pathname = usePathname()

    // Detect current service section
    const currentService =
        pathname?.startsWith('/immigration') ? 'immigration' :
            pathname?.startsWith('/tech') ? 'tech' :
                (pathname?.startsWith('/pricing') || pathname?.startsWith('/scrap')) ? 'metals' :
                    'default'

    // Show ticker only on Home and Pricing/Metals pages
    const showTicker = pathname === '/' || pathname?.startsWith('/pricing')

    // Service-specific navigation configurations
    const navigationConfigs: Record<string, any> = {
        immigration: {
            links: [
                { label: 'Home', href: '/' },
                {
                    label: 'Immigration Tools',
                    icon: FileText,
                    items: [
                        { label: 'CRS Calculator', href: '/immigration/tools/crs-calculator', icon: FileText },
                        { label: 'Eligibility Checker', href: '/immigration/tools/eligibility-checker', icon: Plane },
                        { label: 'PNP Finder', href: '/immigration/tools/pnp-finder', icon: MapPin },
                        { label: 'Common FAQs', href: '/immigration/resources/faq', icon: HelpCircle },
                    ]
                },
                { label: 'All Services', href: '/immigration' },
                { label: 'Contact', href: '/contact' },
            ],
            ctaText: 'Check Eligibility',
            ctaHref: '/immigration/tools/eligibility-checker'
        },
        metals: {
            links: [
                { label: 'Home', href: '/' },
                { label: 'Live Pricing', href: '/pricing' },
                { label: 'Materials', href: '/pricing#materials' },
                { label: 'Locations', href: '/locations' },
                { label: 'Request Quote', href: '/pricing#quote' },
            ],
            ctaText: 'Get Quote',
            ctaHref: '/pricing#quote'
        },
        tech: {
            links: [
                { label: 'Home', href: '/' },
                {
                    label: 'Our Services',
                    icon: Code,
                    items: [
                        { label: 'Web Development', href: '/tech#web', icon: Code },
                        { label: 'Mobile Apps', href: '/tech#mobile', icon: Code },
                        { label: 'Cloud Solutions', href: '/tech#cloud', icon: Building2 },
                    ]
                },
                { label: 'Portfolio', href: '/tech#portfolio' },
                { label: 'Contact', href: '/contact' },
            ],
            ctaText: 'Get Started',
            ctaHref: '/tech#contact'
        },
        default: {
            links: [
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                {
                    label: 'Services',
                    items: [
                        { label: 'Metals Trading', href: '/pricing', icon: Package, desc: 'Scrap metal sourcing & import' },
                        { label: 'IT Consulting', href: '/tech', icon: Code, desc: 'Custom software & ERP systems' },
                        { label: 'Immigration Services', href: '/immigration', icon: Plane, desc: 'Visa & PR consulting' },
                    ]
                },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Locations', href: '/locations' },
                { label: 'Contact', href: '/contact' },
            ],
            ctaText: 'Get Quote',
            ctaHref: '/contact'
        }
    }

    const config = navigationConfigs[currentService]

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Live Market Ticker */}
            {showTicker && <MarketTicker />}

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
                            <div className="text-xs text-slate-500">
                                {currentService === 'immigration' ? 'Immigration Services' :
                                    currentService === 'metals' ? 'Metals Trading' :
                                        currentService === 'tech' ? 'IT Consulting' :
                                            'Metals • IT • Immigration'}
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {config.links.map((link: any, idx: number) => {
                            if (link.items) {
                                // Dropdown
                                return (
                                    <div
                                        key={idx}
                                        className="relative"
                                        onMouseEnter={() => setDropdownOpen(true)}
                                        onMouseLeave={() => setDropdownOpen(false)}
                                    >
                                        <button className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                                            {link.label}
                                            <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {dropdownOpen && (
                                            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2">
                                                {link.items.map((item: any, itemIdx: number) => {
                                                    const Icon = item.icon
                                                    return (
                                                        <Link
                                                            key={itemIdx}
                                                            href={item.href}
                                                            className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                                        >
                                                            {Icon && (
                                                                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                                                    <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="font-semibold text-slate-900 dark:text-white">{item.label}</div>
                                                                {item.desc && <div className="text-xs text-slate-500">{item.desc}</div>}
                                                            </div>
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            } else {
                                // Regular link
                                return (
                                    <Link
                                        key={idx}
                                        href={link.href}
                                        className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                )
                            }
                        })}
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
                            <Link href={config.ctaHref}>{config.ctaText}</Link>
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
                            {config.links.map((link: any, idx: number) => {
                                if (link.items) {
                                    return (
                                        <div key={idx}>
                                            <div className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{link.label}</div>
                                            <div className="pl-4 space-y-3 border-l-2 border-emerald-600">
                                                {link.items.map((item: any, itemIdx: number) => {
                                                    const Icon = item.icon
                                                    return (
                                                        <Link
                                                            key={itemIdx}
                                                            href={item.href}
                                                            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            {Icon && <Icon className="h-4 w-4" />}
                                                            {item.label}
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.href}
                                            className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 font-medium"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                }
                            })}

                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                                <Button asChild variant="outline" className="w-full border-emerald-600 text-emerald-600">
                                    <a href="tel:+19059622919">
                                        <Phone className="h-4 w-4 mr-2" />
                                        +1 (905) 962-2919
                                    </a>
                                </Button>
                                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                                    <Link href={config.ctaHref}>{config.ctaText}</Link>
                                </Button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
