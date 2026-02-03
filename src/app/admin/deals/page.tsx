'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

interface Deal {
    id: string
    deal_ref: string
    supplier_name: string | null
    customer_name: string | null
    product_name: string
    quantity: number
    unit: string
    total_cost_inr: number
    revenue_inr: number
    status: string
    incoterm: string
    eta_date: string | null
    created_at: string
}

export default function DealsPage() {
    const [deals, setDeals] = useState<Deal[]>([])
    const [filteredDeals, setFilteredDeals] = useState<Deal[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    useEffect(() => {
        loadDeals()
    }, [])

    useEffect(() => {
        filterDeals()
    }, [searchQuery, statusFilter, deals])

    async function loadDeals() {
        try {
            const supabase = createClient()

            const { data, error } = await supabase
                .from('deals')
                .select(`
          id,
          deal_ref,
          supplier:suppliers(company_name),
          customer:customers(company_name),
          product_name,
          quantity,
          unit,
          total_cost_inr,
          revenue_inr,
          status,
          incoterm,
          eta_date,
          created_at
        `)
                .order('created_at', { ascending: false })

            if (error) throw error

            const formattedDeals = (data || []).map((deal: any) => ({
                id: deal.id,
                deal_ref: deal.deal_ref,
                supplier_name: deal.supplier?.company_name || 'N/A',
                customer_name: deal.customer?.company_name || 'N/A',
                product_name: deal.product_name,
                quantity: deal.quantity,
                unit: deal.unit,
                total_cost_inr: deal.total_cost_inr,
                revenue_inr: deal.revenue_inr,
                status: deal.status,
                incoterm: deal.incoterm,
                eta_date: deal.eta_date,
                created_at: deal.created_at
            }))

            setDeals(formattedDeals)
            setFilteredDeals(formattedDeals)
        } catch (error) {
            console.error('Failed to load deals:', error)
        } finally {
            setIsLoading(false)
        }
    }

    function filterDeals() {
        let filtered = [...deals]

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(deal =>
                deal.deal_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
                deal.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                deal.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                deal.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(deal => deal.status === statusFilter)
        }

        setFilteredDeals(filtered)
    }

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
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const calculateProfit = (deal: Deal) => {
        return deal.revenue_inr - deal.total_cost_inr
    }

    const calculateMargin = (deal: Deal) => {
        if (deal.revenue_inr === 0) return 0
        return ((deal.revenue_inr - deal.total_cost_inr) / deal.revenue_inr) * 100
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Deals</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage all your import-export deals
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/deals/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Deal
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Total Deals</p>
                    <p className="text-2xl font-bold">{deals.length}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">
                        {deals.filter(d => !['Completed', 'Cancelled'].includes(d.status)).length}
                    </p>
                </Card>
                <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">
                        {formatCurrency(deals.reduce((sum, d) => sum + d.revenue_inr, 0))}
                    </p>
                </Card>
                <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Total Profit</p>
                    <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(deals.reduce((sum, d) => sum + calculateProfit(d), 0))}
                    </p>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by deal ref, product, supplier, or customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-48">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="In Transit">In Transit</SelectItem>
                            <SelectItem value="Customs">Customs</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </Card>

            {/* Deals Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Deal Ref</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Margin</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>ETA</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDeals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">
                                    {searchQuery || statusFilter !== 'all' ? 'No deals match your filters' : 'No deals yet. Create your first deal!'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDeals.map((deal) => (
                                <TableRow key={deal.id} className="hover:bg-muted/50">
                                    <TableCell className="font-mono font-semibold">
                                        {deal.deal_ref}
                                    </TableCell>
                                    <TableCell>{deal.product_name}</TableCell>
                                    <TableCell>{deal.supplier_name}</TableCell>
                                    <TableCell>{deal.customer_name}</TableCell>
                                    <TableCell>
                                        {deal.quantity.toLocaleString()} {deal.unit}
                                    </TableCell>
                                    <TableCell>{formatCurrency(deal.total_cost_inr)}</TableCell>
                                    <TableCell>{formatCurrency(deal.revenue_inr)}</TableCell>
                                    <TableCell>
                                        <span className={calculateMargin(deal) >= 10 ? 'text-green-600 font-semibold' : 'text-amber-600'}>
                                            {calculateMargin(deal).toFixed(1)}%
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(deal.status)}>
                                            {deal.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(deal.eta_date)}</TableCell>
                                    <TableCell>
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/admin/deals/${deal.id}`}>
                                                View →
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
