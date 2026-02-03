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
    expenseSchema,
    type ExpenseFormData,
    EXPENSE_TYPES
} from '@/lib/validations/payment-schema'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

interface AddExpenseModalProps {
    dealId: string
    onSuccess: () => void
}

export function AddExpenseModal({ dealId, onSuccess }: AddExpenseModalProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const form = useForm<ExpenseFormData>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            expense_type: 'Freight',
            paid_date: new Date().toISOString().split('T')[0]
        }
    })

    const onSubmit = async (data: ExpenseFormData) => {
        setIsSubmitting(true)

        try {
            const supabase = createClient()

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('deal_expenses_actual')
                .insert({
                    deal_id: dealId,
                    expense_type: data.expense_type,
                    description: data.description,
                    amount_inr: data.amount_inr,
                    amount_usd: data.amount_usd,
                    paid_date: data.paid_date,
                    vendor_name: data.vendor_name,
                    invoice_number: data.invoice_number,
                    notes: data.notes,
                    created_by: user.id
                })

            if (error) throw error

            toast({
                title: 'Expense Added',
                description: 'Actual expense recorded successfully'
            })

            form.reset()
            setOpen(false)
            onSuccess()
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to add expense',
                variant: 'destructive'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Add Actual Expense</DialogTitle>
                        <DialogDescription>
                            Record an actual cost incurred for this deal
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="expense_type" className="text-right">
                                Type *
                            </Label>
                            <Select
                                value={form.watch('expense_type')}
                                onValueChange={(value) => form.setValue('expense_type', value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {EXPENSE_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description *
                            </Label>
                            <Input
                                id="description"
                                className="col-span-3"
                                {...form.register('description')}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount_inr" className="text-right">
                                Amount (INR) *
                            </Label>
                            <Input
                                id="amount_inr"
                                type="number"
                                step="0.01"
                                className="col-span-3"
                                {...form.register('amount_inr', { valueAsNumber: true })}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="paid_date" className="text-right">
                                Paid Date *
                            </Label>
                            <Input
                                id="paid_date"
                                type="date"
                                className="col-span-3"
                                {...form.register('paid_date')}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="vendor_name" className="text-right">
                                Vendor
                            </Label>
                            <Input
                                id="vendor_name"
                                className="col-span-3"
                                {...form.register('vendor_name')}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="invoice_number" className="text-right">
                                Invoice #
                            </Label>
                            <Input
                                id="invoice_number"
                                className="col-span-3"
                                {...form.register('invoice_number')}
                            />
                        </div>

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
                            {isSubmitting ? 'Adding...' : 'Add Expense'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
