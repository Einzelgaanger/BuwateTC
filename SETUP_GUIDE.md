# Setup Guide - BTC Management System

## Step 1: Database Setup

### 1.1 Run Database Migration

1. **Open Supabase Dashboard:**
   - Go to your Supabase project
   - Navigate to SQL Editor

2. **Run the Migration:**
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Paste into SQL Editor
   - Click "Run" to execute

   This will create:
   - `user_roles` table
   - Role enum type (`member`, `admin`, `coach`)
   - Automatic role assignment trigger
   - Helper functions for role checking
   - Row Level Security policies

### 1.2 Verify Database Setup

Run this query to verify:
```sql
SELECT * FROM user_roles;
```

You should see the table structure created successfully.

---

## Step 2: Environment Variables

Make sure you have these in your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

---

## Step 3: OAuth Configuration (Optional but Recommended)

### 3.1 Google OAuth

1. **In Supabase Dashboard:**
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials:
     - Client ID
     - Client Secret

2. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`

### 3.2 GitHub OAuth (Optional)

1. **In Supabase Dashboard:**
   - Go to Authentication > Providers
   - Enable GitHub provider
   - Add GitHub OAuth App credentials

2. **Get GitHub OAuth Credentials:**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create new OAuth App
   - Add callback URL: `https://your-project.supabase.co/auth/v1/callback`

### 3.3 Update Auth Page for OAuth (Next Step)

After configuring OAuth providers, we'll add OAuth buttons to the Auth page.

---

## Step 4: Create First Admin User

Since admin accounts can only be created by existing admins, you need to manually create the first admin:

1. **Create a user account first:**
   - Sign up through the website as a regular member
   - Note the user's email

2. **Make them admin:**
   - Go to Supabase Dashboard > Table Editor > `user_roles`
   - Find the user you just created
   - Change their `role` from `member` to `admin`

   OR run this SQL:
   ```sql
   UPDATE user_roles 
   SET role = 'admin' 
   WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com');
   ```

---

## Step 5: Testing the Setup

### Test Member Signup:
1. Go to `/auth`
2. Click "Sign up"
3. Fill in details
4. Select "Member" role
5. Create account
6. Should redirect to `/member/dashboard`

### Test Coach Signup:
1. Go to `/auth`
2. Click "Sign up"
3. Fill in details
4. Select "Coach" role
5. Create account
6. Should redirect to `/coach/dashboard`

### Test Login:
1. Login with existing credentials
2. Should automatically redirect to correct dashboard based on role:
   - Admin → `/admin/dashboard`
   - Coach → `/coach/dashboard`
   - Member → `/member/dashboard`

---

## Step 6: Next Steps

After this setup is complete, we need to:

1. **Connect to Database:**
   - Create remaining tables (members, bookings, payments, etc.)
   - Set up relationships
   - Add RLS policies

2. **Implement Core Features:**
   - Booking system
   - Payment processing
   - Member management
   - Admin features
   - Coach features

3. **Add OAuth Buttons to Auth Page:**
   - Google sign-in button
   - GitHub sign-in button (optional)

---

## Troubleshooting

### Issue: "relation 'user_roles' does not exist"
- **Solution:** Make sure you ran the migration SQL script in Supabase

### Issue: User role is null after signup
- **Solution:** Check if the trigger `on_auth_user_created` is created and enabled
- Check user metadata contains `role` field

### Issue: Cannot access admin dashboard
- **Solution:** Verify user has `role = 'admin'` in `user_roles` table

### Issue: Redirect loops
- **Solution:** Clear browser cache and localStorage
- Check that role is being fetched correctly in `useUserRole` hook

---

## Database Schema Reference

### user_roles Table:
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- role (enum: 'member', 'admin', 'coach')
- created_at (timestamp)
- updated_at (timestamp)
```

---

**Once you've completed Step 1 (database migration), let me know and we can proceed with connecting the rest of the application to the database!**
