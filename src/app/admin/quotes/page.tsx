'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Mail, Phone, Building2, Briefcase } from 'lucide-react'
import { getQuotes, updateQuoteStatus } from '@/actions/quotes'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

interface Quote {
    id: string
    company_name: string
    contact_person: string
    email: string
    phone?: string
    service_interest: string
    project_description: string
    budget_range?: string
    timeline?: string
    status: string
    created_at: string
    // Logistics/Scrap fields
    commodity_type?: string | null
    target_port?: string | null
    destination_country?: string | null
    current_location?: string | null
}

export default function QuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    const fetchQuotes = useCallback(async () => {
        setLoading(true)
        const result = await getQuotes()
        if (result.success && result.data) {
            setQuotes(result.data as Quote[])
        } else {
            toast({
                title: 'Error',
                description: result.error || 'Failed to load quotes',
                variant: 'destructive',
            })
        }
        setLoading(false)
    }, [toast])

    useEffect(() => {
        fetchQuotes()
    }, [fetchQuotes])

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        const result = await updateQuoteStatus(id, newStatus)
        if (result.success) {
            setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q))
            toast({ title: 'Status Updated', description: `Quote marked as ${newStatus}` })
        } else {
            toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' })
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800'
            case 'Contacted': return 'bg-amber-100 text-amber-800'
            case 'Qualified': return 'bg-purple-100 text-purple-800'
            case 'Proposal Sent': return 'bg-indigo-100 text-indigo-800'
            case 'Won': return 'bg-green-100 text-green-800'
            case 'Lost': return 'bg-red-100 text-red-800'
            default: return 'bg-slate-100 text-slate-800'
        }
    }

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Quote Requests (IT Leads)</h1>
                <Button onClick={fetchQuotes} variant="outline" size="sm">Refresh</Button>
            </div>

            <Card>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Company & Contact</TableHead>
                                <TableHead>Service & Budget</TableHead>
                                <TableHead className="w-[300px]">Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quotes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No quote requests found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                quotes.map((quote) => (
                                    <TableRow key={quote.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(quote.created_at), 'MMM d, yyyy')}
                                            <div className="text-xs text-muted-foreground">
                                                {format(new Date(quote.created_at), 'h:mm a')}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium flex items-center gap-2">
                                                <Building2 className="h-3 w-3 text-slate-500" /> {quote.company_name}
                                            </div>
                                            <div className="text-sm mt-1">{quote.contact_person}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <Mail className="h-3 w-3" /> {quote.email}
                                            </div>
                                            {quote.phone && (
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Phone className="h-3 w-3" /> {quote.phone}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="mb-1">{quote.service_interest}</Badge>
                                            {quote.budget_range && (
                                                <div className="text-xs text-muted-foreground">
                                                    Budget: <span className="font-medium text-slate-700">{quote.budget_range}</span>
                                                </div>
                                            )}
                                            {quote.timeline && (
                                                <div className="text-xs text-muted-foreground">
                                                    Timeline: {quote.timeline}
                                                </div>
                                            )}
                                            {/* Specialized Fields for Logistics/Scrap */}
                                            {quote.commodity_type && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Commodity: <span className="font-medium text-slate-700">{quote.commodity_type}</span>
                                                </div>
                                            )}
                                            {quote.current_location && (
                                                <div className="text-xs text-muted-foreground">
                                                    Origin: {quote.current_location}
                                                </div>
                                            )}
                                            {quote.destination_country && (
                                                <div className="text-xs text-muted-foreground">
                                                    Dest: {quote.destination_country}
                                                </div>
                                            )}
                                            {quote.target_port && (
                                                <div className="text-xs text-muted-foreground">
                                                    Port: {quote.target_port}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="whitespace-pre-wrap text-sm text-slate-600 line-clamp-3 hover:line-clamp-none cursor-pointer" title={quote.project_description}>
                                            {quote.project_description}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(quote.status)} variant="secondary">
                                                {quote.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end">
                                                <select
                                                    className="h-8 text-xs border rounded bg-transparent px-2"
                                                    value={quote.status}
                                                    onChange={(e) => handleStatusUpdate(quote.id, e.target.value)}
                                                >
                                                    <option value="New">New</option>
                                                    <option value="Contacted">Contacted</option>
                                                    <option value="Qualified">Qualified</option>
                                                    <option value="Proposal Sent">Proposal Sent</option>
                                                    <option value="Won">Won</option>
                                                    <option value="Lost">Lost</option>
                                                </select>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
