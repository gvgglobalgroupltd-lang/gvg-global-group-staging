'use client'

import { useState } from 'react'
import { Download, CheckCircle2, AlertCircle, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { LCAlertBadge } from './LCAlertBadge'
import {
    formatCurrency,
    formatPercentage,
    calculatePaymentProgress,
    getPaymentTypeBadgeColor,
    getStatusBadgeVariant,
    isPaymentOverdue,
    type PaymentScheduleItem
} from '@/lib/finance/payment-calculations'
import { format } from 'date-fns'

interface PaymentScheduleTableProps {
    payments: PaymentScheduleItem[]
    onMarkPaid: (paymentId: string) => void
    onDownloadProof: (paymentId: string) => void
    isAdmin?: boolean
}

export function PaymentScheduleTable({
    payments,
    onMarkPaid,
    onDownloadProof,
    isAdmin = false
}: PaymentScheduleTableProps) {
    const [processingId, setProcessingId] = useState<string | null>(null)

    const progress = calculatePaymentProgress(payments)

    const handleMarkPaid = async (paymentId: string) => {
        setProcessingId(paymentId)
        try {
            await onMarkPaid(paymentId)
        } finally {
            setProcessingId(null)
        }
    }

    if (payments.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                    No payment schedule created yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Add payment milestones to track progress
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Payment Progress Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Payments</p>
                    <p className="text-2xl font-bold">{progress.totalCount}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Paid</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {progress.paidCount}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Pending</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {progress.pendingCount}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Progress</p>
                    <p className="text-2xl font-bold text-primary">
                        {formatPercentage(progress.progressPercentage, 0)}
                    </p>
                </div>
            </div>

            {/* Payment Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Paid Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map((payment) => {
                            const overdue = isPaymentOverdue(payment.due_date, payment.status)

                            return (
                                <TableRow
                                    key={payment.id}
                                    className={overdue ? 'bg-red-50 dark:bg-red-950/20' : ''}
                                >
                                    <TableCell>
                                        <div className="space-y-1">
                                            <Badge className={getPaymentTypeBadgeColor(payment.payment_type)}>
                                                {payment.payment_type}
                                            </Badge>
                                            {payment.percentage && (
                                                <p className="text-xs text-muted-foreground">
                                                    {formatPercentage(payment.percentage, 1)}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div>
                                            <p className="font-semibold">{formatCurrency(payment.amount_inr || 0)}</p>
                                            {payment.amount_usd && (
                                                <p className="text-xs text-muted-foreground">
                                                    {formatCurrency(payment.amount_usd, 'USD')}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <p className="text-sm">
                                            {format(new Date(payment.due_date), 'MMM dd, yyyy')}
                                        </p>
                                        {overdue && (
                                            <Badge variant="destructive" className="mt-1 text-xs">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                Overdue
                                            </Badge>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {payment.paid_date ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                <span className="text-sm">
                                                    {format(new Date(payment.paid_date), 'MMM dd, yyyy')}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Not paid</span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(payment.status)}>
                                            {payment.status}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-sm">{payment.payment_method}</p>
                                            {payment.payment_method === 'Letter of Credit' && payment.lc_number && (
                                                <>
                                                    <p className="text-xs text-muted-foreground">
                                                        LC: {payment.lc_number}
                                                    </p>
                                                    {payment.lc_latest_shipment_date && (
                                                        <LCAlertBadge
                                                            lcNumber={payment.lc_number}
                                                            shipmentDate={payment.lc_latest_shipment_date}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {payment.proof_document_path && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onDownloadProof(payment.id)}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            )}

                                            {payment.status === 'Pending' && isAdmin && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleMarkPaid(payment.id)}
                                                    disabled={processingId === payment.id}
                                                >
                                                    {processingId === payment.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="h-4 w-4 mr-1" />
                                                            Mark Paid
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Payment Totals */}
            <div className="flex justify-between items-center p-4 border rounded-lg bg-muted/30">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-bold">{formatCurrency(progress.totalAmountINR)}</p>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-sm text-muted-foreground">Paid / Pending</p>
                    <p className="text-xl font-bold">
                        <span className="text-green-600 dark:text-green-400">
                            {formatCurrency(progress.paidAmountINR)}
                        </span>
                        <span className="text-muted-foreground mx-2">/</span>
                        <span className="text-amber-600 dark:text-amber-400">
                            {formatCurrency(progress.pendingAmountINR)}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}
