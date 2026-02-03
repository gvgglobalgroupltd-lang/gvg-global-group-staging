import { z } from 'zod'

/**
 * Validations for Advanced Deal Flow
 */

const fileSchema = (typeof File !== 'undefined'
    ? z.instanceof(File)
    : z.any()) as z.ZodType<any>

// Step 1: Parties & Product
export const step1Schema = z.object({
    partnerId: z.string().uuid('Select a supplier'),
    commodityId: z.string().uuid('Select a commodity'),
    originCountry: z.string().min(1, 'Origin required'),
    packagingType: z.enum(['Loose', 'Drums', 'Pallets', 'Bundles', 'Bags', 'Container']).optional(),
    quantityTolerance: z.number().min(0).max(10).optional(),
    qualitySpecs: z.string().optional(),
})

// Step 2: Pricing & Payment
export const step2Schema = z.object({
    incoterm: z.enum(['FOB', 'CIF', 'EXW', 'DDP', 'DAP']),
    buyPrice: z.number().positive(),
    currency: z.enum(['USD', 'CAD', 'AED', 'INR', 'EUR']),
    weightMT: z.number().positive(),

    // Cost Components (Restored)
    oceanFreight: z.number().nonnegative().optional(),
    insurance: z.number().nonnegative().optional(),
    customsExchangeRate: z.number().positive(),

    // Payment Terms
    paymentMethod: z.enum(['LC', 'TT', 'CAD', 'DP', 'PDC']),
    advancePercent: z.number().min(0).max(100),
    balancePercent: z.number().min(0).max(100),
    paymentTermsDesc: z.string().optional(),

    // LC Fields (Conditional)
    lcNumber: z.string().optional(),
    issuingBank: z.string().optional(),
})
    .refine((data) => data.advancePercent + data.balancePercent === 100, {
        message: "Advance + Balance must equal 100%",
        path: ["balancePercent"]
    })
    .refine((data) => {
        if (data.incoterm === 'FOB') {
            return (data.oceanFreight !== undefined && data.oceanFreight >= 0)
        }
        return true
    }, {
        message: "Ocean Freight required for FOB",
        path: ["oceanFreight"]
    })
    .refine((data) => {
        if (data.paymentMethod === 'LC') {
            return !!data.issuingBank
        }
        return true
    }, {
        message: "Issuing Bank required for LC",
        path: ["issuingBank"]
    })

// Step 3: Logistics
export const step3Schema = z.object({
    portOfLoading: z.string().min(1, "POL required"),
    portOfDischarge: z.string().min(1, "POD required"),
    shipmentPeriodStart: z.string().optional(),
    shipmentPeriodEnd: z.string().optional(),
    partialShipment: z.boolean().default(false),
    transshipment: z.boolean().default(false),
})

// Step 4: Documents & Profit
export const step4Schema = z.object({
    requiredDocuments: z.array(z.string()).default([]),
    notes: z.string().optional(),

    // Profit / Local Costs
    localClearanceCost: z.number().nonnegative().default(0),
    transportCost: z.number().nonnegative().default(0),
    targetSellPrice: z.number().positive().optional(),
})

// Combined
export const dealWizardSchema = z.object({
    ...step1Schema.shape,
    ...step2Schema.shape,
    ...step3Schema.shape,
    ...step4Schema.shape
})

export type Step1FormData = z.infer<typeof step1Schema>
export type Step2FormData = z.infer<typeof step2Schema>
export type Step3FormData = z.infer<typeof step3Schema>
export type Step4FormData = z.infer<typeof step4Schema>
export type DealWizardFormData = z.infer<typeof dealWizardSchema>

export const defaultFormValues: Partial<DealWizardFormData> = {
    currency: 'USD',
    incoterm: 'FOB',
    advancePercent: 0,
    balancePercent: 100,
    partialShipment: false,
    transshipment: false,
    paymentMethod: 'TT',
    localClearanceCost: 0,
    transportCost: 0,
    customsExchangeRate: 84.5 // Default fallback
}

// Helpers
export const PSIC_REQUIRED_COUNTRIES = ['Dubai', 'South Africa']

export function requiresPSIC(originCountry: string): boolean {
    return PSIC_REQUIRED_COUNTRIES.includes(originCountry)
}
