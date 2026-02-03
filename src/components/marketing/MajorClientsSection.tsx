import { Building2, Zap, Plane, Car, Factory, Cpu } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function MajorClientsSection() {
    const clientsByIndustry = [
        {
            industry: 'Automotive',
            icon: Car,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950',
            clients: [
                { name: 'Tesla Inc.', product: 'Battery Grade Materials' },
                { name: 'Ford Motor Company', product: 'Steel & Aluminum' },
                { name: 'General Motors', product: 'Specialty Alloys' },
                { name: 'Toyota Motor Corporation', product: 'Rare Earth Metals' },
            ]
        },
        {
            industry: 'Aerospace & Defense',
            icon: Plane,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50 dark:bg-indigo-950',
            clients: [
                { name: 'Boeing', product: 'Aerospace Grade Aluminum' },
                { name: 'Airbus', product: 'Titanium Alloys' },
                { name: 'Lockheed Martin', product: 'Specialty Metals' },
                { name: 'Raytheon Technologies', product: 'Precision Alloys' },
            ]
        },
        {
            industry: 'Construction & Infrastructure',
            icon: Building2,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50 dark:bg-amber-950',
            clients: [
                { name: 'Bechtel Corporation', product: 'Structural Steel' },
                { name: 'Fluor Corporation', product: 'Construction Materials' },
                { name: 'Larsen & Toubro', product: 'Rebar & Steel Products' },
                { name: 'China State Construction', product: 'Building Materials' },
            ]
        },
        {
            industry: 'Manufacturing',
            icon: Factory,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-950',
            clients: [
                { name: 'Siemens AG', product: 'Industrial Metals' },
                { name: 'General Electric', product: 'Turbine Grade Alloys' },
                { name: 'Caterpillar Inc.', product: 'Heavy Equipment Steel' },
                { name: 'ThyssenKrupp', product: 'Specialty Steel' },
            ]
        },
        {
            industry: 'Technology',
            icon: Cpu,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-950',
            clients: [
                { name: 'Apple Inc.', product: 'Aluminum & Rare Metals' },
                { name: 'Samsung Electronics', product: 'Semiconductor Materials' },
                { name: 'Intel Corporation', product: 'Silicon & Specialty Metals' },
                { name: 'TSMC', product: 'High-Purity Materials' },
            ]
        },
        {
            industry: 'Energy & Utilities',
            icon: Zap,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-950',
            clients: [
                { name: 'NextEra Energy', product: 'Solar Grade Materials' },
                { name: 'ExxonMobil', product: 'Pipeline Steel' },
                { name: 'Siemens Gamesa', product: 'Wind Turbine Materials' },
                { name: 'ABB Group', product: 'Electrical Grade Metals' },
            ]
        }
    ]

    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Trusted by Fortune 500 Companies
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Leading global corporations rely on us for premium metals and materials
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {clientsByIndustry.map((industry, index) => (
                        <Card key={index} className="p-6 hover:shadow-xl transition-shadow">
                            <div className={`p-3 ${industry.bgColor} rounded-lg w-fit mb-4`}>
                                <industry.icon className={`h-8 w-8 ${industry.color}`} />
                            </div>

                            <h3 className="text-lg font-bold mb-4">{industry.industry}</h3>

                            <div className="space-y-3">
                                {industry.clients.map((client, idx) => (
                                    <div key={idx} className="border-l-2 border-blue-600 pl-3">
                                        <p className="font-semibold text-sm">{client.name}</p>
                                        <p className="text-xs text-muted-foreground">{client.product}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                    <Card className="p-6 text-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                        <p className="text-4xl font-bold mb-2">30+</p>
                        <p className="text-sm text-blue-100">Fortune 500 Clients</p>
                    </Card>

                    <Card className="p-6 text-center bg-gradient-to-br from-green-600 to-emerald-600 text-white">
                        <p className="text-4xl font-bold mb-2">$500M+</p>
                        <p className="text-sm text-green-100">Annual Trade Volume</p>
                    </Card>

                    <Card className="p-6 text-center bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                        <p className="text-4xl font-bold mb-2">98%</p>
                        <p className="text-sm text-purple-100">On-Time Delivery</p>
                    </Card>

                    <Card className="p-6 text-center bg-gradient-to-br from-amber-600 to-orange-600 text-white">
                        <p className="text-4xl font-bold mb-2">Zero</p>
                        <p className="text-sm text-amber-100">Quality Rejections (2025)</p>
                    </Card>
                </div>

                {/* Trust Statement */}
                <div className="mt-12 text-center">
                    <Card className="inline-block p-6 max-w-3xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                        <p className="text-lg font-semibold mb-2">
                            "Supplier of Choice for Industry Leaders"
                        </p>
                        <p className="text-muted-foreground">
                            Our commitment to quality, reliability, and innovation has made us the preferred partner for the world's most demanding companies.
                        </p>
                    </Card>
                </div>
            </div>
        </section>
    )
}
