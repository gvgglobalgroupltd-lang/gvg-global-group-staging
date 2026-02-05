
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const quoteSchema = z.object({
    company_name: z.string().min(2, "Company name required"),
    contact_person: z.string().min(2, "Contact person required"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    service_interest: z.enum([
        'Custom ERP Development',
        'Mobile App Development',
        'QA & Testing Services',
        'Cloud Solutions',
        'IT Consulting',
        'Other'
    ]),
    project_description: z.string().min(10, "Please provide more details"),
    budget_range: z.string().optional(),
    timeline: z.string().optional(),
    tech_stack: z.string().optional() // Storing in notes or separate field if migration didn't add it. 005 didn't have tech_stack. I'll append to description.
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
        tech_stack: formData.get('tech_stack')
    }

    // Helper to append tech stack to description since column might be missing
    let description = rawData.project_description as string
    if (rawData.tech_stack) {
        description += `\n\nPreferred Tech Stack: ${rawData.tech_stack}`
    }

    const validated = quoteSchema.safeParse(rawData)

    if (!validated.success) {
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
    return {
        success: true,
        message: 'Quote request received! You can join a preliminary consultation call below if you are ready.',
        meetingLink
    }
}
