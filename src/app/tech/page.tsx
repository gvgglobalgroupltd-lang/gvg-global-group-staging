
import { ServiceBookingWizard } from '@/components/tech/ServiceBookingWizard'
import { ServiceQuoteForm } from '@/components/forms/ServiceQuoteForm'
import { PortfolioSection } from '@/components/tech/PortfolioSection'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Code2, Smartphone, TestTube2, Cloud, Users, Zap, FileText, ArrowRight, CheckCircle2 } from 'lucide-react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'

export default function TechPage() {
    const services = [
        {
            icon: Code2,
            title: 'Custom ERP Development',
            description: 'Tailored enterprise resource planning solutions that streamline your business processes and boost efficiency.',
            features: ['Business process automation', 'Integrated systems', 'Cloud-based solutions', 'Scalable architecture']
        },
        {
            icon: Smartphone,
            title: 'Mobile App Development',
            description: 'Native and cross-platform mobile applications designed to engage your users and drive business growth.',
            features: ['iOS & Android apps', 'Cross-platform solutions', 'User-centric design', 'Performance optimization']
        },
        {
            icon: TestTube2,
            title: 'QA & Testing Services',
            description: 'Comprehensive quality assurance to ensure your software is reliable, secure, and bug-free.',
            features: ['Automated testing', 'Manual QA', 'Performance testing', 'Security audits']
        }
    ]

    const benefits = [
        { icon: Cloud, title: 'Modern Tech Stack', description: 'We use cutting-edge technologies (Next.js, Supabase, AI) to build scalable solutions.' },
        { icon: Users, title: 'Expert Team', description: 'Experienced developers and consultants dedicated to your success.' },
        { icon: Zap, title: 'Agile Delivery', description: 'Fast, iterative development with regular updates and feedback loops.' }
    ]

    return (
        <>
            <SiteHeader />

            <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">

                {/* HERO SECTION - Premium Dark Gradient */}
                <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>
                    <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

                    <div className="container relative mx-auto px-4 pt-20 text-center z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
                            <span className="text-sm font-medium text-indigo-300 tracking-wide uppercase">GVG Tech Solutions • Halifax, Canada</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">Digital Excellence</span>
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">For Modern Business</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            We build high-performance software, scalable platforms, and intelligent automated systems from our Halifax, Canada headquarters.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                            <Button asChild size="lg" className="h-14 px-8 text-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 rounded-full transition-all hover:scale-105">
                                <a href="#booking">Book Consultation</a>
                            </Button>
                            <Button asChild variant="ghost" size="lg" className="h-14 px-8 text-lg text-slate-300 hover:text-white hover:bg-white/5 rounded-full">
                                <Link href="#services">Explore Services <ArrowRight className="ml-2 h-5 w-5" /></Link>
                            </Button>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                        <div className="w-1 h-12 rounded-full bg-gradient-to-b from-slate-500 to-transparent"></div>
                    </div>
                </section>

                {/* SERVICES - Dark Glass Cards */}
                <section id="services" className="py-32 relative bg-slate-950">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">Our Expertise</h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                End-to-end technology solutions tailored for scale and performance.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                            {services.map((service, index) => {
                                const Icon = service.icon
                                return (
                                    <div key={index} className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-indigo-500/50 transition-all duration-500">
                                        <div className="relative h-full bg-slate-900/50 backdrop-blur-xl p-8 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                            <div className="mb-6 inline-flex p-4 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                                                <Icon className="h-8 w-8" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-300 transition-colors">{service.title}</h3>
                                            <p className="text-slate-400 mb-8 leading-relaxed">{service.description}</p>
                                            <ul className="space-y-3">
                                                {service.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                                                        <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* PORTFOLIO - Seamless Integration */}
                <div className="relative">
                    <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-900 to-transparent"></div>
                    <PortfolioSection />
                </div>

                {/* QUOTE & BOOKING - Split Layout Container */}
                <section id="booking" className="py-32 relative bg-slate-950 overflow-hidden">
                    {/* Background Glows */}
                    <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]"></div>

                    <div className="container relative mx-auto px-4 z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto">

                            {/* Left: Quote Form (Software) */}
                            <div id="quote" className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-30"></div>
                                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-1">
                                    <div className="p-8 border-b border-white/5">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                                            <FileText className="h-3 w-3" /> Custom Projects
                                        </div>
                                        <h2 className="text-3xl font-bold text-white mb-2">Request Proposal</h2>
                                        <p className="text-slate-400">For complex software consulting and development.</p>
                                    </div>
                                    <div className="p-6">
                                        <ServiceQuoteForm mode="tech" />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Booking Wizard (Hardware/Services) */}
                            <div className="relative mt-12 lg:mt-0">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl blur opacity-30"></div>
                                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-1">
                                    <div className="p-8 border-b border-white/5">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                                            <Zap className="h-3 w-3" /> Direct Booking
                                        </div>
                                        <h2 className="text-3xl font-bold text-white mb-2">Book Service</h2>
                                        <p className="text-slate-400">Schedule hardware repair, maintenance, or consultation.</p>
                                    </div>
                                    <div className="p-6">
                                        <ServiceBookingWizard />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* BENEFITS - Minimal Grid */}
                <section className="py-24 border-t border-white/5 bg-slate-950">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon
                                return (
                                    <div key={index} className="group">
                                        <div className="inline-flex p-5 rounded-2xl bg-white/5 mb-6 group-hover:bg-indigo-500/20 transition-colors duration-500">
                                            <Icon className="h-8 w-8 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                                        <p className="text-slate-500 leading-relaxed">{benefit.description}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-600"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                    <div className="container relative mx-auto px-4 text-center z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ready to build the future?</h2>
                        <div className="flex justify-center gap-6">
                            <Button asChild size="lg" className="h-16 px-10 text-lg bg-white text-indigo-900 hover:bg-slate-100 font-bold rounded-full shadow-2xl">
                                <a href="#quote">Get Started</a>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-16 px-10 text-lg bg-transparent border-2 border-white/30 text-white hover:bg-white/10 rounded-full">
                                <Link href="/">Return to Main Site</Link>
                            </Button>
                        </div>
                    </div>
                </section>

            </main>

            <SiteFooter />
        </>
    )
}
