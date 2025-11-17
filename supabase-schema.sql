-- Das Program Database Schema
-- Run this in your Supabase SQL Editor to create all tables with RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends auth.users)
-- ============================================
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    business_name TEXT,
    business_logo_url TEXT,
    business_address TEXT,
    business_phone TEXT,
    business_email TEXT,
    business_website TEXT,
    tax_id TEXT,
    vat_number TEXT,
    bank_details JSONB,
    default_currency TEXT DEFAULT 'USD',
    default_language TEXT DEFAULT 'en',
    stripe_account_id TEXT,
    paypal_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CLIENTS TABLE
-- ============================================
CREATE TABLE public.clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT,
    vat_number TEXT,
    language_preference TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_clients_email ON public.clients(user_id, email);

-- ============================================
-- PROPOSALS TABLE
-- ============================================
CREATE TYPE proposal_status AS ENUM ('draft', 'sent', 'viewed', 'signed', 'rejected', 'expired');

CREATE TABLE public.proposals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    proposal_number TEXT NOT NULL,
    title TEXT NOT NULL,
    template_id TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    content JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    tax_amount DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status proposal_status DEFAULT 'draft',
    valid_until DATE,
    signed_at TIMESTAMP WITH TIME ZONE,
    signature_data TEXT,
    signer_name TEXT,
    signer_email TEXT,
    view_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE,
    pdf_url TEXT,
    share_token UUID DEFAULT uuid_generate_v4() UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_proposals_user_id ON public.proposals(user_id);
CREATE INDEX idx_proposals_status ON public.proposals(user_id, status);
CREATE INDEX idx_proposals_share_token ON public.proposals(share_token);

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'viewed', 'paid', 'partially_paid', 'overdue', 'cancelled');
CREATE TYPE payment_method AS ENUM ('stripe', 'paypal', 'bank_transfer', 'cash', 'other');

CREATE TABLE public.invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    template_id TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    items JSONB NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    tax_amount DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status invoice_status DEFAULT 'draft',
    payment_method payment_method,
    payment_terms TEXT DEFAULT 'Net 30',
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    paid_at TIMESTAMP WITH TIME ZONE,
    stripe_payment_intent_id TEXT,
    paypal_order_id TEXT,
    notes TEXT,
    footer_text TEXT,
    view_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE,
    pdf_url TEXT,
    share_token UUID DEFAULT uuid_generate_v4() UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_status ON public.invoices(user_id, status);
CREATE INDEX idx_invoices_due_date ON public.invoices(user_id, due_date);
CREATE INDEX idx_invoices_share_token ON public.invoices(share_token);

-- ============================================
-- TIME ENTRIES TABLE
-- ============================================
CREATE TABLE public.time_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    project_name TEXT,
    task_description TEXT,
    hours DECIMAL(8, 2) NOT NULL,
    minutes INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10, 2),
    total_amount DECIMAL(10, 2),
    date DATE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    billable BOOLEAN DEFAULT TRUE,
    invoiced BOOLEAN DEFAULT FALSE,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_time_entries_user_id ON public.time_entries(user_id);
CREATE INDEX idx_time_entries_date ON public.time_entries(user_id, date);
CREATE INDEX idx_time_entries_billable ON public.time_entries(user_id, billable);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    unit TEXT DEFAULT 'hour',
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    category TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_services_user_id ON public.services(user_id);
CREATE INDEX idx_services_active ON public.services(user_id, active);

-- ============================================
-- EMAIL LOGS TABLE
-- ============================================
CREATE TYPE document_type AS ENUM ('proposal', 'invoice');
CREATE TYPE email_status AS ENUM ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed');

CREATE TABLE public.email_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    document_type document_type NOT NULL,
    document_id UUID NOT NULL,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    subject TEXT NOT NULL,
    message TEXT,
    resend_email_id TEXT,
    status email_status DEFAULT 'sent',
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    failed_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_logs_user_id ON public.email_logs(user_id);
CREATE INDEX idx_email_logs_document ON public.email_logs(user_id, document_type, document_id);

-- ============================================
-- PAYMENT TRANSACTIONS TABLE
-- ============================================
CREATE TYPE payment_provider AS ENUM ('stripe', 'paypal');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

CREATE TABLE public.payment_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
    payment_provider payment_provider NOT NULL,
    transaction_id TEXT UNIQUE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT NOT NULL,
    status transaction_status DEFAULT 'pending',
    payment_method_details JSONB,
    fee_amount DECIMAL(12, 2),
    net_amount DECIMAL(12, 2),
    paid_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_invoice_id ON public.payment_transactions(invoice_id);

-- ============================================
-- FOLLOW UP SCHEDULES TABLE
-- ============================================
CREATE TYPE schedule_status AS ENUM ('pending', 'sent', 'cancelled');

CREATE TABLE public.follow_up_schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    document_type document_type NOT NULL,
    document_id UUID NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    status schedule_status DEFAULT 'pending',
    email_template TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_follow_up_schedules_scheduled ON public.follow_up_schedules(scheduled_at, status);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_schedules ENABLE ROW LEVEL SECURITY;

-- USERS policies
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- CLIENTS policies
CREATE POLICY "Users can view own clients" ON public.clients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" ON public.clients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON public.clients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON public.clients
    FOR DELETE USING (auth.uid() = user_id);

-- PROPOSALS policies
CREATE POLICY "Users can view own proposals" ON public.proposals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can view proposals via share token" ON public.proposals
    FOR SELECT USING (share_token IS NOT NULL);

CREATE POLICY "Users can insert own proposals" ON public.proposals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own proposals" ON public.proposals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own proposals" ON public.proposals
    FOR DELETE USING (auth.uid() = user_id);

-- INVOICES policies
CREATE POLICY "Users can view own invoices" ON public.invoices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can view invoices via share token" ON public.invoices
    FOR SELECT USING (share_token IS NOT NULL);

CREATE POLICY "Users can insert own invoices" ON public.invoices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON public.invoices
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices" ON public.invoices
    FOR DELETE USING (auth.uid() = user_id);

-- TIME ENTRIES policies
CREATE POLICY "Users can view own time entries" ON public.time_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own time entries" ON public.time_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own time entries" ON public.time_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own time entries" ON public.time_entries
    FOR DELETE USING (auth.uid() = user_id);

-- SERVICES policies
CREATE POLICY "Users can view own services" ON public.services
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own services" ON public.services
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own services" ON public.services
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own services" ON public.services
    FOR DELETE USING (auth.uid() = user_id);

-- EMAIL LOGS policies (read-only for users)
CREATE POLICY "Users can view own email logs" ON public.email_logs
    FOR SELECT USING (auth.uid() = user_id);

-- PAYMENT TRANSACTIONS policies (read-only for users)
CREATE POLICY "Users can view own payment transactions" ON public.payment_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- FOLLOW UP SCHEDULES policies
CREATE POLICY "Users can view own follow up schedules" ON public.follow_up_schedules
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own follow up schedules" ON public.follow_up_schedules
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own follow up schedules" ON public.follow_up_schedules
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own follow up schedules" ON public.follow_up_schedules
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON public.proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, business_email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NOW(), NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user record on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STORAGE BUCKETS (for file uploads)
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true),
       ('pdfs', 'pdfs', false),
       ('attachments', 'attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for logos bucket
CREATE POLICY "Users can upload their own logos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own logos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own logos" ON storage.objects
    FOR DELETE USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Logos are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'logos');

-- Storage policies for PDFs bucket
CREATE POLICY "Users can upload their own PDFs" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own PDFs" ON storage.objects
    FOR SELECT USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own PDFs" ON storage.objects
    FOR DELETE USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for attachments bucket
CREATE POLICY "Users can upload their own attachments" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own attachments" ON storage.objects
    FOR SELECT USING (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own attachments" ON storage.objects
    FOR DELETE USING (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
