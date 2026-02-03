'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

const partnerSchema = z.object({
    type: z.enum(['supplier', 'customer']),
    company_name: z.string().min(1, 'Company name is required'),
    contact_person: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
})

type PartnerFormData = z.infer<typeof partnerSchema>

interface AddPartnerModalProps {
    onSuccess: () => void
}

export function AddPartnerModal({ onSuccess }: AddPartnerModalProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const form = useForm<PartnerFormData>({
        resolver: zodResolver(partnerSchema),
        defaultValues: {
            type: 'supplier',
            company_name: '',
            country: '',
            email: ''
        }
    })

    const onSubmit = async (data: PartnerFormData) => {
        setIsSubmitting(true)

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('partners')
                .insert({
                    id: uuidv4(),
                    company_name: data.company_name,
                    type: data.type === 'supplier' ? 'Supplier' : 'Customer', // Match DB enum case
                    status: 'Active',
                    contact_person: data.contact_person,
                    email: data.email || null,
                    phone: data.phone,
                    address: data.address,
                    country: data.country,
                })

            if (error) throw error

            toast({
                title: 'Success',
                description: `${data.type === 'supplier' ? 'Supplier' : 'Customer'} added successfully`,
            })

            form.reset()
            setOpen(false)
            onSuccess()
        } catch (error) {
            console.error('Error adding partner:', error)
            toast({
                title: 'Error',
                description: 'Failed to add partner. Please try again.',
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
                    Add Partner
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Add New Partner</DialogTitle>
                        <DialogDescription>
                            Add a new supplier or customer to your network
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Partner Type</Label>
                            <Select
                                value={form.watch('type')}
                                onValueChange={(value: 'supplier' | 'customer') => form.setValue('type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="supplier">Supplier</SelectItem>
                                    <SelectItem value="customer">Customer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="company_name">Company Name *</Label>
                            <Input {...form.register('company_name')} />
                            {form.formState.errors.company_name && (
                                <p className="text-xs text-destructive">{form.formState.errors.company_name.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="contact_person">Contact Person</Label>
                            <Input {...form.register('contact_person')} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input {...form.register('email')} type="email" />
                                {form.formState.errors.email && (
                                    <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input {...form.register('phone')} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="country">Country *</Label>
                            <Input {...form.register('country')} />
                            {form.formState.errors.country && (
                                <p className="text-xs text-destructive">{form.formState.errors.country.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input {...form.register('address')} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Partner'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
