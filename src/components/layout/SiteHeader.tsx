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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ServiceQuoteForm } from '@/components/forms/ServiceQuoteForm'

export function SiteHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [quoteOpen, setQuoteOpen] = useState(false)
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
            // No CTA for immigration
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
            ctaHref: '/tech#quote'
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
            ctaHref: '/pricing#quote'
        }
    }

    const config = navigationConfigs[currentService]
    const isHomePage = pathname === '/' || pathname === '/pricing' || pathname === '/contact' || pathname === '/about' || pathname === '/tech' || pathname === '/locations'

    return (
        <header className={`${isHomePage ? 'absolute top-4 left-0 right-0 mx-auto max-w-7xl rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 shadow-lg supports-[backdrop-filter]:bg-black/20' : 'sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm'} z-50 transition-all duration-300`}>
            {/* Live Market Ticker */}
            {showTicker && (
                <div className={isHomePage ? "rounded-t-2xl overflow-hidden" : ""}>
                    <MarketTicker />
                </div>
            )}

            {/* Main Navigation */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                            <span className={`font-bold text-xl ${isHomePage ? 'text-white' : 'text-white'}`}>GVG</span>
                        </div>
                        <div>
                            <div className={`font-bold text-lg leading-tight ${isHomePage ? 'text-white' : 'text-foreground'}`}>
                                GVG Global Group
                            </div>
                            <div className={`text-xs ${isHomePage ? 'text-white/80' : 'text-muted-foreground'}`}>
                                {currentService === 'immigration' ? 'Immigration Services' :
                                    currentService === 'metals' ? 'Metals Trading' :
                                        currentService === 'tech' ? 'IT Consulting' :
                                            'Metals • IT • Immigration'}
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
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
                                        <button className={`flex items-center gap-1.5 px-4 py-2 font-medium transition-colors rounded-lg hover:bg-accent/10 ${isHomePage ? 'text-white hover:text-white' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
                                            {link.label}
                                            <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Dropdown Menu - Dark Theme to match Header */}
                                        {dropdownOpen && (
                                            <div className="absolute top-full left-0 pt-4 w-72 animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
                                                <div className="bg-slate-950/60 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 py-2">
                                                    {link.items.map((item: any, itemIdx: number) => {
                                                        const Icon = item.icon
                                                        return (
                                                            <Link
                                                                key={itemIdx}
                                                                href={item.href}
                                                                className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
                                                            >
                                                                {Icon && (
                                                                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                                                        <Icon className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
                                                                    </div>
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-semibold text-sm text-white group-hover:text-primary transition-colors">{item.label}</div>
                                                                    {item.desc && <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.desc}</div>}
                                                                </div>
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
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
                                        className={`px-4 py-2 font-medium transition-colors rounded-lg hover:bg-accent/10 ${isHomePage ? 'text-white hover:text-white' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            }
                        })}
                    </nav>

                    {/* CTA Buttons - Desktop */}
                    {config.ctaText && (
                        <div className="hidden lg:flex items-center gap-3">
                            <Button
                                size="default"
                                className="shadow-sm"
                                onClick={() => setQuoteOpen(true)}
                            >
                                {config.ctaText}
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`lg:hidden p-2 rounded-lg transition-colors ${isHomePage ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-accent'}`}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>


                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-border py-4 animate-in slide-in-from-top duration-200">
                        <nav className="flex flex-col space-y-1">
                            {config.links.map((link: any, idx: number) => {
                                if (link.items) {
                                    return (
                                        <div key={idx} className="py-2">
                                            <div className="font-semibold text-foreground mb-2 px-4">{link.label}</div>
                                            <div className="space-y-1">
                                                {link.items.map((item: any, itemIdx: number) => {
                                                    const Icon = item.icon
                                                    return (
                                                        <Link
                                                            key={itemIdx}
                                                            href={item.href}
                                                            className="flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg mx-2 transition-colors"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            {Icon && <Icon className="h-4 w-4" />}
                                                            <span className="text-sm">{item.label}</span>
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
                                            className="px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg mx-2 font-medium transition-colors text-sm"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                }
                            })}

                            {config.ctaText && (
                                <div className="pt-4 mt-4 border-t border-border px-2">
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            setMobileMenuOpen(false)
                                            setQuoteOpen(true)
                                        }}
                                    >
                                        {config.ctaText}
                                    </Button>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>

            <Sheet open={quoteOpen} onOpenChange={setQuoteOpen}>
                <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-slate-50 dark:bg-slate-950 border-l border-border">
                    <SheetHeader className="text-left mb-6">
                        <SheetTitle className="text-2xl font-bold">
                            {currentService === 'tech' ? 'Request Tech Proposal' :
                                currentService === 'metals' ? 'Request Scrap Rate' :
                                    'Get a Quote'}
                        </SheetTitle>
                        <SheetDescription>
                            {currentService === 'tech' ? 'Tell us about your project requirements.' :
                                currentService === 'metals' ? 'Get today\'s live spot rates for your materials.' :
                                    'Fill out the form below and we will get back to you shortly.'}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="px-1 py-4">
                        <ServiceQuoteForm
                            mode={currentService === 'tech' ? 'tech' : 'logistics'}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    )
}
