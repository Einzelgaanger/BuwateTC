# Your Supabase Credentials

## Project Information

**Project URL:**
```
https://scqbhwnhiiztbdtzasrz.supabase.co
```

**Anon Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcWJod25oaWl6dGJkdHphc3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MDU1MjQsImV4cCI6MjA4NDM4MTUyNH0.drzn19mmj4uNQHQbDBD2npzfEgMw73w0fpXOaMmANJU
```

---

## Your .env File Should Contain:

```env
VITE_SUPABASE_URL=https://scqbhwnhiiztbdtzasrz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcWJod25oaWl6dGJkdHphc3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MDU1MjQsImV4cCI6MjA4NDM4MTUyNH0.drzn19mmj4uNQHQbDBD2npzfEgMw73w0fpXOaMmANJU
```

---

## 🚀 Next Steps:

### 1. ✅ Verify .env File
Make sure your `.env` file in the project root has the credentials above.

### 2. 📋 Run Database Migration
1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/scqbhwnhiiztbdtzasrz
2. Go to **SQL Editor**
3. Copy all code from `supabase/migrations/001_initial_schema.sql`
4. Paste and click **Run**
5. You should see: "Success. No rows returned"

### 3. 🔍 Verify Migration Worked
- Go to **Table Editor** in Supabase
- You should see `user_roles` table

### 4. 🧪 Test Connection
1. Restart your dev server (if running):
   ```bash
   npm run dev
   ```
2. Go to: http://localhost:5173/auth
3. Try signing up with email/password
4. You should be redirected to the member dashboard!

### 5. 🔐 Configure Google OAuth (Optional)

**Redirect URI for Google OAuth:**
```
https://scqbhwnhiiztbdtzasrz.supabase.co/auth/v1/callback
```

See `SETUP_INSTRUCTIONS.md` for detailed Google OAuth setup.

---

## ✅ You're All Set!

Once you complete the database migration, your website will be fully connected to Supabase!

**Quick Links:**
- Supabase Dashboard: https://supabase.com/dashboard/project/scqbhwnhiiztbdtzasrz
- SQL Editor: https://supabase.com/dashboard/project/scqbhwnhiiztbdtzasrz/sql
