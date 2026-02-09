'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteDeal(dealId: string) {
    const supabase = await createClient()

    // check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error('Unauthorized')
    }

    // Delete related payments first (if cascade delete is not set up, but let's assume it might be needed)
    // Actually, usually we rely on ON DELETE CASCADE, but safer to try deleting deal directly first.

    const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId)

    if (error) {
        console.error('Error deleting deal:', error)
        throw new Error('Failed to delete deal')
    }

    revalidatePath('/admin/deals')
    return { success: true }
}

export async function updateDeal(dealId: string, data: any) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error('Unauthorized')
    }

    // Explicitly exclude fields that shouldn't be updated or cause issues
    const {
        id,
        created_at,
        created_by,
        deal_ref,
        supplier,
        customer,
        commodity,
        ...updatePayload
    } = data

    const { error } = await supabase
        .from('deals')
        .update(updatePayload)
        .eq('id', dealId)

    if (error) {
        console.error('Error updating deal:', error)
        throw new Error('Failed to update deal')
    }

    revalidatePath(`/admin/deals/${dealId}`)
    revalidatePath('/admin/deals')
    return { success: true }
}
