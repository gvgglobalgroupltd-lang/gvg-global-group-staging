
'use client'

import { Building2, ShieldCheck, Globe2 } from 'lucide-react'

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
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4 px-4 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                        <span className="text-sm font-bold text-indigo-300">Proven Expertise</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                        Mission Critical Delivery
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        High-stakes projects in Banking, FinTech, and Enterprise Logistics.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {projects.map((project, idx) => (
                        <div key={idx} className="group relative rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-300 overflow-hidden">
                            <div className="p-8 h-full flex flex-col">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-3 bg-indigo-500/10 rounded-xl">
                                        <project.icon className="h-6 w-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                        {project.category}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                                    {project.title}
                                </h3>
                                <div className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider">
                                    Lead Role: <span className="text-slate-300">{project.role}</span>
                                </div>
                                <p className="text-slate-400 mb-6 leading-relaxed flex-grow text-sm">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                                    {project.tech.map((t, i) => (
                                        <span key={i} className="text-[10px] font-medium px-2 py-1 bg-slate-900 text-slate-400 rounded border border-slate-800">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
