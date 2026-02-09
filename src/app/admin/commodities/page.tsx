'use client'

import { useState, useEffect } from 'react'

import { AddCommodityModal } from '@/components/admin/AddCommodityModal'

import { Card } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

interface Commodity {
    id: string
    name: string
    hscode: string
    description: string | null
    created_at: string
}

export default function CommoditiesPage() {
    const [commodities, setCommodities] = useState<Commodity[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadCommodities()
    }, [])

    async function loadCommodities() {
        try {
            const supabase = createClient()
            // We will fetch from 'commodities' table, but for now we might handle empty
            const { data, error } = await supabase
                .from('commodities')
                .select('*')
                .order('name') as any

            if (data) {
                setCommodities(data)
            }
        } catch (error) {
            console.error('Failed to load commodities:', error)
        } finally {
            setIsLoading(false)
        }
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Commodities</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage trading commodities and HS codes
                    </p>
                </div>
                <AddCommodityModal onSuccess={loadCommodities} />
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>HS Code</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {commodities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                    No commodities found. Add your first one!
                                </TableCell>
                            </TableRow>
                        ) : (
                            commodities.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold">{item.name}</TableCell>
                                    <TableCell className="font-mono">{item.hscode}</TableCell>
                                    <TableCell>{item.description || '-'}</TableCell>
                                    <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
