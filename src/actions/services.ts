
'use server'

import { createClient } from '@/lib/supabase/server'


export interface ServiceItem {
    id: string
    name: string
    category: 'Software' | 'Hardware' | 'Consulting'
    is_remote: boolean
    description: string | null
    price_range: string | null
    active: boolean
}

export type AvailabilityResponse = {
    available: boolean
    message: string
}

const HALIFAX_PREFIXES = ['B3H', 'B3J', 'B3K', 'B3L', 'B3M', 'B3N', 'B3P', 'B3R', 'B3S']

export async function getServices(): Promise<ServiceItem[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('service_catalog')
        .select('*')
        .eq('active', true)
        .order('category', { ascending: true })

    if (error) {
        console.error('Error fetching services:', error)
        return []
    }

    return data as unknown as ServiceItem[]
}

export async function checkServiceAvailability(
    postalCode: string,
    serviceType: 'Software' | 'Hardware' | 'Consulting'
): Promise<AvailabilityResponse> {
    // 1. Software/Consulting is always available (Remote)
    if (serviceType !== 'Hardware') {
        return { available: true, message: 'Service available remotely.' }
    }

    // 2. Hardware requires Halifax check
    const normalizedCode = postalCode.replace(/\s/g, '').toUpperCase().substring(0, 3)

    if (HALIFAX_PREFIXES.includes(normalizedCode)) {
        return { available: true, message: 'Service available in your area.' }
    }

    return {
        available: false,
        message: 'Hardware service is currently limited to the Halifax area (B3H, B3J, B3M...). Would you like a remote software consultation instead?'
    }
}
