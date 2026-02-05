'use client'

import { useEffect, useState } from 'react'
import { Ship, MapPin, Package, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

interface ShipmentData {
    id: string
    deal_ref: string
    container_number: string | null
    origin_port: string | null
    destination_port: string | null
    eta_date: string | null
    current_status: string
    days_until_arrival: number | null
}

export function LogisticsTracker() {
    const [shipments, setShipments] = useState<ShipmentData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadShipments()
    }, [])

    async function loadShipments() {
        try {
            // Use Server Action instead of client fetch
            const { getLogisticsShipments } = await import('@/actions/logistics')
            const data = await getLogisticsShipments()

            // Calculate days until arrival
            const shipmentsWithDays = (data || []).map((deal: any) => {
                let days_until_arrival = null
                if (deal.eta_date) {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    const eta = new Date(deal.eta_date)
                    eta.setHours(0, 0, 0, 0)
                    days_until_arrival = Math.ceil((eta.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                }

                return {
                    id: deal.id,
                    deal_ref: deal.deal_ref,
                    container_number: deal.container_number,
                    origin_port: deal.origin_port,
                    destination_port: deal.destination_port,
                    eta_date: deal.eta_date,
                    current_status: deal.status,
                    days_until_arrival
                }
            })

            setShipments(shipmentsWithDays)
        } catch (error) {
            console.error('Failed to load shipments:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        const colors = {
            'Shipped': 'bg-blue-500',
            'In Transit': 'bg-purple-500',
            'Customs': 'bg-amber-500'
        } as const
        return colors[status as keyof typeof colors] || 'bg-gray-500'
    }

    const getETABadge = (days: number | null) => {
        if (days === null) return null

        if (days < 0) {
            return <Badge variant="destructive">Delayed ({Math.abs(days)}d)</Badge>
        }
        if (days === 0) {
            return <Badge variant="destructive">Arriving Today</Badge>
        }
        if (days <= 3) {
            return <Badge className="bg-amber-500">ETA: {days}d</Badge>
        }
        return <Badge variant="secondary">ETA: {days}d</Badge>
    }

    if (isLoading) {
        return (
            <Card className="p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Ship className="h-5 w-5 text-blue-600" />
                    Logistics Tracker
                </h3>
                {shipments.length > 0 && (
                    <Badge variant="outline">{shipments.length} active</Badge>
                )}
            </div>

            {shipments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No active shipments</p>
                    <p className="text-sm">All containers have been delivered</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {shipments.map((shipment) => (
                        <Link
                            key={shipment.id}
                            href={`/admin/deals/${shipment.id}`}
                            className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="space-y-3">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge className={getStatusColor(shipment.current_status)}>
                                                {shipment.current_status}
                                            </Badge>
                                            {getETABadge(shipment.days_until_arrival)}
                                        </div>
                                        <p className="font-mono text-sm text-muted-foreground">
                                            {shipment.deal_ref}
                                        </p>
                                    </div>
                                </div>

                                {/* Container Info */}
                                {shipment.container_number && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-semibold">{shipment.container_number}</span>
                                    </div>
                                )}

                                {/* Route */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>
                                        {shipment.origin_port || 'Unknown'} → {shipment.destination_port || 'Unknown'}
                                    </span>
                                </div>

                                {/* ETA */}
                                {shipment.eta_date && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            ETA: {new Date(shipment.eta_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </Card>
    )
}
