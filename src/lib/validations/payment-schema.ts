import { z } from 'zod'

/**
 * Validation schemas for payment and expense management
 */

// Common expense types for dropdown
export const EXPENSE_TYPES = [
    'Freight',
    'Insurance',
    'Customs',
    'Transport',
    'Warehousing',
    'Banking',
    'Legal',
    'Inspection',
    'Other'
] as const

// Payment types for dropdown
export const PAYMENT_TYPES = [
    'Advance',
    'Balance',
    'LC',
    'Final',
    'Other'
] as const

// Payment methods for dropdown
export const PAYMENT_METHODS = [
    'Wire Transfer',
    'Letter of Credit',
    'Cash',
    'Check',
    'Other'
] as const

// Payment statuses
export const PAYMENT_STATUSES = [
    'Pending',
    'Paid',
    'Overdue',
    'Cancelled'
] as const

// Helper for safe File validation
const fileSchema = (typeof File !== 'undefined'
    ? z.instanceof(File)
    : z.any()) as z.ZodType<any>

// Payment Schedule Schema
export const paymentSchema = z.object({
    payment_type: z.enum(PAYMENT_TYPES as unknown as [string, ...string[]]),
    percentage: z
        .number()
        .min(0, 'Percentage must be at least 0')
        .max(100, 'Percentage cannot exceed 100')
        .optional(),
    amount_usd: z.number().nonnegative('Amount must be positive').optional(),
    amount_inr: z.number().nonnegative('Amount must be positive').optional(),
    due_date: z.string().min(1, 'Due date is required'),
    payment_method: z.enum(PAYMENT_METHODS as unknown as [string, ...string[]]),
    lc_number: z.string().optional(),
    lc_latest_shipment_date: z.string().optional(),
    lc_issuing_bank: z.string().optional(),
    lc_beneficiary: z.string().optional(),
    notes: z.string().optional()
}).refine(
    (data) => {
        // Either percentage OR amount must be provided
        return data.percentage !== undefined || data.amount_inr !== undefined || data.amount_usd !== undefined
    },
    {
        message: 'Either percentage or amount must be provided',
        path: ['percentage']
    }
).refine(
    (data) => {
        // If payment method is LC, require LC fields
        if (data.payment_method === 'Letter of Credit') {
            return data.lc_number && data.lc_latest_shipment_date
        }
        return true
    },
    {
        message: 'LC number and shipment date are required for Letter of Credit',
        path: ['lc_number']
    }
)

export type PaymentFormData = z.infer<typeof paymentSchema>

// Mark Payment as Paid Schema
export const markPaymentPaidSchema = z.object({
    payment_id: z.string().uuid('Invalid payment ID'),
    paid_date: z.string().min(1, 'Paid date is required'),
    proof_document: fileSchema.optional(),
    notes: z.string().optional()
})

export type MarkPaymentPaidFormData = z.infer<typeof markPaymentPaidSchema>

// Expense Schema
export const expenseSchema = z.object({
    expense_type: z.string().min(1, 'Expense type is required'),
    description: z.string().min(1, 'Description is required'),
    amount_inr: z
        .number()
        .positive('Amount must be greater than 0'),
    amount_usd: z.number().nonnegative('Amount must be positive').optional(),
    paid_date: z.string().min(1, 'Paid date is required'),
    vendor_name: z.string().optional(),
    invoice_number: z.string().optional(),
    proof_document: fileSchema.optional(),
    notes: z.string().optional()
})

export type ExpenseFormData = z.infer<typeof expenseSchema>
