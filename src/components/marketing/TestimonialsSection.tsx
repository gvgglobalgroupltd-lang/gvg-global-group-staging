'use client'

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
            role: 'Chief Procurement Officer',
            company: 'Pacific Steel Industries',
            flag: '🇺🇸',
            rating: 5,
            content: 'GVG Global Group has been our trusted partner for metals trading for over 5 years. Their reliability, quality assurance, and competitive pricing are unmatched in the industry.'
        },
        {
            name: 'Priya Sharma',
            role: 'CEO',
            company: 'TechVision Solutions',
            flag: '🇮🇳',
            rating: 5,
            content: 'The custom ERP system they developed transformed our business operations. The team\'s expertise and dedication to our success was exceptional. Highly recommended!'
        },
        {
            name: 'Ahmed Al-Mansoori',
            role: 'Operations Director',
            company: 'Emirates Trading Co.',
            flag: '🇦🇪',
            rating: 5,
            content: 'Outstanding logistics coordination and documentation support. Every shipment arrives on time with complete compliance. A truly professional organization.'
        },
        {
            name: 'Sarah Johnson',
            role: 'CTO',
            company: 'Innovate Digital',
            flag: '🇨🇦',
            rating: 5,
            content: 'Their IT consulting team delivered our mobile app ahead of schedule with exceptional quality. The ongoing support has been fantastic. Best decision we made!'
        },
        {
            name: 'Rajesh Kumar',
            role: 'Managing Director',
            company: 'Global Metals Ltd',
            flag: '🇮🇳',
            rating: 5,
            content: 'Transparent pricing, excellent quality, and professional service. They handle complex import-export documentation seamlessly. A reliable partner for our expansion.'
        },
        {
            name: 'Michael Brown',
            role: 'VP Technology',
            company: 'Enterprise Systems Inc',
            flag: '🇺🇸',
            rating: 5,
            content: 'The ERP solution they built is robust, scalable, and perfectly suited to our needs. Their QA testing was thorough and the deployment was smooth.'
        }
    ]

    return (
        <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Trusted by Industry Leaders
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our clients say about working with us.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="p-6 hover:shadow-xl transition-shadow relative bg-card"
                        >
                            <Quote className="h-10 w-10 text-blue-600/20 absolute top-4 right-4" />

                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                                    {testimonial.flag}
                                </div>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>

                            <div className="flex gap-1 mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            <p className="text-muted-foreground mb-4 italic">
                                "{testimonial.content}"
                            </p>

                            <p className="text-sm font-semibold text-blue-600">
                                {testimonial.company}
                            </p>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-950 rounded-full">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.9/5.0 Average Rating</span>
                        <span className="text-muted-foreground">from 200+ clients</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
