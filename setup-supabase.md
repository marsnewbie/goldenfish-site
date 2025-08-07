# 🚀 Supabase Setup Guide for Golden Fish Ordering System

This guide will walk you through setting up Supabase for your modern multi-tenant restaurant ordering system.

## ✅ Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign up/Login with your GitHub account

2. **Create New Project**
   - Click "New Project" 
   - Organization: Create new or select existing
   - Project name: `Golden Fish Ordering System`
   - Database password: Generate a strong password (save this!)
   - Region: `West Europe` (closest to UK users)
   - Pricing: Start with **Free tier** (100K MAU included)

3. **Wait for Setup**
   - Project creation takes ~2 minutes
   - You'll see a loading screen with progress

## ✅ Step 2: Configure Authentication

1. **Go to Authentication Settings**
   - Navigate to: `Authentication > Settings`

2. **Configure Site URL**
   - Site URL: `https://test-ordering-page.vercel.app`

3. **Add Redirect URLs**
   ```
   https://test-ordering-page.vercel.app/
   https://test-ordering-page.vercel.app/checkout.html
   https://test-ordering-page.vercel.app/modern-checkout.html
   https://test-ordering-page.vercel.app/menu.html
   http://localhost:3000
   http://localhost:5500
   http://127.0.0.1:5500
   ```

4. **Enable Email Authentication**
   - Go to: `Authentication > Providers`
   - **Email** should be enabled by default
   - Confirm Email: `Enable email confirmations` = ON
   - Secure email change: `Enable secure email change` = ON

## ✅ Step 3: Set Up Database Schema

1. **Go to SQL Editor**
   - Navigate to: `SQL Editor`

2. **Run Schema Setup**
   - Copy the entire contents of `supabase-schema.sql`
   - Paste into the SQL Editor
   - Click "Run" button
   - Wait for "Success. No rows returned" message

3. **Verify Tables Created**
   - Go to: `Table Editor`
   - You should see these tables:
     - `tenants`
     - `user_tenants` 
     - `user_profiles`
     - `user_passkeys`
     - `restaurants`
     - `menu_categories`
     - `menu_items`
     - `orders`
     - `order_items`
     - `promotions`

## ✅ Step 4: Get Your Credentials

1. **Go to Project Settings**
   - Navigate to: `Settings > API`

2. **Copy Project Credentials**
   ```javascript
   Project URL: https://YOUR_PROJECT_ID.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Update Configuration File**
   - Open: `supabase-config.js`
   - Replace `YOUR_SUPABASE_URL` with your Project URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your anon key

## ✅ Step 5: Enable Social OAuth (Optional)

### Google OAuth Setup

1. **Google Cloud Console Setup**
   - Go to: https://console.cloud.google.com/
   - Create new project or select existing
   - Enable "Google+ API" and "Google Identity API"

2. **Create OAuth Credentials**
   - Go to: `APIs & Services > Credentials`
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "Golden Fish Auth"
   - Authorized origins:
     ```
     https://YOUR_PROJECT_ID.supabase.co
     https://test-ordering-page.vercel.app
     ```
   - Authorized redirect URIs:
     ```
     https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
     ```

3. **Configure in Supabase**
   - Go to: `Authentication > Providers`
   - Enable "Google"
   - Client ID: (from Google Console)
   - Client Secret: (from Google Console)
   - Click "Save"

### Apple OAuth Setup (Optional)

1. **Apple Developer Setup**
   - Sign in to: https://developer.apple.com/account/
   - Go to: "Certificates, Identifiers & Profiles"

2. **Create Service ID**
   - Identifiers > App IDs > "+"
   - Select "Services ID"
   - Description: "Golden Fish Auth"
   - Identifier: `com.goldenfish.auth`

3. **Configure Sign In with Apple**
   - Enable "Sign In with Apple"
   - Primary App ID: (your main app ID)
   - Domain: `test-ordering-page.vercel.app`
   - Return URL: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

4. **Configure in Supabase**
   - Go to: `Authentication > Providers`
   - Enable "Apple"
   - Enter your credentials
   - Click "Save"

## ✅ Step 6: Test Your Setup

1. **Open Browser Console**
   - Go to: https://test-ordering-page.vercel.app
   - Open Developer Tools (F12)
   - Check Console tab

2. **Run Verification**
   ```javascript
   // This should run automatically in development
   verifySupabaseSetup()
   ```

3. **Expected Output**
   ```
   🚀 Supabase configuration loaded. Environment: Production
   ✅ Modern Auth System initialized
   🔍 Supabase Setup Verification
   1. Client initialization: ✅
   2. Database connection: ✅ 
   3. Auth configuration: ✅
   4. RLS policies: Run manual test after authentication
   🎉 Supabase setup verification complete!
   ```

## ✅ Step 7: Create First Tenant

1. **Go to Table Editor**
   - Navigate to: `Table Editor > tenants`

2. **Insert Golden Fish Tenant**
   ```sql
   INSERT INTO tenants (name, slug, business_name, email, plan) VALUES 
   ('Golden Fish Group', 'golden-fish', 'Golden Fish Restaurant Group Ltd', 'admin@goldenfish.co.uk', 'premium');
   ```

3. **Create Restaurant Location**
   - Go to: `Table Editor > restaurants`
   - Insert your restaurant details
   - Link to the tenant you just created

## 🔧 Troubleshooting

### Common Issues

**❌ "Failed to initialize Supabase client"**
- Check your project URL and anon key
- Verify they're correctly set in `supabase-config.js`
- Make sure no typos in the credentials

**❌ "Database connection failed"**
- Your database might still be initializing (wait 5 minutes)
- Check if schema was applied correctly
- Verify RLS policies are enabled

**❌ "Auth redirect not working"**
- Double-check redirect URLs in Supabase settings
- Ensure URLs match exactly (including https/http)
- Clear browser cache and try again

**❌ "Magic link emails not sending"**
- Check Supabase Auth logs in dashboard
- Verify email settings are correct
- Check spam folder

### Getting Help

- **Supabase Discord**: https://discord.supabase.com/
- **Documentation**: https://supabase.com/docs
- **Status Page**: https://status.supabase.com/

## 🎯 Next Steps

After successful setup:

1. **Test Authentication Flow**
   - Try magic link sign-in
   - Test guest checkout
   - Verify user profiles are created

2. **Configure Multi-tenant**
   - Create additional restaurant tenants
   - Test user-tenant relationships
   - Verify RLS isolation

3. **Deploy & Monitor**
   - Push changes to GitHub
   - Monitor Supabase dashboard for usage
   - Set up alerts for errors

## 💰 Pricing Considerations

**Free Tier Limits:**
- 100,000 Monthly Active Users
- 500MB database size
- 2GB bandwidth
- Unlimited API requests

**Recommended Upgrades:**
- Pro Plan ($25/month) when you hit limits
- Includes 100,000 MAU (vs thousands on competitors)
- Additional database size and bandwidth

---

🚀 **Your modern authentication system is now ready for hundreds of restaurants!**