/**
 * Metals API Integration
 * Fetches real-time metal prices (Gold, Silver, Platinum, etc.)
 */

export interface MetalPrice {
    metal: string
    price: number
    unit: string
    currency: string
    timestamp: string
}

export interface MetalsResponse {
    success: boolean
    timestamp: number
    base: string
    unit: string
    rates: {
        [key: string]: number
    }
}

export async function getMetalPrices(): Promise<MetalPrice[]> {
    const apiKey = process.env.METALS_API_KEY
    const baseUrl = process.env.METALS_API_BASE_URL || 'https://api.metals.dev/v1'

    if (!apiKey) {
        console.error('METALS_API_KEY not configured')
        return getMockMetalPrices()
    }

    try {
        const response = await fetch(
            `${baseUrl}/latest?api_key=${apiKey}&currency=USD&unit=toz`,
            {
                next: { revalidate: 300 }, // Cache for 5 minutes
            }
        )

        if (!response.ok) {
            throw new Error(`Metals API error: ${response.status}`)
        }

        const data: MetalsResponse = await response.json()

        // Convert response to our format
        const metals: MetalPrice[] = Object.entries(data.rates).map(([metal, price]) => ({
            metal,
            price,
            unit: data.unit,
            currency: data.base,
            timestamp: new Date(data.timestamp * 1000).toISOString(),
        }))

        return metals
    } catch (error) {
        console.error('Failed to fetch metal prices:', error)
        return getMockMetalPrices()
    }
}

// Fallback mock data
function getMockMetalPrices(): MetalPrice[] {
    return [
        { metal: 'XAU', price: 2050.25, unit: 'toz', currency: 'USD', timestamp: new Date().toISOString() },
        { metal: 'XAG', price: 24.15, unit: 'toz', currency: 'USD', timestamp: new Date().toISOString() },
        { metal: 'XPT', price: 925.50, unit: 'toz', currency: 'USD', timestamp: new Date().toISOString() },
        { metal: 'XPD', price: 980.75, unit: 'toz', currency: 'USD', timestamp: new Date().toISOString() },
    ]
}

export function getMetalName(symbol: string): string {
    const metalNames: { [key: string]: string } = {
        XAU: 'Gold',
        XAG: 'Silver',
        XPT: 'Platinum',
        XPD: 'Palladium',
        ALU: 'Aluminum',
        NI: 'Nickel',
        ZN: 'Zinc',
        PB: 'Lead',
        CU: 'Copper',
    }
    return metalNames[symbol] || symbol
}
