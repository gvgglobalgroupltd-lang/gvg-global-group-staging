const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
    console.log('🗄️  Executing Database Migration...\n')

    const schemaPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql')
    const seedPath = path.join(__dirname, '..', 'supabase', 'migrations', '002_seed_data.sql')

    try {
        // Read schema file
        const schema = fs.readFileSync(schemaPath, 'utf8')

        console.log('📋 Executing schema (this will be done via Supabase SQL Editor)...')
        console.log('❌ Direct SQL execution via API is restricted for security.')
        console.log('\n📍 Please follow these steps instead:\n')
        console.log('1. Open Supabase SQL Editor:')
        console.log('   https://supabase.com/dashboard/project/stslikhsodrvtpwtibdt/sql/new\n')
        console.log('2. Copy the SQL from: supabase/migrations/001_initial_schema.sql')
        console.log('3. Paste and click RUN')
        console.log('4. Then do the same for: 002_seed_data.sql\n')
        console.log('💡 This ensures proper transaction handling and error reporting.\n')

    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}

runMigration()
