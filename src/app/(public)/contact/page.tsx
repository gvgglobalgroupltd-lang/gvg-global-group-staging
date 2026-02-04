import { Mail, Phone, MapPin, Clock, Building2, Globe } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            We're here to help. Reach out to our offices worldwide or contact the department that best fits your needs.
                        </p>
                    </div>

                    {/* Quick Contact & Inquiry Form */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {/* Contact Form */}
                        <div className="md:col-span-2">
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-full">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                    <h2 className="text-2xl font-bold">Send an Inquiry</h2>
                                    <p className="text-muted-foreground">Get a quote or ask us anything.</p>
                                </div>
                                <div className="p-0">
                                    <ContactForm />
                                </div>
                            </div>
                        </div>

                        {/* Quick Contact Info */}
                        <div className="space-y-6">
                            <Card className="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Phone className="h-5 w-5" /> 24/7 Support
                                </h3>
                                <p className="mb-4 text-blue-100">Our trading desk is always open.</p>
                                <a href="tel:+1-555-0123" className="text-2xl font-bold hover:underline">
                                    +1 (555) 012-3456
                                </a>
                                <div className="mt-4 pt-4 border-t border-blue-500/30">
                                    <p className="text-sm font-medium mb-1">Email Us:</p>
                                    <a href="mailto:support@gvgglobal.com" className="hover:underline text-blue-100">support@gvgglobal.com</a>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-blue-600" /> Head Office
                                </h3>
                                <p className="text-muted-foreground text-sm mb-4">
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

                    {/* Regional Offices */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-6">Our Global Offices</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {regions.map((region, index) => (
                                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-3xl mb-2">{region.flag}</p>
                                            <h3 className="text-xl font-bold">{region.name}</h3>
                                            <p className="text-sm text-muted-foreground">{region.office}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                            <p>{region.address}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <a href={`tel:${region.phone}`} className="text-blue-600 hover:underline">
                                                {region.phone}
                                            </a>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <a href={`mailto:${region.email}`} className="text-blue-600 hover:underline">
                                                {region.email}
                                            </a>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <p className="text-muted-foreground">{region.timezone}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Departments */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-6">Contact by Department</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {departments.map((dept, index) => (
                                <Card key={index} className="p-6 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-600/10 rounded-lg">
                                            <Building2 className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-1">{dept.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-2">{dept.description}</p>
                                            <a
                                                href={`mailto:${dept.email}`}
                                                className="text-blue-600 hover:underline text-sm font-medium"
                                            >
                                                {dept.email}
                                            </a>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Business Hours */}
                    <Card className="p-8 mb-12">
                        <h2 className="text-2xl font-bold mb-6">Business Hours</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold mb-3">Americas (USA, Canada)</h3>
                                <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                                <p className="text-sm text-muted-foreground">Saturday: 10:00 AM - 2:00 PM EST</p>
                                <p className="text-sm text-muted-foreground">Sunday: Closed</p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">Asia-Pacific (India)</h3>
                                <p className="text-sm text-muted-foreground">Monday - Saturday: 9:30 AM - 6:30 PM IST</p>
                                <p className="text-sm text-muted-foreground">Sunday: Closed</p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">Middle East (UAE)</h3>
                                <p className="text-sm text-muted-foreground">Sunday - Thursday: 9:00 AM - 6:00 PM GST</p>
                                <p className="text-sm text-muted-foreground">Friday-Saturday: Closed</p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">Africa (South Africa)</h3>
                                <p className="text-sm text-muted-foreground">Monday - Friday: 8:00 AM - 5:00 PM SAST</p>
                                <p className="text-sm text-muted-foreground">Sat-Sun: Closed</p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <p className="text-sm">
                                <strong>Note:</strong> For urgent matters outside business hours, please email{' '}
                                <a href="mailto:urgent@gvgglobal.com" className="text-blue-600 hover:underline">
                                    urgent@gvgglobal.com
                                </a>
                            </p>
                        </div>
                    </Card>

                    {/* Social Media & Other Links */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold mb-6">Stay Connected</h2>
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                Follow us on social media for updates, industry insights, and news:
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="outline" asChild>
                                    <a href="https://linkedin.com/company/gvgglobal" target="_blank" rel="noopener noreferrer">
                                        LinkedIn
                                    </a>
                                </Button>
                                <Button variant="outline" asChild>
                                    <a href="https://twitter.com/gvgglobal" target="_blank" rel="noopener noreferrer">
                                        Twitter
                                    </a>
                                </Button>
                                <Button variant="outline" asChild>
                                    <a href="https://facebook.com/gvgglobal" target="_blank" rel="noopener noreferrer">
                                        Facebook
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
