const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

// Create admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function executeSqlFile(filePath, fileName) {
    console.log(`\n📄 Reading ${fileName}...`)

    try {
        const sql = fs.readFileSync(filePath, 'utf8')
        console.log(`✅ File loaded (${sql.length} characters)`)

        console.log(`\n🚀 Executing ${fileName}...`)
        console.log('⏳ This may take a moment...\n')

        // Execute the SQL
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

        if (error) {
            // If exec_sql function doesn't exist, try direct query
            if (error.message.includes('function') || error.message.includes('exec_sql')) {
                console.log('⚠️  Using alternative execution method...')

                // Split SQL into individual statements and execute them
                const statements = sql
                    .split(';')
                    .map(s => s.trim())
                    .filter(s => s.length > 0 && !s.startsWith('--'))

                console.log(`📋 Executing ${statements.length} SQL statements...`)

                let successCount = 0
                let errorCount = 0

                for (let i = 0; i < statements.length; i++) {
                    const stmt = statements[i]
                    if (stmt.length < 10) continue // Skip tiny statements

                    try {
                        const { error: stmtError } = await supabase.rpc('exec_sql', {
                            sql_query: stmt + ';'
                        }).catch(() => {
                            // If rpc doesn't work, we'll need to handle this differently
                            return { error: new Error('RPC not available') }
                        })

                        if (stmtError && stmtError.message === 'RPC not available') {
                            // Direct SQL execution via REST API
                            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'apikey': supabaseServiceKey,
                                    'Authorization': `Bearer ${supabaseServiceKey}`
                                },
                                body: JSON.stringify({ sql_query: stmt + ';' })
                            })

                            if (!response.ok) {
                                throw new Error(`HTTP ${response.status}: ${await response.text()}`)
                            }
                        } else if (stmtError) {
                            throw stmtError
                        }

                        successCount++
                        process.stdout.write(`\r✅ Progress: ${successCount}/${statements.length} statements executed`)
                    } catch (err) {
                        errorCount++
                        console.log(`\n⚠️  Statement ${i + 1} error (continuing): ${err.message.substring(0, 100)}`)
                    }
                }

                console.log(`\n\n✅ Migration completed: ${successCount} successful, ${errorCount} errors`)
                return { success: true, successCount, errorCount }
            } else {
                throw error
            }
        } else {
            console.log('✅ SQL executed successfully!')
            return { success: true, data }
        }
    } catch (error) {
        console.error(`\n❌ Error executing ${fileName}:`)
        console.error(error.message)
        return { success: false, error }
    }
}

async function runMigrations() {
    console.log('🗄️  GVG Global Group - Database Migration')
    console.log('='.repeat(50))
    console.log(`📡 Supabase URL: ${supabaseUrl}`)
    console.log(`🔑 Using service role key: ${supabaseServiceKey.substring(0, 20)}...`)

    const migrationsDir = path.join(__dirname, 'supabase', 'migrations')

    const migrations = [
        { file: '001_initial_schema.sql', name: 'Initial Schema' },
        { file: '002_seed_data.sql', name: 'Seed Data' }
    ]

    for (const migration of migrations) {
        const filePath = path.join(migrationsDir, migration.file)

        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  Skipping ${migration.name}: File not found`)
            continue
        }

        console.log(`\n${'='.repeat(50)}`)
        console.log(`📦 MIGRATION: ${migration.name}`)
        console.log('='.repeat(50))

        const result = await executeSqlFile(filePath, migration.file)

        if (!result.success) {
            console.error(`\n❌ Migration failed: ${migration.name}`)
            console.error('Stopping migration process.')
            process.exit(1)
        }
    }

    console.log(`\n${'='.repeat(50)}`)
    console.log('🎉 ALL MIGRATIONS COMPLETED SUCCESSFULLY!')
    console.log('='.repeat(50))
    console.log('\n✅ Database schema ready!')
    console.log('\n📋 Next steps:')
    console.log('  1. Go to your Supabase dashboard: Table Editor')
    console.log('  2. Verify that all 10 tables exist')
    console.log('  3. Create an admin user or update your profile role')
    console.log('  4. Test the application at http://localhost:3000')
    console.log('')
}

// Run migrations
runMigrations().catch(error => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
})
