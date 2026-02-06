
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const visaApplicationSchema = z.object({
    visa_type: z.string(), // Allow dynamic strings for now
    application_data: z.any(),
    documents: z.array(z.object({
        name: z.string(),
        path: z.string()
    })).optional(),
    payment_reference: z.string().optional()
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
    // We expect 'documents' to be a JSON string of uploaded file metadata
    const rawData = {
        visa_type: formData.get('visa_type'),
        application_data: JSON.parse(formData.get('application_data') as string || '{}'),
        documents: JSON.parse(formData.get('documents') as string || '[]'),
        payment_reference: formData.get('payment_reference')
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
    // We'll store documents and payment info within application_data for now unless we add columns
    // Merging them into application_data is the safest schema-less approach
    const finalApplicationData = {
        ...validated.data.application_data,
        documents: validated.data.documents,
        payment_reference: validated.data.payment_reference
    }

    const { data, error } = await supabase
        .from('visa_applications')
        .insert({
            user_id: user.id,
            visa_type: validated.data.visa_type,
            status: 'Draft', // Default status
            application_data: finalApplicationData
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

