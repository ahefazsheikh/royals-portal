# Environment Variables Setup Guide

## Overview

This guide explains how to set up all required environment variables for the Royal Sports Portal.

## Variables Explained

### Supabase Variables

#### NEXT_PUBLIC_SUPABASE_URL
- **What**: Your Supabase project URL
- **Where to find**: Supabase Dashboard → Settings → API
- **Format**: `https://your-project.supabase.co`
- **Example**: `https://abcdefgh.supabase.co`

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **What**: Public anonymous key for client-side access
- **Where to find**: Supabase Dashboard → Settings → API → anon key
- **Format**: Long string starting with `eyJ...`
- **Security**: Safe to expose in frontend code

#### SUPABASE_SERVICE_ROLE_KEY
- **What**: Secret key for server-side operations
- **Where to find**: Supabase Dashboard → Settings → API → service_role key
- **Format**: Long string starting with `eyJ...`
- **Security**: NEVER expose in frontend code
- **Usage**: Server-side only (API routes)

### Email Variables

#### EMAIL_USER
- **What**: Gmail address for sending emails
- **Format**: `your-email@gmail.com`
- **Requirements**: Gmail account with 2FA enabled
- **Example**: `noreply@royalswebtech.com`

#### EMAIL_PASS
- **What**: Gmail app password (NOT your regular password)
- **How to get**:
  1. Go to https://myaccount.google.com/apppasswords
  2. Sign in with your Gmail account
  3. Select "Mail" from the dropdown
  4. Select "Windows Computer" from the dropdown
  5. Click "Generate"
  6. Copy the 16-character password
- **Format**: 16 characters (e.g., `abcd efgh ijkl mnop`)
- **Security**: Keep this secret!

### Site Configuration

#### NEXT_PUBLIC_SITE_URL
- **What**: Your website's public URL
- **Format**: `https://your-domain.com`
- **Examples**:
  - `https://royals-portal.vercel.app`
  - `https://portal.royalswebtech.com`
- **Usage**: Used in email links and QR codes
- **Important**: Must match your actual domain

### Admin Setup

#### ADMIN_SETUP_CODE
- **What**: Code required to create the first admin user
- **Default**: `123456`
- **Format**: Any string (recommended: 6+ characters)
- **Security**: Change this to something secure
- **Usage**: Required when visiting `/auth/setup`

## Step-by-Step Setup

### 1. Get Supabase Credentials

1. Go to https://supabase.com
2. Sign in to your project
3. Click "Settings" in the left sidebar
4. Click "API" tab
5. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Set Up Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. If prompted, complete 2FA verification
4. Select "Mail" from the first dropdown
5. Select "Windows Computer" from the second dropdown
6. Click "Generate"
7. Copy the 16-character password
8. Use this as `EMAIL_PASS`

### 3. Configure Vercel Environment Variables

1. Go to https://vercel.com
2. Select your project
3. Click "Settings" in the top menu
4. Click "Environment Variables" in the left sidebar
5. Add each variable:
   - Click "Add New"
   - Enter variable name
   - Enter variable value
   - Select "Production" (or all environments)
   - Click "Save"

### 4. Local Development Setup

1. Create `.env.local` file in project root
2. Copy contents from `.env.example`
3. Fill in all values
4. Save the file
5. Restart development server

## Verification

### Test Supabase Connection
\`\`\`bash
# In your terminal, run:
npm run dev

# Visit http://localhost:3000
# If page loads, Supabase is connected
\`\`\`

### Test Email Configuration
1. Register a test user
2. Check your email for confirmation
3. If email arrives, configuration is correct

### Test Admin Setup
1. Visit http://localhost:3000/auth/setup
2. Enter email, password, and setup code
3. If successful, admin is created

## Troubleshooting

### "Invalid Supabase URL"
- Check `NEXT_PUBLIC_SUPABASE_URL` format
- Should be: `https://your-project.supabase.co`
- No trailing slash

### "Invalid API Key"
- Verify you copied the full key
- Check for extra spaces
- Make sure you used the correct key (anon vs service_role)

### "Email not sending"
- Verify `EMAIL_USER` is correct Gmail address
- Check `EMAIL_PASS` is 16-character app password
- Verify 2FA is enabled on Gmail
- Check spam folder
- Wait a few seconds (email takes time)

### "Setup code invalid"
- Verify `ADMIN_SETUP_CODE` matches what you entered
- Check for typos
- Make sure you're using the code you set

### "Database connection failed"
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check Supabase project is active
- Verify database migration was run
- Check RLS policies are enabled

## Security Best Practices

1. **Never commit .env files**
   - Add `.env.local` to `.gitignore`
   - Use Vercel environment variables for production

2. **Rotate credentials regularly**
   - Change admin passwords monthly
   - Regenerate app passwords quarterly
   - Update API keys if compromised

3. **Use strong setup code**
   - Don't use default `123456`
   - Use random string (e.g., `kR9mP2xL`)
   - Change after first admin creation

4. **Protect service role key**
   - Never expose in frontend code
   - Only use in server-side code
   - Rotate if accidentally exposed

5. **Monitor email usage**
   - Check Gmail account for suspicious activity
   - Review email logs in admin dashboard
   - Set up Gmail alerts

## Environment Variables Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Set and verified
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Set and verified
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Set and verified
- [ ] `EMAIL_USER` - Gmail address set
- [ ] `EMAIL_PASS` - App password set
- [ ] `NEXT_PUBLIC_SITE_URL` - Domain set
- [ ] `ADMIN_SETUP_CODE` - Custom code set
- [ ] All variables added to Vercel
- [ ] `.env.local` added to `.gitignore`
- [ ] Database migration completed
- [ ] Admin user created
- [ ] Test registration successful
- [ ] Test email received

## Support

If you encounter issues:
1. Check this guide for your specific error
2. Review DEPLOYMENT_GUIDE.md
3. Check Vercel logs
4. Check Supabase logs
5. Review browser console (F12)

---

**All environment variables configured? You're ready to deploy!**
