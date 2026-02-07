
import { Building2, Globe, Users, Award, TrendingUp, Cpu } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'

export default function AboutPage() {
    const stats = [
        { label: 'Years in Business', value: '15+', icon: TrendingUp },
        { label: 'Countries Served', value: '8+', icon: Globe },
        { label: 'Active Clients', value: '47+', icon: Users },
        { label: 'Successful Shipments', value: '1,247+', icon: Award },
    ]

    const divisions = [
        {
            name: 'Metals Trading Division',
            icon: Building2,
            description: 'India-based metals import operation sourcing from USA, Canada, UAE',
            services: [
                'Scrap metal sourcing from North America & Middle East',
                'Import services and customs clearance',
                'Quality assurance and inspection',
                'DGFT IEC & GST compliance',
                'Warehouse and distribution in India'
            ]
        },
        {
            name: 'IT Consulting Division',
            icon: Cpu,
            description: 'Custom software development and IT solutions based in India',
            services: [
                'Custom ERP development',
                'Web application development',
                'Cloud solutions and integration',
                'Quality assurance and testing',
                'IT infrastructure consulting'
            ]
        }
    ]

    const regions = [
        { name: 'India', countries: ['Mumbai - Headquarters'], description: 'Operations center' },
        { name: 'North America', countries: ['USA', 'Canada'], description: 'Sourcing partners' },
        { name: 'Middle East', countries: ['UAE'], description: 'Supplier network' },
    ]

    return (
        <>
            <SiteHeader />

            <main className="min-h-screen">
                {/* Hero Section */}
                <section className="relative pt-40 pb-20 overflow-hidden bg-slate-950">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/hero_foundry.jpg"
                            alt="Industrial Foundry"
                            className="h-full w-full object-cover opacity-40"
                        />
                    </div>

                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-slate-950 z-0" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0" />

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <Badge className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-md" variant="outline">Est. 2010</Badge>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                                About <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-400">GVG Global Group</span>
                            </h1>
                            <p className="text-xl text-slate-200 leading-relaxed drop-shadow-md">
                                A diversified global enterprise specializing in international metals trading and cutting-edge IT consulting services, bridging industries and continents.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex flex-col items-center text-center p-4">
                                    <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-full mb-3">
                                        <stat.icon className="h-6 w-6 text-primary dark:text-primary" />
                                    </div>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</p>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            <Card className="p-8 bg-gradient-to-br from-primary to-indigo-600 text-white border-none shadow-lg">
                                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                                <p className="text-primary-foreground/90 leading-relaxed font-medium">
                                    To facilitate seamless global trade and deliver innovative technology solutions that empower businesses worldwide. We are committed to excellence, integrity, and sustainable growth across all our ventures.
                                </p>
                            </Card>

                            <Card className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-none shadow-lg">
                                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                                <p className="text-indigo-50 leading-relaxed font-medium">
                                    To be the most trusted global partner in metals trading and IT consulting, recognized for our reliability, innovation, and commitment to creating value for our clients, partners, and communities.
                                </p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Company Story */}
                <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">Our Story</h2>
                            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                                <p className="mb-6">
                                    Founded in 2010, GVG Global Group began as a modest metals trading operation with a vision to bridge markets across continents. Through dedication, strategic partnerships, and an unwavering commitment to quality, we have grown into a diversified global enterprise.
                                </p>
                                <p className="mb-6">
                                    Recognizing the digital transformation sweeping across industries, we expanded into IT consulting in 2015, bringing the same principles of excellence and client-first approach that made our trading division successful.
                                </p>
                                <p>
                                    Today, we operate across five continents, serving clients from multinational corporations to emerging businesses, always with the same values that guided our founding: transparency, reliability, and innovation.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Divisions */}
                <section className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-3xl font-bold mb-12 text-center text-slate-900 dark:text-white">Our Business Divisions</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                {divisions.map((division, index) => (
                                    <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 border-none shadow-md bg-white dark:bg-slate-950">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
                                                <division.icon className="h-8 w-8 text-primary dark:text-primary" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{division.name}</h3>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{division.description}</p>
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl">
                                            <p className="font-semibold mb-4 text-slate-900 dark:text-white text-sm uppercase tracking-wider">Key Services</p>
                                            <ul className="space-y-3">
                                                {division.services.map((service, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                                                        <span className="text-primary dark:text-primary mt-0.5">•</span>
                                                        <span>{service}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Global Network */}
                <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-3xl font-bold mb-12 text-center text-slate-900 dark:text-white">Global Network</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {regions.map((region, index) => (
                                    <div key={index} className="text-center group">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Globe className="h-8 w-8 text-primary dark:text-primary" />
                                        </div>
                                        <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{region.name}</h3>
                                        <div className="space-y-1 mb-3">
                                            {region.countries.map((country, idx) => (
                                                <p key={idx} className="text-sm text-slate-600 dark:text-slate-400 font-medium">{country}</p>
                                            ))}
                                        </div>
                                        <p className="text-xs text-primary dark:text-primary font-semibold uppercase tracking-wide">{region.description}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-12">
                                <Link href="/locations" className="text-primary dark:text-primary hover:text-primary/80 font-bold inline-flex items-center">
                                    View our global locations <TrendingUp className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-12 text-center text-slate-900 dark:text-white">Our Core Values</h2>
                        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {[
                                { title: 'Integrity', desc: 'We conduct business with the highest ethical standards, building trust through transparency.' },
                                { title: 'Excellence', desc: 'We strive for excellence in everything we do, continuously improving and innovating.' },
                                { title: 'Partnership', desc: 'We believe in long-term partnerships, working collaboratively for mutual success.' },
                                { title: 'Innovation', desc: 'We embrace innovation and technology to deliver better solutions.' },
                                { title: 'Sustainability', desc: 'We are committed to sustainable business practices that benefit our planet and future.' },
                                { title: 'Customer Focus', desc: 'Our clients are at the heart of everything we do. We deliver solutions that exceed expectations.' }
                            ].map((value, i) => (
                                <Card key={i} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-950">
                                    <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">{value.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                        {value.desc}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-primary dark:bg-primary/90">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center text-white">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Work With Us?</h2>
                            <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
                                Whether you're looking for reliable metals trading solutions or cutting-edge IT consulting services, we're here to help.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/contact">
                                    <button className="w-full sm:w-auto bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-white/90 transition-colors shadow-lg">
                                        Contact Us
                                    </button>
                                </Link>
                                <Link href="/tech">
                                    <button className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-colors">
                                        Request IT Consultation
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </>
    )
}
