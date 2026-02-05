
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'GVG Immigration Services | Global Visa Experts',
    description: 'Specialized visa services for OCI, Canada PR, USA, Schengen, and Dubai. Fast, secure, and professional processing.',
}

export default function ImmigrationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            {/* We might want a specialized header for Immigration, but reusing Main with context is okay for MVP */}
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    )
}
