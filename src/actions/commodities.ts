'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'

const commoditySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    hscode: z.string().min(1, 'HS Code is required'),
    description: z.string().optional(),
})

export type CommodityFormData = z.infer<typeof commoditySchema>

export async function addCommodity(data: CommodityFormData) {
    console.log('addCommodity called with:', data)
    const result = commoditySchema.safeParse(data)

    if (!result.success) {
        console.error('Commodity validation failed:', result.error.flatten().fieldErrors)
        return { success: false, error: result.error.issues[0].message }
    }

    try {
        const supabase = await createClient()

        const { error } = await (supabase
            .from('commodities') as any)
            .insert({
                id: uuidv4(),
                name: data.name,
                hscode: data.hscode,
                description: data.description,
            })

        if (error) {
            console.error('Supabase error adding commodity:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/commodities')
        return { success: true }
    } catch (error) {
        console.error('Server error adding commodity:', error)
        return { success: false, error: 'Failed to add commodity. Please try again.' }
    }
}
