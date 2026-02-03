/**
 * Deal Calculator Service
 * Handles all pricing calculations for metal trading deals
 */

export interface DealCalculationInputs {
    // Step 1
    commodityName: string
    originCountry: string

    // Step 2
    incoterm: 'FOB' | 'CIF' | 'EXW' | 'DDP' | 'DAP'
    buyPriceUSD: number
    weightMT: number
    oceanFreightUSD?: number
    insuranceUSD?: number
    customsExchangeRateINR: number
    localClearanceINR: number
    transportINR: number

    // Step 3
    targetSellPriceINR?: number
}

export interface DealCalculationResults {
    // CIF Value
    cifValueUSD: number

    // Duty Calculations
    assessableValueINR: number
    bcdPercentage: number
    bcdAmountINR: number
    swsAmountINR: number

    // Total Cost
    totalLandedCostINR: number

    // Profit Analysis
    projectedMarginPercent: number | null
    isLowMargin: boolean
}

/**
 * Calculate CIF value based on incoterm
 */
export function calculateCIFValue(
    buyPriceUSD: number,
    incoterm: 'FOB' | 'CIF' | 'EXW' | 'DDP' | 'DAP',
    oceanFreightUSD: number = 0,
    insuranceUSD: number = 0
): number {
    // For FOB and EXW, we need to add freight and insurance to get CIF
    if (incoterm === 'FOB' || incoterm === 'EXW') {
        return buyPriceUSD + oceanFreightUSD + insuranceUSD
    }
    // For CIF, DDP, DAP, the buy price usually includes freight/insurance to port
    // (DDP includes more, but for CIF value used in customs, it's at least the base)
    return buyPriceUSD
}

/**
 * Determine BCD percentage based on commodity
 * Copper and Lithium get 0% duty, others get 2.5%
 */
export function getBCDPercentage(commodityName: string): number {
    const lowerName = commodityName.toLowerCase()

    // Zero duty commodities
    if (lowerName.includes('copper') || lowerName.includes('lithium')) {
        return 0
    }

    // Standard duty
    return 2.5
}

/**
 * Calculate assessable value in INR
 */
export function calculateAssessableValue(
    cifValueUSD: number,
    customsExchangeRateINR: number
): number {
    return cifValueUSD * customsExchangeRateINR
}

/**
 * Calculate Basic Customs Duty (BCD)
 */
export function calculateBCD(
    assessableValueINR: number,
    bcdPercentage: number
): number {
    return assessableValueINR * (bcdPercentage / 100)
}

/**
 * Calculate Social Welfare Surcharge (SWS)
 * SWS = 10% of BCD
 */
export function calculateSWS(bcdAmountINR: number): number {
    return bcdAmountINR * 0.10
}

/**
 * Calculate total landed cost in INR
 */
export function calculateTotalLandedCost(
    assessableValueINR: number,
    bcdAmountINR: number,
    swsAmountINR: number,
    localClearanceINR: number,
    transportINR: number
): number {
    return (
        assessableValueINR +
        bcdAmountINR +
        swsAmountINR +
        localClearanceINR +
        transportINR
    )
}

/**
 * Calculate projected profit margin percentage
 */
export function calculateMarginPercentage(
    targetSellPriceINR: number,
    totalLandedCostINR: number
): number {
    if (targetSellPriceINR === 0) return 0

    const margin = targetSellPriceINR - totalLandedCostINR
    return (margin / targetSellPriceINR) * 100
}

/**
 * Main calculation function - orchestrates all calculations
 */
export function calculateDealPricing(
    inputs: DealCalculationInputs
): DealCalculationResults {
    // 1. Calculate CIF Value
    const cifValueUSD = calculateCIFValue(
        inputs.buyPriceUSD,
        inputs.incoterm,
        inputs.oceanFreightUSD || 0,
        inputs.insuranceUSD || 0
    )

    // 2. Calculate Assessable Value
    const assessableValueINR = calculateAssessableValue(
        cifValueUSD,
        inputs.customsExchangeRateINR
    )

    // 3. Determine BCD Percentage
    const bcdPercentage = getBCDPercentage(inputs.commodityName)

    // 4. Calculate BCD Amount
    const bcdAmountINR = calculateBCD(assessableValueINR, bcdPercentage)

    // 5. Calculate SWS (10% of BCD)
    const swsAmountINR = calculateSWS(bcdAmountINR)

    // 6. Calculate Total Landed Cost
    const totalLandedCostINR = calculateTotalLandedCost(
        assessableValueINR,
        bcdAmountINR,
        swsAmountINR,
        inputs.localClearanceINR,
        inputs.transportINR
    )

    // 7. Calculate Profit Margin (if target sell price provided)
    let projectedMarginPercent: number | null = null
    let isLowMargin = false

    if (inputs.targetSellPriceINR && inputs.targetSellPriceINR > 0) {
        projectedMarginPercent = calculateMarginPercentage(
            inputs.targetSellPriceINR,
            totalLandedCostINR
        )
        isLowMargin = projectedMarginPercent < 2
    }

    return {
        cifValueUSD,
        assessableValueINR,
        bcdPercentage,
        bcdAmountINR,
        swsAmountINR,
        totalLandedCostINR,
        projectedMarginPercent,
        isLowMargin
    }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: 'USD' | 'INR' = 'INR'): string {
    const symbol = currency === 'USD' ? '$' : '₹'
    return `${symbol}${amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`
}

/**
 * Format weight for display
 */
export function formatWeight(weightMT: number): string {
    return `${weightMT.toLocaleString('en-IN', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
    })} MT`
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`
}
