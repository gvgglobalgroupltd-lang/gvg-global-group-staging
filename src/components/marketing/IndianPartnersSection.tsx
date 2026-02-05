"use client"

// eslint-disable-next-line @next/next/no-img-element
export function IndianPartnersSection() {
    const partners = [
        { name: 'Tata Steel', logo: '/logos/tata.png' },
        { name: 'JSW Steel', logo: '/logos/jsw.png' },
        { name: 'Hindalco', logo: '/logos/hindalco.png' },
        { name: 'Vedanta', logo: '/logos/vedanta.png' },
        { name: 'SAIL', logo: '/logos/sail.png' },
        { name: 'Adani Ports', logo: '/logos/adani.png' },
        { name: 'CONCOR', logo: '/logos/concor.png' },
        { name: 'BPCL', logo: '/logos/bpcl.png' },
    ]

    // Duplicate list for infinite scroll effect (3x to ensure no gaps on large screens)
    const rollingPartners = [...partners, ...partners, ...partners]

    return (
        <section className="py-8 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="container mx-auto px-4 mb-6 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Trusted by Industry Leaders
                </p>
            </div>

            <div className="relative w-full overflow-hidden group">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>

                <div className="flex w-max animate-scroll group-hover:[animation-play-state:paused] items-center">
                    {rollingPartners.map((partner, idx) => (
                        <div key={idx} className="mx-12 transition-transform duration-300 hover:scale-110 cursor-pointer">
                            <img
                                src={partner.logo}
                                alt={`${partner.name} logo`}
                                className="h-20 w-auto max-w-[180px] object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
