import { MapPin, Phone, Mail, Clock, Building2, Globe } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact & Locations | Global Sourcing, India Based - GVG Global Group',
    description: 'GVG Global Group - India headquarters sourcing scrap metals from USA, Canada, UAE worldwide. Contact us at +1-905-962-2919 or WhatsApp.',
}

export default function LocationsPage() {
    const headquarters = {
        country: 'India',
        flag: '🇮🇳',
        city: 'India',
        type: 'Global Headquarters & Operations Center',
        address: '[Your actual India address - Plot/Building No., Area, City - Pincode]',
        phone: '+1-905-962-2919',
        whatsapp: '+1-905-962-2919',
        email: 'info@gvgglobal.com',
        hours: 'Mon-Sat: 9:00 AM - 7:00 PM IST',
        services: ['Import Operations', 'Quality Control', 'Warehouse & Distribution', 'IT Consulting', 'Global Sourcing', 'Client Services']
    }

    const sourcingRegions = [
        { country: 'Canada', flag: '🇨🇦', materials: ['Scrap Steel', 'Copper Wire', 'Aluminum', 'Brass'] },
        { country: 'United States', flag: '🇺🇸', materials: ['HMS 1/2', 'Stainless Steel', 'Cast Iron'] },
        { country: 'UAE', flag: '🇦🇪', materials: ['Mixed Metals', 'Scrap Steel', 'Non-Ferrous'] },
    ]

    return (
        <main className="min-h-screen py-20 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                        Global Sourcing, India Based
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-3">
                        Headquarters in India • Sourcing from USA, Canada, UAE & Beyond
                    </p>
                    <p className="text-base text-slate-500 dark:text-slate-400">
                        We source premium scrap metals from suppliers across North America and Middle East, importing to India for distribution
                    </p>
                </div>

                {/* Primary Contact Card */}
                <Card className="max-w-4xl mx-auto mb-12 p-8 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20 border-2 border-emerald-200 dark:border-emerald-800">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Central Contact Point</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">For all inquiries, quotes, and business communications</p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                            <a
                                href="tel:+19059622919"
                                className="flex items-center gap-3 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                            >
                                <Phone className="h-5 w-5" />
                                +1 (905) 962-2919
                            </a>

                            <a
                                href="https://wa.me/19059622919"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                WhatsApp
                            </a>
                        </div>

                        <p className="text-sm text-slate-500">Available for calls and WhatsApp messages • Email: {headquarters.email}</p>
                    </div>
                </Card>

                {/* Headquarters */}
                <div className="max-w-6xl mx-auto mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-4xl">{headquarters.flag}</span>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {headquarters.country} - Headquarters
                        </h2>
                    </div>

                    <Card className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                        {headquarters.city}
                                    </h3>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                        {headquarters.type}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {headquarters.address}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-slate-400 flex-shrink-0" />
                                        <a
                                            href={`tel:${headquarters.phone}`}
                                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
                                        >
                                            {headquarters.phone}
                                        </a>
                                        <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">WhatsApp</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-slate-400 flex-shrink-0" />
                                        <a
                                            href={`mailto:${headquarters.email}`}
                                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                        >
                                            {headquarters.email}
                                        </a>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-slate-400 flex-shrink-0" />
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {headquarters.hours}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-3">Services & Capabilities:</p>
                                <div className="flex flex-wrap gap-2">
                                    {headquarters.services.map((service, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-sm rounded text-slate-700 dark:text-slate-300"
                                        >
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sourcing Regions */}
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">Our Sourcing Network</h2>
                        <p className="text-slate-600 dark:text-slate-400">We source premium scrap metals from established suppliers in these regions</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sourcingRegions.map((region, idx) => (
                            <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                                <span className="text-5xl block mb-3">{region.flag}</span>
                                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{region.country}</h3>
                                <p className="text-xs font-semibold text-slate-500 mb-2">Materials Sourced:</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {region.materials.map((material, midx) => (
                                        <span
                                            key={midx}
                                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs rounded text-slate-700 dark:text-slate-300"
                                        >
                                            {material}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card className="mt-8 p-6 bg-slate-100 dark:bg-slate-800">
                        <div className="flex items-start gap-4">
                            <Globe className="h-6 w-6 text-slate-400 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Global Network</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    We maintain relationships with verified suppliers in additional countries across Europe, Asia, and Africa. Contact us to discuss sourcing from your region.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* CTA */}
                <Card className="max-w-4xl mx-auto mt-16 p-8 text-center bg-slate-900 dark:bg-slate-800 text-white">
                    <h3 className="text-2xl font-bold mb-4">Ready to Start Trading?</h3>
                    <p className="mb-6 text-slate-300">
                        Contact us to discuss your scrap metal requirements or supply opportunities
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="tel:+19059622919"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                        >
                            <Phone className="h-5 w-5" />
                            Call +1 (905) 962-2919
                        </a>
                        <a
                            href="https://wa.me/19059622919"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox=" 0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            WhatsApp
                        </a>
                    </div>
                </Card>
            </div>
        </main>
    )
}
