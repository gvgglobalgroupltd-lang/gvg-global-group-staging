import { z } from 'zod'

/**
 * Validation schemas for the multi-step deal wizard
 */

// Step 1: Sourcing & Compliance
const step1Base = z.object({
    partnerId: z.string().uuid('Please select a supplier'),
    originCountry: z.string().min(1, 'Origin country is required'),
    commodityId: z.string().uuid('Please select a commodity'),
    psicFile: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= 5 * 1024 * 1024,
            'File size must be less than 5MB'
        )
        .refine(
            (file) => !file || file.type === 'application/pdf',
            'Only PDF files are allowed'
        )
})

export const step1Schema = step1Base.refine(
    (data) => {
        // If origin is Dubai or South Africa, PSIC file is required
        const requiresPSIC = ['Dubai', 'South Africa'].includes(data.originCountry)
        return !requiresPSIC || data.psicFile instanceof File
    },
    {
        message: 'PSIC Pre-Contract document is required for Dubai and South Africa',
        path: ['psicFile']
    }
)

// Step 2: Pricing & Logistics
const step2Base = z.object({
    incoterm: z.enum(['FOB', 'CIF'] as const),
    buyPriceUSD: z
        .number()
        .positive('Buy price must be greater than 0'),
    weightMT: z
        .number()
        .positive('Weight must be greater than 0'),

    // FOB-specific fields (conditional)
    oceanFreightUSD: z.number().nonnegative().optional(),
    insuranceUSD: z.number().nonnegative().optional(),
    forwarderName: z.string().optional(),

    // CIF-specific fields (conditional)
    shippingLineName: z.string().optional(),

    // Destination type
    destinationType: z.enum(['Warehouse', 'Direct_Customer'] as const),

    // Warehouse fields (conditional)
    warehouseDestination: z.string().optional(),
    portToWarehouseTransportINR: z.number().nonnegative().default(0),

    // Direct customer fields (conditional)
    customerDeliveryAddress: z.string().optional(),

    // Exchange rate
    customsExchangeRateINR: z
        .number()
        .positive('Exchange rate must be greater than 0'),

    // Local costs
    localClearanceINR: z
        .number()
        .nonnegative('Local clearance must be 0 or greater')
        .default(0),
    transportINR: z
        .number()
        .nonnegative('Transport cost must be 0 or greater')
        .default(0)
})

export const step2Schema = step2Base.refine(
    (data) => {
        // If FOB, ocean freight and insurance are required
        if (data.incoterm === 'FOB') {
            return (
                data.oceanFreightUSD !== undefined &&
                data.oceanFreightUSD > 0 &&
                data.insuranceUSD !== undefined &&
                data.insuranceUSD >= 0
            )
        }
        return true
    },
    {
        message: 'Ocean freight and insurance are required for FOB terms',
        path: ['oceanFreightUSD']
    }
).refine(
    (data) => {
        // If Warehouse, warehouse destination is required
        if (data.destinationType === 'Warehouse') {
            return data.warehouseDestination && data.warehouseDestination.length > 0
        }
        return true
    },
    {
        message: 'Warehouse location is required for warehouse stock',
        path: ['warehouseDestination']
    }
).refine(
    (data) => {
        // If Direct Customer, delivery address is required
        if (data.destinationType === 'Direct_Customer') {
            return data.customerDeliveryAddress && data.customerDeliveryAddress.length > 0
        }
        return true
    },
    {
        message: 'Customer delivery address is required for direct sales',
        path: ['customerDeliveryAddress']
    }
)

// Step 3: Profit Guard
const step3Base = z.object({
    targetSellPriceINR: z
        .number()
        .positive('Target sell price must be greater than 0'),
    requestAdminOverride: z.boolean().default(false),
    overrideReason: z.string().optional()
})

export const step3Schema = step3Base.refine(
    (data) => {
        // If requesting admin override, reason is required
        return !data.requestAdminOverride || (data.overrideReason && data.overrideReason.length > 0)
    },
    {
        message: 'Please provide a reason for admin override',
        path: ['overrideReason']
    }
)

// Combined schema for the entire wizard
export const dealWizardSchema = z.object({
    // Step 1 fields
    ...step1Base.shape,

    // Step 2 fields
    ...step2Base.shape,

    // Step 3 fields
    ...step3Base.shape,

    // Additional metadata
    notes: z.string().optional()
})

// Type exports
export type Step1FormData = z.infer<typeof step1Schema>
export type Step2FormData = z.infer<typeof step2Schema>
export type Step3FormData = z.infer<typeof step3Schema>
export type DealWizardFormData = z.infer<typeof dealWizardSchema>

/**
 * Default values for the wizard form
 */
export const defaultFormValues: Partial<DealWizardFormData> = {
    incoterm: 'FOB',
    destinationType: 'Warehouse',
    localClearanceINR: 500,
    transportINR: 800,
    portToWarehouseTransportINR: 0,
    requestAdminOverride: false
}

/**
 * Helper to get countries that require PSIC
 */
export const PSIC_REQUIRED_COUNTRIES = ['Dubai', 'South Africa']

/**
 * Helper to check if PSIC is required
 */
export function requiresPSIC(originCountry: string): boolean {
    return PSIC_REQUIRED_COUNTRIES.includes(originCountry)
}
