'use client'

import { UseFormReturn } from 'react-hook-form'
import { DealWizardFormData, requiresPSIC } from '@/lib/validations/deal-schema'
import { AlertCircle, Upload } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
                            {form.formState.errors.psicFile.message}
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
