'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    dealWizardSchema,
    defaultFormValues,
    DealWizardFormData,
    step1Schema,
    step2Schema,
    step2Base,
    step3Schema,
    step4Schema
} from '@/lib/validations/deal-schema'
import { updateDeal } from '@/actions/deals'
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
    { id: 'sourcing', title: 'Sourcing', schema: step1Schema, baseSchema: step1Schema },
    { id: 'pricing', title: 'Pricing & Payment', schema: step2Schema, baseSchema: step2Base },
    { id: 'logistics', title: 'Logistics', schema: step3Schema, baseSchema: step3Schema },
    { id: 'review', title: 'Review', schema: step4Schema, baseSchema: step4Schema }
]

interface DealWizardProps {
    dealId?: string
    initialData?: DealWizardFormData
}

export function DealWizard({ dealId, initialData }: DealWizardProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [canSubmit, setCanSubmit] = useState(false)
    const { suppliers, commodities, isLoading: isLoadingMasterData } = useDealMasterData()

    const form = useForm<DealWizardFormData>({
        resolver: zodResolver(dealWizardSchema) as any,
        defaultValues: initialData || defaultFormValues,
        mode: 'onChange'
    })

    // Enable submit button after a delay when entering the last step
    // This prevents accidental double-clicks on "Next" triggering "Submit"
    useEffect(() => {
        if (currentStep === STEPS.length - 1) {
            setCanSubmit(false)
            const timer = setTimeout(() => {
                setCanSubmit(true)
            }, 1000) // 1 second cooldown
            return () => clearTimeout(timer)
        }
    }, [currentStep])

    // Ensure form is reset if initialData changes or arrives late
    useEffect(() => {
        if (initialData) {
            console.log('Resetting form with initialData:', initialData)
            form.reset(initialData)
        }
    }, [initialData, form])

    const handleNext = async () => {
        const step = STEPS[currentStep]
        // Use baseSchema for retrieving field keys (avoids ZodEffects .shape issue)
        const baseSchema = (step as any).baseSchema || step.schema
        const fields = Object.keys(baseSchema.shape) as any[]

        // Trigger basic field validation (UI feedback)
        const isBaseValid = await form.trigger(fields)

        // Perform full schema validation (including refinements like Sum=100%)
        const fullValidation = step.schema.safeParse(form.getValues())
        const isValid = isBaseValid && fullValidation.success

        if (isValid) {
            console.log('✅ Validation passed, advancing to next step')
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
        } else {
            console.log('❌ Validation failed')

            // Collect error messages
            const errorMessages = new Set<string>()
            if (!isBaseValid) {
                // Get errors from form state
                Object.keys(form.formState.errors).forEach(key => {
                    const message = (form.formState.errors as any)[key]?.message
                    if (message) errorMessages.add(message)
                })
            }

            if (!fullValidation.success) {
                fullValidation.error.issues.forEach((issue) => {
                    if (issue.path.length > 0) {
                        const fieldName = issue.path[0] as any
                        form.setError(fieldName, {
                            type: 'manual',
                            message: issue.message
                        })
                        errorMessages.add(issue.message)
                    }
                })
            }

            const errorList = Array.from(errorMessages).join(', ')

            toast({
                title: 'Validation Error',
                description: `Please fix the following: ${errorList || 'Check highlighted fields'}`,
                variant: 'destructive',
                duration: 5000
            })
        }
    }

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0))
    }

    const onSubmit = async (data: DealWizardFormData) => {
        if (isSubmitting) return
        setIsSubmitting(true)
        try {
            const supabase = createClient()

            if (dealId) {
                // UPDATE MODE
                // Map form data to DB columns
                const updatePayload = {
                    partner_id: data.partnerId,
                    commodity_id: data.commodityId,
                    origin_country: data.originCountry,
                    validity_date: data.validityDate || null,
                    incoterm: data.incoterm,
                    buy_price: data.buyPrice,
                    currency: data.currency,
                    weight_mt: data.weightMT,
                    exchange_rate_locked: data.customsExchangeRate,
                    logistics_type: 'Self_Managed',
                    destination_type: 'Warehouse',
                    port_of_loading: data.portOfLoading,
                    port_of_discharge: data.portOfDischarge,
                    shipment_period_start: data.shipmentPeriodStart || null,
                    shipment_period_end: data.shipmentPeriodEnd || null,
                    partial_shipment_allowed: data.partialShipment,
                    transshipment_allowed: data.transshipment,
                    free_days_detention: data.freeDays,
                    shipping_line: data.shippingLine,
                    freight_forwarder: data.freightForwarder,
                    pol: data.portOfLoading,
                    pod: data.portOfDischarge,
                    payment_method: data.paymentMethod,
                    payment_terms: data.paymentTerms,
                    advance_percentage: data.advancePercent,
                    balance_percentage: data.balancePercent,
                    lc_number: data.lcNumber || null,
                    lc_expiry_date: data.lcExpiryDate || null,
                    issuing_bank: data.issuingBank || null,
                    packing_type: data.packagingType || null,
                    isri_code: data.isriCode,
                    guaranteed_recovery_rate: data.guaranteedRecovery,
                    moisture_tolerance: data.moistureTolerance,
                    dust_tolerance: data.dustTolerance,
                    quantity_tolerance_percent: data.quantityTolerance || 0,
                    quality_specs: data.qualitySpecs,
                    claims_days: data.claimsDays,
                    weight_franchise: data.weightFranchise,
                    cost_ocean_freight: data.oceanFreight || 0,
                    cost_insurance: data.insurance || 0,
                    cost_customs_rate: data.customsExchangeRate,
                    cost_bcd_percent: data.bcdPercent,
                    cost_sws_percent: data.swsPercent,
                    cost_finance: data.financeCost,
                    required_documents: data.requiredDocuments,
                    notes: data.notes
                }

                await updateDeal(dealId, updatePayload)

                toast({
                    title: 'Deal Updated',
                    description: 'Changes have been saved successfully.',
                    duration: 3000,
                })

                router.push(`/admin/deals/${dealId}`)
            } else {
                // CREATE MODE
                // Generate sequential Ref (mock logic for now, or DB trigger)
                const dealRef = `D-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

                const { error } = await (supabase.from('deals') as any).insert({
                    deal_ref: dealRef,
                    status: 'Draft',
                    trader_id: (await supabase.auth.getUser()).data.user?.id!,
                    partner_id: data.partnerId,
                    commodity_id: data.commodityId,
                    origin_country: data.originCountry,
                    validity_date: data.validityDate || null,
                    incoterm: data.incoterm,

                    // Pricing
                    buy_price: data.buyPrice,
                    currency: data.currency,
                    weight_mt: data.weightMT,
                    exchange_rate_locked: data.customsExchangeRate,

                    // Logistics
                    logistics_type: 'Self_Managed',
                    destination_type: 'Warehouse',
                    port_of_loading: data.portOfLoading,
                    port_of_discharge: data.portOfDischarge,
                    shipment_period_start: data.shipmentPeriodStart || null,
                    shipment_period_end: data.shipmentPeriodEnd || null,
                    partial_shipment_allowed: data.partialShipment,
                    transshipment_allowed: data.transshipment,
                    free_days_detention: data.freeDays,
                    shipping_line: data.shippingLine,
                    freight_forwarder: data.freightForwarder,
                    pol: data.portOfLoading, // Redundant but requested in schema
                    pod: data.portOfDischarge, // Redundant but requested in schema

                    // Payment
                    payment_method: data.paymentMethod,
                    payment_terms: data.paymentTerms,
                    advance_percentage: data.advancePercent,
                    balance_percentage: data.balancePercent,
                    lc_number: data.lcNumber || null,
                    lc_expiry_date: data.lcExpiryDate || null,
                    issuing_bank: data.issuingBank || null,

                    // Product Quality & Specs
                    packing_type: data.packagingType || null,
                    isri_code: data.isriCode,
                    guaranteed_recovery_rate: data.guaranteedRecovery,
                    moisture_tolerance: data.moistureTolerance,
                    dust_tolerance: data.dustTolerance,
                    quantity_tolerance_percent: data.quantityTolerance || 0,
                    quality_specs: data.qualitySpecs,

                    // Agreement
                    claims_days: data.claimsDays,
                    weight_franchise: data.weightFranchise,

                    // Costing (Estimates)
                    cost_ocean_freight: data.oceanFreight || 0,
                    cost_insurance: data.insurance || 0,
                    cost_customs_rate: data.customsExchangeRate,
                    cost_bcd_percent: data.bcdPercent,
                    cost_sws_percent: data.swsPercent,
                    cost_finance: data.financeCost,

                    // Docs
                    required_documents: data.requiredDocuments,
                    notes: data.notes
                } as any)

                if (error) throw error

                // Create Payment Records
                const dealId = (data as any)[0]?.id // Assuming Supabase returns created object if .select() is used

                // Re-fetch deal ID if not returned above (insert doesn't return data by default without select)
                const { data: createdDeal, error: fetchError } = await (supabase
                    .from('deals') as any)
                    .select('id')
                    .eq('deal_ref', dealRef)
                    .single() as any

                if (fetchError || !createdDeal) {
                    console.error('Failed to fetch created deal for payments:', fetchError)
                    // Don't block flow, but log error
                } else {
                    const payments = []
                    // Calculate total cost approx from form data if column missing in DB
                    const totalCost = (data.buyPrice * data.weightMT) || 0

                    // Map form payment method to DB allowed values for deal_payments
                    const methodMap: Record<string, string> = {
                        'TT': 'Wire Transfer',
                        'LC': 'Letter of Credit',
                        'CAD': 'Cash',
                        'DP': 'Other'
                    }
                    const dbPaymentMethod = methodMap[data.paymentMethod] || 'Other'

                    // 1. Advance Payment
                    if (data.advancePercent > 0) {
                        payments.push({
                            deal_id: createdDeal.id,
                            payment_type: 'Advance',
                            percentage: data.advancePercent,
                            amount_usd: (data.buyPrice * data.weightMT * (data.advancePercent / 100)), // Approximate
                            due_date: new Date().toISOString(), // Due immediately
                            status: 'Pending',
                            payment_method: dbPaymentMethod,
                            created_by: (await supabase.auth.getUser()).data.user?.id!
                        })
                    }

                    // 2. Balance Payment
                    if (data.balancePercent > 0) {
                        payments.push({
                            deal_id: createdDeal.id,
                            payment_type: 'Balance',
                            percentage: data.balancePercent,
                            amount_usd: (data.buyPrice * data.weightMT * (data.balancePercent / 100)),
                            due_date: data.shipmentPeriodEnd || new Date().toISOString(), // Due on shipment/arrival
                            status: 'Pending',
                            payment_method: dbPaymentMethod,
                            created_by: (await supabase.auth.getUser()).data.user?.id!
                        })
                    }

                    if (payments.length > 0) {
                        const { error: payError } = await (supabase.from('deal_payments') as any).insert(payments) as any
                        if (payError) console.error('Failed to create payment records:', payError)
                    }
                }

                toast({
                    title: 'Deal Created Successfully',
                    description: `Reference: ${dealRef}`,
                    duration: 3000,
                })

                router.push('/admin/deals')
            }

        } catch (error: any) {
            console.error('Submission error:', error)
            toast({
                title: 'Error Saving Deal',
                description: error.message,
                variant: 'destructive',
                duration: 5000,
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
            <h1 className="text-3xl font-bold mb-8">{dealId ? 'Edit Deal' : 'Create New Deal'}</h1>

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
                                className="bg-green-600 hover:bg-green-700"
                                data-testid="submit-deal-button"
                                disabled={isSubmitting || !canSubmit}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {dealId ? 'Saving...' : 'Creating...'}
                                    </>
                                ) : (
                                    dealId ? 'Save Changes' : 'Create Deal'
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    )
}
