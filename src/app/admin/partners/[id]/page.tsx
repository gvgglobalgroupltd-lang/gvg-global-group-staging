'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Building2, User, Mail, Phone, MapPin, Globe } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

interface Partner {
    id: string
    company_name: string
    contact_person: string | null
    email: string | null
    phone: string | null
    address: string | null
    country: string | null
    website: string | null
    tax_id: string | null
    type: 'Supplier' | 'Customer'
    status: 'Active' | 'Inactive'
    created_at: string
}

export default function PartnerDetailsPage() {
    const params = useParams()
    const id = params.id as string
    const [partner, setPartner] = useState<Partner | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadPartner() {
            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from('partners')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setPartner(data as any)
            } catch (error) {
                console.error('Failed to load partner:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadPartner()
    }, [id])

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto py-8">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    if (!partner) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">Partner not found</p>
                <Button asChild className="mt-4">
                    <Link href="/admin/partners">Back to Partners</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/partners">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">{partner.company_name}</h1>
                    <div className="flex gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${partner.type === 'Supplier' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {partner.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${partner.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                            {partner.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        Company Details
                    </h2>
                    <Separator />
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-muted-foreground">Tax ID / VAT</p>
                            <p className="font-medium">{partner.tax_id || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Website</p>
                            {partner.website ? (
                                <a href={partner.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                                    <Globe className="h-3 w-3" /> {partner.website}
                                </a>
                            ) : (
                                <p className="font-medium">N/A</p>
                            )}
                        </div>
                    </div>
                </Card>

                <Card className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        Contact Information
                    </h2>
                    <Separator />
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{partner.contact_person || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {partner.email ? (
                                <a href={`mailto:${partner.email}`} className="text-blue-600 hover:underline">{partner.email}</a>
                            ) : (
                                <span>N/A</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {partner.phone ? (
                                <a href={`tel:${partner.phone}`} className="text-blue-600 hover:underline">{partner.phone}</a>
                            ) : (
                                <span>N/A</span>
                            )}
                        </div>
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                            <span className="whitespace-pre-line">
                                {[partner.address, partner.country].filter(Boolean).join('\n')}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
