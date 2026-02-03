'use client'

import { AlertTriangle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    calculateLCDaysRemaining,
    getLCAlertLevel,
    type LCAlert
} from '@/lib/finance/payment-calculations'

interface LCAlertBadgeProps {
    lcNumber: string
    shipmentDate: string
    variant?: 'badge' | 'alert'
}

export function LCAlertBadge({ lcNumber, shipmentDate, variant = 'badge' }: LCAlertBadgeProps) {
    const daysRemaining = calculateLCDaysRemaining(shipmentDate)
    const alertLevel = getLCAlertLevel(daysRemaining)

    const badgeVariant = {
        'EXPIRED': 'destructive' as const,
        'TODAY': 'destructive' as const,
        'WARNING': 'outline' as const,
        'OK': 'secondary' as const
    }[alertLevel]

    const badgeColor = {
        'EXPIRED': 'bg-red-500 text-white border-red-500',
        'TODAY': 'bg-red-500 text-white border-red-500',
        'WARNING': 'bg-amber-500 text-white border-amber-500',
        'OK': 'bg-green-500 text-white border-green-500'
    }[alertLevel]

    const message = {
        'EXPIRED': `LC ${lcNumber} EXPIRED`,
        'TODAY': `LC ${lcNumber} expires TODAY`,
        'WARNING': `LC ${lcNumber} expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`,
        'OK': `LC ${lcNumber} - ${daysRemaining} days remaining`
    }[alertLevel]

    if (variant === 'alert' && (alertLevel === 'EXPIRED' || alertLevel === 'TODAY' || alertLevel === 'WARNING')) {
        const alertVariant = alertLevel === 'EXPIRED' || alertLevel === 'TODAY' ? 'destructive' : undefined
        const alertColor = alertLevel === 'WARNING'
            ? 'border-amber-500/50 bg-amber-500/10'
            : ''

        return (
            <Alert variant={alertVariant} className={alertColor}>
                <div className="flex items-center gap-2">
                    {alertLevel === 'WARNING' ? (
                        <Clock className="h-4 w-4 text-amber-500" />
                    ) : (
                        <AlertTriangle className="h-4 w-4" />
                    )}
                    <AlertDescription className={alertLevel === 'WARNING' ? 'text-amber-700 dark:text-amber-400' : ''}>
                        <strong>{alertLevel === 'EXPIRED' ? 'EXPIRED:' : alertLevel === 'TODAY' ? 'TODAY:' : 'Urgent:'}</strong>{' '}
                        {message}
                    </AlertDescription>
                </div>
            </Alert>
        )
    }

    if (alertLevel === 'OK') {
        return null // Don't show badge if everything is OK
    }

    return (
        <Badge variant={badgeVariant} className={badgeColor}>
            {alertLevel === 'EXPIRED' || alertLevel === 'TODAY' ? (
                <AlertTriangle className="h-3 w-3 mr-1" />
            ) : (
                <Clock className="h-3 w-3 mr-1" />
            )}
            {message}
        </Badge>
    )
}

interface LCAlertSummaryProps {
    alerts: LCAlert[]
}

export function LCAlertSummary({ alerts }: LCAlertSummaryProps) {
    if (alerts.length === 0) {
        return null
    }

    const expiredCount = alerts.filter(a => a.alert_level === 'EXPIRED').length
    const todayCount = alerts.filter(a => a.alert_level === 'TODAY').length
    const warningCount = alerts.filter(a => a.alert_level === 'WARNING').length

    return (
        <div className="space-y-2">
            {expiredCount > 0 && (
                <Badge variant="destructive" className="mr-2">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {expiredCount} LC{expiredCount > 1 ? 's' : ''} EXPIRED
                </Badge>
            )}
            {todayCount > 0 && (
                <Badge variant="destructive" className="mr-2">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {todayCount} LC{todayCount > 1 ? 's' : ''} expire TODAY
                </Badge>
            )}
            {warningCount > 0 && (
                <Badge variant="outline" className="bg-amber-500 text-white border-amber-500 mr-2">
                    <Clock className="h-3 w-3 mr-1" />
                    {warningCount} LC{warningCount > 1 ? 's' : ''} expiring soon
                </Badge>
            )}
        </div>
    )
}
