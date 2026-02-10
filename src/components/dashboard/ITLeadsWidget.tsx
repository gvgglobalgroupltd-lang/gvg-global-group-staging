'use client'

import { useEffect, useState } from 'react'
import { Briefcase, Mail, Phone, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { updateQuoteStatus } from '@/actions/quotes'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'

interface ITLead {
    id: string
    company_name: string
    contact_person: string
    email: string
    phone: string | null
    service_interest: string
    project_description: string | null
    budget_range: string | null
    timeline: string | null
    status: string
    priority: string
    created_at: string
    days_old: number
}

export function ITLeadsWidget() {
    const [leads, setLeads] = useState<ITLead[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAssigning, setIsAssigning] = useState<string | null>(null)
    const { toast } = useToast()

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
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline">
                                                    View Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px]">
                                                <DialogHeader>
                                                    <DialogTitle>{lead.company_name}</DialogTitle>
                                                    <DialogDescription>
                                                        Consultation request from {lead.contact_person}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-muted-foreground font-medium">Service</p>
                                                            <p className="text-foreground">{lead.service_interest}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground font-medium">Priority</p>
                                                            <Badge variant={getPriorityVariant(lead.priority)}>
                                                                {lead.priority}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground font-medium text-sm mb-1">Project Description</p>
                                                        <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                                                            {lead.project_description || 'No description provided'}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-muted-foreground font-medium text-sm">Budget Range</p>
                                                            <p className="text-foreground">{lead.budget_range || 'Not specified'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground font-medium text-sm">Timeline</p>
                                                            <p className="text-foreground">{lead.timeline || 'Not specified'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {lead.status === 'New' && (
                                            <Button
                                                size="sm"
                                                disabled={isAssigning === lead.id}
                                                onClick={async () => {
                                                    try {
                                                        setIsAssigning(lead.id)
                                                        const result = await updateQuoteStatus(lead.id, 'Contacted')
                                                        if (result.success) {
                                                            toast({
                                                                title: "Lead Assigned",
                                                                description: `Successfully assigned ${lead.company_name} to you.`,
                                                            })
                                                            loadLeads() // Refresh the list
                                                        } else {
                                                            throw new Error(result.error)
                                                        }
                                                    } catch (err) {
                                                        toast({
                                                            title: "Assignment Failed",
                                                            description: "Could not assign lead. Please try again.",
                                                            variant: "destructive"
                                                        })
                                                    } finally {
                                                        setIsAssigning(null)
                                                    }
                                                }}
                                            >
                                                {isAssigning === lead.id ? 'Assigning...' : 'Assign'}
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
