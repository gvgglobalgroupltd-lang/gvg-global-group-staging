'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'

const partnerSchema = z.object({
    type: z.enum(['supplier', 'customer']),
    company_name: z.string().min(1, 'Company name is required'),
    contact_person: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
})

export type PartnerFormData = z.infer<typeof partnerSchema>

export async function addPartner(data: PartnerFormData) {
    const result = partnerSchema.safeParse(data)

    if (!result.success) {
        return { success: false, error: result.error.issues[0].message }
    }

    try {
        const supabase = await createClient()

        // Check if user is authenticated (optional, but good practice if RLS requires it)
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            // Depending on requirements, we might allow public submission or require auth.
            // For admin panel, auth is likely required.
            // console.warn("User not authenticated, proceed with caution if RLS is strict")
        }

        const { error } = await (supabase
            .from('partners') as any)
            .insert({
                id: uuidv4(),
                company_name: data.company_name,
                type: data.type === 'supplier' ? 'Supplier' : 'Customer', // Match DB enum case
                status: 'Active',
                contact_person: data.contact_person,
                email: data.email || null,
                phone: data.phone,
                address: data.address,
                country: data.country,
            })

        if (error) {
            console.error('Supabase error adding partner:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/partners')
        return { success: true }
    } catch (error) {
        console.error('Server error adding partner:', error)
        return { success: false, error: 'Failed to add partner. Please try again.' }
    }
}
