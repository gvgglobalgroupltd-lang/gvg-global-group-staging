
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const visaApplicationSchema = z.object({
    visa_type: z.enum(['OCI', 'Canada_PR', 'US_Tourist', 'Schengen', 'Dubai_Express', 'Other']),
    application_data: z.any() // Using any for JSONB flexibility initially
})

export type SubmitVisaState = {
    success?: boolean
    message?: string
    errors?: any
    applicationId?: string
}

export async function submitVisaApplication(prevState: SubmitVisaState, formData: FormData): Promise<SubmitVisaState> {
    const supabase = await createClient()

    // 1. Check Auth (Security)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, message: 'You must be logged in to submit an application.' }
    }

    // 2. Extract Data
    const rawData = {
        visa_type: formData.get('visa_type'),
        application_data: JSON.parse(formData.get('application_data') as string || '{}')
    }

    // 3. Validate
    const validated = visaApplicationSchema.safeParse(rawData)
    if (!validated.success) {
        return {
            success: false,
            message: 'Validation failed',
            errors: validated.error.flatten().fieldErrors
        }
    }

    // 4. Insert into DB
    const { data, error } = await supabase
        .from('visa_applications')
        .insert({
            user_id: user.id,
            visa_type: validated.data.visa_type,
            status: 'Draft', // Default status
            application_data: validated.data.application_data
        })
        .select()
        .single()

    if (error) {
        console.error('Visa Submission Error:', error)
        return { success: false, message: 'Failed to create application. Please try again.' }
    }

    revalidatePath('/immigration/dashboard')

    return {
        success: true,
        message: 'Application draft created successfully!',
        applicationId: (data as any)?.id
    }
}

import { unstable_cache } from 'next/cache'

export async function getImmigrationServices() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('immigration_service_catalog')
        .select('*')
        .eq('is_active', true)
        .order('title')

    if (error) {
        console.error('Error fetching services:', error)
        return []
    }
    return data
}

