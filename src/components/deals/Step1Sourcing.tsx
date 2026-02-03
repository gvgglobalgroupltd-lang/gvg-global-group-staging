'use client'

import { UseFormReturn } from 'react-hook-form'
import { DealWizardFormData, requiresPSIC } from '@/lib/validations/deal-schema'
import { AlertCircle, Upload } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface Step1SourcingProps {
    form: UseFormReturn<DealWizardFormData>
    suppliers: Array<{ id: string; company_name: string; country: string }>
    commodities: Array<{ id: string; name: string; hscode: string }>
}

const ORIGIN_COUNTRIES = [
    'USA',
    'China',
    'Germany',
    'Dubai',
    'South Africa',
    'India',
    'Australia',
    'Canada',
    'Brazil'
]

export function Step1Sourcing({ form, suppliers, commodities }: Step1SourcingProps) {
    const originCountry = form.watch('originCountry')
    const showPSICWarning = requiresPSIC(originCountry || '')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue('psicFile', file, { shouldValidate: true })
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Sourcing & Compliance
                </h2>
                <p className="text-muted-foreground">
                    Select your supplier, origin, and commodity details
                </p>
            </div>

            {/* Agreement Basics */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="validityDate">Agreement Validity Date</Label>
                    <Input
                        type="date"
                        {...form.register('validityDate')}
                    />
                </div>
            </div>

            {/* Supplier Selection */}
            <div className="space-y-2">
                <Label htmlFor="partnerId">Supplier *</Label>
                <Select
                    value={form.watch('partnerId')}
                    onValueChange={(value) => form.setValue('partnerId', value, { shouldValidate: true })}
                >
                    <SelectTrigger id="partnerId">
                        <SelectValue placeholder="Select a supplier..." />
                    </SelectTrigger>
                    <SelectContent>
                        {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.company_name} ({supplier.country})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {form.formState.errors.partnerId && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.partnerId.message}
                    </p>
                )}
            </div>

            {/* Origin Country */}
            <div className="space-y-2">
                <Label htmlFor="originCountry">Origin Country *</Label>
                <Select
                    value={form.watch('originCountry')}
                    onValueChange={(value) => form.setValue('originCountry', value, { shouldValidate: true })}
                >
                    <SelectTrigger id="originCountry">
                        <SelectValue placeholder="Select origin country..." />
                    </SelectTrigger>
                    <SelectContent>
                        {ORIGIN_COUNTRIES.map((country) => (
                            <SelectItem key={country} value={country}>
                                {country}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {form.formState.errors.originCountry && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.originCountry.message}
                    </p>
                )}
            </div>

            {/* Commodity Selection */}
            <div className="space-y-2">
                <Label htmlFor="commodityId">Commodity *</Label>
                <Select
                    value={form.watch('commodityId')}
                    onValueChange={(value) => form.setValue('commodityId', value, { shouldValidate: true })}
                >
                    <SelectTrigger id="commodityId">
                        <SelectValue placeholder="Select a commodity..." />
                    </SelectTrigger>
                    <SelectContent>
                        {commodities.map((commodity) => (
                            <SelectItem key={commodity.id} value={commodity.id}>
                                {commodity.name} (HS: {commodity.hscode})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {form.formState.errors.commodityId && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.commodityId.message}
                    </p>
                )}
            </div>

            {/* Material Specs */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="isriCode">ISRI Code</Label>
                    <Input
                        {...form.register('isriCode')}
                        placeholder="e.g. BARLEY"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="radioactivityLimit">Radioactivity Limit</Label>
                    <Input
                        {...form.register('radioactivityLimit')}
                        placeholder="Free from Radiation"
                        defaultValue="Free from Radiation"
                    />
                </div>
            </div>

            {/* Packaging & Quality */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="packagingType">Packaging</Label>
                    <Select
                        value={form.watch('packagingType')}
                        onValueChange={(value) => form.setValue('packagingType', value as any)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select packaging..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Loose">Loose / Bulk</SelectItem>
                            <SelectItem value="Container">Container</SelectItem>
                            <SelectItem value="Pallets">Pallets</SelectItem>
                            <SelectItem value="Drums">Drums</SelectItem>
                            <SelectItem value="Bundles">Bundles</SelectItem>
                            <SelectItem value="Bags">Bags</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Quality Check */}
            <Card className="p-4 bg-muted/40">
                <h3 className="text-sm font-semibold mb-3">Quality Tolerances</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Guaranteed Recovery %</Label>
                        <Input
                            type="number"
                            {...form.register('guaranteedRecovery', { valueAsNumber: true })}
                            step="0.01"
                            placeholder="99.9"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Moisture Max %</Label>
                        <Input
                            type="number"
                            {...form.register('moistureTolerance', { valueAsNumber: true })}
                            step="0.01"
                            placeholder="1.0"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Dust/Attachment Max %</Label>
                        <Input
                            type="number"
                            {...form.register('dustTolerance', { valueAsNumber: true })}
                            step="0.01"
                            placeholder="1.0"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Qty Tolerance (+/- %)</Label>
                        <Input
                            type="number"
                            {...form.register('quantityTolerance', { valueAsNumber: true })}
                            placeholder="5"
                        />
                    </div>
                </div>
            </Card>

            <div className="space-y-2">
                <Label htmlFor="qualitySpecs">Quality Specifications</Label>
                <Input
                    {...form.register('qualitySpecs')}
                    placeholder="e.g. Moisture < 1%, Copper Content > 99.9%"
                />
            </div>

            {/* PSIC Warning */}
            {showPSICWarning && (
                <Alert className="border-amber-500/50 bg-amber-500/10">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <AlertDescription className="text-amber-700 dark:text-amber-400">
                        <strong>Compliance Required:</strong> PSIC Pre-Contract document is mandatory for {originCountry}
                    </AlertDescription>
                </Alert>
            )}

            {/* PSIC File Upload */}
            {showPSICWarning && (
                <div className="space-y-2">
                    <Label htmlFor="psicFile">PSIC Pre-Contract Document *</Label>
                    <div className="flex items-center gap-4">
                        <Input
                            id="psicFile"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="flex-1"
                        />
                        <Button type="button" variant="outline" size="icon">
                            <Upload className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        PDF only, max 5MB
                    </p>
                    {form.formState.errors.psicFile && (
                        <p className="text-sm text-destructive">
                            {(form.formState.errors.psicFile as any)?.message}
                        </p>
                    )}
                </div>
            )}

            {/* Info Box */}
            <Alert>
                <AlertDescription>
                    <strong>Note:</strong> Make sure all supplier and commodity details are accurate as they affect compliance and customs calculations.
                </AlertDescription>
            </Alert>
        </div>
    )
}
