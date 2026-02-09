'use client'

import { useEffect, useState, useCallback } from 'react'
import { Package, Search, Warehouse, AlertTriangle } from 'lucide-react'
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

export const dynamic = 'force-dynamic'

interface InventoryItem {
    id: string
    deal_id: string
    deal_ref: string
    product_name: string
    warehouse_location: string
    quantity_stored: number
    quantity_remaining: number
    unit: string
    storage_date: string
    notes: string | null
}

export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [warehouseFilter, setWarehouseFilter] = useState<string>('all')

    const loadInventory = useCallback(async () => {
        try {
            const supabase = createClient()

            const { data, error } = await supabase
                .from('inventory')
                .select(`
          id,
          deal_id,
          deals(deal_ref),
          product_name,
          warehouse_location,
          quantity_stored,
          quantity_remaining,
          unit,
          storage_date,
          notes
        `)
                .order('storage_date', { ascending: false }) as any

            if (error) throw error

            const formattedInventory = (data || []).map((item: any) => ({
                id: item.id,
                deal_id: item.deal_id,
                deal_ref: item.deals?.deal_ref || 'N/A',
                product_name: item.product_name,
                warehouse_location: item.warehouse_location,
                quantity_stored: item.quantity_stored,
                quantity_remaining: item.quantity_remaining,
                unit: item.unit,
                storage_date: item.storage_date,
                notes: item.notes
            }))

            setInventory(formattedInventory)
            setFilteredInventory(formattedInventory)
        } catch (error) {
            console.error('Failed to load inventory:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const filterInventory = useCallback(() => {
        let filtered = [...inventory]

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.deal_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.warehouse_location.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Warehouse filter
        if (warehouseFilter !== 'all') {
            filtered = filtered.filter(item => item.warehouse_location === warehouseFilter)
        }

        setFilteredInventory(filtered)
    }, [inventory, searchQuery, warehouseFilter])

    useEffect(() => {
        loadInventory()
    }, [loadInventory])

    useEffect(() => {
        filterInventory()
    }, [filterInventory])

    const getStockStatus = (item: InventoryItem) => {
        const percentage = (item.quantity_remaining / item.quantity_stored) * 100
        if (percentage === 0) return { status: 'Out of Stock', color: 'bg-red-500' }
        if (percentage < 20) return { status: 'Low Stock', color: 'bg-amber-500' }
        if (percentage < 50) return { status: 'Medium Stock', color: 'bg-blue-500' }
        return { status: 'In Stock', color: 'bg-green-500' }
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const warehouses = Array.from(new Set(inventory.map(i => i.warehouse_location)))
    const totalItems = inventory.reduce((sum, i) => sum + i.quantity_remaining, 0)
    const lowStockCount = inventory.filter(i =>
        (i.quantity_remaining / i.quantity_stored) < 0.2 && i.quantity_remaining > 0
    ).length

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
                    <h1 className="text-3xl font-bold">Inventory</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage warehouse stock and inventory levels
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Total Items</p>
                    </div>
                    <p className="text-2xl font-bold">{inventory.length}</p>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Warehouse className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Warehouses</p>
                    </div>
                    <p className="text-2xl font-bold">{warehouses.length}</p>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Units in Stock</p>
                    </div>
                    <p className="text-2xl font-bold">{totalItems.toLocaleString()}</p>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <p className="text-sm text-muted-foreground">Low Stock Items</p>
                    </div>
                    <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by product, deal ref, or warehouse..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                        <SelectTrigger className="w-full md:w-64">
                            <Warehouse className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Warehouses</SelectItem>
                            {warehouses.map((warehouse) => (
                                <SelectItem key={warehouse} value={warehouse}>
                                    {warehouse}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Inventory Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Deal Ref</TableHead>
                            <TableHead>Warehouse</TableHead>
                            <TableHead>Stored</TableHead>
                            <TableHead>Remaining</TableHead>
                            <TableHead>Utilization</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Storage Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInventory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                                    {searchQuery || warehouseFilter !== 'all' ? 'No inventory matches your filters' : 'No inventory items yet'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInventory.map((item) => {
                                const stockStatus = getStockStatus(item)
                                const utilizationPercentage = ((item.quantity_stored - item.quantity_remaining) / item.quantity_stored) * 100

                                return (
                                    <TableRow key={item.id} className="hover:bg-muted/50">
                                        <TableCell className="font-semibold">{item.product_name}</TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/admin/deals/${item.deal_id}`}
                                                className="font-mono text-blue-600 hover:underline"
                                            >
                                                {item.deal_ref}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{item.warehouse_location}</TableCell>
                                        <TableCell>
                                            {item.quantity_stored.toLocaleString()} {item.unit}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {item.quantity_remaining.toLocaleString()} {item.unit}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500"
                                                        style={{ width: `${utilizationPercentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    {utilizationPercentage.toFixed(0)}%
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={stockStatus.color}>
                                                {stockStatus.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{formatDate(item.storage_date)}</TableCell>
                                        <TableCell>
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/admin/deals/${item.deal_id}`}>
                                                    View Deal
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
