# Supabase Setup Guide - Complete Configuration

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name:** BTC Tennis Club (or any name)
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to Uganda (e.g., Europe West)
5. Click "Create new project"
6. Wait 2-3 minutes for project to initialize

---

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

---

## Step 3: Set Up Environment Variables

1. **Create `.env` file** in the root of your project (same level as `package.json`)

2. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file** and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
   ```

4. **IMPORTANT:** 
   - Make sure `.env` is in your `.gitignore` file
   - Never commit `.env` to version control
   - The `.env.example` file can be committed (without real values)

---

## Step 4: Run Database Migration

1. **Open Supabase SQL Editor:**
   - In your Supabase dashboard, go to **SQL Editor**
   - Click "New query"

2. **Run the migration:**
   - Open `supabase/migrations/001_initial_schema.sql`
   - Copy ALL the SQL code
   - Paste into Supabase SQL Editor
   - Click "Run" (or press Ctrl+Enter)

3. **Verify it worked:**
   - You should see "Success. No rows returned"
   - Go to **Table Editor** → You should see `user_roles` table

---

## Step 5: Configure Google OAuth

### 5.1 Get Google OAuth Credentials

1. **Go to Google Cloud Console:**
   - Visit [https://console.cloud.google.com](https://console.cloud.google.com)
   - Sign in with your Google account

2. **Create a Project:**
   - Click "Select a project" → "New Project"
   - Name: "BTC Tennis Club"
   - Click "Create"

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure OAuth consent screen:
     - User Type: **External** (for public use)
     - App name: "BTC Tennis Club"
     - User support email: Your email
     - Developer contact: Your email
     - Click "Save and Continue"
     - Scopes: Leave default, click "Save and Continue"
     - Test users: Add your email, click "Save and Continue"
     - Summary: Click "Back to Dashboard"
   
   - Application type: **Web application**
   - Name: "BTC Tennis Club Web"
   - Authorized redirect URIs: 
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
     (Replace `your-project-id` with your actual Supabase project ID)
   - Click "Create"
   - **Save the Client ID and Client Secret** (you'll need these)

### 5.2 Configure Google OAuth in Supabase

1. **In Supabase Dashboard:**
   - Go to **Authentication** → **Providers**
   - Find **Google** and click to expand

2. **Enable Google Provider:**
   - Toggle "Enable Google provider" to ON
   - Paste your **Client ID** from Google Cloud Console
   - Paste your **Client Secret** from Google Cloud Console
   - Click "Save"

3. **Test the connection:**
   - The status should show as "Connected"
   - If there's an error, double-check your redirect URI matches exactly

---

## Step 6: Configure Auth Redirect URLs

1. **In Supabase Dashboard:**
   - Go to **Authentication** → **URL Configuration**
   - **Site URL:** Your website URL (e.g., `http://localhost:5173` for local dev)
   - **Redirect URLs:** Add these:
     ```
     http://localhost:5173/**
     http://localhost:5173/auth/callback
     https://your-production-domain.com/**
     https://your-production-domain.com/auth/callback
     ```

2. **Click "Save"**

---

## Step 7: Test the Connection

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test Database Connection:**
   - Go to `http://localhost:5173/auth`
   - Try signing up with email/password
   - Check Supabase Dashboard → **Authentication** → **Users**
   - You should see your new user
   - Check **Table Editor** → `user_roles` table
   - You should see a role entry for your user

3. **Test Google OAuth:**
   - Go to `http://localhost:5173/auth`
   - Click "Continue with Google"
   - Sign in with Google
   - You should be redirected back and logged in
   - Check Supabase Dashboard → **Authentication** → **Users**
   - User should be created with Google provider

---

## Step 8: Create First Admin User

Since admin accounts can only be created manually:

1. **Sign up as a regular member** through the website

2. **Make them admin:**
   - Go to Supabase Dashboard → **Table Editor** → `user_roles`
   - Find the user you just created
   - Click on the row to edit
   - Change `role` from `member` to `admin`
   - Click "Save"

   OR run this SQL:
   ```sql
   UPDATE user_roles 
   SET role = 'admin' 
   WHERE user_id = (
     SELECT id FROM auth.users 
     WHERE email = 'your-email@example.com'
   );
   ```

---

## Troubleshooting

### Issue: "Missing env.VITE_SUPABASE_URL" error
**Solution:**
- Make sure `.env` file exists in project root
- Make sure variable names start with `VITE_`
- Restart your dev server after creating `.env`

### Issue: Google OAuth redirect error
**Solution:**
- Check redirect URI in Google Cloud Console matches Supabase callback URL exactly
- Make sure no trailing slashes
- Format: `https://your-project-id.supabase.co/auth/v1/callback`

### Issue: Database connection fails
**Solution:**
- Verify your Supabase URL and key in `.env`
- Check Supabase project is active (not paused)
- Verify migration was run successfully

### Issue: User role not created on signup
**Solution:**
- Check if migration was run (should see `user_roles` table)
- Check if trigger `on_auth_user_created` exists
- Check Supabase logs for errors

### Issue: Cannot access admin dashboard
**Solution:**
- Verify user has `role = 'admin'` in `user_roles` table
- Clear browser localStorage and try again
- Check browser console for errors

---

## Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Never committed real credentials to git
- [ ] Using `anon` key in frontend (not `service_role` key)
- [ ] RLS policies are enabled on `user_roles` table
- [ ] Google OAuth redirect URI is correctly configured
- [ ] Site URL is configured in Supabase

---

## Next Steps

After completing this setup:

1. ✅ Database is connected
2. ✅ Authentication is working
3. ✅ Google OAuth is configured
4. ✅ Role system is set up

**Now you can:**
- Build out the rest of the database schema (members, bookings, payments, etc.)
- Connect booking system to database
- Implement payment tracking
- Build admin features
- Build coach features

---

## Quick Reference

### Important URLs:
- **Supabase Dashboard:** `https://supabase.com/dashboard/project/_`
- **Google Cloud Console:** `https://console.cloud.google.com`
- **Supabase SQL Editor:** `https://supabase.com/dashboard/project/_/sql`

### Environment Variables Needed:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### OAuth Redirect URI Format:
```
https://your-project-id.supabase.co/auth/v1/callback
```

---

**Once you've completed these steps, your website will be fully connected to Supabase!** 🎉
