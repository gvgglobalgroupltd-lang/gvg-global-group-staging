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
import { Loader2, Mail, Phone, Building2 } from 'lucide-react'
import { getInquiries, updateInquiryStatus } from '@/app/actions/inquiries'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

interface Inquiry {
    id: string
    full_name: string
    email: string
    phone?: string
    company_name?: string
    inquiry_type: string
    message: string
    status: string
    created_at: string
}

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    const fetchInquiries = useCallback(async () => {
        setLoading(true)
        const result = await getInquiries()
        if (result.success && result.data) {
            setInquiries(result.data as Inquiry[])
        } else {
            toast({
                title: 'Error',
                description: result.error || 'Failed to load inquiries',
                variant: 'destructive',
            })
        }
        setLoading(false)
    }, [toast])

    useEffect(() => {
        fetchInquiries()
    }, [fetchInquiries])

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        const result = await updateInquiryStatus(id, newStatus)
        if (result.success) {
            setInquiries(inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i))
            toast({ title: 'Status Updated', description: `Inquiry marked as ${newStatus}` })
        } else {
            toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' })
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800'
            case 'In Progress': return 'bg-amber-100 text-amber-800'
            case 'Resolved': return 'bg-green-100 text-green-800'
            case 'Archived': return 'bg-slate-100 text-slate-800'
            default: return 'bg-slate-100 text-slate-800'
        }
    }

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Customer Inquiries</h1>
                <Button onClick={fetchInquiries} variant="outline" size="sm">Refresh</Button>
            </div>

            <Card>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="w-[400px]">Message</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inquiries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No inquiries found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                inquiries.map((inquiry) => (
                                    <TableRow key={inquiry.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                                            <div className="text-xs text-muted-foreground">
                                                {format(new Date(inquiry.created_at), 'h:mm a')}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{inquiry.full_name}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {inquiry.email}
                                            </div>
                                            {inquiry.phone && (
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Phone className="h-3 w-3" /> {inquiry.phone}
                                                </div>
                                            )}
                                            {inquiry.company_name && (
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Building2 className="h-3 w-3" /> {inquiry.company_name}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{inquiry.inquiry_type}</Badge>
                                        </TableCell>
                                        <TableCell className="whitespace-pre-wrap text-sm text-slate-600 line-clamp-3 hover:line-clamp-none cursor-pointer" title={inquiry.message}>
                                            {inquiry.message}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge className={getStatusColor(inquiry.status)} variant="secondary">
                                                    {inquiry.status}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end">
                                                <select
                                                    className="h-8 text-xs border rounded bg-transparent px-2"
                                                    value={inquiry.status}
                                                    onChange={(e) => handleStatusUpdate(inquiry.id, e.target.value)}
                                                >
                                                    <option value="New">New</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Resolved">Resolved</option>
                                                    <option value="Archived">Archived</option>
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
