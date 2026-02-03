import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Package, Code, TrendingUp, Laptop } from 'lucide-react'

export function ServicesSelectorSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                        What Are You Looking For?
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        We specialize in two distinct business lines - choose your area of interest
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Metals Trading Card */}
                    <Card className="relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all hover:shadow-2xl group">
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative p-8">
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                                <Package className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                                Metals Trading
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                Global scrap metal sourcing and import services. Premium quality materials from USA, Canada, UAE with full certification and compliance.
                            </p>

                            {/* Features */}
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                    Live market pricing
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                    ISO 9001:2015 certified
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                    Ferrous & non-ferrous metals
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                    Import documentation support
                                </li>
                            </ul>

                            {/* CTA */}
                            <div className="flex flex-col gap-3">
                                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <Link href="/pricing">
                                        View Metal Prices
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
                                    <Link href="/contact">Request Quote</Link>
                                </Button>
                            </div>

                            {/* Badge */}
                            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-xs text-slate-500 text-center">
                                    ⭐ 1,247+ successful shipments
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* IT Services Card */}
                    <Card className="relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-2xl group">
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative p-8">
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                                <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                                IT Consulting & Development
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                Custom software development, ERP systems, web applications, and IT consulting services to digitize your business operations.
                            </p>

                            {/* Features */}
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <Laptop className="h-4 w-4 text-blue-600" />
                                    Custom ERP development
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <Laptop className="h-4 w-4 text-blue-600" />
                                    Web & mobile apps
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <Laptop className="h-4 w-4 text-blue-600" />
                                    Cloud solutions
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <Laptop className="h-4 w-4 text-blue-600" />
                                    Technical consulting
                                </li>
                            </ul>

                            {/* CTA */}
                            <div className="flex flex-col gap-3">
                                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                    <Link href="/tech">
                                        Explore IT Services
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20">
                                    <Link href="/contact">Schedule Consultation</Link>
                                </Button>
                            </div>

                            {/* Badge */}
                            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-xs text-slate-500 text-center">
                                    💻 89+ projects delivered
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Help text */}
                <p className="text-center mt-8 text-sm text-slate-500">
                    Not sure which service you need? <Link href="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium underline">Contact us</Link> and we'll guide you
                </p>
            </div>
        </section>
    )
}
