'use client'

import { UseFormReturn } from 'react-hook-form'
import { DealWizardFormData } from '@/lib/validations/deal-schema'
import { useDealCalculations, useExchangeRate } from '@/hooks/useDealCalculations'
import { formatCurrency, formatPercentage } from '@/lib/calculations/deal-calculator'
import { Ship, TruckIcon, RefreshCw, Calculator } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface Step2PricingProps {
    form: UseFormReturn<DealWizardFormData>
    commodityName: string
}

export function Step2Pricing({ form, commodityName }: Step2PricingProps) {
    const incoterm = form.watch('incoterm')
    const buyPriceUSD = form.watch('buyPriceUSD') || 0
    const oceanFreightUSD = form.watch('oceanFreightUSD') || 0
    const insuranceUSD = form.watch('insuranceUSD') || 0
    const customsExchangeRateINR = form.watch('customsExchangeRateINR') || 0
    const localClearanceINR = form.watch('localClearanceINR') || 0
    const transportINR = form.watch('transportINR') || 0

    // Fetch live exchange rate
    const { rate: liveRate, isLoading: rateLoading, lastUpdated, refetch } = useExchangeRate('USD')

    // Real-time calculations
    const calculations = useDealCalculations({
        commodityName,
        originCountry: form.watch('originCountry') || '',
        incoterm: incoterm || 'FOB',
        buyPriceUSD,
        weightMT: form.watch('weightMT') || 0,
        oceanFreightUSD,
        insuranceUSD,
        customsExchangeRateINR,
        localClearanceINR,
        transportINR
    })

    // Auto-fill exchange rate when loaded
    if (liveRate && !customsExchangeRateINR) {
        form.setValue('customsExchangeRateINR', liveRate, { shouldValidate: false })
    }

    const handleUseLiveRate = () => {
        if (liveRate) {
            form.setValue('customsExchangeRateINR', liveRate, { shouldValidate: true })
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Pricing & Logistics
                </h2>
                <p className="text-muted-foreground">
                    Configure shipping terms and calculate landed costs
                </p>
            </div>

            {/* Incoterm Toggle */}
            <div className="space-y-3">
                <Label>Who manages shipping? *</Label>
                <RadioGroup
                    value={incoterm}
                    onValueChange={(value: 'FOB' | 'CIF') =>
                        form.setValue('incoterm', value, { shouldValidate: true })
                    }
                    className="grid grid-cols-2 gap-4"
                >
                    <div>
                        <RadioGroupItem value="FOB" id="fob" className="peer sr-only" />
                        <Label
                            htmlFor="fob"
                            className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                            <Ship className="mb-3 h-6 w-6" />
                            <div className="text-center">
                                <div className="font-semibold">We Ship (FOB)</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    We handle freight & insurance
                                </div>
                            </div>
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="CIF" id="cif" className="peer sr-only" />
                        <Label
                            htmlFor="cif"
                            className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                            <TruckIcon className="mb-3 h-6 w-6" />
                            <div className="text-center">
                                <div className="font-semibold">Supplier Ships (CIF)</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Supplier handles freight
                                </div>
                            </div>
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Basic Trade Details */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="buyPriceUSD">Buy Price (USD) *</Label>
                    <Input
                        id="buyPriceUSD"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={buyPriceUSD || ''}
                        onChange={(e) =>
                            form.setValue('buyPriceUSD', parseFloat(e.target.value) || 0, {
                                shouldValidate: true
                            })
                        }
                    />
                    {form.formState.errors.buyPriceUSD && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.buyPriceUSD.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="weightMT">Weight (MT) *</Label>
                    <Input
                        id="weightMT"
                        type="number"
                        step="0.001"
                        placeholder="0.000"
                        value={form.watch('weightMT') || ''}
                        onChange={(e) =>
                            form.setValue('weightMT', parseFloat(e.target.value) || 0, {
                                shouldValidate: true
                            })
                        }
                    />
                    {form.formState.errors.weightMT && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.weightMT.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Conditional FOB Fields */}
            {incoterm === 'FOB' && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Ship className="h-4 w-4" />
                        FOB Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="oceanFreightUSD">Ocean Freight (USD) *</Label>
                            <Input
                                id="oceanFreightUSD"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={oceanFreightUSD || ''}
                                onChange={(e) =>
                                    form.setValue('oceanFreightUSD', parseFloat(e.target.value) || 0, {
                                        shouldValidate: true
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="insuranceUSD">Insurance (USD) *</Label>
                            <Input
                                id="insuranceUSD"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={insuranceUSD || ''}
                                onChange={(e) =>
                                    form.setValue('insuranceUSD', parseFloat(e.target.value) || 0, {
                                        shouldValidate: true
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="forwarderName">Freight Forwarder</Label>
                        <Input
                            id="forwarderName"
                            placeholder="Enter forwarder name..."
                            value={form.watch('forwarderName') || ''}
                            onChange={(e) => form.setValue('forwarderName', e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Conditional CIF Fields */}
            {incoterm === 'CIF' && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-semibold flex items-center gap-2">
                        <TruckIcon className="h-4 w-4" />
                        CIF Details
                    </h3>
                    <div className="space-y-2">
                        <Label htmlFor="shippingLineName">Shipping Line</Label>
                        <Input
                            id="shippingLineName"
                            placeholder="Enter shipping line name..."
                            value={form.watch('shippingLineName') || ''}
                            onChange={(e) => form.setValue('shippingLineName', e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Destination Type Toggle */}
            <div className="space-y-3">
                <Label>Final Destination *</Label>
                <RadioGroup
                    value={form.watch('destinationType')}
                    onValueChange={(value: 'Warehouse' | 'Direct_Customer') =>
                        form.setValue('destinationType', value, { shouldValidate: true })
                    }
                    className="grid grid-cols-2 gap-4"
                >
                    <div>
                        <RadioGroupItem value="Warehouse" id="warehouse" className="peer sr-only" />
                        <Label
                            htmlFor="warehouse"
                            className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                            <Ship className="mb-3 h-6 w-6" />
                            <div className="text-center">
                                <div className="font-semibold">Warehouse Stock</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Add to inventory
                                </div>
                            </div>
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="Direct_Customer" id="direct" className="peer sr-only" />
                        <Label
                            htmlFor="direct"
                            className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                            <TruckIcon className="mb-3 h-6 w-6" />
                            <div className="text-center">
                                <div className="font-semibold">Direct High Sea Sale</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Ship to customer
                                </div>
                            </div>
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Conditional Warehouse Fields */}
            {form.watch('destinationType') === 'Warehouse' && (
                <div className="space-y-4 p-4 border rounded-lg bg-blue-500/5 border-blue-500/20">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Ship className="h-4 w-4" />
                        Warehouse Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="warehouseDestination">Warehouse Location *</Label>
                            <Input
                                id="warehouseDestination"
                                placeholder="Enter warehouse location..."
                                value={form.watch('warehouseDestination') || ''}
                                onChange={(e) => form.setValue('warehouseDestination', e.target.value, {
                                    shouldValidate: true
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="portToWarehouseTransport">Port to Warehouse (INR)</Label>
                            <Input
                                id="portToWarehouseTransport"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={form.watch('portToWarehouseTransportINR') || ''}
                                onChange={(e) =>
                                    form.setValue('portToWarehouseTransportINR', parseFloat(e.target.value) || 0, {
                                        shouldValidate: true
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Conditional Direct Customer Fields */}
            {form.watch('destinationType') === 'Direct_Customer' && (
                <div className="space-y-4 p-4 border rounded-lg bg-purple-500/5 border-purple-500/20">
                    <h3 className="font-semibold flex items-center gap-2">
                        <TruckIcon className="h-4 w-4" />
                        Customer Details
                    </h3>
                    <div className="space-y-2">
                        <Label htmlFor="customerDeliveryAddress">Customer Delivery Address *</Label>
                        <Input
                            id="customerDeliveryAddress"
                            placeholder="Enter full delivery address..."
                            value={form.watch('customerDeliveryAddress') || ''}
                            onChange={(e) => form.setValue('customerDeliveryAddress', e.target.value, {
                                shouldValidate: true
                            })}
                        />
                    </div>
                </div>
            )}


            {/* Exchange Rate */}
            <div className="space-y-2">
                <Label htmlFor="customsExchangeRateINR">
                    Customs Exchange Rate (USD → INR) *
                </Label>
                <div className="flex gap-2">
                    <Input
                        id="customsExchangeRateINR"
                        type="number"
                        step="0.0001"
                        placeholder="0.0000"
                        value={customsExchangeRateINR || ''}
                        onChange={(e) =>
                            form.setValue('customsExchangeRateINR', parseFloat(e.target.value) || 0, {
                                shouldValidate: true
                            })
                        }
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleUseLiveRate}
                        disabled={rateLoading || !liveRate}
                    >
                        {rateLoading ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                            'Use Live'
                        )}
                    </Button>
                </div>
                {lastUpdated && (
                    <p className="text-xs text-muted-foreground">
                        Live rate: {liveRate?.toFixed(4)} (Updated: {lastUpdated.toLocaleTimeString()})
                    </p>
                )}
                {form.formState.errors.customsExchangeRateINR && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.customsExchangeRateINR.message}
                    </p>
                )}
            </div>

            {/* Local Costs */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="localClearanceINR">Local Clearance (INR)</Label>
                    <Input
                        id="localClearanceINR"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={localClearanceINR || ''}
                        onChange={(e) =>
                            form.setValue('localClearanceINR', parseFloat(e.target.value) || 0, {
                                shouldValidate: true
                            })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="transportINR">Transport (INR)</Label>
                    <Input
                        id="transportINR"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={transportINR || ''}
                        onChange={(e) =>
                            form.setValue('transportINR', parseFloat(e.target.value) || 0, {
                                shouldValidate: true
                            })
                        }
                    />
                </div>
            </div>

            {/* Calculation Summary */}
            <Card className="p-4 bg-gradient-to-br from-industrial/5 to-industrial/10 border-industrial/20">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <Calculator className="h-4 w-4" />
                    Live Calculations
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-muted-foreground">CIF Value (USD):</span>
                        <span className="font-semibold">{formatCurrency(calculations.cifValueUSD, 'USD')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-muted-foreground">Assessable Value (INR):</span>
                        <span className="font-semibold">{formatCurrency(calculations.assessableValueINR)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-muted-foreground">
                            BCD ({formatPercentage(calculations.bcdPercentage)}):
                        </span>
                        <span className="font-semibold">{formatCurrency(calculations.bcdAmountINR)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-muted-foreground">SWS (10% of BCD):</span>
                        <span className="font-semibold">{formatCurrency(calculations.swsAmountINR)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 text-base">
                        <span className="font-bold">Total Landed Cost:</span>
                        <span className="font-bold text-primary">
                            {formatCurrency(calculations.totalLandedCostINR)}
                        </span>
                    </div>
                </div>

                {calculations.bcdPercentage === 0 && (
                    <Alert className="mt-4 border-green-500/50 bg-green-500/10">
                        <AlertDescription className="text-green-700 dark:text-green-400">
                            <strong>Zero Duty:</strong> {commodityName} qualifies for 0% BCD
                        </AlertDescription>
                    </Alert>
                )}
            </Card>
        </div>
    )
}
