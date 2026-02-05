"use client"

import { Shield, Award, Users, TrendingUp, Package, Globe } from 'lucide-react'
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
            label: 'Years Exp.',
            color: 'text-blue-500'
        },
        {
            icon: Globe,
            value: 8,
            suffix: '+',
            label: 'Countries',
            color: 'text-emerald-500'
        },
        {
            icon: Package,
            value: 1247,
            suffix: '+',
            label: 'Shipments',
            color: 'text-indigo-500'
        },
        {
            icon: Users,
            value: 47,
            suffix: '+',
            label: 'Active Clients',
            color: 'text-purple-500'
        },
        {
            icon: Award,
            value: 89,
            suffix: '+',
            label: 'Projects',
            color: 'text-amber-500'
        },
        {
            icon: Shield,
            value: 97,
            suffix: '%',
            label: 'Satisfaction',
            color: 'text-green-500'
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

        const element = document.getElementById('stats-strip')
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
        <section id="stats-strip" className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
            <div className="container mx-auto">
                <div className="flex flex-wrap md:flex-nowrap justify-between items-center shadow-none divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex-1 min-w-[50%] md:min-w-0 py-4 px-2 flex flex-col items-center justify-center text-center group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-3 mb-1">
                                <stat.icon className={`h-5 w-5 ${stat.color} opacity-80 group-hover:scale-110 transition-transform`} />
                                <span className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                                </span>
                            </div>
                            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
