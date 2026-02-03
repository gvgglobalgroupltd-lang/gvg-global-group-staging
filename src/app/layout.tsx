import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://gvgglobal.com'),
  title: {
    default: 'GVG Global Group - International Metals Trading & IT Consulting',
    template: '%s | GVG Global Group'
  },
  description: 'Leading international metals trading and IT consulting company. Authorized by government agencies. Trusted by Fortune 500 companies. ISO certified with 15+ years of excellence.',
  keywords: [
    'metals trading',
    'steel export',
    'aluminum trading',
    'international trade',
    'import export',
    'IT consulting',
    'ERP development',
    'mobile app development',
    'Fortune 500',
    'ISO certified',
    'government authorized',
    'sustainability',
    'recycling',
    'USA',
    'Canada',
    'India',
    'UAE',
    'Dubai'
  ],
  authors: [{ name: 'GVG Global Group' }],
  creator: 'GVG Global Group',
  publisher: 'GVG Global Group',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gvgglobal.com',
    title: 'GVG Global Group - International Metals Trading & IT Consulting',
    description: 'Trusted by Fortune 500. Government authorized in USA, Canada, India, UAE. 15+ years, 5000+ shipments, ISO certified.',
    siteName: 'GVG Global Group',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GVG Global Group - Metals Trading & IT Consulting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GVG Global Group - International Metals Trading & IT Consulting',
    description: 'Trusted by Fortune 500. Government authorized. 15+ years excellence.',
    images: ['/og-image.png'],
    creator: '@gvgglobal',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verifications as needed
  },
  alternates: {
    canonical: 'https://gvgglobal.com',
  },
  category: 'business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
