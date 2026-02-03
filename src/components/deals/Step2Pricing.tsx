'use client'

import { UseFormReturn } from 'react-hook-form'
import { DealWizardFormData } from '@/lib/validations/deal-schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'

interface Step2PricingProps {
    form: UseFormReturn<DealWizardFormData>
}

export function Step2Pricing({ form }: Step2PricingProps) {
    const paymentMethod = form.watch('paymentMethod')
    const incoterm = form.watch('incoterm')
    const currency = form.watch('currency')

    const isFob = incoterm === 'FOB'

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Pricing & Payment
                </h2>
                <p className="text-muted-foreground">
                    Define financial terms, incoterms, and payment structure
                </p>
            </div>

            {/* Price & Quantity */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Buy Price ({currency}) *</Label>
                    <Input
                        type="number"
                        {...form.register('buyPrice', { valueAsNumber: true })}
                        step="0.01"
                    />
                    {form.formState.errors.buyPrice && (
                        <p className="text-xs text-destructive">{form.formState.errors.buyPrice.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Weight (MT) *</Label>
                    <Input
                        type="number"
                        {...form.register('weightMT', { valueAsNumber: true })}
                        step="0.001"
                    />
                    {form.formState.errors.weightMT && (
                        <p className="text-xs text-destructive">{form.formState.errors.weightMT.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                        value={form.watch('currency')}
                        onValueChange={(value: any) => form.setValue('currency', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {['USD', 'EUR', 'GBP', 'INR', 'AED', 'CAD'].map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Incoterm</Label>
                    <Select
                        value={form.watch('incoterm')}
                        onValueChange={(value: any) => form.setValue('incoterm', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="FOB">FOB (Free On Board)</SelectItem>
                            <SelectItem value="CIF">CIF (Cost, Insurance & Freight)</SelectItem>
                            <SelectItem value="EXW">EXW (Ex Works)</SelectItem>
                            <SelectItem value="DDP">DDP (Delivered Duty Paid)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Logistics Costs (Conditional) */}
            {(isFob || incoterm === 'EXW') && (
                <Card className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
                    <h3 className="text-sm font-semibold mb-3 text-blue-700 dark:text-blue-300">Logistics Add-ons</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Ocean Freight ({currency})</Label>
                            <Input
                                type="number"
                                {...form.register('oceanFreight', { valueAsNumber: true })}
                                placeholder="0.00"
                            />
                            {form.formState.errors.oceanFreight && (
                                <p className="text-xs text-destructive">{form.formState.errors.oceanFreight.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Insurance ({currency})</Label>
                            <Input
                                type="number"
                                {...form.register('insurance', { valueAsNumber: true })}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </Card>
            )}



            {/* Payment Terms */}
            <Card className="p-4 bg-muted/30">
                <h3 className="font-semibold mb-4">Payment Structure</h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <Select
                            value={form.watch('paymentMethod')}
                            onValueChange={(value: any) => form.setValue('paymentMethod', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TT">T/T (Telegraphic Transfer)</SelectItem>
                                <SelectItem value="LC">L/C (Letter of Credit)</SelectItem>
                                <SelectItem value="CAD">CAD (Cash Against Docs)</SelectItem>
                                <SelectItem value="DP">D/P (Documents against Payment)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Advance %</Label>
                            <Input
                                type="number"
                                {...form.register('advancePercent', { valueAsNumber: true })}
                                max={100}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Balance %</Label>
                            <Input
                                type="number"
                                {...form.register('balancePercent', { valueAsNumber: true })}
                                max={100}
                            />
                        </div>
                    </div>
                </div>

                {/* LC Specific Fields */}
                {paymentMethod === 'LC' && (
                    <div className="mt-4 pt-4 border-t space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>LC Number</Label>
                                <Input {...form.register('lcNumber')} placeholder="LC-2024-..." />
                            </div>
                            <div className="space-y-2">
                                <Label>LC Expiry Date</Label>
                                <Input type="date" {...form.register('lcExpiryDate')} />
                            </div>
                            <div className="space-y-2">
                                <Label>Issuing Bank</Label>
                                <Input {...form.register('issuingBank')} placeholder="Bank Name" />
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-4 space-y-2">
                    <Label>Payment Terms Notes</Label>
                    <Input
                        {...form.register('paymentTerms')}
                        placeholder="e.g. 20% Advance, 80% upon copy of BL"
                    />
                </div>
            </Card>
        </div>
    )
}
