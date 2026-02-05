
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plane, FileText, Stamp, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react'
import { getImmigrationServices } from '@/actions/immigration'
import { Badge } from '@/components/ui/badge'

export default async function ImmigrationPage() {
    const services = await getImmigrationServices() || []

    // Helper to map DB icon strings to Lucide components
    const getIcon = (name: string | null) => {
        const icons: any = { Plane, FileText, Stamp, MapPin }
        return icons[name || 'FileText'] || FileText
    }

    // Helper for colors based on service code (optional styling)
    const getColor = (code: string) => {
        if (code.includes('OCI')) return 'text-orange-600 bg-orange-100'
        if (code.includes('CAN')) return 'text-red-600 bg-red-100'
        if (code.includes('US')) return 'text-blue-600 bg-blue-100'
        return 'text-emerald-600 bg-emerald-100'
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>

                <div className="container relative mx-auto px-4">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm font-medium mb-6">
                            <Plane className="h-4 w-4" /> Global Mobility Solutions
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Your Gateway to the World
                        </h1>
                        <p className="text-xl text-slate-300 mb-8">
                            Professional immigration services for individuals and families. We simplify the complexity of visas, PR, and citizenship.
                        </p>
                        <div className="flex gap-4">
                            <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
                                <Link href="/immigration/eligibility">Check Eligibility</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="border-slate-700 hover:bg-slate-800 text-white">
                                <Link href="#services">View Services</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section id="services" className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                            Comprehensive Visa Services
                        </h2>
                        <p className="text-slate-600 mt-4">Selected your destination to get started</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service: any, idx: number) => {
                            const Icon = getIcon(service.icon_name)
                            const colorClass = getColor(service.code)

                            return (
                                <Link key={idx} href={`/immigration/apply/${service.code}`} className="group">
                                    <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-slate-200 flex flex-col">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            {service.price > 0 && (
                                                <Badge variant="secondary" className="font-mono text-sm">
                                                    {service.currency === 'USD' ? '$' : service.currency} {service.price}
                                                </Badge>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                                            {service.title}
                                        </h3>

                                        {service.processing_time && (
                                            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                                                ⏱ {service.processing_time}
                                            </p>
                                        )}

                                        <p className="text-slate-500 mb-6 text-sm leading-relaxed flex-grow">
                                            {service.description}
                                        </p>

                                        <div className="flex items-center text-amber-600 font-semibold text-sm mt-auto">
                                            Start Application <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Features / Why Us */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-3xl opacity-20 transform rotate-3"></div>
                            <img
                                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop"
                                alt="Visa Consultation"
                                className="relative rounded-3xl shadow-2xl"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose GVG Immigration?</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="mt-1 bg-green-100 p-2 rounded-full h-fit">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">Expert Verification</h3>
                                        <p className="text-slate-600">Every document is reviewed by our specialists before submission to minimize rejection risk.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1 bg-green-100 p-2 rounded-full h-fit">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">End-to-End Support</h3>
                                        <p className="text-slate-600">From the first form to final passport collection, we guide you through every step.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1 bg-green-100 p-2 rounded-full h-fit">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">Halifax In-Person Service</h3>
                                        <p className="text-slate-600">Local clients in Halifax can opt for doorstep document verification and pickup.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
