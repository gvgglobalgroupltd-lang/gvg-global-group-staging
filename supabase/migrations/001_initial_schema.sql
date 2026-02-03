-- =====================================================
-- GVG Global Group - Database Schema
-- Comprehensive ERP System for Metals Trading & IT Services
-- =====================================================

-- =====================================================
-- 1. USER & ACCESS MANAGEMENT
-- =====================================================

-- Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Trader', 'Consultant', 'Viewer')),
  branch TEXT NOT NULL CHECK (branch IN ('Halifax', 'India', 'Dubai')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- =====================================================
-- 2. MASTER DATA TABLES
-- =====================================================

-- Commodities Table
CREATE TABLE IF NOT EXISTS public.commodities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  hscode TEXT,
  default_customs_duty NUMERIC(10, 2) DEFAULT 0,
  is_precious BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for commodities
CREATE POLICY "Anyone can view commodities"
  ON public.commodities FOR SELECT
  USING (true);

CREATE POLICY "Admins and Traders can manage commodities"
  ON public.commodities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Trader')
    )
  );

-- Partners Table
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Supplier', 'Customer', 'Both')),
  country TEXT NOT NULL,
  tax_id TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Blacklist', 'Inactive')),
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partners
CREATE POLICY "Anyone can view active partners"
  ON public.partners FOR SELECT
  USING (status = 'Active' OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('Admin', 'Trader')
  ));

CREATE POLICY "Admins and Traders can manage partners"
  ON public.partners FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Trader')
    )
  );

-- Cost Heads Table
CREATE TABLE IF NOT EXISTS public.cost_heads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  default_value NUMERIC(10, 2) DEFAULT 0,
  is_fixed BOOLEAN DEFAULT false,
  category TEXT CHECK (category IN ('Freight', 'Duty', 'Bank', 'Handling', 'Other')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cost_heads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cost_heads
CREATE POLICY "Anyone can view cost heads"
  ON public.cost_heads FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage cost heads"
  ON public.cost_heads FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- =====================================================
-- 3. METAL TRADING CORE
-- =====================================================

-- Deals Table
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_ref TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (
    status IN ('Draft', 'Approved', 'Shipped', 'Customs', 'Stock', 'Sold', 'Cancelled')
  ),
  trader_id UUID NOT NULL REFERENCES public.profiles(id),
  partner_id UUID NOT NULL REFERENCES public.partners(id),
  commodity_id UUID REFERENCES public.commodities(id),
  
  -- Trade Details
  incoterm TEXT NOT NULL CHECK (incoterm IN ('FOB', 'CIF', 'EXW', 'DDP', 'DAP')),
  origin_country TEXT NOT NULL,
  logistics_type TEXT NOT NULL CHECK (logistics_type IN ('Self_Managed', 'Supplier_Managed')),
  destination_type TEXT NOT NULL CHECK (destination_type IN ('Warehouse', 'Direct_Customer')),
  
  -- Pricing & Quantity
  weight_mt NUMERIC(10, 3) NOT NULL,
  buy_price NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'CAD', 'AED', 'INR', 'EUR')),
  exchange_rate_locked NUMERIC(10, 4),
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT positive_weight CHECK (weight_mt > 0),
  CONSTRAINT positive_price CHECK (buy_price > 0)
);

-- Enable RLS
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deals
CREATE POLICY "Users can view deals based on role"
  ON public.deals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND (
        p.role IN ('Admin', 'Trader') OR
        (p.role = 'Viewer' AND deals.status != 'Draft')
      )
    )
  );

CREATE POLICY "Traders can create deals"
  ON public.deals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Trader')
    )
  );

CREATE POLICY "Traders can update their own deals or Admins can update all"
  ON public.deals FOR UPDATE
  USING (
    trader_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- Deal Expenses Table
CREATE TABLE IF NOT EXISTS public.deal_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  expense_name TEXT NOT NULL,
  amount_local NUMERIC(12, 2) NOT NULL,
  amount_inr NUMERIC(12, 2),
  category TEXT NOT NULL CHECK (category IN ('Freight', 'Duty', 'Bank', 'Handling', 'Insurance', 'Other')),
  currency TEXT DEFAULT 'USD',
  exchange_rate NUMERIC(10, 4),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT positive_amount CHECK (amount_local >= 0)
);

-- Enable RLS
ALTER TABLE public.deal_expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deal_expenses
CREATE POLICY "Users can view deal expenses if they can view the deal"
  ON public.deal_expenses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.deals d
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE d.id = deal_id
      AND (
        p.role IN ('Admin', 'Trader') OR
        (p.role = 'Viewer' AND d.status != 'Draft')
      )
    )
  );

CREATE POLICY "Traders can manage expenses for their deals"
  ON public.deal_expenses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE id = deal_id AND trader_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- =====================================================
-- 4. LOGISTICS & STOCK
-- =====================================================

-- Shipments Table
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  container_no TEXT,
  bl_number TEXT,
  eta DATE,
  ata DATE,
  shipping_line TEXT,
  vessel_name TEXT,
  port_of_loading TEXT,
  port_of_discharge TEXT,
  status TEXT DEFAULT 'In Transit' CHECK (
    status IN ('Booked', 'In Transit', 'Arrived', 'Cleared', 'Delivered')
  ),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shipments
CREATE POLICY "Users can view shipments based on deal access"
  ON public.shipments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.deals d
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE d.id = deal_id
      AND p.role IN ('Admin', 'Trader', 'Viewer')
    )
  );

CREATE POLICY "Traders and Admins can manage shipments"
  ON public.shipments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Trader')
    )
  );

-- Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id),
  warehouse_location TEXT NOT NULL,
  current_weight NUMERIC(10, 3) NOT NULL,
  reserved_weight NUMERIC(10, 3) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Available' CHECK (
    status IN ('Available', 'Reserved', 'Sold', 'In Transit', 'Damaged')
  ),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT positive_current_weight CHECK (current_weight >= 0),
  CONSTRAINT positive_reserved_weight CHECK (reserved_weight >= 0),
  CONSTRAINT valid_reservation CHECK (reserved_weight <= current_weight)
);

-- Enable RLS
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inventory
CREATE POLICY "Users can view inventory based on role"
  ON public.inventory FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Trader', 'Viewer')
    )
  );

CREATE POLICY "Traders and Admins can manage inventory"
  ON public.inventory FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Trader')
    )
  );

-- =====================================================
-- 5. IT SERVICES
-- =====================================================

-- Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  service_type TEXT NOT NULL CHECK (
    service_type IN ('Web', 'App', 'QA', 'Cloud', 'Consulting', 'Custom')
  ),
  status TEXT NOT NULL DEFAULT 'New' CHECK (
    status IN ('New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost')
  ),
  budget NUMERIC(12, 2),
  budget_currency TEXT DEFAULT 'USD',
  source TEXT,
  notes TEXT,
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads
CREATE POLICY "Consultants and Admins can view leads"
  ON public.leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Consultant')
    )
  );

CREATE POLICY "Consultants can create and manage leads"
  ON public.leads FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Consultant')
    )
  );

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id),
  project_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Planning' CHECK (
    status IN ('Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled')
  ),
  milestones JSONB DEFAULT '[]'::jsonb,
  deadline DATE,
  budget NUMERIC(12, 2),
  actual_cost NUMERIC(12, 2) DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  team_size INTEGER DEFAULT 1,
  assigned_to UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Team members can view projects"
  ON public.projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Consultant')
    )
  );

CREATE POLICY "Consultants and Admins can manage projects"
  ON public.projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Consultant')
    )
  );

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_branch ON public.profiles(branch);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Deals indexes
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_trader_id ON public.deals(trader_id);
CREATE INDEX IF NOT EXISTS idx_deals_partner_id ON public.deals(partner_id);
CREATE INDEX IF NOT EXISTS idx_deals_deal_ref ON public.deals(deal_ref);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON public.deals(created_at DESC);

-- Deal expenses indexes
CREATE INDEX IF NOT EXISTS idx_deal_expenses_deal_id ON public.deal_expenses(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_expenses_category ON public.deal_expenses(category);

-- Shipments indexes
CREATE INDEX IF NOT EXISTS idx_shipments_deal_id ON public.shipments(deal_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_eta ON public.shipments(eta);

-- Inventory indexes
CREATE INDEX IF NOT EXISTS idx_inventory_deal_id ON public.inventory(deal_id);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON public.inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse ON public.inventory(warehouse_location);

-- Leads indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_service_type ON public.leads(service_type);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON public.projects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_projects_deadline ON public.projects(deadline);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commodities_updated_at BEFORE UPDATE ON public.commodities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_heads_updated_at BEFORE UPDATE ON public.cost_heads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON public.shipments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION: Auto-create profile on user signup
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, branch)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'Viewer'),
    COALESCE(NEW.raw_user_meta_data->>'branch', 'Halifax')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
