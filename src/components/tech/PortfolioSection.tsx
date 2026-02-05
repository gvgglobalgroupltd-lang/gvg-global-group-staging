
'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Building2, ShieldCheck, Globe2 } from 'lucide-react'

export function PortfolioSection() {
    const projects = [
        {
            title: 'Global Banking Payment Gateway',
            category: 'FinTech',
            role: 'Lead Architect',
            description: 'Architected a secure, high-throughput payment gateway processing $50M+ daily. Implemented ISO 20022 standards and real-time fraud detection.',
            tech: ['Java/Spring Boot', 'Kafka', 'React', 'AWS'],
            icon: Building2
        },
        {
            title: 'Automated QE Framework for Trading Platform',
            category: 'QE Leadership',
            role: 'QE Lead',
            description: 'Designed a hybrid Selenium/Playwright framework reducing regression cycle time by 70%. Managed a team of 15 SDETs ensuring 99.9% release stability.',
            tech: ['Playwright', 'Python', 'Jenkins', 'Docker'],
            icon: ShieldCheck
        },
        {
            title: 'Cross-Border Supply Chain Tracker',
            category: 'Logistics',
            role: 'Full Stack Developer',
            description: 'Built a real-time tracking system for international shipments with blockchain-based verification for document integrity.',
            tech: ['Next.js', 'Supabase', 'Solidity', 'Go'],
            icon: Globe2
        }
    ]

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4 px-4 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                        <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">Proven Expertise</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                        Delivering Excellence in High-Stakes Domains
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Years of experience leading critical projects in Banking, FinTech, and Enterprise Logistics.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {projects.map((project, idx) => (
                        <Card key={idx} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                            <div className="p-8 flex-1">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                        <project.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <Badge variant="outline" className="text-indigo-600 border-indigo-200 dark:text-indigo-400 dark:border-indigo-800">
                                        {project.category}
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    {project.title}
                                </h3>
                                <div className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">
                                    Role: {project.role}
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {project.tech.map((t, i) => (
                                        <span key={i} className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-md">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
