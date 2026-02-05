
import { MapPin, Phone, Mail, Clock, Building2, Globe } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
        <main className="min-h-screen">
            {/* Header Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                            Global Sourcing, <span className="text-emerald-600">India Based</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-4 max-w-2xl mx-auto">
                            Headquarters in India • Sourcing from USA, Canada, UAE & Beyond
                        </p>
                        <p className="text-base text-slate-500 dark:text-slate-400">
                            We source premium scrap metals from suppliers across North America and Middle East, importing to India for distribution
                        </p>
                    </div>
                </div>
            </section>

            {/* Primary Contact Card */}
            <section className="py-12 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="p-8 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20 border-2 border-emerald-100 dark:border-emerald-800 shadow-lg">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Central Contact Point</h2>
                                <p className="text-slate-600 dark:text-slate-400 mb-8">For all inquiries, quotes, and business communications</p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <a
                                        href="tel:+19059622919"
                                        className="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-md w-full sm:w-auto justify-center"
                                    >
                                        <Phone className="h-5 w-5" />
                                        +1 (905) 962-2919
                                    </a>

                                    <a
                                        href="https://wa.me/19059622919"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-md w-full sm:w-auto justify-center"
                                    >
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        Message on WhatsApp
                                    </a>
                                </div>

                                <p className="text-sm text-slate-500 mt-6 font-medium">Available for calls and WhatsApp messages • Email: {headquarters.email}</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Headquarters Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="text-5xl shadow-sm rounded-lg overflow-hidden">{headquarters.flag}</div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{headquarters.country}</h2>
                                <p className="text-slate-500 font-medium">Global Headquarters</p>
                            </div>
                        </div>

                        <Card className="p-8 border-none shadow-md bg-white dark:bg-slate-950">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div>
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                            {headquarters.city}
                                        </h3>
                                        <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 uppercase tracking-wide">
                                            {headquarters.type}
                                        </Badge>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-slate-100 rounded-lg">
                                                <MapPin className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white mb-1">Address</p>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                                    {headquarters.address}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-slate-100 rounded-lg">
                                                <Phone className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white mb-1">Phone / WhatsApp</p>
                                                <a
                                                    href={`tel:${headquarters.phone}`}
                                                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 font-medium block"
                                                >
                                                    {headquarters.phone}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-slate-100 rounded-lg">
                                                <Mail className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white mb-1">Email</p>
                                                <a
                                                    href={`mailto:${headquarters.email}`}
                                                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 font-medium"
                                                >
                                                    {headquarters.email}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-slate-100 rounded-lg">
                                                <Clock className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white mb-1">Working Hours</p>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                                    {headquarters.hours}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Services & Capabilities</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {headquarters.services.map((service, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{service}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Sourcing Regions */}
            <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Our Sourcing Network</h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">We source premium scrap metals from established suppliers in these regions</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {sourcingRegions.map((region, idx) => (
                                <div key={idx} className="group text-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <span className="text-6xl block mb-6 transition-transform group-hover:scale-110 duration-300 inline-block">{region.flag}</span>
                                    <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{region.country}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Materials Sourced</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {region.materials.map((material, midx) => (
                                            <span
                                                key={midx}
                                                className="px-3 py-1.5 bg-white dark:bg-slate-800 text-sm font-medium rounded-md text-slate-600 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-700"
                                            >
                                                {material}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full font-medium text-sm">
                                <Globe className="h-4 w-4" />
                                <span>We verify suppliers globally. Contact us to become a partner.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-slate-900 dark:bg-black text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Trading?</h3>
                        <p className="mb-10 text-slate-300 text-lg max-w-2xl mx-auto">
                            Contact us to discuss your scrap metal requirements or supply opportunities
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+19059622919"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-100 transition-colors shadow-lg"
                            >
                                <Phone className="h-5 w-5" />
                                Call +1 (905) 962-2919
                            </a>
                            <a
                                href="https://wa.me/19059622919"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                Message on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
