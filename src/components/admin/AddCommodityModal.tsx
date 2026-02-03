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
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

const commoditySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    hscode: z.string().min(1, 'HS Code is required'),
    description: z.string().optional(),
})

type CommodityFormData = z.infer<typeof commoditySchema>

interface AddCommodityModalProps {
    onSuccess: () => void
}

export function AddCommodityModal({ onSuccess }: AddCommodityModalProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const form = useForm<CommodityFormData>({
        resolver: zodResolver(commoditySchema),
        defaultValues: {
            name: '',
            hscode: '',
            description: ''
        }
    })

    const onSubmit = async (data: CommodityFormData) => {
        setIsSubmitting(true)

        try {
            const supabase = createClient()

            const { error } = await supabase
                .from('commodities')
                .insert({
                    id: uuidv4(),
                    name: data.name,
                    hscode: data.hscode,
                    description: data.description,
                })

            if (error) throw error

            toast({
                title: 'Success',
                description: 'Commodity added successfully',
            })

            form.reset()
            setOpen(false)
            onSuccess()
        } catch (error) {
            console.error('Error adding commodity:', error)
            toast({
                title: 'Error',
                description: 'Failed to add commodity. Please try again.',
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
                    Add Commodity
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Add New Commodity</DialogTitle>
                        <DialogDescription>
                            Add a new trading commodity to the master list
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Commodity Name *</Label>
                            <Input {...form.register('name')} placeholder="e.g. Copper Millberry" />
                            {form.formState.errors.name && (
                                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="hscode">HS Code *</Label>
                            <Input {...form.register('hscode')} placeholder="e.g. 7403.11" />
                            {form.formState.errors.hscode && (
                                <p className="text-xs text-destructive">{form.formState.errors.hscode.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input {...form.register('description')} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Commodity'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
