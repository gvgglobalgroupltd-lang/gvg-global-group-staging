"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSlider() {
    return (
        <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-muted border-b border-border">
            {/* Background Image with Zoom Animation */}
            <div className="absolute inset-0">
                <Image
                    src="/images/hero_scrap_yard.jpg"
                    alt="Global Metal Recycling"
                    fill
                    className="object-cover animate-ken-burns bg-zinc-900"
                    priority
                    sizes="100vw"
                />

                {/* Overlays for Text Visibility */}
                {/* 1. Dark side gradient for main text content */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                {/* 2. Top gradient for Navigation Header visibility */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                <div className="max-w-2xl animate-in slide-in-from-left-10 duration-700 fade-in pt-20">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                        Global Metal Recycling Leaders
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-zinc-100 mb-8 font-medium max-w-xl leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        Sourcing premium scrap grades from USA, Canada, and UAE for sustainable steel production.
                    </p>
                    <Button asChild size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100 text-base px-8 shadow-xl transition-all border-none">
                        <Link href="/contact">
                            Get a Quote <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
