'use server'

import { createClient } from '@/lib/supabase/server'

export interface MetalRate {
    symbol: string
    name: string
    price: number
    currency: string
    unit: string
    trend?: number // simulated trend
}

export interface CurrencyRate {
    code: string
    rate: number
}

export async function getMetalRates(): Promise<MetalRate[]> {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('market_rates')
            .select('*')
            .order('name')

        if (error) {
            console.error('Error fetching metal rates:', error)
            return []
        }

        // Simulate small live variance for the frontend effect
        // In a real app, this variance would come from the DB history
        return data.map((rate: any) => ({
            ...rate,
            trend: (Math.random() * 2 - 1) * 0.5 // Random trend between -0.5% and +0.5%
        }))

    } catch (err) {
        console.error('Server Action Error:', err)
        return []
    }
}

export async function getCurrencyRates(baseCurrency: string = 'USD'): Promise<CurrencyRate[]> {
    try {
        // Use open.er-api.com (Free, no key)
        const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        })

        if (!response.ok) throw new Error('Failed to fetch rates')

        const data = await response.json()

        // Filter for major currencies
        const targets = ['INR', 'AED', 'EUR', 'GBP', 'CNY', 'CAD']

        return targets.map(code => ({
            code,
            rate: data.rates[code]
        }))

    } catch (err) {
        console.error('Currency API Error:', err)
        // Fallback rates if API fails
        return [
            { code: 'INR', rate: 84.50 },
            { code: 'AED', rate: 3.67 },
            { code: 'EUR', rate: 0.92 }
        ]
    }
}
