"use client"

import { Star, Quote } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Testimonial {
    name: string
    role: string
    company: string
    content: string
    rating: number
    flag: string
}

export function TestimonialsSection() {
    const testimonials: Testimonial[] = [
        {
            name: 'Robert Chen',
            role: 'CPO', // Abbreviated for compactness
            company: 'Pacific Steel',
            flag: '🇺🇸',
            rating: 5,
            content: 'GVG Global Group has been our trusted partner for 5+ years. Their reliability is unmatched.'
        },
        {
            name: 'Priya Sharma',
            role: 'CEO',
            company: 'TechVision',
            flag: '🇮🇳',
            rating: 5,
            content: 'The custom ERP system transformed our operations. Exceptional dedication!'
        },
        {
            name: 'Ahmed Al-Mansoori',
            role: 'Director',
            company: 'Emirates Trading',
            flag: '🇦🇪',
            rating: 5,
            content: 'Shipments arrive on time with complete compliance. Truly professional.'
        },
        {
            name: 'Sarah Johnson',
            role: 'CTO',
            company: 'Innovate Digital',
            flag: '🇨🇦',
            rating: 5,
            content: 'Delivered our mobile app ahead of schedule. Best decision we made!'
        },
        {
            name: 'Rajesh Kumar',
            role: 'MD',
            company: 'Global Metals',
            flag: '🇮🇳',
            rating: 5,
            content: 'Transparent pricing and seamless documentation handling.'
        },
        {
            name: 'Michael Brown',
            role: 'VP Tech',
            company: 'Enterprise Sys',
            flag: '🇺🇸',
            rating: 5,
            content: 'Robust, scalable ERP solution. Smooth deployment and support.'
        }
    ]

    // Duplicate for infinite scroll
    const rollingTestimonials = [...testimonials, ...testimonials]

    return (
        <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 overflow-hidden">
            <div className="container mx-auto px-4 mb-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                    Trusted by Industry Leaders
                </h2>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">4.9/5.0 Average</span>
                    <span className="text-xs text-slate-500">from 200+ reviews</span>
                </div>
            </div>

            <div className="relative w-full">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-50 dark:from-blue-950 to-transparent z-10 pointer-events-none"></div>

                <div className="flex w-max animate-scroll hover:[animation-play-state:paused] py-4">
                    {rollingTestimonials.map((item, idx) => (
                        <Card
                            key={idx}
                            className="mx-4 p-5 w-[350px] flex-shrink-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg">
                                        {item.flag}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white leading-tight">{item.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.role}, {item.company}</p>
                                    </div>
                                </div>
                                <Quote className="h-6 w-6 text-slate-200 dark:text-slate-700" />
                            </div>

                            <div className="flex gap-0.5 mb-2">
                                {[...Array(item.rating)].map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed line-clamp-3">
                                "{item.content}"
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
