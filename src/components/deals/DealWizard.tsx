'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { DealWizardFormData, dealWizardSchema, defaultFormValues } from '@/lib/validations/deal-schema'
import { useDealMasterData, useDealCalculations } from '@/hooks/useDealCalculations'
import { Step1Sourcing } from './Step1Sourcing'
import { Step2Pricing } from './Step2Pricing'
import { Step3Profit } from './Step3Profit'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

const STEPS = [
    { number: 1, title: 'Sourcing', subtitle: 'Supplier & Commodity' },
    { number: 2, title: 'Pricing', subtitle: 'Costs & Logistics' },
    { number: 3, title: 'Profit', subtitle: 'Margin Analysis' }
]

export function DealWizard() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    // Load master data
    const { suppliers, commodities, isLoading: dataLoading } = useDealMasterData()

    // Initialize form
    const form = useForm<DealWizardFormData>({
        resolver: zodResolver(dealWizardSchema),
        defaultValues: defaultFormValues,
        mode: 'onChange'
    })

    // Get current values for calculations
    const commodityId = form.watch('commodityId')
    const commodityName = commodities.find(c => c.id === commodityId)?.name || ''

    // Calculate total landed cost for Step 3
    const calculations = useDealCalculations({
        commodityName,
        originCountry: form.watch('originCountry') || '',
        incoterm: form.watch('incoterm') || 'FOB',
        buyPriceUSD: form.watch('buyPriceUSD') || 0,
        weightMT: form.watch('weightMT') || 0,
        oceanFreightUSD: form.watch('oceanFreightUSD'),
        insuranceUSD: form.watch('insuranceUSD'),
        customsExchangeRateINR: form.watch('customsExchangeRateINR') || 0,
        localClearanceINR: form.watch('localClearanceINR') || 0,
        transportINR: form.watch('transportINR') || 0,
        targetSellPriceINR: form.watch('targetSellPriceINR')
    })

    const handleNext = async () => {
        let isValid = false

        // Validate current step fields
        if (currentStep === 1) {
            isValid = await form.trigger(['partnerId', 'originCountry', 'commodityId', 'psicFile'])
        } else if (currentStep === 2) {
            isValid = await form.trigger([
                'incoterm',
                'buyPriceUSD',
                'weightMT',
                'oceanFreightUSD',
                'insuranceUSD',
                'forwarderName',
                'shippingLineName',
                'customsExchangeRateINR',
                'localClearanceINR',
                'transportINR'
            ])
        } else if (currentStep === 3) {
            isValid = await form.trigger(['targetSellPriceINR', 'requestAdminOverride', 'overrideReason'])
        }

        if (isValid) {
            if (currentStep < 3) {
                setCurrentStep(currentStep + 1)
            }
        } else {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all required fields correctly.',
                variant: 'destructive'
            })
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async (data: DealWizardFormData) => {
        // Check margin validation
        if (calculations.isLowMargin && !data.requestAdminOverride) {
            toast({
                title: 'Low Margin',
                description: 'Please request admin override for margins below 2%.',
                variant: 'destructive'
            })
            return
        }

        setIsSubmitting(true)

        try {
            //TODO: Implement actual deal creation
            // 1. Upload PSIC file to Supabase Storage (if exists)
            // 2. Create deal record in database
            // 3. Create expense records
            // 4. Redirect to deal view page

            console.log('Deal Data:', data)
            console.log('Calculations:', calculations)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            toast({
                title: 'Success!',
                description: 'Deal created successfully.',
            })

            // Redirect to deals list
            router.push('/admin/metals')

        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create deal. Please try again.',
                variant: 'destructive'
            })
            console.error('Deal creation error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const progress = (currentStep / STEPS.length) * 100

    if (dataLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Progress Steps */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    {STEPS.map((step, idx) => (
                        <div key={step.number} className="flex-1">
                            <div className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep > step.number
                                            ? 'bg-primary border-primary text-primary-foreground'
                                            : currentStep === step.number
                                                ? 'border-primary text-primary'
                                                : 'border-muted text-muted-foreground'
                                        }`}
                                >
                                    {currentStep > step.number ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <span className="font-semibold">{step.number}</span>
                                    )}
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className={`text-sm font-semibold ${currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                                        }`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{step.subtitle}</p>
                                </div>
                                {idx < STEPS.length - 1 && (
                                    <div className={`h-0.5 w-full mx-4 ${currentStep > step.number ? 'bg-primary' : 'bg-muted'
                                        }`} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Form */}
            <Card className="p-6">
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    {/* Step Content */}
                    <div className="min-h-[500px]">
                        {currentStep === 1 && (
                            <Step1Sourcing
                                form={form}
                                suppliers={suppliers}
                                commodities={commodities}
                            />
                        )}
                        {currentStep === 2 && (
                            <Step2Pricing
                                form={form}
                                commodityName={commodityName}
                            />
                        )}
                        {currentStep === 3 && (
                            <Step3Profit
                                form={form}
                                commodityName={commodityName}
                                totalLandedCost={calculations.totalLandedCostINR}
                            />
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 1 || isSubmitting}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Previous
                        </Button>

                        <div className="text-sm text-muted-foreground">
                            Step {currentStep} of {STEPS.length}
                        </div>

                        {currentStep < 3 ? (
                            <Button type="button" onClick={handleNext}>
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    (calculations.isLowMargin && !form.watch('requestAdminOverride'))
                                }
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creating Deal...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Create Deal
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    )
}
