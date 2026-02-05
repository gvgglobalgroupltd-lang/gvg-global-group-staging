
'use server'

import { createClient } from '@/lib/supabase/server'

export async function getLogisticsShipments() {
    // If this is for a public dashboard, use createAdminClient or ensure RLS allows 'anon'.
    // Assuming this is an admin/protected dashboard component, standard client is fine IF user is logged in.
    // If user is NOT logged in, we should check/return empty.
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('deals')
            .select('id, deal_ref, container_number, origin_port, destination_port, eta_date, status')
            .in('status', ['Shipped', 'In Transit', 'Customs'])
            .order('eta_date', { ascending: true })
            .limit(10)

        if (error) {
            console.error('Fetch Error:', error)
            return [] // Return empty array on error gracefully
        }

        return data || []
    } catch (e) {
        console.error('Server Action Error:', e)
        return []
    }
}
