
import { Mail, Phone, MapPin, Clock, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { ContactForm } from '@/components/forms/ContactForm'

export default function ContactPage() {
    const regions = [
        {
            name: 'United States',
            flag: '🇺🇸',
            office: 'North America Headquarters',
            address: 'Your Address Here',
            phone: '+1 (XXX) XXX-XXXX',
            email: 'usa@gvgglobal.com',
            timezone: 'EST (UTC-5)'
        },
        {
            name: 'Canada',
            flag: '🇨🇦',
            office: 'Canada Office',
            address: 'Your Address Here',
            phone: '+1 (XXX) XXX-XXXX',
            email: 'canada@gvgglobal.com',
            timezone: 'EST (UTC-5)'
        },
        {
            name: 'India',
            flag: '🇮🇳',
            office: 'India Headquarters',
            address: 'Your Address Here',
            phone: '+91-XXXXX-XXXXX',
            email: 'india@gvgglobal.com',
            timezone: 'IST (UTC+5:30)'
        },
        {
            name: 'United Arab Emirates',
            flag: '🇦🇪',
            office: 'Middle East Office',
            address: 'Dubai, UAE',
            phone: '+971-XX-XXX-XXXX',
            email: 'dubai@gvgglobal.com',
            timezone: 'GST (UTC+4)'
        },
        {
            name: 'South Africa',
            flag: '🇿🇦',
            office: 'African Operations',
            address: 'Your Address Here',
            phone: '+27-XX-XXX-XXXX',
            email: 'africa@gvgglobal.com',
            timezone: 'SAST (UTC+2)'
        }
    ]

    const departments = [
        {
            name: 'Metals Trading',
            email: 'metals@gvgglobal.com',
            description: 'Import/export, logistics, quality assurance'
        },
        {
            name: 'IT Consulting',
            email: 'tech@gvgglobal.com',
            description: 'ERP, mobile apps, QA testing services'
        },
        {
            name: 'Customer Support',
            email: 'support@gvgglobal.com',
            description: 'General inquiries and support'
        },
        {
            name: 'Sales',
            email: 'sales@gvgglobal.com',
            description: 'New business and partnerships'
        },
        {
            name: 'Finance',
            email: 'finance@gvgglobal.com',
            description: 'Payments, invoices, accounting'
        },
        {
            name: 'Legal & Compliance',
            email: 'legal@gvgglobal.com',
            description: 'Contracts, compliance, data protection'
        }
    ]

    return (
        <main className="min-h-screen">
            {/* Header Section - Dark Hero */}
            <section className="relative pt-40 pb-20 overflow-hidden bg-slate-950">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/hero_logistics.jpg"
                        alt="Global Logistics Network"
                        className="h-full w-full object-cover opacity-40"
                    />
                </div>

                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-slate-950 z-0" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">Contact Us</h1>
                        <p className="text-xl text-slate-200 max-w-2xl mx-auto drop-shadow-sm">
                            We&apos;re here to help. Reach out to our offices worldwide or contact the department that best fits your needs.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Contact Area */}
            <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Contact Form */}
                        <div className="md:col-span-2">
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 h-full overflow-hidden">
                                <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Send an Inquiry</h2>
                                    <p className="text-slate-500 dark:text-slate-400">Get a quote or ask us anything.</p>
                                </div>
                                <div className="p-0">
                                    <ContactForm />
                                </div>
                            </div>
                        </div>

                        {/* Quick Contact Info */}
                        <div className="space-y-6">
                            <Card className="p-8 bg-primary text-primary-foreground border-none shadow-lg">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Phone className="h-5 w-5" /> 24/7 Support
                                </h3>
                                <p className="mb-6 text-primary-foreground/90 opacity-90">Our trading desk is always open for urgent inquiries.</p>
                                <a href="tel:+1-555-0123" className="block text-3xl font-bold hover:opacity-90 transition-opacity mb-6">
                                    +1 (555) 012-3456
                                </a>
                                <div className="pt-6 border-t border-primary-foreground/30">
                                    <p className="text-sm font-medium mb-2 text-primary-foreground/80">Email Us:</p>
                                    <a href="mailto:support@gvgglobal.com" className="hover:text-white text-primary-foreground font-medium text-lg transition-colors">support@gvgglobal.com</a>
                                </div>
                            </Card>

                            <Card className="p-8 border-none shadow-md bg-slate-50 dark:bg-slate-900">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Building2 className="h-5 w-5 text-primary" /> Head Office
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                                    1234 Trade Tower, Financial District<br />
                                    New York, NY 10005<br />
                                    United States
                                </p>
                                <Button variant="outline" className="w-full" asChild>
                                    <a href="https://maps.google.com" target="_blank">Get Directions</a>
                                </Button>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Global Offices */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center text-slate-900 dark:text-white">Our Global Offices</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {regions.map((region, index) => (
                            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-none shadow-sm bg-white dark:bg-slate-950">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <p className="text-4xl mb-3">{region.flag}</p>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{region.name}</h3>
                                        <p className="text-sm text-slate-500 font-medium">{region.office}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-sm">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-4 w-4 text-slate-400 mt-1 flex-shrink-0" />
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{region.address}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                        <a href={`tel:${region.phone}`} className="text-primary hover:text-primary/80 font-medium">
                                            {region.phone}
                                        </a>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                        <a href={`mailto:${region.email}`} className="text-primary hover:text-primary/80 font-medium">
                                            {region.email}
                                        </a>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                        <p className="text-slate-500 text-xs font-medium">{region.timezone}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Departments */}
            <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center text-slate-900 dark:text-white">Contact by Department</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {departments.map((dept, index) => (
                                <Card key={index} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border-slate-200 dark:border-slate-800">
                                    <div className="flex items-start gap-5">
                                        <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-xl">
                                            <Building2 className="h-6 w-6 text-primary dark:text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">{dept.name}</h3>
                                            <p className="text-sm text-slate-500 mb-3">{dept.description}</p>
                                            <a
                                                href={`mailto:${dept.email}`}
                                                className="text-primary hover:text-primary/80 text-sm font-semibold inline-flex items-center gap-1"
                                            >
                                                {dept.email}
                                                <span className="block w-1.5 h-1.5 rounded-full bg-primary ml-1"></span>
                                            </a>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Business Hours & Social */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                        {/* Hours */}
                        <div className="md:col-span-2">
                            <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Business Hours</h2>
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="text-xl">🇺🇸</span> Americas
                                    </h3>
                                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                        <p className="flex justify-between"><span>Mon - Fri:</span> <span className="font-medium text-slate-900 dark:text-slate-200">9:00 AM - 6:00 PM EST</span></p>
                                        <p className="flex justify-between"><span>Saturday:</span> <span className="font-medium text-slate-900 dark:text-slate-200">10:00 AM - 2:00 PM EST</span></p>
                                        <p className="flex justify-between"><span>Sunday:</span> <span className="text-slate-400">Closed</span></p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="text-xl">🇮🇳</span> Asia-Pacific
                                    </h3>
                                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                        <p className="flex justify-between"><span>Mon - Sat:</span> <span className="font-medium text-slate-900 dark:text-slate-200">9:30 AM - 6:30 PM IST</span></p>
                                        <p className="flex justify-between"><span>Sunday:</span> <span className="text-slate-400">Closed</span></p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="text-xl">🇦🇪</span> Middle East
                                    </h3>
                                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                        <p className="flex justify-between"><span>Sun - Thu:</span> <span className="font-medium text-slate-900 dark:text-slate-200">9:00 AM - 6:00 PM GST</span></p>
                                        <p className="flex justify-between"><span>Fri - Sat:</span> <span className="text-slate-400">Closed</span></p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="text-xl">🇿🇦</span> Africa
                                    </h3>
                                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                        <p className="flex justify-between"><span>Mon - Fri:</span> <span className="font-medium text-slate-900 dark:text-slate-200">8:00 AM - 5:00 PM SAST</span></p>
                                        <p className="flex justify-between"><span>Sat - Sun:</span> <span className="text-slate-400">Closed</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 p-4 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20 dark:border-primary/30">
                                <p className="text-sm text-primary dark:text-primary-foreground flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <strong>Urgent Requirement?</strong> Email <a href="mailto:urgent@gvgglobal.com" className="underline hover:text-primary/80">urgent@gvgglobal.com</a> for priority response.
                                </p>
                            </div>
                        </div>

                        {/* Social */}
                        <div>
                            <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Stay Connected</h2>
                            <Card className="p-6 border-none shadow-md bg-white dark:bg-slate-950">
                                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                                    Follow us on social media for live market updates, industry insights, and company news.
                                </p>
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start h-12 text-slate-600 hover:text-primary hover:border-primary transition-all" asChild>
                                        <a href="https://linkedin.com/company/gvgglobal" target="_blank" rel="noopener noreferrer">
                                            LinkedIn
                                        </a>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start h-12 text-slate-600 hover:text-sky-500 hover:border-sky-500 transition-all" asChild>
                                        <a href="https://twitter.com/gvgglobal" target="_blank" rel="noopener noreferrer">
                                            Twitter
                                        </a>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start h-12 text-slate-600 hover:text-primary hover:border-primary transition-all" asChild>
                                        <a href="https://facebook.com/gvgglobal" target="_blank" rel="noopener noreferrer">
                                            Facebook
                                        </a>
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
