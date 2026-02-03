'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Users, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

interface Partner {
    id: string
    company_name: string
    contact_person: string | null
    email: string | null
    phone: string | null
    address: string | null
    country: string | null
    created_at: string
}

export default function PartnersPage() {
    const [suppliers, setSuppliers] = useState<Partner[]>([])
    const [customers, setCustomers] = useState<Partner[]>([])
    const [filteredSuppliers, setFilteredSuppliers] = useState<Partner[]>([])
    const [filteredCustomers, setFilteredCustomers] = useState<Partner[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        loadPartners()
    }, [])

    useEffect(() => {
        filterSuppliers()
        filterCustomers()
    }, [searchQuery, suppliers, customers])

    async function loadPartners() {
        try {
            const supabase = createClient()

            const [suppliersResult, customersResult] = await Promise.all([
                supabase.from('suppliers').select('*').order('company_name') as any,
                supabase.from('customers').select('*').order('company_name') as any
            ])

            if (suppliersResult.error) throw suppliersResult.error
            if (customersResult.error) throw customersResult.error

            setSuppliers(suppliersResult.data || [])
            setCustomers(customersResult.data || [])
            setFilteredSuppliers(suppliersResult.data || [])
            setFilteredCustomers(customersResult.data || [])
        } catch (error) {
            console.error('Failed to load partners:', error)
        } finally {
            setIsLoading(false)
        }
    }

    function filterSuppliers() {
        if (!searchQuery) {
            setFilteredSuppliers(suppliers)
            return
        }

        setFilteredSuppliers(
            suppliers.filter(s =>
                s.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.country?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    }

    function filterCustomers() {
        if (!searchQuery) {
            setFilteredCustomers(customers)
            return
        }

        setFilteredCustomers(
            customers.filter(c =>
                c.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.country?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    function renderPartnerTable(partners: Partner[]) {
        if (partners.length === 0) {
            return (
                <div className="text-center py-12 text-muted-foreground">
                    {searchQuery ? 'No partners match your search' : 'No partners yet'}
                </div>
            )
        }

        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Added On</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {partners.map((partner) => (
                        <TableRow key={partner.id} className="hover:bg-muted/50">
                            <TableCell className="font-semibold">{partner.company_name}</TableCell>
                            <TableCell>{partner.contact_person || 'N/A'}</TableCell>
                            <TableCell>
                                {partner.email ? (
                                    <a
                                        href={`mailto:${partner.email}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {partner.email}
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                            </TableCell>
                            <TableCell>
                                {partner.phone ? (
                                    <a
                                        href={`tel:${partner.phone}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {partner.phone}
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                            </TableCell>
                            <TableCell>{partner.country || 'N/A'}</TableCell>
                            <TableCell>{formatDate(partner.created_at)}</TableCell>
                            <TableCell>
                                <Button variant="ghost" size="sm">
                                    View Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
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
                    <h1 className="text-3xl font-bold">Partners</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage suppliers and customers
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Partner
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Total Suppliers</p>
                    </div>
                    <p className="text-2xl font-bold">{suppliers.length}</p>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Total Customers</p>
                    </div>
                    <p className="text-2xl font-bold">{customers.length}</p>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Total Partners</p>
                    </div>
                    <p className="text-2xl font-bold">{suppliers.length + customers.length}</p>
                </Card>
            </div>

            {/* Search */}
            <Card className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search partners by name, contact, email, or country..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="suppliers" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="suppliers">
                        <Building2 className="h-4 w-4 mr-2" />
                        Suppliers ({filteredSuppliers.length})
                    </TabsTrigger>
                    <TabsTrigger value="customers">
                        <Users className="h-4 w-4 mr-2" />
                        Customers ({filteredCustomers.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="suppliers">
                    <Card>
                        {renderPartnerTable(filteredSuppliers)}
                    </Card>
                </TabsContent>

                <TabsContent value="customers">
                    <Card>
                        {renderPartnerTable(filteredCustomers)}
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
