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
    isriCode: z.string().optional(),
    packagingType: z.enum(['Loose', 'Drums', 'Pallets', 'Bundles', 'Bags', 'Container']).optional(),
    guaranteedRecovery: z.number().min(0).max(100).optional(), // %
    moistureTolerance: z.number().min(0).max(100).optional(), // %
    dustTolerance: z.number().min(0).max(100).optional(), // %
    radioactivityLimit: z.string().default('Free from Radiation'),
    quantityTolerance: z.number().min(0).max(10).optional(),
    qualitySpecs: z.string().optional(),
    validityDate: z.string().optional(), // Agreement validity
    psicFile: fileSchema.optional(),
})

// Step 2: Pricing & Payment
export const step2Schema = z.object({
    incoterm: z.enum(['FOB', 'CIF', 'EXW', 'DDP', 'DAP']),
    buyPrice: z.number().positive(),
    currency: z.enum(['USD', 'INR', 'EUR', 'CAD', 'AED']),
    weightMT: z.number().positive(),

    // Cost Components (Estimates)
    oceanFreight: z.number().nonnegative().optional(),
    insurance: z.number().nonnegative().optional(),

    // Payment Terms
    paymentMethod: z.enum(['LC', 'TT', 'CAD', 'DP', 'PDC', 'Other']),
    paymentTerms: z.string().optional(), // Descriptive
    advancePercent: z.number().min(0).max(100),
    balancePercent: z.number().min(0).max(100),

    // LC Fields (Conditional)
    lcNumber: z.string().optional(),
    lcExpiryDate: z.string().optional(),
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
// Step 3: Logistics & Agreement
export const step3Schema = z.object({
    portOfLoading: z.string().min(1, "POL required"),
    portOfDischarge: z.string().min(1, "POD required"),
    shipmentPeriodStart: z.string().optional(),
    shipmentPeriodEnd: z.string().optional(),
    partialShipment: z.boolean().default(false),
    transshipment: z.boolean().default(false),
    freeDays: z.number().int().default(14),
    shippingLine: z.string().optional(),
    freightForwarder: z.string().optional(),
    claimsDays: z.number().int().default(7),
    weightFranchise: z.number().default(1.0), // %
})

// Step 4: Documents & Profit
// Step 4: Landed Costing & Docs
const step4Base = z.object({
    requiredDocuments: z.array(z.string()).default([]),
    notes: z.string().optional(),

    // Landed Costing (Estimates)
    customsExchangeRate: z.number().positive().default(84.5),
    bcdPercent: z.number().nonnegative().default(2.5),
    swsPercent: z.number().nonnegative().default(10), // % of BCD
    localClearanceCost: z.number().nonnegative().default(0), // CHA
    transportCost: z.number().nonnegative().default(0), // Inland
    financeCost: z.number().nonnegative().default(0),
    targetSellPrice: z.number().positive().optional(),
})

export const step4Schema = step4Base

// Combined
export const dealWizardSchema = z.object({
    ...step1Schema.shape,
    ...step2Schema.shape,
    ...step3Schema.shape,
    ...step4Base.shape,
})

export type Step1FormData = z.infer<typeof step1Schema>
export type Step2FormData = z.infer<typeof step2Schema>
export type Step3FormData = z.infer<typeof step3Schema>
export type Step4FormData = z.infer<typeof step4Schema>
export type DealWizardFormData = z.infer<typeof dealWizardSchema>

export const defaultFormValues: DealWizardFormData = {
    partnerId: '',
    commodityId: '',
    originCountry: '',
    isriCode: '',
    packagingType: undefined,
    guaranteedRecovery: undefined,
    moistureTolerance: undefined,
    dustTolerance: undefined,
    radioactivityLimit: 'Free from Radiation',
    quantityTolerance: undefined,
    qualitySpecs: undefined,
    psicFile: undefined,
    validityDate: undefined,

    incoterm: 'FOB',
    buyPrice: 0,
    currency: 'USD',
    weightMT: 0,
    oceanFreight: undefined,
    insurance: undefined,

    paymentMethod: 'TT',
    paymentTerms: '',
    advancePercent: 0,
    balancePercent: 100,
    lcNumber: undefined,
    lcExpiryDate: undefined,
    issuingBank: undefined,

    portOfLoading: '',
    portOfDischarge: '',
    shipmentPeriodStart: undefined,
    shipmentPeriodEnd: undefined,
    partialShipment: false,
    transshipment: false,
    freeDays: 14,
    shippingLine: '',
    freightForwarder: '',
    claimsDays: 7,
    weightFranchise: 1.0,

    requiredDocuments: [],
    notes: undefined,

    customsExchangeRate: 84.5,
    bcdPercent: 2.5,
    swsPercent: 10,
    localClearanceCost: 0,
    transportCost: 0,
    financeCost: 0,
    targetSellPrice: undefined,
}

// Helpers
export const PSIC_REQUIRED_COUNTRIES = ['Dubai', 'South Africa']

export function requiresPSIC(originCountry: string): boolean {
    return PSIC_REQUIRED_COUNTRIES.includes(originCountry)
}
