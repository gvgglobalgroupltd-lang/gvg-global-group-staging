'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    BarChart3,
    TrendingUp,
    Package,
    Users,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

interface DashboardMetrics {
    totalDeals: number
    totalVolume: number
    inventoryCount: number
    inventoryVolume: number
    totalPartners: number
    activeSuppliers: number
    activeCustomers: number
}

interface RecentDeal {
    id: string
    deal_ref: string
    partner: { company_name: string } | null
    status: string
    weight_mt: number
    created_at: string
}

interface DealData {
    id: string
    deal_ref: string
    weight_mt: number
    status: string
    created_at: string
    partner_id: string
    partners: { company_name: string } | null
}

interface InventoryData {
    current_weight: number
}

interface PartnerData {
    type: string
}

export default function ReportsPage() {
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        totalDeals: 0,
        totalVolume: 0,
        inventoryCount: 0,
        inventoryVolume: 0,
        totalPartners: 0,
        activeSuppliers: 0,
        activeCustomers: 0
    })
    const [recentDeals, setRecentDeals] = useState<RecentDeal[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const loadDashboardData = useCallback(async () => {
        try {
            const supabase = createClient()

            // Fetch Deals Stats
            const { data: dealsData, error: dealsError } = await supabase
                .from('deals')
                .select('id, weight_mt, status, deal_ref, created_at, partner_id, partners(company_name)')
                .order('created_at', { ascending: false })

            if (dealsError) throw dealsError

            const deals = dealsData as unknown as DealData[]

            // Fetch Inventory Stats
            const { data: inventoryData, error: inventoryError } = await supabase
                .from('inventory')
                .select('current_weight')

            if (inventoryError) throw inventoryError

            const inventory = inventoryData as unknown as InventoryData[]

            // Fetch Partners Stats
            const { data: partnersData, error: partnersError } = await supabase
                .from('partners')
                .select('type')

            if (partnersError) throw partnersError

            const partners = partnersData as unknown as PartnerData[]

            // Process Metrics
            const totalVolume = deals?.reduce((sum, deal) => sum + (deal.weight_mt || 0), 0) || 0
            const inventoryVolume = inventory?.reduce((sum, item) => sum + (item.current_weight || 0), 0) || 0

            const suppliers = partners?.filter(p => p.type === 'Supplier').length || 0
            const customers = partners?.filter(p => p.type === 'Customer').length || 0

            setMetrics({
                totalDeals: deals?.length || 0,
                totalVolume,
                inventoryCount: inventory?.length || 0,
                inventoryVolume,
                totalPartners: partners?.length || 0,
                activeSuppliers: suppliers,
                activeCustomers: customers
            })

            // Format Recent Deals (Top 5)
            const recent = deals?.slice(0, 5).map((deal: any) => ({
                id: deal.id,
                deal_ref: deal.deal_ref,
                partner: deal.partners, // Supabase returns object or array depending on relation, usually object for single relation
                status: deal.status,
                weight_mt: deal.weight_mt,
                created_at: deal.created_at
            })) || []

            setRecentDeals(recent)

        } catch (error) {
            console.error('Failed to load dashboard data:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadDashboardData()
    }, [loadDashboardData])

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of business performance and key metrics
                    </p>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Volume Traded</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalVolume.toLocaleString()} MT</div>
                        <p className="text-xs text-muted-foreground">
                            Across {metrics.totalDeals} total deals
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Inventory</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.inventoryVolume.toLocaleString()} MT</div>
                        <p className="text-xs text-muted-foreground">
                            {metrics.inventoryCount} items in stock
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Partner Network</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalPartners}</div>
                        <p className="text-xs text-muted-foreground">
                            {metrics.activeSuppliers} Suppliers, {metrics.activeCustomers} Customers
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Deal Velocity</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalDeals}</div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime deals execution
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Deals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Partner</TableHead>
                                    <TableHead>Volume</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentDeals.length > 0 ? (
                                    recentDeals.map((deal) => (
                                        <TableRow key={deal.id}>
                                            <TableCell className="font-medium">{deal.deal_ref}</TableCell>
                                            <TableCell>{deal.partner?.company_name || 'N/A'}</TableCell>
                                            <TableCell>{deal.weight_mt} MT</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {deal.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {new Date(deal.created_at).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No deals found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <div className="text-sm text-muted-foreground mb-4">
                            Common administrative tasks
                        </div>
                        {/* Placeholder for future quick actions or charts */}
                        <div className="flex items-center justify-center h-[200px] border-2 border-dashed rounded-lg text-muted-foreground bg-muted/20">
                            Volume Chart Coming Soon
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
