"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const slides = [
    {
        id: 1,
        type: 'image',
        src: '/images/hero_scrap_yard.png',
        poster: '',
        title: "Global Metal Recycling Leaders",
        subtitle: "Sourcing premium scrap grades from USA, Canada, and UAE for sustainable steel production.",
        cta: "Get a Quote",
        link: "/contact"
    },
    {
        id: 2,
        type: 'image',
        src: '/images/hero_logistics.png',
        poster: '',
        title: "Seamless International Logistics",
        subtitle: "End-to-end supply chain management with ISO 9001:2015 certified processes.",
        cta: "Our Locations",
        link: "/locations"
    },
    {
        id: 3,
        type: 'image',
        src: '/images/hero_foundry.png',
        title: "Building a Network of Trust",
        subtitle: "Partnered with 50+ organizations worldwide to power the circular economy.",
        cta: "View Market 24/7",
        link: "/pricing"
    }
]

export function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0)

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 8000) // 8 seconds per slide
        return () => clearInterval(timer)
    }, [])

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

    return (
        <section className="relative h-[65vh] min-h-[500px] w-full overflow-hidden bg-slate-950">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    {/* Background Media */}
                    <div className="absolute inset-0">
                        {slide.type === 'video' ? (
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                poster={slide.poster}
                                className="h-full w-full object-cover"
                            >
                                <source src={slide.src} type="video/mp4" />
                            </video>
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={slide.src}
                                alt={slide.title}
                                className="h-full w-full object-cover animate-ken-burns"
                            />
                        )}
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
                        <div className="max-w-2xl animate-in slide-in-from-left-10 duration-700 fade-in">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-md">
                                {slide.title}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-200 mb-8 font-light drop-shadow">
                                {slide.subtitle}
                            </p>
                            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white border-none text-lg px-8 py-6 h-auto shadow-xl">
                                <Link href={slide.link}>
                                    {slide.cta} <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <div className="absolute bottom-10 right-10 z-30 flex gap-4">
                <Button variant="outline" size="icon" onClick={prevSlide} className="bg-black/30 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-full h-12 w-12">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextSlide} className="bg-black/30 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-full h-12 w-12">
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-10 left-10 z-30 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-12 bg-emerald-500' : 'w-6 bg-white/40 hover:bg-white/60'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    )
}
