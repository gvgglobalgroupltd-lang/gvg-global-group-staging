/**
 * Payment and Financial Calculations
 * Utilities for payment schedules, P&L, and LC alerts
 */

export interface PaymentScheduleItem {
    id: string
    deal_id: string
    payment_type: 'Advance' | 'Balance' | 'LC' | 'Final' | 'Other'
    percentage?: number
    amount_usd?: number
    amount_inr?: number
    due_date: string
    paid_date?: string
    status: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled'
    payment_method: 'Wire Transfer' | 'Letter of Credit' | 'Cash' | 'Check' | 'Other'
    lc_number?: string
    lc_latest_shipment_date?: string
    lc_issuing_bank?: string
    lc_beneficiary?: string
    proof_document_path?: string
    proof_document_name?: string
    notes?: string
    created_by: string
    created_at: string
    updated_at: string
}

export interface ActualExpense {
    id: string
    deal_id: string
    expense_type: string
    description: string
    amount_inr: number
    amount_usd?: number
    paid_date: string
    vendor_name?: string
    invoice_number?: string
    proof_document_path?: string
    proof_document_name?: string
    notes?: string
    created_by: string
    created_at: string
    updated_at: string
}

export interface PLSummary {
    deal_id: string
    deal_ref: string
    estimated_cost_inr: number
    actual_cost_inr: number
    variance_inr: number
    variance_percentage: number
    total_payments_inr: number
    total_paid_inr: number
    total_pending_inr: number
    sell_price_inr: number
    profit_inr: number
    profit_margin_percentage: number
}

export interface LCAlert {
    payment_id: string
    deal_id: string
    deal_ref: string
    lc_number: string
    lc_latest_shipment_date: string
    days_until_shipment: number
    alert_level: 'EXPIRED' | 'TODAY' | 'WARNING' | 'OK'
}

/**
 * Calculate payment amount from percentage and deal value
 */
export function calculatePaymentAmount(
    percentage: number,
    totalDealValueINR: number
): number {
    return (percentage / 100) * totalDealValueINR
}

/**
 * Calculate percentage from amount and deal value
 */
export function calculatePaymentPercentage(
    amount: number,
    totalDealValueINR: number
): number {
    if (totalDealValueINR === 0) return 0
    return (amount / totalDealValueINR) * 100
}

/**
 * Validate payment schedule totals
 */
export function validatePaymentSchedule(
    payments: Array<{ percentage?: number; amount_inr?: number }>,
    totalDealValueINR: number
): { valid: boolean; error?: string; totalPercentage: number; totalAmount: number } {
    let totalPercentage = 0
    let totalAmount = 0

    for (const payment of payments) {
        if (payment.percentage) {
            totalPercentage += payment.percentage
        }
        if (payment.amount_inr) {
            totalAmount += payment.amount_inr
        }
    }

    if (totalPercentage > 100) {
        return {
            valid: false,
            error: `Total payment percentage (${totalPercentage.toFixed(2)}%) exceeds 100%`,
            totalPercentage,
            totalAmount
        }
    }

    if (totalAmount > totalDealValueINR * 1.1) {
        // Allow 10% overage for rounding
        return {
            valid: false,
            error: 'Total payment amount exceeds deal value',
            totalPercentage,
            totalAmount
        }
    }

    return { valid: true, totalPercentage, totalAmount }
}

/**
 * Calculate days until LC shipment deadline
 */
export function calculateLCDaysRemaining(shipmentDate: string): number {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const deadline = new Date(shipmentDate)
    deadline.setHours(0, 0, 0, 0)

    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
}

/**
 * Get LC alert level based on days remaining
 */
export function getLCAlertLevel(daysRemaining: number): LCAlert['alert_level'] {
    if (daysRemaining < 0) return 'EXPIRED'
    if (daysRemaining === 0) return 'TODAY'
    if (daysRemaining <= 5) return 'WARNING'
    return 'OK'
}

/**
 * Get variance indicator level
 */
export function getVarianceLevel(
    variancePercentage: number
): 'positive' | 'neutral' | 'warning' | 'danger' {
    if (variancePercentage > 5) return 'positive' // Significantly under budget
    if (variancePercentage >= 0) return 'neutral' // On or slightly under budget
    if (variancePercentage >= -5) return 'warning' // Slightly over budget
    return 'danger' // Significantly over budget
}

/**
 * Get profit margin indicator level
 */
export function getProfitMarginLevel(
    marginPercentage: number
): 'excellent' | 'good' | 'acceptable' | 'poor' | 'loss' {
    if (marginPercentage >= 15) return 'excellent'
    if (marginPercentage >= 10) return 'good'
    if (marginPercentage >= 5) return 'acceptable'
    if (marginPercentage >= 0) return 'poor'
    return 'loss'
}

/**
 * Format currency (INR or USD)
 */
export function formatCurrency(
    amount: number,
    currency: 'INR' | 'USD' = 'INR'
): string {
    if (currency === 'INR') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
    }).format(amount)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`
}

/**
 * Check if payment is overdue
 */
export function isPaymentOverdue(dueDate: string, status: string): boolean {
    if (status !== 'Pending') return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)

    return due < today
}

/**
 * Calculate payment schedule progress
 */
export function calculatePaymentProgress(payments: PaymentScheduleItem[]): {
    totalCount: number
    paidCount: number
    pendingCount: number
    overdueCount: number
    totalAmountINR: number
    paidAmountINR: number
    pendingAmountINR: number
    progressPercentage: number
} {
    const totalCount = payments.length
    const paidCount = payments.filter(p => p.status === 'Paid').length
    const pendingCount = payments.filter(p => p.status === 'Pending').length
    const overdueCount = payments.filter(p => p.status === 'Overdue').length

    const totalAmountINR = payments.reduce((sum, p) => sum + (p.amount_inr || 0), 0)
    const paidAmountINR = payments
        .filter(p => p.status === 'Paid')
        .reduce((sum, p) => sum + (p.amount_inr || 0), 0)
    const pendingAmountINR = payments
        .filter(p => p.status === 'Pending' || p.status === 'Overdue')
        .reduce((sum, p) => sum + (p.amount_inr || 0), 0)

    const progressPercentage = totalAmountINR > 0
        ? (paidAmountINR / totalAmountINR) * 100
        : 0

    return {
        totalCount,
        paidCount,
        pendingCount,
        overdueCount,
        totalAmountINR,
        paidAmountINR,
        pendingAmountINR,
        progressPercentage
    }
}

/**
 * Get expense type icon
 */
export function getExpenseTypeIcon(expenseType: string): string {
    const iconMap: Record<string, string> = {
        'Freight': '🚢',
        'Insurance': '🛡️',
        'Customs': '🏛️',
        'Transport': '🚚',
        'Warehousing': '🏭',
        'Banking': '🏦',
        'Legal': '⚖️',
        'Inspection': '🔍',
        'Other': '💰'
    }

    return iconMap[expenseType] || '💵'
}

/**
 * Get payment type badge color
 */
export function getPaymentTypeBadgeColor(
    paymentType: PaymentScheduleItem['payment_type']
): string {
    const colorMap: Record<PaymentScheduleItem['payment_type'], string> = {
        'Advance': 'bg-blue-500',
        'Balance': 'bg-purple-500',
        'LC': 'bg-green-500',
        'Final': 'bg-amber-500',
        'Other': 'bg-gray-500'
    }

    return colorMap[paymentType]
}

/**
 * Get status badge variant
 */
export function getStatusBadgeVariant(
    status: PaymentScheduleItem['status']
): 'default' | 'secondary' | 'destructive' | 'outline' {
    const variantMap: Record<PaymentScheduleItem['status'], any> = {
        'Pending': 'secondary',
        'Paid': 'default',
        'Overdue': 'destructive',
        'Cancelled': 'outline'
    }

    return variantMap[status]
}
