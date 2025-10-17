# Royal Sports Portal - Deployment Guide

## Prerequisites

- Supabase project (already connected)
- Gmail account with app password
- Vercel account (for deployment)
- Node.js 18+ installed locally

## Step 1: Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/00-fresh-start.sql`
4. Execute the SQL script to create all tables and policies

## Step 2: Environment Variables

Add these to your Vercel project settings (Settings → Environment Variables):

\`\`\`
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Admin Setup
ADMIN_SETUP_CODE=123456
\`\`\`

### Getting Gmail App Password:
1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy the generated 16-character password
5. Use this as EMAIL_PASS

## Step 3: Create Admin User

1. Deploy the project to Vercel
2. Visit `https://your-domain.com/auth/setup`
3. Enter:
   - Admin Email: your email
   - Password: secure password
   - Setup Code: 123456 (or your custom code)
4. Click "Create Admin"
5. You'll be redirected to login page

## Step 4: Login to Admin Panel

1. Visit `https://your-domain.com/auth/login`
2. Use the email and password you created
3. You'll see the admin dashboard

## Step 5: Create Storage Bucket

1. Go to Supabase → Storage
2. Create a new bucket named `uploads`
3. Set it to Private
4. Add RLS policy:
   - Allow public read access to `submissions/*`
   - Allow authenticated write access

## Features Overview

### User Registration
- Internship, Job, or Inquiry registration
- File uploads (photo + resume)
- Duplicate prevention by email+phone
- Automatic confirmation email with QR code
- Unique ID generation

### Admin Dashboard
- View all registrations
- Filter by type and status
- Check-in candidates
- Update registration status
- Send custom emails to candidates
- View communication history
- Audit logs

### Role-Based Access
- **Director**: Full access, manage admins
- **Admin**: Manage registrations, send emails
- **HR**: View registrations, send emails
- **Developer**: View registrations only
- **Executive**: View registrations, analytics

## Troubleshooting

### Email Not Sending
- Check EMAIL_USER and EMAIL_PASS are correct
- Verify Gmail app password (not regular password)
- Check spam folder
- Ensure 2FA is enabled on Gmail account

### File Upload Failing
- Verify storage bucket exists and is private
- Check file size limits (5MB photo, 10MB resume)
- Ensure file types are correct (JPG/PNG for photo, PDF for resume)

### Duplicate Registration Error
- User already registered with same email AND phone
- They can use different email or phone to register again
- Admin can manually delete old registration if needed

### Admin Login Not Working
- Verify email exists in admins table
- Check admin is marked as active
- Try resetting password via Supabase dashboard

## Deployment Checklist

- [ ] Database migration script executed
- [ ] All environment variables set in Vercel
- [ ] Storage bucket created and configured
- [ ] Admin user created via setup page
- [ ] Admin can login successfully
- [ ] Test registration form submission
- [ ] Test file uploads
- [ ] Test email sending
- [ ] Test admin dashboard features
- [ ] Test role-based access

## Support

For issues or questions, check the error logs in:
- Vercel: Deployments → Logs
- Supabase: Logs → Edge Functions
- Browser Console: F12 → Console tab

## Security Notes

- Never commit .env files
- Use strong admin passwords
- Regularly review audit logs
- Keep Supabase credentials secure
- Use HTTPS only in production
- Enable RLS on all tables
- Regularly backup your database
