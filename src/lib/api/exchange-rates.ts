/**
 * Exchange Rate API Integration
 * Fetches currency exchange rates
 */

export interface ExchangeRate {
    from: string
    to: string
    rate: number
    timestamp: string
}

export interface ExchangeRateResponse {
    base: string
    date: string
    rates: {
        [key: string]: number
    }
}

export async function getExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRate[]> {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY

    if (!apiKey) {
        console.error('EXCHANGE_RATE_API_KEY not configured')
        return getMockExchangeRates()
    }

    try {
        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`,
            {
                next: { revalidate: 3600 }, // Cache for 1 hour
            }
        )

        if (!response.ok) {
            throw new Error(`Exchange Rate API error: ${response.status}`)
        }

        const data = await response.json()

        if (data.result !== 'success') {
            throw new Error('Exchange Rate API returned error')
        }

        // Convert to our format - top currencies
        const topCurrencies = ['EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF', 'INR']
        const rates: ExchangeRate[] = topCurrencies
            .filter(currency => data.conversion_rates[currency])
            .map(currency => ({
                from: baseCurrency,
                to: currency,
                rate: data.conversion_rates[currency],
                timestamp: new Date(data.time_last_update_unix * 1000).toISOString(),
            }))

        return rates
    } catch (error) {
        console.error('Failed to fetch exchange rates:', error)
        return getMockExchangeRates()
    }
}

function getMockExchangeRates(): ExchangeRate[] {
    return [
        { from: 'USD', to: 'EUR', rate: 0.92, timestamp: new Date().toISOString() },
        { from: 'USD', to: 'GBP', rate: 0.79, timestamp: new Date().toISOString() },
        { from: 'USD', to: 'JPY', rate: 149.50, timestamp: new Date().toISOString() },
        { from: 'USD', to: 'CNY', rate: 7.24, timestamp: new Date().toISOString() },
        { from: 'USD', to: 'AUD', rate: 1.53, timestamp: new Date().toISOString() },
        { from: 'USD', to: 'CAD', rate: 1.36, timestamp: new Date().toISOString() },
    ]
}

export function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount)
}
