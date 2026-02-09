
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const quoteSchema = z.object({
    company_name: z.string().min(2, "Company name required"),
    contact_person: z.string().min(2, "Contact person required"),
    email: z.string().email("Invalid email"),
    phone: z.string().nullable().optional(),
    service_interest: z.enum([
        // Tech Services
        'Custom ERP Development',
        'Mobile App Development',
        'QA & Testing Services',
        'Cloud Solutions',
        'IT Consulting',
        // Immigration Services
        'Study Visa',
        'Work Permit',
        'PR Application',
        'Visitor Visa',
        'Business Visa',
        // Logistics Services
        'Scrap Metal Import',
        'Scrap Metal Export',
        'Logistics & Shipping',
        'Customs Clearance',
        'Other'
    ]),
    project_description: z.string().min(10, "Please provide more details"),
    budget_range: z.string().nullable().optional(),
    timeline: z.string().nullable().optional(),
    tech_stack: z.string().nullable().optional(),
    // New optional fields for specific modes (mapped to description or stored if columns exist)
    destination_country: z.string().nullable().optional(),
    current_location: z.string().nullable().optional(),
    commodity_type: z.string().nullable().optional(),
    target_port: z.string().nullable().optional()
})

export type SubmitQuoteState = {
    success: boolean
    message: string
    meetingLink?: string
    errors?: Record<string, string[]>
}

export async function submitQuote(prevState: SubmitQuoteState, formData: FormData): Promise<SubmitQuoteState> {
    const supabase = await createClient()

    // Extract data
    const rawData = {
        company_name: formData.get('company_name'),
        contact_person: formData.get('contact_person'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service_interest: formData.get('service_interest'),
        project_description: formData.get('project_description'),
        budget_range: formData.get('budget_range'),
        timeline: formData.get('timeline'),
        tech_stack: formData.get('tech_stack'),
        destination_country: formData.get('destination_country'),
        current_location: formData.get('current_location'),
        commodity_type: formData.get('commodity_type'),
        target_port: formData.get('target_port')
    }

    // Helper to append extra details to description
    let description = rawData.project_description as string

    if (rawData.tech_stack) description += `\n\nPreferred Tech Stack: ${rawData.tech_stack}`
    if (rawData.destination_country) description += `\n\nDestination: ${rawData.destination_country}`
    if (rawData.current_location) description += `\n\nCurrent Location: ${rawData.current_location}`
    if (rawData.commodity_type) description += `\n\nCommodity: ${rawData.commodity_type}`
    if (rawData.target_port) description += `\n\nTarget Port: ${rawData.target_port}`

    const validated = quoteSchema.safeParse(rawData)

    if (!validated.success) {
        console.error('Quote validation failed:', validated.error.flatten().fieldErrors)
        return {
            success: false,
            message: 'Validation failed',
            errors: validated.error.flatten().fieldErrors
        }
    }

    // Insert into it_leads
    const { error } = await supabase
        .from('it_leads')
        .insert({
            company_name: validated.data.company_name,
            contact_person: validated.data.contact_person,
            email: validated.data.email,
            phone: validated.data.phone || null,
            service_interest: validated.data.service_interest,
            project_description: description,
            budget_range: validated.data.budget_range || null,
            timeline: validated.data.timeline || null,
            status: 'New',
            source: 'Website Quote Form'
        })

    if (error) {
        console.error('Quote submission error:', error)
        return {
            success: false,
            message: 'Failed to submit quote. Please try again.'
        }
    }

    // Generate Video Call Link (Jitsi)
    // Logic: https://meet.jit.si/GVG-Consultation-[RandomID]
    const meetingId = Math.random().toString(36).substring(7)
    const meetingLink = `https://meet.jit.si/GVG-Consultation-${meetingId}`

    revalidatePath('/tech')
    revalidatePath('/admin/quotes')
    return {
        success: true,
        message: 'Quote request received! You can join a preliminary consultation call below if you are ready.',
        meetingLink
    }
}

export async function getQuotes() {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        const { data, error } = await supabase
            .from('it_leads')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return { success: true, data: data as unknown[] }
    } catch (error: unknown) {
        console.error('Fetch error:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function updateQuoteStatus(id: string, status: string) {
    const supabase = await createClient()
    try {
        const { error } = await supabase
            .from('it_leads')
            .update({ status })
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/quotes')
        return { success: true }
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}
