'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DealWizard } from '@/components/deals/DealWizard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DealWizardFormData } from '@/lib/validations/deal-schema'

export default function EditDealPage() {
    const params = useParams()
    const dealId = params.id as string
    const [isLoading, setIsLoading] = useState(true)
    const [initialData, setInitialData] = useState<DealWizardFormData | null>(null)

    useEffect(() => {
        async function loadDeal() {
            try {
                const supabase = createClient()
                const { data: deal, error } = await supabase
                    .from('deals')
                    .select('*')
                    .eq('id', dealId)
                    .single()

                if (error) throw error
                if (!deal) throw new Error('Deal not found')

                const dealData = deal as any

                // Map DB data to Form Data
                const formData: DealWizardFormData = {
                    // Step 1: Sourcing
                    partnerId: dealData.partner_id,
                    commodityId: dealData.commodity_id,
                    originCountry: dealData.origin_country,
                    validityDate: dealData.validity_date,
                    incoterm: dealData.incoterm,

                    // Step 2: Pricing
                    buyPrice: dealData.buy_price,
                    currency: dealData.currency,
                    weightMT: dealData.weight_mt,
                    customsExchangeRate: dealData.exchange_rate_locked,
                    paymentMethod: dealData.payment_method,
                    paymentTerms: dealData.payment_terms,
                    advancePercent: dealData.advance_percentage,
                    balancePercent: dealData.balance_percentage,
                    lcNumber: dealData.lc_number || undefined,
                    lcExpiryDate: dealData.lc_expiry_date || undefined,
                    issuingBank: dealData.issuing_bank || undefined,

                    // Step 3: Logistics
                    portOfLoading: dealData.port_of_loading || dealData.pol,
                    portOfDischarge: dealData.port_of_discharge || dealData.pod,
                    shipmentPeriodStart: dealData.shipment_period_start || undefined,
                    shipmentPeriodEnd: dealData.shipment_period_end || undefined,
                    partialShipment: dealData.partial_shipment_allowed,
                    transshipment: dealData.transshipment_allowed,
                    freeDays: dealData.free_days_detention,
                    shippingLine: dealData.shipping_line,
                    freightForwarder: dealData.freight_forwarder,
                    packagingType: dealData.packing_type || undefined,

                    // Product Specs (Step 3 continued/Step 4)
                    isriCode: dealData.isri_code,
                    guaranteedRecovery: dealData.guaranteed_recovery_rate,
                    moistureTolerance: dealData.moisture_tolerance,
                    dustTolerance: dealData.dust_tolerance,
                    radioactivityLimit: 'Free from Radiation', // Default string
                    quantityTolerance: dealData.quantity_tolerance_percent,
                    qualitySpecs: dealData.quality_specs,
                    claimsDays: dealData.claims_days,
                    weightFranchise: dealData.weight_franchise,

                    // Costing
                    oceanFreight: dealData.cost_ocean_freight,
                    insurance: dealData.cost_insurance,
                    bcdPercent: dealData.cost_bcd_percent,
                    swsPercent: dealData.cost_sws_percent,
                    financeCost: dealData.cost_finance,
                    localClearanceCost: 0, // Default/Missing in DB
                    transportCost: 0,      // Default/Missing in DB

                    // Docs
                    requiredDocuments: dealData.required_documents || [],
                    notes: dealData.notes
                }

                setInitialData(formData)
            } catch (error) {
                console.error('Failed to load deal:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadDeal()
    }, [dealId])

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto py-8">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    if (!initialData) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">Deal not found</p>
                <Button asChild className="mt-4">
                    <Link href="/admin/deals">Back to Deals</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="max-w-4xl mx-auto">
                <Link href={`/admin/deals/${dealId}`}>
                    <Button variant="ghost" size="sm" className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Deal Details
                    </Button>
                </Link>
                <DealWizard key={initialData ? 'loaded' : 'loading'} dealId={dealId} initialData={initialData} />
            </div>
        </div>
    )
}
