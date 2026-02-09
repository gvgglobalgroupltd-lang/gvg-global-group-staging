
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const serviceSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(3, "Title is too short"),
    code: z.string().min(2, "Code must be at least 2 chars").regex(/^[A-Z0-9_]+$/, "Code must be uppercase alphanumeric with underscores (e.g. OCI_FULL)"),
    description: z.string().min(10, "Description is too short"),
    price: z.coerce.number().min(0),
    currency: z.string().default('USD'),
    processing_time: z.string().min(1, "Processing time required"),
    icon_name: z.string().nullable().optional(),
    requirements: z.string().or(z.array(z.string())).transform(val => {
        if (Array.isArray(val)) return val;
        // Split by newline if string
        return val.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    })
})

export type ServiceFormState = {
    success?: boolean
    message?: string
    errors?: Record<string, string[]> | string
    payload?: unknown
}

export async function manageImmigrationService(prevState: ServiceFormState, formData: FormData): Promise<ServiceFormState> {
    const supabase = await createClient()

    // 1. Auth Check (Admin)
    // In a real app, check for specific admin role. 
    // Capturing user to ensure they are at least authenticated.
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, message: 'Unauthorized' }
    }

    // 2. Extract Data
    const rawData = {
        id: formData.get('id') as string || undefined,
        title: formData.get('title'),
        code: formData.get('code'),
        description: formData.get('description'),
        price: formData.get('price'),
        currency: formData.get('currency'),
        processing_time: formData.get('processing_time'),
        icon_name: formData.get('icon_name') ? (formData.get('icon_name') as string) : null,
        requirements: formData.get('requirements') // Expecting textarea string
    }

    // 3. Validate
    const validated = serviceSchema.safeParse(rawData)

    if (!validated.success) {
        return {
            success: false,
            message: 'Validation failed',
            errors: validated.error.flatten().fieldErrors
        }
    }

    const { id, ...payload } = validated.data

    // Check for uniqueness manually to handle update properly
    const { data: existing } = await supabase
        .from('immigration_service_catalog')
        .select('id')
        .eq('code', validated.data.code)
        .neq('id', id || '') // Exclude self if updating
        .single()

    if (existing) {
        return {
            success: false,
            message: 'A service with this code already exists.',
            payload: rawData
        }
    }

    let error

    if (id) {
        // Update
        const res = await supabase
            .from('immigration_service_catalog')
            .update(payload)
            .eq('id', id)
        error = res.error
    } else {
        // Insert
        const res = await supabase
            .from('immigration_service_catalog')
            .insert(payload)
        error = res.error
    }

    if (error) {
        console.error('Service Save Error:', error)
        return {
            success: false,
            message: 'Database error occurred: ' + (error.message || 'Unknown error'),
            payload: rawData
        }
    }

    revalidatePath('/admin/immigration')
    revalidatePath('/immigration') // Update public page as well

    return { success: true, message: 'Service saved successfully!' }
}

export async function toggleServiceStatus(id: string, currentStatus: boolean) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('immigration_service_catalog')
        .update({ is_active: !currentStatus })
        .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/immigration')
    revalidatePath('/admin/immigration')
    revalidatePath('/immigration')
}

export async function getAdminImmigrationServices() {
    const supabase = await createClient()
    const { data, error } = await (supabase
        .from('immigration_service_catalog') as any)
        .select('*')
        .order('created_at', { ascending: false }) as any

    if (error) {
        console.error('Error fetching admin services:', error)
        return []
    }
    return data
}
