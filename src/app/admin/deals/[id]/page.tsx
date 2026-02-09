'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Package, DollarSign, FileText, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { deleteDeal } from '@/actions/deals'

interface DealDetails {
    id: string
    deal_ref: string
    supplier_name: string
    customer_name: string
    product_name: string
    quantity: number
    unit: string
    incoterm: string
    origin_port: string | null
    destination_port: string | null
    container_number: string | null
    bl_number: string | null
    shipment_period_end: string | null
    delivery_type: string
    warehouse_location: string | null
    status: string
    cost_breakdown: any
    revenue_breakdown: any
    created_at: string
    updated_at: string
}

export default function DealDetailsPage() {
    const params = useParams()

    const dealId = params.id as string

    const [deal, setDeal] = useState<DealDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const loadDeal = useCallback(async () => {
        try {
            const supabase = createClient()

            const { data, error } = await supabase
                .from('deals')
                .select(`
          *,
          supplier:partners!deals_partner_id_fkey(company_name),
          commodity:commodities(name)
        `)
                .eq('id', dealId)
                .single()

            if (error) throw error

            const dealData = data as Record<string, any>
            setDeal({
                ...dealData,
                supplier_name: dealData.supplier?.company_name || 'N/A',
                customer_name: dealData.customer?.company_name || 'N/A',
                product_name: dealData.commodity?.name || 'Unknown Product',
                quantity: dealData.weight_mt || 0,
                unit: 'MT',
                shipment_period_end: dealData.shipment_period_end || null,
            } as DealDetails)
        } catch (error) {
            console.error('Failed to load deal:', error)
        } finally {
            setIsLoading(false)
        }
    }, [dealId])

    useEffect(() => {
        loadDeal()
    }, [loadDeal])

    const getStatusColor = (status: string) => {
        const colors = {
            'Draft': 'bg-gray-500',
            'Confirmed': 'bg-blue-500',
            'Shipped': 'bg-purple-500',
            'In Transit': 'bg-indigo-500',
            'Customs': 'bg-amber-500',
            'Delivered': 'bg-green-500',
            'Completed': 'bg-emerald-500',
            'Cancelled': 'bg-red-500'
        } as const
        return colors[status as keyof typeof colors] || 'bg-gray-500'
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (date: string | null) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    if (!deal) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">Deal not found</p>
                <Button asChild className="mt-4">
                    <Link href="/admin/deals">Back to Deals</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/deals">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold font-mono">{deal.deal_ref}</h1>
                            <Badge className={getStatusColor(deal.status)}>
                                {deal.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">
                            {deal.product_name} • {deal.quantity.toLocaleString()} {deal.unit}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/admin/deals/${deal.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={async () => {
                            if (confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
                                try {
                                    await deleteDeal(deal.id)
                                    window.location.href = '/admin/deals' // Redirect after delete
                                } catch (error) {
                                    alert('Failed to delete deal')
                                }
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Incoterm</p>
                    </div>
                    <p className="text-2xl font-bold">{deal.incoterm}</p>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Total Cost</p>
                    </div>
                    <p className="text-2xl font-bold">
                        {formatCurrency(deal.cost_breakdown?.total_cost_inr || 0)}
                    </p>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(deal.revenue_breakdown?.total_revenue_inr || 0)}
                    </p>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Profit</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(
                            (deal.revenue_breakdown?.total_revenue_inr || 0) -
                            (deal.cost_breakdown?.total_cost_inr || 0)
                        )}
                    </p>
                </Card>
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="finance">Finance</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Product</p>
                                    <p className="font-semibold">{deal.product_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Quantity</p>
                                    <p className="font-semibold">
                                        {deal.quantity.toLocaleString()} {deal.unit}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Incoterm</p>
                                    <p className="font-semibold">{deal.incoterm}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Delivery Type</p>
                                    <p className="font-semibold">{deal.delivery_type}</p>
                                </div>
                                {deal.warehouse_location && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Warehouse</p>
                                        <p className="font-semibold">{deal.warehouse_location}</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Partners */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Partners</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Supplier</p>
                                    <p className="font-semibold">{deal.supplier_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Customer</p>
                                    <p className="font-semibold">{deal.customer_name}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Shipping Details */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Shipping Details</h3>
                            <div className="space-y-3">
                                {deal.origin_port && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Origin Port</p>
                                        <p className="font-semibold">{deal.origin_port}</p>
                                    </div>
                                )}
                                {deal.destination_port && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Destination Port</p>
                                        <p className="font-semibold">{deal.destination_port}</p>
                                    </div>
                                )}
                                {deal.container_number && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Container Number</p>
                                        <p className="font-semibold font-mono">{deal.container_number}</p>
                                    </div>
                                )}
                                {deal.bl_number && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">BL Number</p>
                                        <p className="font-semibold font-mono">{deal.bl_number}</p>
                                    </div>
                                )}
                                {deal.shipment_period_end && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">ETA</p>
                                        <p className="font-semibold">{formatDate(deal.shipment_period_end)}</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Timestamps */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Created</p>
                                    <p className="font-semibold">{formatDate(deal.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Last Updated</p>
                                    <p className="font-semibold">{formatDate(deal.updated_at)}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                {/* Documents Tab - Shows existing document vault component */}
                <TabsContent value="documents">
                    <Card className="p-6">
                        <p className="text-muted-foreground text-center py-8">
                            Document vault will be loaded here
                        </p>
                        <div className="text-center">
                            <Button asChild>
                                <Link href={`/admin/deals/${dealId}/documents`}>
                                    Go to Documents →
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                {/* Finance Tab - Shows existing finance component */}
                <TabsContent value="finance">
                    <Card className="p-6">
                        <p className="text-muted-foreground text-center py-8">
                            Finance details will be loaded here
                        </p>
                        <div className="text-center">
                            <Button asChild>
                                <Link href={`/admin/deals/${dealId}/finance`}>
                                    Go to Finance →
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
