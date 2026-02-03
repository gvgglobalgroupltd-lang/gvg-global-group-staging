'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    dealWizardSchema,
    defaultFormValues,
    DealWizardFormData,
    step1Schema,
    step2Schema,
    step3Schema,
    step4Schema
} from '@/lib/validations/deal-schema'
import { useDealMasterData } from '@/hooks/useDealCalculations'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react'

// Steps
import { Step1Sourcing } from './Step1Sourcing'
import { Step2Pricing } from './Step2Pricing'
import { Step3Logistics } from './Step3Logistics'
import { Step4Documents } from './Step4Documents'

const STEPS = [
    { id: 'sourcing', title: 'Sourcing', schema: step1Schema },
    { id: 'pricing', title: 'Pricing & Payment', schema: step2Schema },
    { id: 'logistics', title: 'Logistics', schema: step3Schema },
    { id: 'review', title: 'Review', schema: step4Schema }
]

export function DealWizard() {
    const router = useRouter()
    const { toast } = useToast()
    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { suppliers, commodities, isLoading: isLoadingMasterData } = useDealMasterData()

    const form = useForm<DealWizardFormData>({
        resolver: zodResolver(dealWizardSchema) as any,
        defaultValues: defaultFormValues,
        mode: 'onChange'
    })

    const handleNext = async () => {
        const step = STEPS[currentStep]
        const fields = Object.keys(step.schema.shape) as any[]

        // Trigger validation for current step fields
        const isValid = await form.trigger(fields)

        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
        } else {
            toast({
                title: 'Validation Error',
                description: 'Please fix the errors in the form before proceeding.',
                variant: 'destructive'
            })
        }
    }

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0))
    }

    const onSubmit = async (data: DealWizardFormData) => {
        setIsSubmitting(true)
        try {
            const supabase = createClient()

            // Generate sequential Ref (mock logic for now, or DB trigger)
            const dealRef = `D-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

            const { error } = await supabase.from('deals').insert({
                deal_ref: dealRef,
                status: 'Draft',
                trader_id: (await supabase.auth.getUser()).data.user?.id!,
                partner_id: data.partnerId,
                commodity_id: data.commodityId,
                origin_country: data.originCountry,
                incoterm: data.incoterm,

                // Pricing
                buy_price: data.buyPrice,
                currency: data.currency,
                weight_mt: data.weightMT,
                exchange_rate_locked: data.customsExchangeRate,

                // Logistics
                logistics_type: 'Self_Managed', // Default for now
                destination_type: 'Warehouse', // Default for now
                port_of_loading: data.portOfLoading,
                port_of_discharge: data.portOfDischarge,
                shipment_period_start: data.shipmentPeriodStart || null,
                shipment_period_end: data.shipmentPeriodEnd || null,
                partial_shipment_allowed: data.partialShipment,
                transshipment_allowed: data.transshipment,

                // Payment
                payment_method: data.paymentMethod,
                payment_terms_desc: data.paymentTermsDesc,
                advance_percentage: data.advancePercent,
                balance_percentage: data.balancePercent,
                lc_number: data.lcNumber || null,
                issuing_bank: data.issuingBank || null,

                // Product Quality
                packaging_type: data.packagingType || null,
                quantity_tolerance_percent: data.quantityTolerance || 0,
                quality_specs: data.qualitySpecs ? { description: data.qualitySpecs } : {},

                // Docs
                required_documents: data.requiredDocuments,
                notes: data.notes
            })

            if (error) throw error

            toast({
                title: 'Deal Created Successfully',
                description: `Reference: ${dealRef}`,
            })

            router.push('/admin/deals')

        } catch (error: any) {
            console.error('Submission error:', error)
            toast({
                title: 'Error Creating Deal',
                description: error.message,
                variant: 'destructive'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoadingMasterData) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Create New Deal</h1>

            {/* Step Indicators */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10" />
                {STEPS.map((step, index) => {
                    const isCompleted = index < currentStep
                    const isCurrent = index === currentStep

                    return (
                        <div key={step.id} className="flex flex-col items-center bg-background px-2">
                            <div
                                className={`
                                    w-10 h-10 rounded-full flex items-center justify-center border-2 
                                    ${isCompleted ? 'bg-primary border-primary text-primary-foreground' :
                                        isCurrent ? 'border-primary text-primary' : 'border-muted text-muted-foreground'}
                                    transition-colors duration-200
                                `}
                            >
                                {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <span>{index + 1}</span>}
                            </div>
                            <span className={`mt-2 text-sm font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {step.title}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Form Content */}
            <Card className="p-6 min-h-[500px]">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="mb-8">
                        {currentStep === 0 && (
                            <Step1Sourcing
                                form={form}
                                suppliers={suppliers}
                                commodities={commodities}
                            />
                        )}
                        {currentStep === 1 && (
                            <Step2Pricing form={form} />
                        )}
                        {currentStep === 2 && (
                            <Step3Logistics form={form} />
                        )}
                        {currentStep === 3 && (
                            <Step4Documents
                                form={form}
                                // Pass commodity name for calculator context
                                commodityName={commodities.find(c => c.id === form.getValues('commodityId'))?.name}
                            />
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 0 || isSubmitting}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>

                        {currentStep < STEPS.length - 1 ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                            >
                                Next Step
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Deal'
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    )
}
