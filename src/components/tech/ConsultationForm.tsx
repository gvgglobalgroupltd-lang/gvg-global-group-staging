'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    itLeadSchema,
    type ITLeadFormData,
    IT_SERVICES,
    BUDGET_RANGES,
    TIMELINES
} from '@/lib/validations/it-lead-schema'
import { createClient } from '@/lib/supabase/client'

export function ConsultationForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<ITLeadFormData>({
        resolver: zodResolver(itLeadSchema),
        defaultValues: {
            service_interest: 'Custom ERP Development'
        }
    })

    const onSubmit = async (data: ITLeadFormData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const supabase = createClient()

            const { error: submitError } = await supabase
                .from('it_leads')
                .insert({
                    company_name: data.company_name,
                    contact_person: data.contact_person,
                    email: data.email,
                    phone: data.phone,
                    service_interest: data.service_interest,
                    project_description: data.project_description,
                    budget_range: data.budget_range,
                    timeline: data.timeline,
                    status: 'New',
                    source: 'Website'
                })

            if (submitError) throw submitError

            setIsSuccess(true)
            form.reset()
        } catch (err) {
            console.error('Form submission error:', err)
            setError(err instanceof Error ? err.message : 'Failed to submit request')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">
                        Request Received!
                    </h3>
                    <p className="text-green-700 dark:text-green-300">
                        Thank you for your interest in GVG Tech services. Our team will review your request and contact you within 24-48 hours.
                    </p>
                    <div className="pt-4 border-t border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                            Need immediate assistance?
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            📧 tech@gvgglobal.com | 📞 +91-XXX-XXX-XXXX
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setIsSuccess(false)}
                        className="mt-4"
                    >
                        Submit Another Request
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-6 md:p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <h3 className="text-2xl font-bold mb-2">Request a Consultation</h3>
                    <p className="text-muted-foreground">
                        Fill out the form below and our experts will get back to you shortly.
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Company Name */}
                <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                        id="company_name"
                        placeholder="Enter your company name"
                        {...form.register('company_name')}
                    />
                    {form.formState.errors.company_name && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.company_name.message}
                        </p>
                    )}
                </div>

                {/* Contact Person */}
                <div className="space-y-2">
                    <Label htmlFor="contact_person">Contact Person *</Label>
                    <Input
                        id="contact_person"
                        placeholder="Your name"
                        {...form.register('contact_person')}
                    />
                    {form.formState.errors.contact_person && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.contact_person.message}
                        </p>
                    )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="email@company.com"
                            {...form.register('email')}
                        />
                        {form.formState.errors.email && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+91-XXX-XXX-XXXX"
                            {...form.register('phone')}
                        />
                    </div>
                </div>

                {/* Service Interest */}
                <div className="space-y-2">
                    <Label htmlFor="service_interest">Service of Interest *</Label>
                    <Select
                        value={form.watch('service_interest')}
                        onValueChange={(value: any) => form.setValue('service_interest', value)}
                    >
                        <SelectTrigger id="service_interest">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {IT_SERVICES.map((service) => (
                                <SelectItem key={service} value={service}>
                                    {service}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.formState.errors.service_interest && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.service_interest.message}
                        </p>
                    )}
                </div>

                {/* Budget & Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="budget_range">Budget Range</Label>
                        <Select
                            value={form.watch('budget_range')}
                            onValueChange={(value) => form.setValue('budget_range', value)}
                        >
                            <SelectTrigger id="budget_range">
                                <SelectValue placeholder="Select budget range..." />
                            </SelectTrigger>
                            <SelectContent>
                                {BUDGET_RANGES.map((range) => (
                                    <SelectItem key={range} value={range}>
                                        {range}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="timeline">Project Timeline</Label>
                        <Select
                            value={form.watch('timeline')}
                            onValueChange={(value) => form.setValue('timeline', value)}
                        >
                            <SelectTrigger id="timeline">
                                <SelectValue placeholder="Select timeline..." />
                            </SelectTrigger>
                            <SelectContent>
                                {TIMELINES.map((time) => (
                                    <SelectItem key={time} value={time}>
                                        {time}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Project Description */}
                <div className="space-y-2">
                    <Label htmlFor="project_description">Project Description *</Label>
                    <Textarea
                        id="project_description"
                        placeholder="Tell us about your project requirements..."
                        rows={5}
                        {...form.register('project_description')}
                    />
                    {form.formState.errors.project_description && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.project_description.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4 mr-2" />
                            Request Consultation
                        </>
                    )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    By submitting this form, you agree to our privacy policy and terms of service.
                </p>
            </form>
        </Card>
    )
}
