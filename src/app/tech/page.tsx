import { Code2, Smartphone, TestTube2, Cloud, Users, Zap } from 'lucide-react'
import { ConsultationForm } from '@/components/tech/ConsultationForm'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TechPage() {
    const services = [
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,transparent,black)]" />

                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block mb-4 px-4 py-2 bg-indigo-600/10 border border-indigo-600/20 rounded-full">
                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                GVG Tech - IT Solutions Partner
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 mb-6">
                            Transform Your Business with Technology
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                            Custom software solutions, mobile apps, and IT consulting to accelerate your digital transformation.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="text-lg px-8">
                                <a href="#consultation">Request Consultation</a>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="text-lg px-8">
                                <Link href="#services">View Services</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 bg-white/50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive technology solutions tailored to your business needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {services.map((service, index) => {
                            const Icon = service.icon
                            return (
                                <Card
                                    key={index}
                                    className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800"
                                >
                                    <div className="mb-4">
                                        <div className="inline-flex p-3 bg-indigo-600/10 rounded-lg">
                                            <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                                    <p className="text-muted-foreground mb-4">{service.description}</p>

                                    <ul className="space-y-2">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm">
                                                <span className="text-indigo-600 dark:text-indigo-400 mt-1">✓</span>
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
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose GVG Tech?</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            We bring expertise, innovation, and dedication to every project
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon
                            return (
                                <div
                                    key={index}
                                    className="text-center p-6 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800"
                                >
                                    <div className="inline-flex p-4 bg-indigo-600/10 rounded-full mb-4">
                                        <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                                    <p className="text-muted-foreground">{benefit.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Consultation Form Section */}
            <section id="consultation" className="py-20 bg-white/50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Build Something Amazing</h2>
                            <p className="text-xl text-muted-foreground">
                                Tell us about your project and we'll get back to you within 24-48 hours
                            </p>
                        </div>

                        <ConsultationForm />
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join leading companies who trust GVG Tech for their digital transformation
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                            <a href="#consultation">Get Started</a>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent text-white border-white hover:bg-white/10">
                            <Link href="/admin">Admin Portal</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
