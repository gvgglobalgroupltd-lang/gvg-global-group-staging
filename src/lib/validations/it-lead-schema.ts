import { z } from 'zod'

/**
 * Validation schema for IT consultation lead form
 */

export const itLeadSchema = z.object({
    company_name: z.string().min(2, 'Company name is required'),
    contact_person: z.string().min(2, 'Contact person name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    service_interest: z.enum([
        'Custom ERP Development',
        'Mobile App Development',
        'QA & Testing Services',
        'Cloud Solutions',
        'IT Consulting',
        'Other'
    ], {
        required_error: 'Please select a service'
    }),
    project_description: z.string().min(20, 'Please provide at least 20 characters'),
    budget_range: z.string().optional(),
    timeline: z.string().optional()
})

export type ITLeadFormData = z.infer<typeof itLeadSchema>

// Service options for dropdown
export const IT_SERVICES = [
    'Custom ERP Development',
    'Mobile App Development',
    'QA & Testing Services',
    'Cloud Solutions',
    'IT Consulting',
    'Other'
] as const

// Budget ranges
export const BUDGET_RANGES = [
    'Under $10,000',
    '$10,000 - $50,000',
    '$50,000 - $100,000',
    '$100,000+',
    'To be discussed'
] as const

// Timeline options
export const TIMELINES = [
    'Urgent (< 1 month)',
    '1-3 months',
    '3-6 months',
    '6+ months',
    'Flexible'
] as const

// Lead statuses
export const LEAD_STATUSES = [
    'New',
    'Contacted',
    'Qualified',
    'Proposal Sent',
    'Won',
    'Lost'
] as const

// Lead priorities
export const LEAD_PRIORITIES = [
    'Low',
    'Medium',
    'High',
    'Urgent'
] as const
