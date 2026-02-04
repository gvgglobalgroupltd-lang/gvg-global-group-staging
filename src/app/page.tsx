import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TestimonialsSection } from '@/components/marketing/TestimonialsSection'
import { StatsCounter } from '@/components/marketing/StatsCounter'
import { PartnersSection } from '@/components/marketing/PartnersSection'
import { IndianPartnersSection } from '@/components/marketing/IndianPartnersSection'
import { ServicesSelectorSection } from '@/components/marketing/ServicesSelectorSection'
import { SEOSchema } from '@/components/seo/SEOSchema'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { WhatsAppWidget } from '@/components/common/WhatsAppWidget'
import { ArrowRight, Globe, Shield, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GVG Global Group - India Based Metals Trading & IT Consulting | ISO Certified',
  description: 'Leading India-based metals trading company. Sourcing from USA, Canada, UAE. ISO 9001:2015, DGFT, GST certified. 15+ years experience, serving Tata Steel, JSW, Hindalco.',
  keywords: ['metals trading India', 'scrap metal import', 'steel trading', 'aluminum trading', 'IT consulting', 'international trade India', 'DGFT certified', 'ISO 9001', 'Tata Steel supplier'],
  openGraph: {
    title: 'GVG Global Group - India Based Metals Trading & IT Consulting',
    description: 'ISO certified, DGFT authorized. 15+ years, 5247 shipments. Sourcing from USA, Canada, UAE.',
    url: 'https://gvgglobal.com',
    siteName: 'GVG Global Group',
    images: [
      {
        url: 'https://gvgglobal.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GVG Global Group - India Based Metals Trading',
    description: 'ISO & DGFT certified. Global sourcing, India based.',
    images: ['https://gvgglobal.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function Home() {
  return (
    <>
      <SEOSchema type="organization" />
      <SiteHeader />

      <main className="min-h-screen">
        {/* Hero Section with Warehouse Media */}
        <section className="relative py-16 md:py-24 bg-white dark:bg-slate-950 overflow-hidden border-b border-slate-100 dark:border-slate-800">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-900 dark:to-transparent" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-full">
                  <Shield className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">ISO 9001:2015 Certified • DGFT Authorized</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-slate-900 dark:text-white leading-tight">
                  Global Metals Trading & IT Excellence
                </h1>

                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-3 font-medium">
                  15+ Years • 1,247 Shipments • India Based
                </p>

                <p className="text-base text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-xl">
                  Based in India, sourcing globally from USA, Canada, UAE and beyond. ISO 9001:2015 certified. Specialized in scrap metal imports, serving automotive OEMs, aerospace manufacturers, and industrial leaders.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg" className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                    <Link href="/contact">
                      Get a Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Link href="/pricing">View Current Prices</Link>
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">8+</p>
                    <p className="text-xs text-slate-500">Countries</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">$120M+</p>
                    <p className="text-xs text-slate-500">Trade Volume</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">97%</p>
                    <p className="text-xs text-slate-500">On-Time</p>
                  </div>
                </div>
              </div>

              {/* Right: Warehouse Photo/Video Placeholder */}
              <div className="hidden md:block space-y-4">
                {/* Warehouse Photo Placeholder */}
                <Card className="overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                  <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 aspect-video flex items-center justify-center">
                    <div className="text-center p-8">
                      <svg className="h-16 w-16 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Add Your Warehouse Photo Here
                      </p>
                      <p className="text-xs text-slate-500">
                        Replace with actual facility image (1920x1080px)
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Video Placeholder */}
                <Card className="overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                  <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 aspect-video flex items-center justify-center">
                    <div className="text-center p-8">
                      <svg className="h-16 w-16 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Add Operations Video Here
                      </p>
                      <p className="text-xs text-slate-500">
                        Upload your facility tour (MP4, 30-60 sec)
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Services Selector - Clear Separation */}
        <ServicesSelectorSection />

        {/* Stats Counter */}
        <StatsCounter />

        {/* Indian Partners & Clients */}
        <IndianPartnersSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-y border-slate-200 dark:border-slate-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                Ready to Start Trading?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                Contact us for quotes and business opportunities
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-lg font-semibold">
                  <Link href="tel:+19059622919">Call +1-905-962-2919</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 font-semibold shadow-md">
                  <Link href="https://wa.me/19059622919">WhatsApp Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />

      {/* WhatsApp Widget */}
      <WhatsAppWidget />
    </>
  )
}
