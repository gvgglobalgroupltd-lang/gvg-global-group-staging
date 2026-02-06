import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TestimonialsSection } from '@/components/marketing/TestimonialsSection'
import { StatsCounter } from '@/components/marketing/StatsCounter'
import { PartnersSection } from '@/components/marketing/PartnersSection'
import { IndianPartnersSection } from '@/components/marketing/IndianPartnersSection'
import { ServicesSelectorSection } from '@/components/marketing/ServicesSelectorSection'
import { MaterialCatalog } from '@/components/marketing/MaterialCatalog'
import { ImpactDashboard } from '@/components/marketing/ImpactDashboard'
import { HeroSlider } from '@/components/marketing/HeroSlider'
import { SEOSchema } from '@/components/seo/SEOSchema'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { WhatsAppWidget } from '@/components/common/WhatsAppWidget'
import { ArrowRight, Globe, TrendingUp } from 'lucide-react'
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
        {/* Hero Slider Section */}
        <HeroSlider />

        {/* Premium Separator Line */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
        <div className="h-4 bg-white dark:bg-slate-950"></div>

        {/* Services Selector - Clear Separation */}
        <ServicesSelectorSection />

        {/* Visual Material Catalog (New) */}
        <MaterialCatalog />

        {/* Stats Counter (Original) - Kept as purely business stats */}
        <StatsCounter />

        {/* Indian Partners & Clients */}
        <IndianPartnersSection />

        {/* Impact Dashboard (New) - Sustainability Stats */}
        <ImpactDashboard />

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
