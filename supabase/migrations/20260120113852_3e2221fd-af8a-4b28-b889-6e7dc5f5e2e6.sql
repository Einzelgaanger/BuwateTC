-- =====================================================
-- BTC Tennis Club Complete Database Schema
-- =====================================================

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'member', 'coach');

-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Create enum for member status
CREATE TYPE public.member_status AS ENUM ('active', 'inactive', 'suspended');

-- Create enum for court status
CREATE TYPE public.court_status AS ENUM ('active', 'maintenance', 'closed');

-- Create enum for session status
CREATE TYPE public.session_status AS ENUM ('pending', 'confirmed', 'rejected', 'completed', 'cancelled');

-- Create enum for dependent relationship
CREATE TYPE public.dependent_relationship AS ENUM ('spouse', 'child', 'parent', 'sibling', 'other');

-- Create enum for membership type
CREATE TYPE public.membership_type AS ENUM ('monthly', 'annual', 'pay_as_you_play');

-- =====================================================
-- USER ROLES TABLE (Critical for auth)
-- =====================================================
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    address TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    membership_type membership_type DEFAULT 'pay_as_you_play',
    membership_start DATE,
    membership_end DATE,
    status member_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- DEPENDENTS TABLE (for member family members)
-- =====================================================
CREATE TABLE public.dependents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    relationship dependent_relationship NOT NULL,
    date_of_birth DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dependents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their own dependents"
  ON public.dependents
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = dependents.member_id 
    AND profiles.user_id = auth.uid()
  ));

CREATE POLICY "Members can manage their own dependents"
  ON public.dependents
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = dependents.member_id 
    AND profiles.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all dependents"
  ON public.dependents
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all dependents"
  ON public.dependents
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- COURTS TABLE
-- =====================================================
CREATE TABLE public.courts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    surface TEXT DEFAULT 'Clay',
    description TEXT,
    status court_status DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;

-- Everyone can view courts
CREATE POLICY "Anyone can view active courts"
  ON public.courts
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage courts"
  ON public.courts
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- Insert default courts
INSERT INTO public.courts (name, surface, description, status, notes) VALUES
  ('Court 1', 'Clay', 'Primary court - standard size', 'active', 'Main competition court'),
  ('Court 2', 'Clay', 'Secondary court - standard size', 'active', 'Training and practice court');

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    court_id UUID REFERENCES public.courts(id) ON DELETE CASCADE NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status booking_status DEFAULT 'pending',
    booking_type TEXT DEFAULT 'member', -- member, non_member, coaching, academy
    opponent_name TEXT,
    coach_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    amount INTEGER DEFAULT 0, -- in UGX
    is_prime_time BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = coach_id);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Coaches can view bookings they're assigned to"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = coach_id);

CREATE POLICY "Admins can view all bookings"
  ON public.bookings
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all bookings"
  ON public.bookings
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL, -- in UGX
    description TEXT,
    payment_method TEXT DEFAULT 'momo', -- momo, cash, bank
    transaction_reference TEXT,
    status payment_status DEFAULT 'pending',
    payment_date DATE,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments"
  ON public.payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON public.payments
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all payments"
  ON public.payments
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- COACH AVAILABILITY TABLE
-- =====================================================
CREATE TABLE public.coach_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    recurring TEXT DEFAULT 'none', -- none, daily, weekly
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coach_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can view their own availability"
  ON public.coach_availability
  FOR SELECT
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can manage their own availability"
  ON public.coach_availability
  FOR ALL
  USING (auth.uid() = coach_id);

CREATE POLICY "Members can view coach availability"
  ON public.coach_availability
  FOR SELECT
  USING (is_available = true);

CREATE POLICY "Admins can view all availability"
  ON public.coach_availability
  FOR SELECT
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- COACHING SESSIONS TABLE
-- =====================================================
CREATE TABLE public.coaching_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    student_name TEXT,
    court_id UUID REFERENCES public.courts(id) ON DELETE SET NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_type TEXT DEFAULT 'private', -- private, academy
    status session_status DEFAULT 'pending',
    amount INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can view their own sessions"
  ON public.coaching_sessions
  FOR SELECT
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can manage their own sessions"
  ON public.coaching_sessions
  FOR ALL
  USING (auth.uid() = coach_id);

CREATE POLICY "Students can view their sessions"
  ON public.coaching_sessions
  FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all sessions"
  ON public.coaching_sessions
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all sessions"
  ON public.coaching_sessions
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- REVENUE ENTRIES TABLE (for P&L tracking)
-- =====================================================
CREATE TABLE public.revenue_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL, -- Pledges, Membership Fees, Playing Fees, etc.
    description TEXT,
    amount INTEGER NOT NULL, -- in UGX
    entry_date DATE NOT NULL,
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    member_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_cash BOOLEAN DEFAULT true, -- true = cash, false = accrual
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.revenue_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all revenue"
  ON public.revenue_entries
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage revenue"
  ON public.revenue_entries
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- EXPENSE ENTRIES TABLE (for P&L tracking)
-- =====================================================
CREATE TABLE public.expense_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL, -- Salaries, Maintenance, Utilities, etc.
    description TEXT,
    amount INTEGER NOT NULL, -- in UGX
    entry_date DATE NOT NULL,
    is_cash BOOLEAN DEFAULT true, -- true = cash, false = accrual
    vendor TEXT,
    receipt_url TEXT,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.expense_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all expenses"
  ON public.expense_entries
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage expenses"
  ON public.expense_entries
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- PLEDGES TABLE
-- =====================================================
CREATE TABLE public.pledges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL, -- in UGX
    description TEXT,
    pledge_date DATE NOT NULL,
    due_date DATE,
    paid_amount INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending', -- pending, partial, fulfilled
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pledges"
  ON public.pledges
  FOR SELECT
  USING (auth.uid() = member_id);

CREATE POLICY "Users can create their own pledges"
  ON public.pledges
  FOR INSERT
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Admins can view all pledges"
  ON public.pledges
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all pledges"
  ON public.pledges
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dependents_updated_at BEFORE UPDATE ON public.dependents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courts_updated_at BEFORE UPDATE ON public.courts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_coach_availability_updated_at BEFORE UPDATE ON public.coach_availability FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_coaching_sessions_updated_at BEFORE UPDATE ON public.coaching_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_revenue_entries_updated_at BEFORE UPDATE ON public.revenue_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_expense_entries_updated_at BEFORE UPDATE ON public.expense_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pledges_updated_at BEFORE UPDATE ON public.pledges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to create user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Get role from user metadata (set during signup), default to 'member'
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::app_role,
    'member'
  );
  
  -- Insert the role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create profile entry
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_court_id ON public.bookings(court_id);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_coach_availability_coach_id ON public.coach_availability(coach_id);
CREATE INDEX idx_coach_availability_date ON public.coach_availability(date);
CREATE INDEX idx_coaching_sessions_coach_id ON public.coaching_sessions(coach_id);
CREATE INDEX idx_coaching_sessions_student_id ON public.coaching_sessions(student_id);
CREATE INDEX idx_coaching_sessions_date ON public.coaching_sessions(session_date);
CREATE INDEX idx_revenue_entries_date ON public.revenue_entries(entry_date);
CREATE INDEX idx_expense_entries_date ON public.expense_entries(entry_date);
CREATE INDEX idx_pledges_member_id ON public.pledges(member_id);