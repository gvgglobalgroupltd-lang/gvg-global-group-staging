import { Building2, Globe, Users, Award, TrendingUp, Cpu } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <Badge className="mb-4" variant="outline">Est. 2010</Badge>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            About <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">GVG Global Group</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            A diversified global enterprise specializing in international metals trading and cutting-edge IT consulting services, bridging industries and continents.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        {stats.map((stat, index) => (
                            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                                <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </Card>
                        ))}
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <Card className="p-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                            <p className="text-blue-50 leading-relaxed">
                                To facilitate seamless global trade and deliver innovative technology solutions that empower businesses worldwide. We are committed to excellence, integrity, and sustainable growth across all our ventures.
                            </p>
                        </Card>

                        <Card className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                            <p className="text-indigo-50 leading-relaxed">
                                To be the most trusted global partner in metals trading and IT consulting, recognized for our reliability, innovation, and commitment to creating value for our clients, partners, and communities.
                            </p>
                        </Card>
                    </div>

                    {/* Company Story */}
                    <Card className="p-8 mb-16">
                        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed mb-4">
                                Founded in 2010, GVG Global Group began as a modest metals trading operation with a vision to bridge markets across continents. Through dedication, strategic partnerships, and an unwavering commitment to quality, we have grown into a diversified global enterprise.
                            </p>
                            <p className="text-lg leading-relaxed mb-4">
                                Recognizing the digital transformation sweeping across industries, we expanded into IT consulting in 2015, bringing the same principles of excellence and client-first approach that made our trading division successful.
                            </p>
                            <p className="text-lg leading-relaxed">
                                Today, we operate across five continents, serving clients from multinational corporations to emerging businesses, always with the same values that guided our founding: transparency, reliability, and innovation.
                            </p>
                        </div>
                    </Card>

                    {/* Divisions */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">Our Business Divisions</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {divisions.map((division, index) => (
                                <Card key={index} className="p-8 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-blue-600/10 rounded-lg">
                                            <division.icon className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold">{division.name}</h3>
                                    </div>
                                    <p className="text-muted-foreground mb-6">{division.description}</p>
                                    <div>
                                        <p className="font-semibold mb-3">Services:</p>
                                        <ul className="space-y-2">
                                            {division.services.map((service, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-blue-600 mt-1">✓</span>
                                                    <span>{service}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Global Presence */}
                    <Card className="p-8 mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">Global Network</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {regions.map((region, index) => (
                                <div key={index} className="text-center">
                                    <Globe className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                                    <h3 className="font-bold text-lg mb-2">{region.name}</h3>
                                    <div className="space-y-1">
                                        {region.countries.map((country, idx) => (
                                            <p key={idx} className="text-sm text-muted-foreground">{country}</p>
                                        ))}
                                        <p className="text-xs text-blue-600 mt-2">{region.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link href="/locations" className="text-blue-600 hover:underline font-semibold">
                                View our locations →
                            </Link>
                        </div>
                    </Card>

                    {/* Core Values */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="p-6">
                                <h3 className="text-xl font-bold mb-3">Integrity</h3>
                                <p className="text-muted-foreground">
                                    We conduct business with the highest ethical standards, building trust through transparency and honesty in every transaction.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-xl font-bold mb-3">Excellence</h3>
                                <p className="text-muted-foreground">
                                    We strive for excellence in everything we do, from product quality to customer service, continuously improving and innovating.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-xl font-bold mb-3">Partnership</h3>
                                <p className="text-muted-foreground">
                                    We believe in long-term partnerships, working collaboratively with clients, suppliers, and stakeholders for mutual success.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                                <p className="text-muted-foreground">
                                    We embrace innovation and technology to deliver better solutions and stay ahead in a rapidly evolving global marketplace.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-xl font-bold mb-3">Sustainability</h3>
                                <p className="text-muted-foreground">
                                    We are committed to sustainable business practices that benefit our planet, communities, and future generations.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-xl font-bold mb-3">Customer Focus</h3>
                                <p className="text-muted-foreground">
                                    Our clients are at the heart of everything we do. We listen, adapt, and deliver solutions that exceed expectations.
                                </p>
                            </Card>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <Card className="p-12 text-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                        <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
                        <p className="text-blue-50 mb-8 max-w-2xl mx-auto">
                            Whether you're looking for reliable metals trading solutions or cutting-edge IT consulting services, we're here to help.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link href="/contact">
                                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                                    Contact Us
                                </button>
                            </Link>
                            <Link href="/tech">
                                <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                    Request IT Consultation
                                </button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
