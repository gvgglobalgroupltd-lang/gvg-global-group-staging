'use client'

import { useEffect, useState } from 'react'
import { Briefcase, Mail, Phone, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'

interface ITLead {
    id: string
    company_name: string
    contact_person: string
    email: string
    phone: string | null
    service_interest: string
    status: string
    priority: string
    created_at: string
    days_old: number
}

export function ITLeadsWidget() {
    const [leads, setLeads] = useState<ITLead[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadLeads()
    }, [])

    async function loadLeads() {
        try {
            const supabase = createClient()

            const { data, error } = await supabase
                .rpc('get_recent_it_leads', { p_days: 30 }) as any

            if (error) throw error

            setLeads(data || [])
        } catch (error) {
            console.error('Failed to load IT leads:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        const colors = {
            'New': 'bg-green-500',
            'Contacted': 'bg-blue-500',
            'Qualified': 'bg-purple-500',
            'Proposal Sent': 'bg-amber-500',
            'Won': 'bg-emerald-500',
            'Lost': 'bg-gray-500'
        } as const
        return colors[status as keyof typeof colors] || 'bg-gray-500'
    }

    const getPriorityVariant = (priority: string) => {
        const variants = {
            'Urgent': 'destructive',
            'High': 'destructive',
            'Medium': 'secondary',
            'Low': 'outline'
        } as const
        return variants[priority as keyof typeof variants] || 'outline'
    }

    if (isLoading) {
        return (
            <Card className="p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-3">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </Card>
        )
    }

    const newLeads = leads.filter(l => l.status === 'New')

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-indigo-600" />
                    IT Consultation Leads
                </h3>
                {newLeads.length > 0 && (
                    <Badge className="bg-green-500">{newLeads.length} new</Badge>
                )}
            </div>

            {leads.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No recent leads</p>
                    <p className="text-sm">New consultation requests will appear here</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {leads.map((lead) => (
                        <div
                            key={lead.id}
                            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="space-y-3">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-lg">{lead.company_name}</h4>
                                        <p className="text-sm text-muted-foreground">{lead.contact_person}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge className={getStatusColor(lead.status)}>
                                            {lead.status}
                                        </Badge>
                                        <Badge variant={getPriorityVariant(lead.priority)}>
                                            {lead.priority}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Service */}
                                <div className="flex items-center gap-2 text-sm">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                        {lead.service_interest}
                                    </span>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        <a href={`mailto:${lead.email}`} className="hover:underline">
                                            {lead.email}
                                        </a>
                                    </div>
                                    {lead.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            <a href={`tel:${lead.phone}`} className="hover:underline">
                                                {lead.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Timestamp */}
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>
                                            {lead.days_old === 0
                                                ? 'Today'
                                                : lead.days_old === 1
                                                    ? 'Yesterday'
                                                    : `${lead.days_old} days ago`}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">
                                            View Details
                                        </Button>
                                        {lead.status === 'New' && (
                                            <Button size="sm">
                                                Assign
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    )
}
