'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface InquiryData {
    fullName: string
    email: string
    phone?: string
    companyName?: string
    inquiryType: 'Quote' | 'General' | 'Partnership'
    message: string
    metadata?: any
}

export async function submitInquiry(data: InquiryData) {
    const supabase = await createClient()

    try {
        const { error } = await supabase.from('inquiries' as any).insert({
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            company_name: data.companyName,
            inquiry_type: data.inquiryType,
            message: data.message,
            metadata: data.metadata || {},
            status: 'New'
        })

        if (error) throw error

        return { success: true }
    } catch (error: any) {
        console.error('Submission error:', error)
        return { success: false, error: error.message }
    }
}

export async function getInquiries() {
    const supabase = await createClient()

    try {
        // Admin check is handled by RLS, but double check here for cleaner error
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        const { data, error } = await supabase
            .from('inquiries' as any)
            .select('*')
            .order('created_at', { ascending: false }) as any

        if (error) throw error

        return { success: true, data }
    } catch (error: any) {
        console.error('Fetch error:', error)
        return { success: false, error: error.message }
    }
}

export async function updateInquiryStatus(id: string, status: string) {
    const supabase = await createClient()
    try {
        const { error } = await supabase
            .from('inquiries')
            .update({ status })
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/inquiries')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
