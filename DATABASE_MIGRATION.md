# Database Migration Guide

## 📋 Overview

This guide will help you execute the database migrations to set up your GVG Global Group ERP database schema in Supabase.

---

## 🗄️ Database Schema Summary

### Tables Created (10 total)

#### 1. **User & Access** (1 table)
- `profiles` - User profiles with roles and branch assignments

#### 2. **Master Data** (3 tables)
- `commodities` - Metal types and HS codes
- `partners` - Suppliers and customers
- `cost_heads` - Standard expense categories

#### 3. **Metal Trading Core** (2 tables)
- `deals` - Metal trading transactions
- `deal_expenses` - per-deal expense tracking

#### 4. **Logistics & Stock** (2 tables)
- `shipments` - Shipping and container tracking
- `inventory` - Warehouse stock management

#### 5. **IT Services** (2 tables)
- `leads` - Sales leads for IT services
- `projects` - IT project management

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with role-based policies:

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all tables |
| **Trader** | Full access to metals-related tables, view others |
| **Consultant** | Full access to IT-related tables, view others |
| **Viewer** | Read-only access to approved/public data |

---

## 🚀 How to Apply Migrations

### Option 1: Supabase Dashboard (Recommended)

1. **Go to SQL Editor**
   - Visit: https://supabase.com/dashboard/project/stslikhsodrvtpwtibdt/sql/new

2. **Run Schema Migration**
   - Open `supabase/migrations/001_initial_schema.sql`
   - Copy the entire content
   - Paste into Supabase SQL Editor
   - Click **RUN** (bottom right)
   - Wait for success message

3. **Run Seed Data**
   - Open `supabase/migrations/002_seed_data.sql`
   - Copy the entire content
   - Paste into Supabase SQL Editor
   - Click **RUN**
   - Wait for success message

4. **Verify Tables Created**
   - Go to **Table Editor** in Supabase dashboard
   - You should see all 10 tables listed

### Option 2: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref stslikhsodrvtpwtibdt

# Apply migrations
supabase db push
```

---

## ✅ Post-Migration Verification

### 1. Check Tables
```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected output: 10 tables (commodities, cost_heads, deal_expenses, deals, inventory, leads, partners, profiles, projects, shipments)

### 2. Check RLS Policies
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`

### 3. Check Sample Data
```sql
-- Verify seed data loaded
SELECT COUNT(*) FROM commodities; -- Should be 6
SELECT COUNT(*) FROM partners; -- Should be 6
SELECT COUNT(*) FROM cost_heads; -- Should be 8
```

---

## 📊 Sample Data Included

### Commodities (6 items)
- Copper Millberry
- Aluminum Ingots
- Steel HMS 1&2
- Gold Bars
- Silver Bars
- Zinc Ingots

### Partners (6 companies)
- Global Metals Inc (USA)
- Asian Steel Trading (China)
- European Copper Co (Germany)
- Middle East Alloys (UAE)
- Indian Manufacturing Ltd (India)
- Canadian Resources (Canada)

### Cost Heads (8 categories)
- Ocean Freight
- CHA Charges
- SWS Fee
- Port Handling
- Inland Transport
- Bank Charges
- Insurance
- Customs Duty

---

## 🔧 TypeScript Integration

The TypeScript types are already configured in your project:

### Type Imports
```typescript
import type { Database, Deal, Profile, Partner } from '@/lib/database.types'
import { createClient } from '@/lib/supabase/client'

// Fully typed client
const supabase = createClient() // Now has full type inference
```

### Example Usage
```typescript
// Insert a new deal (TypeScript will validate the structure)
const { data, error } = await supabase
  .from('deals')
  .insert({
    deal_ref: 'MTL-2024-001',
    trader_id: userId,
    partner_id: partnerId,
    incoterm: 'FOB', // TypeScript knows valid values
    origin_country: 'USA',
    logistics_type: 'Self_Managed',
    destination_type: 'Warehouse',
    weight_mt: 100,
    buy_price: 50000,
    currency: 'USD'
  })
  
// Query with type-safe results
const { data: deals } = await supabase
  .from('deals')
  .select('*, trader:profiles(*), partner:partners(*)')
  .eq('status', 'Approved')
// data is fully typed as DealWithRelations[]
```

---

## 🎯 Next Steps After Migration

### 1. Create Your Admin Profile
The auto-trigger will create a profile when you sign up, but you can update it:

```sql
-- Update your profile to Admin role
UPDATE profiles 
SET role = 'Admin', 
    full_name = 'Your Name',
    branch = 'Halifax'
WHERE email = 'your-email@example.com';
```

### 2. Test the Application

**Metals Division** (`/admin/metals`)
- Create test deals
- Add expenses to deals
- Track shipments
- Manage inventory

**Tech Division** (`/admin/tech`)
- Create leads
- Convert leads to projects
- Track project progress
- Manage milestones

### 3. Build Custom Pages

You can now create pages that interact with the database:

- Deal management interface
- Inventory dashboard
- Project timeline view
- Financial reports
- Analytics dashboards

---

## 🔍 Useful SQL Queries

### Get all deals with related data
```sql
SELECT 
  d.*,
  p.full_name as trader_name,
  pt.company_name as partner_name,
  c.name as commodity_name
FROM deals d
LEFT JOIN profiles p ON d.trader_id = p.id
LEFT JOIN partners pt ON d.partner_id = pt.id
LEFT JOIN commodities c ON d.commodity_id = c.id
ORDER BY d.created_at DESC;
```

### Calculate total expenses per deal
```sql
SELECT 
  d.deal_ref,
  SUM(de.amount_inr) as total_expenses_inr
FROM deals d
LEFT JOIN deal_expenses de ON d.id = de.deal_id
GROUP BY d.id, d.deal_ref;
```

### View inventory summary by warehouse
```sql
SELECT 
  warehouse_location,
  status,
  SUM(current_weight) as total_weight,
  COUNT(*) as lot_count
FROM inventory
GROUP BY warehouse_location, status
ORDER BY warehouse_location;
```

---

## ⚠️ Important Notes

1. **RLS is Enforced**: All queries respect row-level security based on the authenticated user's role
2. **Auto-triggers**: The database automatically:
   - Updates `updated_at` timestamps
   - Creates profile on user signup
3. **Foreign Keys**: All relationships are enforced with cascading deletes where appropriate
4. **Indexes**: Performance indexes are created on commonly queried fields

---

## 🆘 Troubleshooting

### Error: "relation does not exist"
- Migration not applied yet. Run the SQL files in Supabase dashboard

### Error: "permission denied for table"
- RLS policies blocking access. Ensure your user has the correct role in the profiles table

### Error: "violates foreign key constraint"
- Referenced record doesn't exist. Create master data (partners, commodities) before creating deals

### TypeScript errors after migration
- Restart your dev server: `npm run dev`
- Clear Next.js cache: `rm -rf .next` (or delete `.next` folder)

---

## 📚 Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [TypeScript Support](https://supabase.com/docs/guides/api/typescript-support)
- [Supabase SQL Editor](https://supabase.com/dashboard/project/stslikhsodrvtpwtibdt/sql)

---

**Ready to apply migrations?** Open the Supabase dashboard and follow Option 1 above!
