"use client"

import { Leaf, Recycle, Zap, TreePine } from 'lucide-react'
import { useState, useEffect } from 'react'

const stats = [
    {
        label: "Recycled Material",
        value: 5240,
        suffix: " MT",
        icon: Recycle,
        desc: "Diverted from landfills"
    },
    {
        label: "CO₂ Saved",
        value: 8900,
        suffix: " Tons",
        icon: Leaf,
        desc: "Equivalent carbon offset"
    },
    {
        label: "Energy Conserved",
        value: 14500,
        suffix: " MWh",
        icon: Zap,
        desc: "Powering growth"
    },
    {
        label: "Trees Planted",
        value: 42000,
        suffix: "+",
        icon: TreePine,
        desc: "Annual equivalent"
    }
]

export function ImpactDashboard() {
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true)
                }
            },
            { threshold: 0.1 }
        )

        const element = document.getElementById('impact-strip')
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
        <section id="impact-strip" className="bg-emerald-50/50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="container mx-auto">
                <div className="flex flex-wrap md:flex-nowrap justify-between items-center divide-y md:divide-y-0 md:divide-x divide-emerald-100 dark:divide-emerald-900/50 rounded-b-xl overflow-hidden">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex-1 min-w-[50%] md:min-w-0 py-4 px-2 flex flex-col items-center justify-center text-center group hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition-colors">
                            <div className="flex items-center gap-3 mb-1">
                                <stat.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400 opacity-80 group-hover:scale-110 transition-transform" />
                                <span className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                                </span>
                            </div>
                            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                                {stat.label}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
