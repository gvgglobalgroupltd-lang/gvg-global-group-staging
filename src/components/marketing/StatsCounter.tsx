'use client'

import { Shield, Award, Users, TrendingUp, Package, Globe } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'

interface Stat {
    icon: React.ElementType
    value: number
    suffix: string
    label: string
    color: string
}

export function StatsCounter() {
    const [hasAnimated, setHasAnimated] = useState(false)

    const stats: Stat[] = [
        {
            icon: TrendingUp,
            value: 15,
            suffix: '+',
            label: 'Years in Business',
            color: 'text-blue-600'
        },
        {
            icon: Globe,
            value: 8,
            suffix: '+',
            label: 'Countries Served',
            color: 'text-green-600'
        },
        {
            icon: Package,
            value: 1247,
            suffix: '+',
            label: 'Successful Shipments',
            color: 'text-purple-600'
        },
        {
            icon: Users,
            value: 47,
            suffix: '+',
            label: 'Active Clients',
            color: 'text-indigo-600'
        },
        {
            icon: Award,
            value: 89,
            suffix: '+',
            label: 'IT Projects Delivered',
            color: 'text-amber-600'
        },
        {
            icon: Shield,
            value: 97,
            suffix: '%',
            label: 'Client Satisfaction',
            color: 'text-emerald-600'
        }
    ]

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true)
                }
            },
            { threshold: 0.1 }
        )

        const element = document.getElementById('stats-counter')
        if (element) observer.observe(element)

        return () => observer.disconnect()
    }, [hasAnimated])

    const AnimatedNumber = ({ value, suffix }: { value: number; suffix: string }) => {
        const [count, setCount] = useState(0)

        useEffect(() => {
            if (!hasAnimated) return

            const duration = 2000
            const steps = 60
            const increment = value / steps
            let current = 0

            const timer = setInterval(() => {
                current += increment
                if (current >= value) {
                    setCount(value)
                    clearInterval(timer)
                } else {
                    setCount(Math.floor(current))
                }
            }, duration / steps)

            return () => clearInterval(timer)
        }, [hasAnimated, value])

        return (
            <span>
                {count.toLocaleString()}
                {suffix}
            </span>
        )
    }

    return (
        <section id="stats-counter" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                        Trusted Globally, Proven Locally
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400">
                        Numbers that speak for our commitment to excellence
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {stats.map((stat, index) => (
                        <Card
                            key={index}
                            className="p-6 text-center bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg hover:scale-105 transition-all"
                        >
                            <stat.icon className={`h-10 w-10 mx-auto mb-3 ${stat.color}`} />
                            <p className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
                                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
