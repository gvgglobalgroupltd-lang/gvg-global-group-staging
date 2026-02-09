'use client'

import { UseFormReturn } from 'react-hook-form'
import { DealWizardFormData } from '@/lib/validations/deal-schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'

interface Step3LogisticsProps {
    form: UseFormReturn<DealWizardFormData>
}

export function Step3Logistics({ form }: Step3LogisticsProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Logistics & Shipment
                </h2>
                <p className="text-muted-foreground">
                    Define shipping ports, periods, and constraints
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Port of Loading (POL) <span className="text-destructive">*</span></Label>
                    <Input id="portOfLoading" {...form.register('portOfLoading')} placeholder="e.g. Mundra, India" />
                    {form.formState.errors.portOfLoading && (
                        <p className="text-xs text-destructive">{form.formState.errors.portOfLoading.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Port of Discharge (POD) <span className="text-destructive">*</span></Label>
                    <Input id="portOfDischarge" {...form.register('portOfDischarge')} placeholder="e.g. Jebel Ali, UAE" />
                    {form.formState.errors.portOfDischarge && (
                        <p className="text-xs text-destructive">{form.formState.errors.portOfDischarge.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Latest Shipment Date (LDS)</Label>
                    <Input
                        type="date"
                        {...form.register('shipmentPeriodEnd')}
                    />
                </div>

                <div className="space-y-4 pt-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="partial"
                            checked={form.watch('partialShipment')}
                            onCheckedChange={(c) => form.setValue('partialShipment', c as boolean)}
                        />
                        <Label htmlFor="partial" className="font-normal cursor-pointer">
                            Partial Shipment Allowed
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="transshipment"
                            checked={form.watch('transshipment')}
                            onCheckedChange={(c) => form.setValue('transshipment', c as boolean)}
                        />
                        <Label htmlFor="transshipment" className="font-normal cursor-pointer">
                            Transshipment Allowed
                        </Label>
                    </div>
                </div>
            </div>

            {/* Service Providers */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Shipping Line</Label>
                    <Input {...form.register('shippingLine')} placeholder="e.g. Maersk" />
                </div>
                <div className="space-y-2">
                    <Label>Freight Forwarder</Label>
                    <Input {...form.register('freightForwarder')} placeholder="Contact Person / Company" />
                </div>
            </div>

            {/* Terms & Conditions */}
            <Card className="p-4 bg-muted/40">
                <h3 className="text-sm font-semibold mb-3">Agreement Terms</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Free Days at Dest.</Label>
                        <Input
                            type="number"
                            {...form.register('freeDays', { valueAsNumber: true })}
                            placeholder="14"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Claims Period (Days)</Label>
                        <Input
                            type="number"
                            {...form.register('claimsDays', { valueAsNumber: true })}
                            placeholder="7"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Weight Franchise %</Label>
                        <Input
                            type="number"
                            {...form.register('weightFranchise', { valueAsNumber: true })}
                            step="0.01"
                            placeholder="1.0"
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}
