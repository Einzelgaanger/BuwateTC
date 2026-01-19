# Quick Start Guide - Connect to Supabase

## 🚀 3-Step Setup (5 minutes)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create account
2. Click "New Project"
3. Fill in details and wait 2-3 minutes

### Step 2: Get Your Credentials
1. In Supabase Dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** 
   - **anon public** key

### Step 3: Configure Environment
1. Create `.env` file in project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
   ```
2. Restart dev server: `npm run dev`

---

## 📋 Next: Run Database Migration

1. Open Supabase → **SQL Editor**
2. Copy all code from `supabase/migrations/001_initial_schema.sql`
3. Paste and click "Run"
4. ✅ You should see `user_roles` table created

---

## 🔐 Google OAuth Setup (Optional but Recommended)

### Get Google Credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → Enable Google+ API
3. Create OAuth 2.0 credentials (Web application)
4. Add redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret

### Configure in Supabase:
1. Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google** provider
3. Paste Client ID and Client Secret
4. Click "Save"

### Configure Redirect URLs:
1. Supabase → **Authentication** → **URL Configuration**
2. Add these redirect URLs:
   - `http://localhost:5173/**`
   - `http://localhost:5173/auth/callback`

---

## ✅ Test It Works

1. Run: `npm run dev`
2. Go to: `http://localhost:5173/auth`
3. Try:
   - ✅ Sign up with email/password
   - ✅ Click "Continue with Google" (if configured)

---

## 🎯 What's Next?

After connection is working:
- ✅ Database is connected
- ✅ Authentication is ready
- ✅ Role system is set up
- ✅ Google OAuth works

**Now we can build:**
- Booking system with database
- Payment tracking
- Admin features
- Coach features
- Member management

---

## 📖 Detailed Guide

For more detailed instructions, see: **SUPABASE_SETUP.md**

---

## ❓ Troubleshooting

**"Missing env.VITE_SUPABASE_URL"**
→ Create `.env` file with your credentials

**"relation user_roles does not exist"**
→ Run the migration SQL in Supabase

**Google OAuth not working**
→ Check redirect URI matches exactly

**Need help?** Check `SUPABASE_SETUP.md` for detailed troubleshooting
