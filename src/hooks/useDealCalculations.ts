'use client'

import { useState, useEffect, useMemo } from 'react'
import { calculateDealPricing, type DealCalculationInputs, type DealCalculationResults } from '@/lib/calculations/deal-calculator'
import { getExchangeRates } from '@/lib/api/exchange-rates'

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
        inputs.targetSellPriceINR
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

        async function loadData() {
            try {
                setIsLoading(true)

                // Fetch from Supabase (we'll implement the actual fetch)
                // For now, using mock data
                const mockSuppliers = [
                    { id: '1', company_name: 'Global Metals Inc', country: 'USA' },
                    { id: '2', company_name: 'Asian Steel Trading', country: 'China' },
                    { id: '3', company_name: 'European Copper Co', country: 'Germany' }
                ]

                const mockCommodities = [
                    { id: '1', name: 'Copper Millberry', hscode: '740311' },
                    { id: '2', name: 'Aluminum Ingots', hscode: '760110' },
                    { id: '3', name: 'Lithium Carbonate', hscode: '283691' }
                ]

                if (mounted) {
                    setSuppliers(mockSuppliers)
                    setCommodities(mockCommodities)
                }
            } catch (err) {
                if (mounted) {
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
