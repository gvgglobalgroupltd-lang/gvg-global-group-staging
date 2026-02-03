
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyDatabase() {
    console.log('🔄 Connecting to Supabase...')
    console.log(`📍 URL: ${supabaseUrl}`)

    try {
        // 1. Fetch Commodities
        console.log('\n📦 Fetching Commodities...')
        const { data: commodities, error: commError } = await supabase
            .from('commodities')
            .select('name, hscode')
            .limit(5)

        if (commError) {
            console.error('❌ Error fetching commodities:', commError.message)
        } else {
            console.log(`✅ Success! Found ${commodities.length} commodities:`)
            console.table(commodities)
        }

        // 2. Fetch Partners
        console.log('\n🤝 Fetching Partners...')
        const { data: partners, error: partError } = await supabase
            .from('partners')
            .select('company_name, type, country')
            .limit(5)

        if (partError) {
            console.error('❌ Error fetching partners:', partError.message)
        } else {
            console.log(`✅ Success! Found ${partners.length} partners:`)
            console.table(partners)
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err)
    }
}

verifyDatabase()
