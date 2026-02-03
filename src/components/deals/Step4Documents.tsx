'use client'

import { UseFormReturn } from 'react-hook-form'
import { DealWizardFormData } from '@/lib/validations/deal-schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useDealCalculations } from '@/hooks/useDealCalculations'

interface Step4DocumentsProps {
    form: UseFormReturn<DealWizardFormData>
    commodityName?: string
}

const COMMON_DOCUMENTS = [
    'Commercial Invoice',
    'Packing List',
    'Bill of Lading',
    'Certificate of Origin',
    'Insurance Policy',
    'Certificate of Weight',
    'Certificate of Quality'
]

export function Step4Documents({ form, commodityName }: Step4DocumentsProps) {
    const requiredDocs = form.watch('requiredDocuments') || []

    // Mapping for calculator
    const formData = form.watch()
    const calcInputs = {
        commodityName: commodityName || '',
        incoterm: formData.incoterm || 'FOB',
        buyPriceUSD: formData.buyPrice || 0,
        weightMT: formData.weightMT || 0,
        oceanFreightUSD: formData.oceanFreight || 0,
        insuranceUSD: formData.insurance || 0,
        customsExchangeRateINR: formData.customsExchangeRate || 84.5,
        localClearanceINR: formData.localClearanceCost || 0,
        transportINR: formData.transportCost || 0,
        targetSellPriceINR: formData.targetSellPrice || 0
    }

    const {
        totalLandedCostINR,
        projectedMarginPercent,
        isLowMargin,
        isLoading
    } = useDealCalculations(calcInputs)

    const toggleDoc = (doc: string) => {
        if (requiredDocs.includes(doc)) {
            form.setValue('requiredDocuments', requiredDocs.filter(d => d !== doc))
        } else {
            form.setValue('requiredDocuments', [...requiredDocs, doc])
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Documents & Profitability
                </h2>
                <p className="text-muted-foreground">
                    Required documents and final deal summary
                </p>
            </div>

            <Card className="p-6">
                <h3 className="font-semibold mb-4">Required Documents</h3>
                <div className="grid grid-cols-2 gap-3">
                    {COMMON_DOCUMENTS.map((doc) => (
                        <div key={doc} className="flex items-center space-x-2">
                            <Checkbox
                                id={`doc-${doc}`}
                                checked={requiredDocs.includes(doc)}
                                onCheckedChange={() => toggleDoc(doc)}
                            />
                            <Label htmlFor={`doc-${doc}`} className="font-normal cursor-pointer">
                                {doc}
                            </Label>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="space-y-2">
                <Label>Additional Notes / Instructions</Label>
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Any specific instructions for this deal..."
                    {...form.register('notes')}
                />
            </div>

            {/* Landed Cost Estimates */}
            <Card className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-4">Landed Costing (Estimates)</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                        <Label>Customs Exch. Rate (INR)</Label>
                        <Input
                            type="number"
                            {...form.register('customsExchangeRate', { valueAsNumber: true })}
                            step="0.01"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>BCD %</Label>
                        <Input
                            type="number"
                            {...form.register('bcdPercent', { valueAsNumber: true })}
                            step="0.01"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>SWS % (of BCD)</Label>
                        <Input
                            type="number"
                            {...form.register('swsPercent', { valueAsNumber: true })}
                            defaultValue={10}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                        <Label>Finance Cost (INR)</Label>
                        <Input
                            type="number"
                            {...form.register('financeCost', { valueAsNumber: true })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Local Clearance (INR)</Label>
                        <Input
                            type="number"
                            {...form.register('localClearanceCost', { valueAsNumber: true })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Inland Transport (INR)</Label>
                        <Input
                            type="number"
                            {...form.register('transportCost', { valueAsNumber: true })}
                        />
                    </div>
                </div>

                <div className="border-t pt-4">
                    <div className="space-y-2">
                        <Label>Target Sell Price (INR/kg)</Label>
                        <Input
                            type="number"
                            {...form.register('targetSellPrice', { valueAsNumber: true })}
                        />
                    </div>
                </div>
            </Card>

            {/* Profit Summary Section */}
            <Card className="p-4 border-t-4 border-t-green-500">
                <h3 className="font-semibold mb-4">Deal Profitability Check</h3>

                <div className="pt-4 border-t flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                        <span>Landed Cost (INR/kg):</span>
                        <span className="font-mono">₹{totalLandedCostINR.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Projected Margin:</span>
                        <span className={`text-xl font-bold ${isLowMargin ? 'text-red-600' : 'text-green-600'}`}>
                            {projectedMarginPercent ? `${projectedMarginPercent.toFixed(2)}%` : '--'}
                        </span>
                    </div>
                    {isLowMargin && (
                        <p className="text-xs text-red-600 mt-1">Warning: Margin is below 5%. Admin approval required.</p>
                    )}
                </div>
            </Card>
        </div>
    )
}
