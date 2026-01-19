# ✅ Quick Setup Instructions

## Step 1: Create .env File

Create a file named `.env` in the root of your project (same folder as `package.json`) with this content:

```env
VITE_SUPABASE_URL=https://scqbhwnhiiztbdtzasrz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcWJod25oaWl6dGJkdHphc3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MDU1MjQsImV4cCI6MjA4NDM4MTUyNH0.drzn19mmj4uNQHQbDBD2npzfEgMw73w0fpXOaMmANJU
```

**Important:** After creating `.env`, restart your dev server if it's running.

---

## Step 2: Run Database Migration

1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/scqbhwnhiiztbdtzasrz
2. Go to **SQL Editor** (left sidebar)
3. Click **New query**
4. Open `supabase/migrations/001_initial_schema.sql` in your project
5. Copy ALL the SQL code from that file
6. Paste into Supabase SQL Editor
7. Click **Run** (or press Ctrl+Enter)

You should see: "Success. No rows returned"

**Verify:** Go to **Table Editor** → You should now see `user_roles` table

---

## Step 3: Test the Connection

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Go to: http://localhost:5173/auth

3. Try signing up:
   - Fill in name, email, password
   - Select "Member" role
   - Click "Create Account"
   - You should be redirected to `/member/dashboard`

4. Check Supabase Dashboard:
   - Go to **Authentication** → **Users** → You should see your new user
   - Go to **Table Editor** → `user_roles` → You should see a role entry

---

## Step 4: Configure Google OAuth (Optional)

### Get Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth client ID**
6. Configure:
   - Application type: **Web application**
   - Name: "BTC Tennis Club"
   - **Authorized redirect URIs:** 
     ```
     https://scqbhwnhiiztbdtzasrz.supabase.co/auth/v1/callback
     ```
7. Click **Create** and save the **Client ID** and **Client Secret**

### Add to Supabase:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click to expand
4. Toggle **Enable Google provider** to ON
5. Paste your **Client ID**
6. Paste your **Client Secret**
7. Click **Save**

### Configure Redirect URLs:

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL:** `http://localhost:5173` (for development)
3. Add **Redirect URLs:**
   ```
   http://localhost:5173/**
   http://localhost:5173/auth/callback
   ```
4. Click **Save**

---

## ✅ You're Done!

After completing these steps:

- ✅ Database is connected
- ✅ Authentication works
- ✅ Role system is set up
- ✅ Google OAuth ready (if configured)

**Test it:**
- Try signing up: http://localhost:5173/auth
- Try Google sign-in: Click "Continue with Google" button

---

## Troubleshooting

**Issue: "Missing env.VITE_SUPABASE_URL"**
- Make sure `.env` file exists in project root
- Make sure it has the exact variable names (VITE_ prefix)
- Restart your dev server

**Issue: "relation user_roles does not exist"**
- You need to run the migration SQL in Supabase
- See Step 2 above

**Issue: Google OAuth not working**
- Check redirect URI matches exactly: `https://scqbhwnhiiztbdtzasrz.supabase.co/auth/v1/callback`
- Verify Client ID and Secret in Supabase
- Check redirect URLs are configured in Supabase URL Configuration

**Need more help?** See `SUPABASE_SETUP.md` for detailed troubleshooting
