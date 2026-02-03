'use client'

import { UseFormReturn } from 'react-hook-form'
import { DealWizardFormData } from '@/lib/validations/deal-schema'
import { useDealCalculations } from '@/hooks/useDealCalculations'
import { formatCurrency, formatPercentage } from '@/lib/calculations/deal-calculator'
import { TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Step3ProfitProps {
    form: UseFormReturn<DealWizardFormData>
    commodityName: string
    totalLandedCost: number
}

export function Step3Profit({ form, commodityName, totalLandedCost }: Step3ProfitProps) {
    const targetSellPriceINR = form.watch('targetSellPriceINR') || 0
    const requestAdminOverride = form.watch('requestAdminOverride') || false

    // Calculate margin
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
        targetSellPriceINR
    })

    const marginPercent = calculations.projectedMarginPercent || 0
    const isLowMargin = calculations.isLowMargin
    const profitAmount = targetSellPriceINR - totalLandedCost

    // Determine margin health
    const getMarginStatus = () => {
        if (marginPercent >= 5) {
            return { color: 'green', label: 'Healthy', icon: CheckCircle2 }
        } else if (marginPercent >= 2) {
            return { color: 'yellow', label: 'Acceptable', icon: TrendingUp }
        } else {
            return { color: 'red', label: 'Low Risk', icon: AlertTriangle }
        }
    }

    const marginStatus = getMarginStatus()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Profit Guard
                </h2>
                <p className="text-muted-foreground">
                    Set your target price and review projected margins
                </p>
            </div>

            {/* Cost Summary */}
            <Card className="p-4 bg-muted/30">
                <h3 className="font-semibold mb-3">Deal Summary</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Landed Cost:</span>
                        <span className="font-semibold">{formatCurrency(totalLandedCost)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Commodity:</span>
                        <span>{commodityName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight:</span>
                        <span>{form.watch('weightMT')?.toFixed(3)} MT</span>
                    </div>
                </div>
            </Card>

            {/* Target Sell Price */}
            <div className="space-y-2">
                <Label htmlFor="targetSellPriceINR">Target Sell Price (INR) *</Label>
                <Input
                    id="targetSellPriceINR"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={targetSellPriceINR || ''}
                    onChange={(e) =>
                        form.setValue('targetSellPriceINR', parseFloat(e.target.value) || 0, {
                            shouldValidate: true
                        })
                    }
                    className="text-lg font-semibold"
                />
                {form.formState.errors.targetSellPriceINR && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.targetSellPriceINR.message}
                    </p>
                )}
            </div>

            {/* Profit Analysis */}
            {targetSellPriceINR > 0 && (
                <Card
                    className={`p-6 border-2 ${marginStatus.color === 'green'
                            ? 'border-green-500/50 bg-green-500/5'
                            : marginStatus.color === 'yellow'
                                ? 'border-yellow-500/50 bg-yellow-500/5'
                                : 'border-red-500/50 bg-red-500/5'
                        }`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        {marginStatus.color === 'green' ? (
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        ) : marginStatus.color === 'yellow' ? (
                            <TrendingUp className="h-8 w-8 text-yellow-500" />
                        ) : (
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        )}
                        <div>
                            <h3 className="text-xl font-bold">
                                {formatPercentage(marginPercent)} Margin
                            </h3>
                            <p className={`text-sm ${marginStatus.color === 'green'
                                    ? 'text-green-600'
                                    : marginStatus.color === 'yellow'
                                        ? 'text-yellow-600'
                                        : 'text-red-600'
                                }`}>
                                {marginStatus.label}
                            </p>
                        </div>
                    </div>

                    <Progress
                        value={Math.min(marginPercent, 100)}
                        className="h-3 mb-4"
                    />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Profit Amount</p>
                            <p className={`text-lg font-bold ${profitAmount >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {formatCurrency(profitAmount)}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Per MT</p>
                            <p className="text-lg font-bold">
                                {form.watch('weightMT')
                                    ? formatCurrency(profitAmount / form.watch('weightMT')!)
                                    : '—'}
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Low Margin Warning */}
            {isLowMargin && (
                <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-700 dark:text-red-400">
                        <strong>Low Margin Warning:</strong> This deal has a margin below 2%. Admin override required to proceed.
                    </AlertDescription>
                </Alert>
            )}

            {/* Admin Override Section */}
            {isLowMargin && (
                <div className="space-y-4 p-4 border-2 border-amber-500/50 rounded-lg bg-amber-500/5">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="requestAdminOverride"
                            checked={requestAdminOverride}
                            onCheckedChange={(checked) =>
                                form.setValue('requestAdminOverride', checked as boolean, {
                                    shouldValidate: true
                                })
                            }
                        />
                        <div className="space-y-1">
                            <Label
                                htmlFor="requestAdminOverride"
                                className="text-base font-semibold cursor-pointer"
                            >
                                Request Admin Override
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                This deal will be flagged for admin approval before execution
                            </p>
                        </div>
                    </div>

                    {requestAdminOverride && (
                        <div className="space-y-2">
                            <Label htmlFor="overrideReason">Justification *</Label>
                            <Textarea
                                id="overrideReason"
                                placeholder="Explain why this low-margin deal should be approved (e.g., strategic partnership, market positioning, etc.)"
                                value={form.watch('overrideReason') || ''}
                                onChange={(e) => form.setValue('overrideReason', e.target.value, {
                                    shouldValidate: true
                                })}
                                rows={4}
                            />
                            {form.formState.errors.overrideReason && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.overrideReason.message}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Additional Notes */}
            <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                    id="notes"
                    placeholder="Any additional information about this deal..."
                    value={form.watch('notes') || ''}
                    onChange={(e) => form.setValue('notes', e.target.value)}
                    rows={3}
                />
            </div>

            {/* Success Message */}
            {marginPercent >= 5 && (
                <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700 dark:text-green-400">
                        <strong>Excellent!</strong> This deal meets all profitability requirements.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}
