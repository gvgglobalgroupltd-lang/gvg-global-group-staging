import { ReactNode } from 'react'
import { SiteHeader } from '@/components/layout/SiteHeader'

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />
            {children}
        </div>
    )
}
