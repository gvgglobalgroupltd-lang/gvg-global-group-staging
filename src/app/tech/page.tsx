
import { ServiceBookingWizard } from '@/components/tech/ServiceBookingWizard'
import { QuoteRequestForm } from '@/components/tech/QuoteRequestForm'
import { PortfolioSection } from '@/components/tech/PortfolioSection'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Code2, Smartphone, TestTube2, Cloud, Users, Zap, FileText } from 'lucide-react'

export default function TechPage() {
    // ... services and benefits arrays ...
    const services = [
        // ... (Keep existing services array content)
        {
            icon: Code2,
            title: 'Custom ERP Development',
            description: 'Tailored enterprise resource planning solutions that streamline your business processes and boost efficiency.',
            features: [
                'Business process automation',
                'Integrated systems',
                'Cloud-based solutions',
                'Scalable architecture'
            ]
        },
        {
            icon: Smartphone,
            title: 'Mobile App Development',
            description: 'Native and cross-platform mobile applications designed to engage your users and drive business growth.',
            features: [
                'iOS & Android apps',
                'Cross-platform solutions',
                'User-centric design',
                'Performance optimization'
            ]
        },
        {
            icon: TestTube2,
            title: 'QA & Testing Services',
            description: 'Comprehensive quality assurance to ensure your software is reliable, secure, and bug-free.',
            features: [
                'Automated testing',
                'Manual QA',
                'Performance testing',
                'Security audits'
            ]
        }
    ]

    const benefits = [
        // ... (Keep existing benefits array content)
        {
            icon: Cloud,
            title: 'Modern Tech Stack',
            description: 'We use cutting-edge technologies to build scalable, efficient solutions.'
        },
        {
            icon: Users,
            title: 'Expert Team',
            description: 'Experienced developers and consultants dedicated to your success.'
        },
        {
            icon: Zap,
            title: 'Agile Delivery',
            description: 'Fast, iterative development with regular updates and feedback loops.'
        }
    ]

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,transparent,black)]" />

                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block mb-6 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-full">
                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                GVG Tech - IT Solutions Partner
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 mb-8 leading-tight">
                            Transform Your Business with Technology
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Custom software solutions, mobile apps, and IT consulting to accelerate your digital transformation.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="text-lg px-8 py-6 h-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                                <a href="#booking">Book a Service</a>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto border-2">
                                <Link href="#services">View Services</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                {/* ... (Keep existing services section content) ... */}
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Our Services</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Comprehensive technology solutions tailored to your business needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {services.map((service, index) => {
                            const Icon = service.icon
                            return (
                                <Card
                                    key={index}
                                    className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-slate-50 dark:bg-slate-900 border-none shadow-sm"
                                >
                                    <div className="mb-6">
                                        <div className="inline-flex p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                            <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{service.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{service.description}</p>

                                    <ul className="space-y-3">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                                <span className="text-indigo-600 dark:text-indigo-400 mt-0.5 font-bold">✓</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                {/* ... (Keep existing benefits section content) ... */}
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Why Choose GVG Tech?</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            We bring expertise, innovation, and dedication to every project
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon
                            return (
                                <div
                                    key={index}
                                    className="text-center p-8 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="inline-flex p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-6 text-indigo-600 dark:text-indigo-400">
                                        <Icon className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{benefit.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{benefit.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>


            {/* Portfolio Section */}
            <PortfolioSection />

            {/* Quote Request Section */}
            <section id="quote" className="py-24 bg-indigo-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-sm font-medium mb-4">
                            <FileText className="h-4 w-4" /> Custom Projects
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Request a Detailed Quote</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            For complex software projects, share your requirements and get a comprehensive technical proposal.
                        </p>
                    </div>
                    <QuoteRequestForm />
                </div>
            </section>

            {/* Booking Section */}
            <section id="booking" className="py-24 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Book a Service</h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400">
                                Select a service, check availability, and schedule your appointment online.
                            </p>
                        </div>

                        {/* Service Booking Wizard */}
                        <ServiceBookingWizard />
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
                    <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                        Join leading companies who trust GVG Tech for their digital transformation
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto font-bold shadow-lg">
                            <a href="#booking">Book Now</a>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 h-auto bg-transparent text-white border-2 border-white hover:bg-white/10 font-bold">
                            <Link href="/">Return to Main Site</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}
