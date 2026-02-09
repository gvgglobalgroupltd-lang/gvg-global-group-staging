'use client'

import { useState, useEffect, useMemo } from 'react'
import { calculateDealPricing, type DealCalculationInputs, type DealCalculationResults } from '@/lib/calculations/deal-calculator'
import { getExchangeRates } from '@/lib/api/exchange-rates'
import { createClient } from '@/lib/supabase/client'

/**
 * Custom hook for real-time deal calculations
 */
export function useDealCalculations(
    inputs: Partial<DealCalculationInputs>
): DealCalculationResults & { isLoading: boolean } {
    const [isLoading, setIsLoading] = useState(false)

    // Memoized calculation results
    const results = useMemo(() => {
        // Check if we have minimum required inputs
        if (
            !inputs.commodityName ||
            !inputs.buyPriceUSD ||
            !inputs.customsExchangeRateINR ||
            inputs.buyPriceUSD <= 0 ||
            inputs.customsExchangeRateINR <= 0
        ) {
            return {
                cifValueUSD: 0,
                assessableValueINR: 0,
                bcdPercentage: 0,
                bcdAmountINR: 0,
                swsAmountINR: 0,
                totalLandedCostINR: 0,
                projectedMarginPercent: null,
                isLowMargin: false
            }
        }

        // Perform calculations
        return calculateDealPricing(inputs as DealCalculationInputs)
    }, [
        inputs.commodityName,
        inputs.incoterm,
        inputs.buyPriceUSD,
        inputs.weightMT,
        inputs.oceanFreightUSD,
        inputs.insuranceUSD,
        inputs.customsExchangeRateINR,
        inputs.localClearanceINR,
        inputs.transportINR,
        inputs.targetSellPriceINR,
        inputs
    ])

    return { ...results, isLoading }
}

/**
 * Hook to fetch and manage exchange rate
 */
export function useExchangeRate(baseCurrency: string = 'USD') {
    const [rate, setRate] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    useEffect(() => {
        let mounted = true

        async function fetchRate() {
            try {
                setIsLoading(true)
                setError(null)

                const rates = await getExchangeRates(baseCurrency)
                const inrRate = rates.find(r => r.to === 'INR')

                if (mounted) {
                    if (inrRate) {
                        setRate(inrRate.rate)
                        setLastUpdated(new Date())
                    } else {
                        setError('INR rate not found')
                    }
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch exchange rate')
                }
            } finally {
                if (mounted) {
                    setIsLoading(false)
                }
            }
        }

        fetchRate()

        // Refresh rate every hour
        const interval = setInterval(fetchRate, 60 * 60 * 1000)

        return () => {
            mounted = false
            clearInterval(interval)
        }
    }, [baseCurrency])

    const refetch = async () => {
        setIsLoading(true)
        try {
            const rates = await getExchangeRates(baseCurrency)
            const inrRate = rates.find(r => r.to === 'INR')
            if (inrRate) {
                setRate(inrRate.rate)
                setLastUpdated(new Date())
                setError(null)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch rate')
        } finally {
            setIsLoading(false)
        }
    }

    return { rate, isLoading, error, lastUpdated, refetch }
}

/**
 * Hook to load master data (suppliers, commodities)
 */
export function useDealMasterData() {
    const [suppliers, setSuppliers] = useState<any[]>([])
    const [commodities, setCommodities] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true
        const supabase = createClient() // Ensure createClient is imported from '@/lib/supabase/client' at top of file

        async function loadData() {
            try {
                setIsLoading(true)

                const [suppliersResult, commoditiesResult] = await Promise.all([
                    (supabase
                        .from('partners') as any)
                        .select('id, company_name, country')
                        .eq('type', 'Supplier')
                        .eq('status', 'Active')
                        .order('company_name'),
                    (supabase
                        .from('commodities') as any)
                        .select('id, name, hscode')
                        .order('name')
                ])

                if (suppliersResult.error) {
                    console.error('Suppliers fetch error:', suppliersResult.error)
                    // Don't throw, let it fall through or handle gracefully
                }
                if (commoditiesResult.error) {
                    console.error('Commodities fetch error:', commoditiesResult.error)
                }

                if (mounted) {
                    // Use DB data if available, otherwise empty (don't force invalid mocks that break validation)
                    setSuppliers(suppliersResult.data || [])
                    setCommodities(commoditiesResult.data || [])

                    // Only use mocks if absolutely nothing came back AND we possess no data (prevent breaking UI with empty lists if DB is down)
                    if ((!suppliersResult.data || suppliersResult.data.length === 0) && (!commoditiesResult.data || commoditiesResult.data.length === 0)) {
                        // Optional: fallback to valid UUID mocks ONLY if really needed for dev without DB
                        // For now, let's return [] to avoid "Invalid UUID" validation error
                        // or use real UUIDs:
                        /*
                        const mockSuppliers = [
                            { id: '550e8400-e29b-41d4-a716-446655440000', company_name: 'Mock Supplier', country: 'USA' }
                        ]
                        setSuppliers(mockSuppliers)
                        */
                    }
                }
            } catch (err) {
                if (mounted) {
                    console.error('Failed to load master data:', err)
                    setError(err instanceof Error ? err.message : 'Failed to load data')
                }
            } finally {
                if (mounted) {
                    setIsLoading(false)
                }
            }
        }

        loadData()

        return () => {
            mounted = false
        }
    }, [])

    return { suppliers, commodities, isLoading, error }
}
