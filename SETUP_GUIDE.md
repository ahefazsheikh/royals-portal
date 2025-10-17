# Royals Webtech Portal - Setup Guide

## Prerequisites
- Node.js 18+
- Supabase account
- Gmail account for email notifications
- Environment variables configured

## Environment Variables Required

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_SETUP_CODE=your_secure_setup_code
\`\`\`

## Database Setup

1. Run the migration script in Supabase SQL Editor:
   - Copy contents of `scripts/01-init-database.sql`
   - Execute in Supabase SQL Editor

2. Create Supabase Storage bucket:
   - Name: `uploads`
   - Make it private

## Initial Admin Setup

1. Navigate to `/auth/setup`
2. Enter admin email and password
3. Use the `ADMIN_SETUP_CODE` from environment variables
4. Login at `/auth/login`

## Features

### Registration
- Internship, Job, and Inquiry registration forms
- File uploads (Resume PDF, Photo JPG/PNG)
- Duplicate prevention by email and phone
- Automatic confirmation emails with QR codes
- Mobile-responsive design

### Admin Panel
- Dashboard with statistics
- Registration management
- QR code scanner for check-in
- Email communication with candidates
- Role-based access control

### Role-Based Access
- **Director**: Full access, manage admins
- **Admin**: Full access to registrations
- **HR**: Manage registrations, send emails
- **Developer**: Limited access, check-in only
- **Executive**: View-only access

### Security Features
- Row-level security (RLS) in Supabase
- Rate limiting on email sending
- Input validation and sanitization
- Audit logging for all admin actions
- File type and size validation

## Deployment

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Support

For issues or questions, contact Royals Webtech Pvt. Ltd.
