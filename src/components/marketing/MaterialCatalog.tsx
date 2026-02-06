"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
import { Button } from "@/components/ui/button"

const materials = [
    {
        name: "Copper Scrap",
        description: "Premium Millberry, Berry, Birch/Cliff",
        image: "/images/materials/copper.png",
        type: "Non-Ferrous",
        link: "/services"
    },
    {
        name: "Aluminum Alloys",
        description: "Taint/Tabor, Tense, Extrusion 6063",
        image: "/images/materials/aluminum.png",
        type: "Non-Ferrous",
        link: "/services"
    },
    {
        name: "Heavy Melting Steel",
        description: "Industrial HMS 1 & 2, Shredded",
        image: "/images/materials/hms_steel.png",
        type: "Ferrous",
        link: "/services"
    },
    {
        name: "Brass Honey",
        description: "Yellow Brass, Mixed Honey/Ocean",
        image: "/images/materials/brass.png",
        type: "Non-Ferrous",
        link: "/services"
    },
    {
        name: "Stainless Steel",
        description: "Grade 304, 316, 430 Sheets/Pipes",
        image: "/images/materials/stainless.png",
        type: "Ferrous",
        link: "/services"
    },
    {
        name: "Electronic Waste",
        description: "High-grade PCBs, Processors, Memory",
        image: "/images/materials/ewaste.png",
        type: "Electronics",
        link: "/services"
    }
]

export function MaterialCatalog() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 320 // Approx card width + gap
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <section className="py-12 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-8 px-2">
                    <div className="text-left">
                        <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest">Premium Sourcing</span>
                        <h2 className="text-2xl md:text-3xl font-bold mt-1 text-slate-900 dark:text-white">
                            Global Material Catalog
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl text-sm hidden md:block">
                            Sourcing high-grade recyclable metals for industrial manufacturing.
                        </p>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll('left')}
                            className="h-8 w-8 rounded-full border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll('right')}
                            className="h-8 w-8 rounded-full border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 -mx-4 px-4 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {materials.map((item, idx) => (
                        <Card key={idx} className="flex-none w-[280px] md:w-[320px] snap-center group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white dark:bg-slate-950 p-0">
                            {/* Image Area */}
                            <div className="relative w-full aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/20 group-hover:to-slate-900/10 transition-colors z-10"></div>
                                {/* Progressive Image with WebP Support */}
                                <picture>
                                    <source
                                        srcSet={item.image.replace('.png', '.webp')}
                                        type="image/webp"
                                    />
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                </picture>
                                <div className="absolute top-3 right-3 z-20">
                                    <Badge className="bg-white/90 text-slate-900 backdrop-blur-sm hover:bg-white text-[10px] font-bold border-none px-2 py-0.5">
                                        {item.type}
                                    </Badge>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-4 relative">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                                        {item.name}
                                    </h3>
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                                    {item.description}
                                </p>

                                <Link
                                    href={item.link}
                                    className="inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-all group-hover:translate-x-1 uppercase tracking-wider"
                                >
                                    Details
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
