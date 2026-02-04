'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { submitInquiry } from '@/app/actions/inquiries'
import { Loader2, CheckCircle2 } from 'lucide-react'

const inquirySchema = z.object({
    fullName: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    companyName: z.string().optional(),
    inquiryType: z.enum(['Quote', 'General', 'Partnership']),
    message: z.string().min(10, 'Message must be at least 10 characters')
})

type InquiryFormValues = z.infer<typeof inquirySchema>

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const { toast } = useToast()

    const form = useForm<InquiryFormValues>({
        resolver: zodResolver(inquirySchema),
        defaultValues: {
            inquiryType: 'General',
            message: ''
        }
    })

    const onSubmit = async (data: InquiryFormValues) => {
        setIsSubmitting(true)
        try {
            const result = await submitInquiry(data)

            if (!result.success) {
                throw new Error(result.error)
            }

            setIsSuccess(true)
            toast({
                title: "Inquiry Sent!",
                description: "We've received your message and will respond shortly.",
                variant: 'default'
            })
            form.reset()
        } catch (error: any) {
            toast({
                title: "Submission Failed",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">Message Sent!</h3>
                <p className="text-emerald-700 dark:text-emerald-300 mb-6">
                    Thank you for contacting GVG Global. Our team will review your inquiry and get back to you within 24 hours.
                </p>
                <Button
                    variant="outline"
                    onClick={() => setIsSuccess(false)}
                    className="border-emerald-600 text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-800"
                >
                    Send Another Message
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" {...form.register('fullName')} placeholder="John Doe" />
                    {form.formState.errors.fullName && (
                        <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" {...form.register('email')} placeholder="john@company.com" />
                    {form.formState.errors.email && (
                        <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" {...form.register('phone')} placeholder="+1 (555) 000-0000" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" {...form.register('companyName')} placeholder="Acme Trading Ltd." />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="inquiryType">Subject / Type *</Label>
                <Select
                    onValueChange={(val: any) => form.setValue('inquiryType', val)}
                    defaultValue="General"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="General">General Inquiry</SelectItem>
                        <SelectItem value="Quote">Request for Quote (Buy/Sell)</SelectItem>
                        <SelectItem value="Partnership">Partnership Proposal</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                    id="message"
                    {...form.register('message')}
                    placeholder="Tell us about your requirements (e.g., Commodity, Quantity, Port)..."
                    className="min-h-[120px]"
                />
                {form.formState.errors.message && (
                    <p className="text-xs text-red-500">{form.formState.errors.message.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                    </>
                ) : (
                    'Send Message'
                )}
            </Button>
        </form>
    )
}
