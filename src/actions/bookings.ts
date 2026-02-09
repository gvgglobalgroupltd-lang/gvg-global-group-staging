
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const bookingSchema = z.object({
    service_id: z.string().uuid(),
    customer_name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Valid phone required"),
    address: z.string().min(5, "Address required for on-site service"),
    postal_code: z.string().min(3, "Postal code required"),
    booking_date: z.string(), // YYYY-MM-DD
    slot: z.enum(['Morning', 'Afternoon']),
    notes: z.string().optional()
})

export type CreateBookingState = {
    success: boolean
    message: string
    errors?: Record<string, string[]>
}

export async function createBooking(prevState: CreateBookingState, formData: FormData): Promise<CreateBookingState> {
    const supabase = await createClient()

    // Extract raw data
    const rawData = {
        service_id: formData.get('service_id'),
        customer_name: formData.get('customer_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        postal_code: formData.get('postal_code'),
        booking_date: formData.get('booking_date'),
        slot: formData.get('slot'),
        notes: formData.get('notes')
    }

    // Validate
    const validated = bookingSchema.safeParse(rawData)

    if (!validated.success) {
        return {
            success: false,
            message: 'Validation failed',
            errors: validated.error.flatten().fieldErrors
        }
    }

    const { error } = await supabase
        .from('bookings')
        .insert(validated.data)
        .select()

    if (error) {
        console.error('Booking creation error:', error)
        return {
            success: false,
            message: 'Failed to create booking. Please try again.'
        }
    }

    revalidatePath('/tech')
    return {
        success: true,
        message: 'Booking confirmed! We will contact you shortly.'
    }
}
