'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Clock, FileText, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface ActionItem {
    item_type: string
    item_id: string
    deal_ref: string
    title: string
    description: string
    priority: 'Low' | 'Medium' | 'High' | 'Urgent'
    due_date: string | null
    days_remaining: number | null
}

export function ActionCenter() {
    const [items, setItems] = useState<ActionItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadActionItems()
    }, [])

    async function loadActionItems() {
        try {
            const supabase = createClient()

            const { data, error } = await supabase
                .rpc('get_action_center_items')

            if (error) throw error

            setItems(data || [])
        } catch (error) {
            console.error('Failed to load action items:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getPriorityBadge = (priority: string) => {
        const variants = {
            Urgent: 'destructive',
            High: 'destructive',
            Medium: 'secondary',
            Low: 'outline'
        } as const

        return variants[priority as keyof typeof variants] || 'outline'
    }

    const getPriorityIcon = (priority: string) => {
        if (priority === 'Urgent' || priority === 'High') {
            return <AlertTriangle className="h-4 w-4" />
        }
        return <Clock className="h-4 w-4" />
    }

    if (isLoading) {
        return (
            <Card className="p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    Action Center
                </h3>
                {items.length > 0 && (
                    <Badge variant="destructive">{items.length} items</Badge>
                )}
            </div>

            {items.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">All caught up!</p>
                    <p className="text-sm">No urgent actions required</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.item_id}
                            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={getPriorityBadge(item.priority)} className="flex items-center gap-1">
                                            {getPriorityIcon(item.priority)}
                                            {item.priority}
                                        </Badge>
                                        <span className="text-sm font-mono text-muted-foreground">
                                            {item.deal_ref}
                                        </span>
                                    </div>

                                    <h4 className="font-semibold">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>

                                    {item.days_remaining !== null && (
                                        <p className="text-xs text-muted-foreground">
                                            {item.days_remaining < 0
                                                ? `Overdue by ${Math.abs(item.days_remaining)} days`
                                                : item.days_remaining === 0
                                                    ? 'Due today'
                                                    : `${item.days_remaining} days remaining`}
                                        </p>
                                    )}
                                </div>

                                <Button asChild variant="ghost" size="sm">
                                    <Link href={`/admin/deals/${item.item_id}`}>
                                        View →
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    )
}
