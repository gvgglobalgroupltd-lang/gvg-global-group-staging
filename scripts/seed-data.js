
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedData() {
    console.log('🌱 Starting database seed...');

    // 1. Commodities
    const commodities = [
        { name: 'Copper Millberry', hscode: '74040012', description: 'Copper Wire Scrap 99.9%', is_precious: false },
        { name: 'Aluminum 6063', hscode: '76020010', description: 'Aluminum Extrusion Scrap', is_precious: false },
        { name: 'Brass Honey', hscode: '74040022', description: 'Yellow Brass Scrap', is_precious: false },
        { name: 'HMS 1&2', hscode: '72044900', description: 'Heavy Melting Steel Scrap', is_precious: false },
        { name: 'Gold Bars', hscode: '71081200', description: 'Gold Bullion 99.99%', is_precious: true }
    ];

    const { error: commError } = await supabase
        .from('commodities')
        .upsert(commodities, { onConflict: 'name', ignoreDuplicates: true });

    if (commError) console.error('Error seeding commodities:', commError.message);
    else console.log('✅ Commodities seeded');

    // 2. Partners
    const partners = [
        // Suppliers
        { company_name: 'Global Metals Inc', type: 'Supplier', country: 'USA', status: 'Active', contact_person: 'John Smith', email: 'john@globalmetals.com', phone: '+1 555-0123' },
        { company_name: 'Euro Scrap GmbH', type: 'Supplier', country: 'Germany', status: 'Active', contact_person: 'Hans Mueller', email: 'hans@euroscrap.de', phone: '+49 123 45678' },
        { company_name: 'Dubai Recyclers LLC', type: 'Supplier', country: 'Dubai', status: 'Active', contact_person: 'Ahmed Al-Sayed', email: 'ahmed@dubairecyclers.ae', phone: '+971 50 1234567' },
        // Customers
        { company_name: 'Mumbai Manufacturing Ltd', type: 'Customer', country: 'India', status: 'Active', contact_person: 'Rajesh Kumar', email: 'rajesh@mumbaimanufacturing.in', phone: '+91 98765 43210' },
        { company_name: 'Vietnam Steel Corp', type: 'Customer', country: 'Vietnam', status: 'Active', contact_person: 'Nguyen Van A', email: 'nguyen@vietnamsteel.vn', phone: '+84 90 123 4567' }
    ];

    /* 
       Note: Partners table usually doesn't have a unique name constraint in the basic schema, 
       but we want to avoid duplicates. We'll check existence first or just insert if simple upsert fails.
       For this script, we'll try to find by name first.
    */

    for (const partner of partners) {
        const { data } = await supabase.from('partners').select('id').eq('company_name', partner.company_name).single();
        if (!data) {
            await supabase.from('partners').insert(partner);
        }
    }
    console.log('✅ Partners seeded');

    // 3. Cost Heads
    const costHeads = [
        { name: 'Ocean Freight', category: 'Freight', default_value: 1200.00, is_fixed: false },
        { name: 'Terminal Handling Charges', category: 'Handling', default_value: 300.00, is_fixed: true },
        { name: 'Insurance Premium', category: 'Insurance', default_value: 150.00, is_fixed: false },
        { name: 'Customs Clearance', category: 'Duty', default_value: 500.00, is_fixed: true },
        { name: 'Trucking', category: 'Freight', default_value: 400.00, is_fixed: false }
    ];

    const { error: costError } = await supabase
        .from('cost_heads')
        .upsert(costHeads, { onConflict: 'name', ignoreDuplicates: true });

    if (costError) console.error('Error seeding cost heads:', costError.message);
    else console.log('✅ Cost Heads seeded');

    console.log('✨ Seeding complete!');
}

seedData();
