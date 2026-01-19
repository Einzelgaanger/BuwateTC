# Buwate Tennis Club (BTC) Management System
## Complete System Specification Document

**Version:** 1.0  
**Date:** January 19, 2026  
**Status:** Partial Implementation - See Progress Report Below

---

## 📊 PROGRESS REPORT

### ✅ What Has Been Built

1. **Frontend Foundation**
   - React + TypeScript + Vite setup
   - Modern UI with shadcn/ui components and Tailwind CSS
   - Responsive design with mobile support
   - Routing structure (React Router)

2. **Pages Implemented (UI Only)**
   - Homepage (`/`) - Hero, features, pricing, rules sections
   - Authentication (`/auth`) - Login/Signup with Supabase Auth integration
   - Membership (`/membership`) - Static membership information
   - Book Court (`/book`) - Court booking UI with calendar and time slots (uses mock data)
   - Dashboard (`/dashboard`) - Basic layout with mock data, sidebar navigation
   - About (`/about`) - Basic about page
   - 404 Not Found page

3. **AI Assistant**
   - Floating chat widget (BTC Assistant)
   - Supabase Edge Function integration (`btc-assistant`)
   - Stream-based responses
   - System prompt configured with club information

4. **Infrastructure**
   - Supabase client configured
   - Environment variables setup
   - TypeScript types (empty database schema currently)

### ❌ What Is Missing / Needs Completion

1. **Database Schema**
   - No tables defined yet (types.ts shows empty schema)
   - Need all tables for: members, bookings, payments, courts, coaches, dependents, P&L

2. **Core Functionality**
   - Booking system not connected to database
   - No real-time availability checking
   - Payment tracking incomplete
   - Member management missing
   - Dependents management missing

3. **Admin Interface**
   - Completely missing
   - Need full admin dashboard

4. **Coach Interface**
   - Completely missing
   - Need coach availability management

5. **Features Not Implemented**
   - P&L (Profit & Loss) accounting system
   - Member dependents (spouse/children)
   - Payment records integration
   - Booking cancellation with 2-hour rule
   - 24-hour advance booking enforcement
   - Prime time vs off-peak pricing
   - MoMo payment integration
   - Coach session bookings
   - Tournament management

---

## 🏗️ SYSTEM ARCHITECTURE

### Technology Stack
- **Frontend:** React 18, TypeScript, Vite
- **UI Library:** shadcn/ui, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Authentication:** Supabase Auth
- **AI:** Lovable AI Gateway (Gemini Flash)
- **Payment:** Mobile Money (MoMo) - 0790229161 (Brian Isubikalu)

### Database: Supabase PostgreSQL

---

## 📋 COMPLETE FEATURE SPECIFICATION

### 1. USER INTERFACES (3 Types)

#### A. PUBLIC VISITOR INTERFACE (Unauthenticated)

**Pages:**
- Home (`/`) ✅ IMPLEMENTED
- About (`/about`) ✅ IMPLEMENTED  
- Membership Info (`/membership`) ✅ IMPLEMENTED
- Book Court (`/book`) ✅ UI ONLY (needs DB integration)
- Login/Signup (`/auth`) ✅ IMPLEMENTED

**Features:**
- View club information
- See membership options and pricing
- Check court availability (read-only)
- View club rules
- Access AI Assistant for information
- Sign up for membership

---

#### B. MEMBER INTERFACE (Authenticated Users)

**Route:** `/dashboard` (already created, needs completion)

**Tabs/Sections:**

##### Tab 1: Overview (#overview)
**Status:** ⚠️ PARTIAL - Has basic layout, needs real data

**Content:**
- Welcome message with member name
- Statistics Cards:
  - Total Bookings (all-time)
  - Hours Played (all-time)
  - Outstanding Balance (UGX)
  - Member Since (date)
  - Upcoming Bookings Count
- Quick Actions:
  - Book Court button
  - Make Payment button
  - Update Profile button
- Recent Activity Feed:
  - Last 5 bookings
  - Recent payments
  - Notifications

##### Tab 2: My Bookings (#bookings)
**Status:** ❌ NOT IMPLEMENTED

**Content:**
- Filter Options:
  - All / Upcoming / Past / Cancelled
  - Date range picker
- Bookings List:
  - Each booking card shows:
    - Court number (Court 1 or Court 2)
    - Date and time
    - Duration (always 1 hour)
    - Booking status (Upcoming, Completed, Cancelled)
    - Amount paid/owed
    - Opponent name (if specified)
    - Coach name (if booked with coach)
  - Actions per booking:
    - Cancel (if >2 hours before)
    - View details
    - Pay (if unpaid)
- Empty state when no bookings
- Calendar view option (optional)

**Booking Rules Enforced:**
- Can only book 24+ hours in advance
- Maximum 1 hour per booking
- Can cancel only if >2 hours before slot
- Cannot book past slots

##### Tab 3: Payments (#payments)
**Status:** ❌ NOT IMPLEMENTED

**Content:**
- Payment Summary:
  - Total Paid (all-time)
  - Outstanding Balance
  - Next Payment Due (for monthly subscribers)
- Payment History Table:
  - Date
  - Transaction ID
  - Description (e.g., "Court booking - Court 1, Jan 20, 9AM", "Monthly subscription - Feb 2026", "Annual membership fee")
  - Amount (UGX)
  - Status (Paid, Pending, Failed)
  - Payment Method (MoMo)
  - Receipt/Proof (if uploaded)
- Make Payment Section:
  - Form to record payment
  - Upload MoMo receipt screenshot
  - Reference number input
  - Admin will verify before marking as paid

##### Tab 4: Profile & Dependents (#settings)
**Status:** ❌ NOT IMPLEMENTED

**Content:**
- Personal Information:
  - Full Name (editable)
  - Email (from auth, read-only)
  - Phone Number (editable)
  - Date of Birth (editable)
  - Membership Status (read-only):
    - Annual Member: Yes/No
    - Monthly Subscriber: Yes/No
    - Membership Start Date
    - Membership End Date (for monthly)
- Dependents Management:
  - Add Dependent button
  - List of dependents:
    - Name
    - Relationship (Spouse, Child)
    - Date of Birth
    - Edit / Remove buttons
  - When booking, can select booking for dependent (applies child pricing)
- Change Password section
- Notification Preferences

---

#### C. ADMIN INTERFACE

**Route:** `/admin/dashboard` (needs creation)

**Access Control:** Only users with `role = 'admin'` in database

**Main Navigation:**
- Dashboard Overview
- Members Management
- Bookings Management
- Payments & Accounting
- Coaches Management
- Courts Management
- P&L Reports
- Settings

##### Admin Tab 1: Dashboard Overview
**Status:** ❌ NOT IMPLEMENTED

**Content:**
- Key Metrics (Today):
  - Active Bookings Today
  - Revenue Today
  - New Members This Month
  - Outstanding Payments
- Key Metrics (This Month):
  - Total Bookings
  - Total Revenue
  - New Members
  - Expenses
  - Net Profit
- Quick Actions:
  - Approve Pending Payments
  - View Today's Schedule
  - Add New Member
  - Record Expense
- Recent Activity:
  - Last 10 bookings
  - Recent payments (pending approval)
  - New member registrations

##### Admin Tab 2: Members Management
**Status:** ❌ NOT IMPLEMENTED

**Content:**
- Member List Table:
  - Columns:
    - Name
    - Email
    - Phone
    - Membership Type
    - Member Since
    - Total Bookings
    - Outstanding Balance
    - Status (Active, Inactive, Suspended)
  - Actions:
    - View Full Profile
    - Edit Member
    - View Dependents
    - View Booking History
    - View Payment History
    - Suspend/Activate
- Filters:
  - Search by name/email
  - Filter by membership type
  - Filter by status
- Add New Member button:
  - Form with all member fields
  - Can create auth account or link existing
  - Set membership type immediately
- Bulk Actions:
  - Export member list
  - Send email to selected members

##### Admin Tab 3: Bookings Management
**Status:** ❌ NOT IMPLEMENTED

**Content:**
- Calendar View:
  - Shows all bookings across both courts
  - Color-coded by booking type (member, non-member, coaching)
  - Can click to view/edit booking
- List View:
  - Table with all bookings
  - Filters:
    - Date range
    - Court (1, 2, or both)
    - Member/Non-member
    - Status
  - Columns:
    - Date & Time
    - Court
    - Member Name
    - Type (Member/Non-member/Child)
    - Amount
    - Status
    - Payment Status
    - Actions (Edit, Cancel, Mark Paid)
- Special Requests Section:
  - Bookings requested outside normal rules
  - Approve/Reject functionality
- Statistics:
  - Court utilization rate
  - Peak hours analysis
  - Booking trends

##### Admin Tab 4: Payments & Accounting
**Status:** ❌ NOT IMPLEMENTED

**Content:**
- Payment Approval Queue:
  - Pending payments requiring verification
  - Each shows:
    - Member name
    - Amount
    - Description
    - MoMo receipt (if uploaded)
    - Reference number
    - Submitted date
  - Actions: Approve / Reject / Request More Info
- Payment History:
  - All payments (approved, rejected, pending)
  - Filters and search
  - Export functionality
- Manual Payment Entry:
  - Record payment manually
  - Link to member
  - Enter amount, description, date
- Outstanding Balances Report:
  - List of members with outstanding payments
  - Sort by amount
  - Send reminder email option

##### Admin Tab 5: Coaches Management
**Status:** ❌ NOT IMPLEMENTED

**Content:**
- Coach List:
  - Coach Name
  - Phone
  - Email
  - Status (Active, Inactive)
  - Total Sessions Booked
  - Actions (Edit, Deactivate)
- Coach Availability:
  - Calendar view per coach
  - Set availability windows
  - Block dates/times
- Coach Sessions:
  - View all coaching sessions
  - Link to bookings

##### Admin Tab 6: Courts Management
**Status:** ❌ NOT IMPLEMENTED

**Content:**
- Court List:
  - Court 1 (Clay)
  - Court 2 (Clay)
  - Status per court (Active, Maintenance, Closed)
- Maintenance Schedule:
  - Block dates/times for maintenance
  - Set court unavailable
- Court Settings:
  - Operating hours (8 AM - 10 PM)
  - Pricing rules (prime time, off-peak)
  - Booking rules (24hr advance, 1hr max, etc.)

##### Admin Tab 7: P&L Reports
**Status:** ❌ NOT IMPLEMENTED

**Content:**
- Revenue Section:
  - **Revenue Lines:**
    1. Pledges
    2. Membership Fees
    3. Member Playing Fees
    4. Non-Member Playing Fees
    5. Coaching Academy Playing Fees (Member Children)
    6. Coaching Academy Playing Fees (Non-Member Children)
    7. Private Session Playing Fees
    8. Tournament Fees
  
  - Each revenue line shows:
    - Total (Cash)
    - Total (Accrual)
    - Difference (Advance/Arrears)
    - Breakdown by month/year

- Expense Section:
  - **Expense Lines:**
    1. Court Attendant Salary
    2. Security
    3. Maintenance Works
    4. Resurfacing Works
    5. Facility Lease
    6. Water
    7. Electricity
    8. Tournament Costs
    9. Line Marking
    10. Development Costs
    11. Playing Equipment Costs
    12. Tools and Machinery
  
  - Each expense line shows:
    - Total (Cash)
    - Total (Accrual)
    - Breakdown by month/year

- Summary View:
  - Total Revenue (Cash vs Accrual)
  - Total Expenses (Cash vs Accrual)
  - Net Profit/Loss
  - Cash vs Accrual comparison
  - Charts/Graphs:
    - Revenue trend over time
    - Expense breakdown (pie chart)
    - Profit margin

- Time Period Filters:
  - This Month
  - This Year
  - Custom date range
  - Compare periods

- Add Revenue/Expense Entry:
  - Record new revenue or expense
  - Select category
  - Enter amount
  - Select Cash or Accrual
  - Date
  - Description/Notes
  - Attach receipt (optional)

##### Admin Tab 8: Settings
**Status:** ❌ NOT IMPLEMENTED

**Content:**
- Club Information:
  - Club Name
  - Contact Details
  - Address
  - Operating Hours
- Pricing Configuration:
  - Member rates (prime/off-peak)
  - Non-member rates (prime/off-peak)
  - Child rates (member/non-member)
  - Coaching rates
  - Monthly package rates
  - Membership fees
- Booking Rules:
  - Advance booking requirement (24 hours)
  - Cancellation window (2 hours)
  - Maximum booking duration (1 hour)
  - Prime time hours (8AM-12PM, 3PM-6PM)
  - Off-peak hours (12PM-3PM, 6PM-10PM)
- Payment Settings:
  - MoMo number (0790229161)
  - Payment approval workflow
- Email Templates:
  - Booking confirmation
  - Payment reminder
  - Cancellation notice
- User Roles:
  - Manage admin users
  - Assign roles

---

#### D. COACH INTERFACE

**Route:** `/coach/dashboard` (needs creation)

**Access Control:** Only users with `role = 'coach'` in database

**Tabs:**

##### Tab 1: My Availability
**Status:** ❌ NOT IMPLEMENTED

**Content:**
- Calendar View:
  - Set available time slots
  - Block unavailable times
  - Recurring availability (e.g., "Available every Monday 9AM-12PM")
- Availability Form:
  - Select date
  - Select time range
  - Set as available/unavailable
  - Save

##### Tab 2: My Sessions
**Status:** ❌ NOT IMPLEMENTED

**Content:**
- Upcoming Sessions:
  - Date and time
  - Student name (member or non-member)
  - Court number
  - Session type (Academy, Private)
  - Accept/Reject button (if pending)
- Past Sessions:
  - History of completed sessions
  - Student ratings (if implemented)
- Statistics:
  - Total sessions this month
  - Total earnings (if tracked)

##### Tab 3: Profile
**Status:** ❌ NOT IMPLEMENTED

**Content:**
- Coach Information:
  - Name
  - Phone
  - Email
  - Bio
  - Specializations
- Settings:
  - Change password
  - Notification preferences

---

## 🗄️ DATABASE SCHEMA

### Required Tables

#### 1. `members`
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- full_name (text, required)
- email (text, unique, required)
- phone (text)
- date_of_birth (date)
- membership_type (enum: 'none', 'annual', 'annual_monthly')
- membership_start_date (date)
- membership_end_date (date, nullable)
- is_active (boolean, default true)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 2. `dependents`
```sql
- id (uuid, primary key)
- member_id (uuid, foreign key to members)
- name (text, required)
- relationship (enum: 'spouse', 'child')
- date_of_birth (date)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 3. `courts`
```sql
- id (uuid, primary key)
- name (text, unique, required) -- "Court 1", "Court 2"
- court_type (text, default 'clay')
- status (enum: 'active', 'maintenance', 'closed', default 'active')
- created_at (timestamp)
- updated_at (timestamp)
```

#### 4. `bookings`
```sql
- id (uuid, primary key)
- member_id (uuid, foreign key to members, nullable -- for non-members)
- dependent_id (uuid, foreign key to dependents, nullable)
- court_id (uuid, foreign key to courts, required)
- booking_date (date, required)
- booking_time (time, required) -- e.g., "09:00:00"
- duration_hours (integer, default 1)
- is_member (boolean, required) -- true if member, false if non-member
- is_child (boolean, default false)
- opponent_name (text, nullable)
- coach_id (uuid, foreign key to coaches, nullable)
- session_type (enum: 'regular', 'coaching_academy', 'coaching_private', nullable)
- pricing_type (enum: 'prime', 'off_peak', required)
- amount (decimal, required)
- status (enum: 'confirmed', 'completed', 'cancelled', default 'confirmed')
- payment_status (enum: 'unpaid', 'pending', 'paid', default 'unpaid')
- cancellation_reason (text, nullable)
- cancelled_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 5. `coaches`
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users, nullable)
- name (text, required)
- email (text, nullable)
- phone (text, nullable)
- status (enum: 'active', 'inactive', default 'active')
- created_at (timestamp)
- updated_at (timestamp)
```

#### 6. `coach_availability`
```sql
- id (uuid, primary key)
- coach_id (uuid, foreign key to coaches, required)
- available_date (date, required)
- start_time (time, required)
- end_time (time, required)
- is_available (boolean, default true)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 7. `payments`
```sql
- id (uuid, primary key)
- member_id (uuid, foreign key to members, required)
- booking_id (uuid, foreign key to bookings, nullable)
- payment_type (enum: 'booking', 'membership_fee', 'monthly_subscription', 'pledge', 'tournament', required)
- amount (decimal, required)
- currency (text, default 'UGX')
- payment_method (text, default 'momo')
- momo_reference (text, nullable)
- receipt_url (text, nullable) -- URL to uploaded receipt image
- status (enum: 'pending', 'approved', 'rejected', default 'pending')
- approved_by (uuid, foreign key to auth.users, nullable)
- approved_at (timestamp, nullable)
- notes (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 8. `revenue_entries`
```sql
- id (uuid, primary key)
- revenue_category (enum: 
    'pledges',
    'membership_fees',
    'member_playing_fees',
    'non_member_playing_fees',
    'coaching_academy_member_children',
    'coaching_academy_non_member_children',
    'private_session_fees',
    'tournament_fees',
  required)
- amount (decimal, required)
- accounting_type (enum: 'cash', 'accrual', required)
- entry_date (date, required)
- description (text, nullable)
- payment_id (uuid, foreign key to payments, nullable)
- booking_id (uuid, foreign key to bookings, nullable)
- created_by (uuid, foreign key to auth.users, required)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 9. `expense_entries`
```sql
- id (uuid, primary key)
- expense_category (enum:
    'court_attendant_salary',
    'security',
    'maintenance_works',
    'resurfacing_works',
    'facility_lease',
    'water',
    'electricity',
    'tournament_costs',
    'line_marking',
    'development_costs',
    'playing_equipment_costs',
    'tools_machinery',
  required)
- amount (decimal, required)
- accounting_type (enum: 'cash', 'accrual', required)
- entry_date (date, required)
- description (text, nullable)
- receipt_url (text, nullable)
- created_by (uuid, foreign key to auth.users, required)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 10. `court_maintenance`
```sql
- id (uuid, primary key)
- court_id (uuid, foreign key to courts, required)
- start_date (date, required)
- end_date (date, required)
- start_time (time, nullable)
- end_time (time, nullable)
- reason (text, nullable)
- created_by (uuid, foreign key to auth.users, required)
- created_at (timestamp)
```

#### 11. `user_roles` (or extend auth.users metadata)
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users, unique)
- role (enum: 'member', 'admin', 'coach', default 'member')
- created_at (timestamp)
```

### Database Functions & Triggers Needed

1. **Booking Validation Function:**
   - Check 24-hour advance requirement
   - Check slot availability
   - Check court maintenance conflicts
   - Calculate pricing based on member status, time, and dependent

2. **Payment Processing:**
   - Auto-create revenue entry when payment approved
   - Update booking payment status
   - Calculate outstanding balance

3. **Cancellation Rules:**
   - Enforce 2-hour cancellation window
   - Handle refunds (if applicable)

4. **Membership Expiry:**
   - Auto-update membership status
   - Send reminders before expiry

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Roles
1. **Public/Visitor:** No authentication, limited access
2. **Member:** Authenticated users with `role = 'member'`
3. **Admin:** Authenticated users with `role = 'admin'`
4. **Coach:** Authenticated users with `role = 'coach'`

### Row Level Security (RLS) Policies Needed

- **members:** Users can read their own record, admins can read all
- **bookings:** Users can read their own bookings, admins can read all
- **payments:** Users can read their own payments, admins can read all
- **dependents:** Users can manage their own dependents, admins can manage all
- **revenue_entries:** Admins only
- **expense_entries:** Admins only
- **coaches:** Public read, coaches manage own, admins manage all

---

## 🤖 AI ASSISTANT ENHANCEMENTS

**Current Status:** ✅ Basic implementation exists

**Needs Enhancement:**
1. **Booking Integration:**
   - Check real-time availability
   - Make bookings directly from chat
   - Cancel bookings
   - Show user's upcoming bookings

2. **Payment Integration:**
   - Check outstanding balance
   - Guide payment process
   - Verify payment status

3. **Database Context:**
   - Connect to Supabase to fetch real data
   - Update system prompt with dynamic data

**AI Assistant Capabilities Should Include:**
- "Check availability for Court 1 tomorrow at 9 AM"
- "Book Court 2 for next Monday at 3 PM"
- "Cancel my booking on Jan 20"
- "What's my outstanding balance?"
- "Show my upcoming bookings"
- "How do I add a dependent?"
- "What are the membership benefits?"

---

## 💰 PRICING STRUCTURE

### Court Booking Rates (Per Hour)

**Prime Time (8 AM - 12 PM, 3 PM - 6 PM):**
- Club Members: UGX 10,000
- Club Members' Children: UGX 5,000
- Non-Members: UGX 15,000
- Non-Members' Children: UGX 10,000

**Off-Peak (12 PM - 3 PM, 6 PM - 10 PM):**
- Club Members: UGX 10,000 (same as prime)
- Club Members' Children: UGX 5,000
- Non-Members: UGX 15,000 (same as prime)
- Non-Members' Children: UGX 10,000

### Monthly Packages
- Club Members: UGX 150,000/month (unlimited play)
- Non-Members: UGX 200,000/month (unlimited play)

### Membership Fees
- Annual Membership Fee: UGX 100,000 (one-time)
- Monthly Subscription: UGX 20,000/month

### Coaching Rates (To be confirmed with coaches)
- Academy Sessions: Differentiated for member/non-member children
- Private Sessions: Separate pricing

---

## 📱 BOOKING RULES & VALIDATION

1. **Advance Booking:** Minimum 24 hours in advance
2. **Maximum Duration:** 1 hour per booking
3. **Cancellation:** Must cancel at least 2 hours before booking time
4. **Prime Time:** 8 AM - 12 PM and 3 PM - 6 PM
5. **Off-Peak:** 12 PM - 3 PM and 6 PM - 10 PM
6. **Operating Hours:** 8 AM - 10 PM daily
7. **Court Count:** 2 courts (Court 1 and Court 2)

---

## 🔄 INTEGRATION POINTS

### Supabase Edge Functions Needed

1. **`create-booking`:**
   - Validate booking rules
   - Check availability
   - Calculate price
   - Create booking record
   - Return confirmation

2. **`cancel-booking`:**
   - Validate cancellation window (2 hours)
   - Update booking status
   - Handle refund logic (if applicable)

3. **`process-payment`:**
   - Verify MoMo reference
   - Update payment status
   - Create revenue entry
   - Update member balance

4. **`check-availability`:**
   - Query available slots for date/court
   - Consider maintenance
   - Return available times

5. **Enhanced `btc-assistant`:**
   - Connect to database for real-time queries
   - Support booking actions
   - Support payment queries

### Payment Integration

- **MoMo Number:** 0790229161 (Brian Isubikalu)
- Payment flow:
  1. User books court → Receives amount to pay
  2. User pays via MoMo
  3. User uploads receipt in dashboard
  4. Admin verifies and approves
  5. Payment marked as paid
  6. Revenue entry created

---

## 📋 DATA MIGRATION

If Excel data exists, need migration script to:
1. Import member details
2. Import dependents
3. Import historical bookings (if needed)
4. Import payment history
5. Set up initial P&L data

---

## 🎨 UI/UX REQUIREMENTS

### Design System (Already Implemented)
- Modern, clean interface
- Mobile-responsive
- Consistent color scheme (court green, gold accents)
- Smooth animations (Framer Motion)
- Accessible components

### Key UX Flows

1. **Booking Flow:**
   - Select date → Select court → Select time → Confirm → Pay → Receive confirmation

2. **Payment Flow:**
   - View outstanding balance → Make MoMo payment → Upload receipt → Wait for approval → Confirmed

3. **Member Registration:**
   - Sign up → Fill profile → Choose membership → Pay membership fee → Activate account

---

## 🧪 TESTING REQUIREMENTS

1. **Booking Rules:**
   - Cannot book <24 hours in advance
   - Cannot book more than 1 hour
   - Cannot cancel <2 hours before
   - Prime time pricing applied correctly

2. **Payment Processing:**
   - Outstanding balance calculated correctly
   - Revenue entries created on approval
   - P&L calculations accurate

3. **Role-Based Access:**
   - Members can only see own data
   - Admins can see all data
   - Coaches can see own sessions

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Database schema created in Supabase
- [ ] RLS policies configured
- [ ] Edge functions deployed
- [ ] Environment variables set
- [ ] Admin user created
- [ ] Initial courts added (Court 1, Court 2)
- [ ] Payment approval workflow tested
- [ ] Email notifications configured (optional)
- [ ] AI assistant database integration complete
- [ ] Mobile responsiveness verified
- [ ] Browser compatibility tested

---

## 📝 NOTES FOR LOVABLE

1. **Priority Features to Build First:**
   - Database schema and migrations
   - Member booking functionality (connect BookCourt page to DB)
   - Member dashboard completion (all 4 tabs)
   - Admin dashboard (all 8 tabs)
   - Payment approval system

2. **Complex Features:**
   - P&L system with Cash vs Accrual tracking
   - AI assistant booking integration
   - Real-time availability checking

3. **Excel Data Integration:**
   - Need to understand Excel structure to create migration script
   - May need manual data entry for initial setup

4. **Coaches:**
   - Coaches are independent contractors
   - They manage their own availability
   - Booking with coach is optional for members

---

## 📞 CONTACT INFORMATION

**Club Details:**
- Name: Buwate Tennis Club (BTC)
- Location: Buwate, Kampala, Uganda
- Phone: +256 772 675 050, +256 772 367 7325
- Email: btc2023@gmail.com
- Payment MoMo: 0790229161 (Brian Isubikalu)

---

**END OF SPECIFICATION**

This document should be provided to Lovable with the instruction: "Please build the complete system according to this specification, starting with the database schema and then implementing all missing features in priority order."
