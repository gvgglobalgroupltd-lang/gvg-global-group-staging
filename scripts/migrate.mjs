/**
 * Supabase Database Migration Helper
 * 
 * This script helps you apply database migrations to your Supabase project.
 * Due to security restrictions, SQL must be executed via the Supabase dashboard.
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const projectRef = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').hostname.split('.')[0]

console.log('\n' + '='.repeat(70))
console.log('🗄️  GVG GLOBAL GROUP - DATABASE MIGRATION GUIDE')
console.log('='.repeat(70) + '\n')

if (!projectRef || projectRef === 'undefined') {
    console.error('❌ Could not detect Supabase project reference from .env.local')
    console.error('   Please check your NEXT_PUBLIC_SUPABASE_URL setting\n')
    process.exit(1)
}

console.log(`📡 Project: ${projectRef}`)
console.log(`🔗 SQL Editor: https://supabase.com/dashboard/project/${projectRef}/sql/new\n`)

console.log('-'.repeat(70))
console.log('📋 MIGRATION STEPS')
console.log('-'.repeat(70) + '\n')

console.log('Step 1: Open Supabase SQL Editor')
console.log(`        → https://supabase.com/dashboard/project/${projectRef}/sql/new\n`)

console.log('Step 2: Execute Schema Migration')
console.log(`        → File: supabase/migrations/001_initial_schema.sql`)
console.log(`        → Copy entire file content`)
console.log(`        → Paste in SQL Editor`)
console.log(`        → Click "RUN" button\n`)

console.log('Step 3: Execute Seed Data')
console.log(`        → File: supabase/migrations/002_seed_data.sql`)
console.log(`        → Copy entire file content`)
console.log(`        → Paste in SQL Editor`)
console.log(`        → Click "RUN" button\n`)

console.log('Step 4: Verify Migration')
console.log(`        → Go to Table Editor`)
console.log(`        → Should see 10 tables: profiles, commodities, partners,`)
console.log(`          cost_heads, deals, deal_expenses, shipments, inventory,`)
console.log(`          leads, projects\n`)

console.log('Step 5: Update Your Profile')
console.log(`        Run this SQL to make yourself an Admin:` + '\n')
console.log(`        UPDATE profiles`)
console.log(`        SET role = 'Admin', full_name = 'Your Name'`)
console.log(`        WHERE email = 'your-email@example.com';\n`)

console.log('='.repeat(70))
console.log('📄 MIGRATION FILE CONTENTS')
console.log('='.repeat(70) + '\n')

try {
    const schemaPath = join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql')
    const seedPath = join(__dirname, '..', 'supabase', 'migrations', '002_seed_data.sql')

    const schema = readFileSync(schemaPath, 'utf8')
    const seed = readFileSync(seedPath, 'utf8')

    console.log(`✅ Schema SQL loaded (${schema.length.toLocaleString()} characters)`)
    console.log(`   Location: supabase/migrations/001_initial_schema.sql\n`)

    console.log(`✅ Seed SQL loaded (${seed.length.toLocaleString()} characters)`)
    console.log(`   Location: supabase/migrations/002_seed_data.sql\n`)

    console.log('💡TIP: You can copy-paste directly from the files in your editor!')
    console.log('      Or use the Supabase dashboard file upload feature.\n')

} catch (error) {
    console.error(`❌ Error reading migration files: ${error.message}\n`)
    process.exit(1)
}

console.log('='.repeat(70))
console.log('✅ Ready to migrate! Follow the steps above.')
console.log('='.repeat(70) + '\n')

// Offer to open the URL
console.log('💻 Quick action: Opening SQL Editor in your browser...\n')

// Try to open browser (works on most systems)
const { exec } = await import('child_process')
const url = `https://supabase.com/dashboard/project/${projectRef}/sql/new`

const command = process.platform === 'win32' ? `start ${url}` :
    process.platform === 'darwin' ? `open ${url}` :
        `xdg-open ${url}`

exec(command, (error) => {
    if (error) {
        console.log('⚠️  Could not auto-open browser. Please open manually:')
        console.log(`   ${url}\n`)
    } else {
        console.log('✅ Browser opened! You can now paste and execute the SQL.\n')
    }
})
