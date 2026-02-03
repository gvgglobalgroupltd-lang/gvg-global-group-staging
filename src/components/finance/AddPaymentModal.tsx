'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    paymentSchema,
    type PaymentFormData,
    PAYMENT_TYPES,
    PAYMENT_METHODS
} from '@/lib/validations/payment-schema'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

interface AddPaymentModalProps {
    dealId: string
    totalDealValueINR: number
    onSuccess: () => void
}

export function AddPaymentModal({ dealId, totalDealValueINR, onSuccess }: AddPaymentModalProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const form = useForm<PaymentFormData>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            payment_type: 'Advance',
            payment_method: 'Wire Transfer',
            percentage: 20
        }
    })

    const paymentMethod = form.watch('payment_method')
    const percentage = form.watch('percentage')

    // Auto-calculate amount from percentage
    const calculatedAmount = percentage ? (percentage / 100) * totalDealValueINR : 0

    const onSubmit = async (data: PaymentFormData) => {
        setIsSubmitting(true)

        try {
            const supabase = createClient()

            // Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // Calculate amount if not provided
            const amountINR = data.amount_inr || calculatedAmount

            const { error } = await supabase
                .from('deal_payments')
                .insert({
                    deal_id: dealId,
                    payment_type: data.payment_type,
                    percentage: data.percentage,
                    amount_inr: amountINR,
                    amount_usd: data.amount_usd,
                    due_date: data.due_date,
                    payment_method: data.payment_method,
                    lc_number: data.lc_number,
                    lc_latest_shipment_date: data.lc_latest_shipment_date,
                    lc_issuing_bank: data.lc_issuing_bank,
                    lc_beneficiary: data.lc_beneficiary,
                    notes: data.notes,
                    status: 'Pending',
                    created_by: user.id
                })

            if (error) throw error

            toast({
                title: 'Payment Added',
                description: 'Payment schedule entry created successfully'
            })

            form.reset()
            setOpen(false)
            onSuccess()
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to add payment',
                variant: 'destructive'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Add Payment Schedule</DialogTitle>
                        <DialogDescription>
                            Create a payment milestone for this deal
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Payment Type */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="payment_type" className="text-right">
                                Type *
                            </Label>
                            <Select
                                value={form.watch('payment_type')}
                                onValueChange={(value: any) => form.setValue('payment_type', value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAYMENT_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Percentage */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="percentage" className="text-right">
                                Percentage
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="percentage"
                                    type="number"
                                    step="0.01"
                                    {...form.register('percentage', { valueAsNumber: true })}
                                />
                                {percentage && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Amount: ₹{calculatedAmount.toLocaleString('en-IN')}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="due_date" className="text-right">
                                Due Date *
                            </Label>
                            <Input
                                id="due_date"
                                type="date"
                                className="col-span-3"
                                {...form.register('due_date')}
                            />
                        </div>

                        {/* Payment Method */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="payment_method" className="text-right">
                                Method *
                            </Label>
                            <Select
                                value={form.watch('payment_method')}
                                onValueChange={(value: any) => form.setValue('payment_method', value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAYMENT_METHODS.map((method) => (
                                        <SelectItem key={method} value={method}>
                                            {method}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* LC Fields (conditional) */}
                        {paymentMethod === 'Letter of Credit' && (
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="lc_number" className="text-right">
                                        LC Number *
                                    </Label>
                                    <Input
                                        id="lc_number"
                                        className="col-span-3"
                                        {...form.register('lc_number')}
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="lc_latest_shipment_date" className="text-right">
                                        Shipment Date *
                                    </Label>
                                    <Input
                                        id="lc_latest_shipment_date"
                                        type="date"
                                        className="col-span-3"
                                        {...form.register('lc_latest_shipment_date')}
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="lc_issuing_bank" className="text-right">
                                        Issuing Bank
                                    </Label>
                                    <Input
                                        id="lc_issuing_bank"
                                        className="col-span-3"
                                        {...form.register('lc_issuing_bank')}
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="lc_beneficiary" className="text-right">
                                        Beneficiary
                                    </Label>
                                    <Input
                                        id="lc_beneficiary"
                                        className="col-span-3"
                                        {...form.register('lc_beneficiary')}
                                    />
                                </div>
                            </>
                        )}

                        {/* Notes */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <Textarea
                                id="notes"
                                className="col-span-3"
                                rows={3}
                                {...form.register('notes')}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Payment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
