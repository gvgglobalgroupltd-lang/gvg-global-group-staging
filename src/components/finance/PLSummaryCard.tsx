'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    formatCurrency,
    formatPercentage,
    getVarianceLevel,
    getProfitMarginLevel,
    type PLSummary
} from '@/lib/finance/payment-calculations'
import { createClient } from '@/lib/supabase/client'

interface PLSummaryCardProps {
    dealId: string
    refreshTrigger?: number
}

export function PLSummaryCard({ dealId, refreshTrigger = 0 }: PLSummaryCardProps) {
    const [plData, setPlData] = useState<PLSummary | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchPLData() {
            setIsLoading(true)
            setError(null)

            try {
                const supabase = createClient()

                // Call the P&L summary function
                const { data, error: fetchError } = await supabase
                    .rpc('get_deal_pl_summary', { p_deal_id: dealId })
                    .single()

                if (fetchError) {
                    throw fetchError
                }

                setPlData(data)
            } catch (err) {
                console.error('Failed to fetch P&L data:', err)
                setError(err instanceof Error ? err.message : 'Failed to load P&L data')
            } finally {
                setIsLoading(false)
            }
        }

        fetchPLData()
    }, [dealId, refreshTrigger])

    if (isLoading) {
        return (
            <Card className="p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </Card>
        )
    }

    if (error || !plData) {
        return (
            <Card className="p-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error || 'No P&L data available'}</AlertDescription>
                </Alert>
            </Card>
        )
    }

    const varianceLevel = getVarianceLevel(plData.variance_percentage)
    const profitLevel = getProfitMarginLevel(plData.profit_margin_percentage)

    const varianceColor = {
        positive: 'text-green-600 dark:text-green-400',
        neutral: 'text-blue-600 dark:text-blue-400',
        warning: 'text-amber-600 dark:text-amber-400',
        danger: 'text-red-600 dark:text-red-400'
    }[varianceLevel]

    const profitColor = {
        excellent: 'text-green-600 dark:text-green-400',
        good: 'text-blue-600 dark:text-blue-400',
        acceptable: 'text-amber-600 dark:text-amber-400',
        poor: 'text-orange-600 dark:text-orange-400',
        loss: 'text-red-600 dark:text-red-400'
    }[profitLevel]

    return (
        <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Profit & Loss Summary
                </h3>
                <Badge variant="outline">{plData.deal_ref}</Badge>
            </div>

            {/* Cost Analysis */}
            <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground">Estimated Cost:</span>
                    <span className="font-semibold">{formatCurrency(plData.estimated_cost_inr)}</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground">Actual Cost:</span>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{formatCurrency(plData.actual_cost_inr)}</span>
                        {plData.variance_percentage !== 0 && (
                            <Badge variant="outline" className={varianceColor}>
                                {plData.variance_percentage > 0 ? (
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                ) : (
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                )}
                                {formatPercentage(Math.abs(plData.variance_percentage))}
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Variance:</span>
                    <span className={`font-bold ${varianceColor}`}>
                        {plData.variance_inr >= 0 ? '+' : '-'}
                        {formatCurrency(Math.abs(plData.variance_inr))}
                        {plData.variance_inr >= 0 ? ' ✅' : ' ⚠️'}
                    </span>
                </div>

                {varianceLevel === 'danger' && (
                    <Alert className="mt-4 border-red-500/50 bg-red-500/10">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <AlertDescription className="text-red-700 dark:text-red-400">
                            <strong>Over Budget:</strong> Actual costs exceed estimated by{' '}
                            {formatPercentage(Math.abs(plData.variance_percentage))}
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Profit Analysis */}
            <div className="space-y-4 pt-4 border-t-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sell Price:</span>
                    <span className="font-semibold text-primary">{formatCurrency(plData.sell_price_inr)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Projected Profit:</span>
                    <span className={`font-bold text-lg ${profitColor}`}>
                        {formatCurrency(plData.profit_inr)}
                    </span>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Profit Margin:</span>
                        <span className={`font-bold ${profitColor}`}>
                            {formatPercentage(plData.profit_margin_percentage)}
                            {profitLevel === 'excellent' && ' 🎉'}
                            {profitLevel === 'good' && ' 🟢'}
                            {profitLevel === 'acceptable' && ' 🟡'}
                            {profitLevel === 'poor' && ' 🟠'}
                            {profitLevel === 'loss' && ' 🔴'}
                        </span>
                    </div>
                    <Progress
                        value={Math.min(Math.max(plData.profit_margin_percentage, 0), 100)}
                        className="h-2"
                    />
                </div>

                {profitLevel === 'loss' && (
                    <Alert className="border-red-500/50 bg-red-500/10">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <AlertDescription className="text-red-700 dark:text-red-400">
                            <strong>Loss Warning:</strong> Current costs result in a negative margin
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Payment Status */}
            <div className="mt-6 pt-4 border-t space-y-3">
                <h4 className="text-sm font-semibold">Payment Status</h4>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Paid:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(plData.total_paid_inr)}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Pending Payments:</span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">
                        {formatCurrency(plData.total_pending_inr)}
                    </span>
                </div>
                {plData.total_payments_inr > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-2 text-xs text-muted-foreground">
                            <span>Payment Progress</span>
                            <span>
                                {formatPercentage((plData.total_paid_inr / plData.total_payments_inr) * 100)}
                            </span>
                        </div>
                        <Progress
                            value={(plData.total_paid_inr / plData.total_payments_inr) * 100}
                            className="h-2"
                        />
                    </div>
                )}
            </div>
        </Card>
    )
}
