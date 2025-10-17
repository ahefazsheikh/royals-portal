# Royal Sports Portal - Complete Registration & Admin System

A professional, fully-functional registration portal built with Next.js, Supabase, and Tailwind CSS. Features role-based admin access, file uploads, email notifications, and comprehensive candidate management.

## Features

### User Features
- **Multiple Registration Types**: Internship, Job, or General Inquiry
- **File Uploads**: Photo (JPG/PNG, max 5MB) and Resume (PDF, max 10MB)
- **Duplicate Prevention**: Prevents duplicate registrations by email+phone combination
- **Unique ID Generation**: Each registration gets a unique ID (e.g., RWT-INT-250117-ABC1)
- **QR Code Generation**: Automatic QR code for verification
- **Email Confirmation**: Automatic confirmation email with registration details
- **Mobile Responsive**: Fully responsive design for all devices
- **Form Validation**: Client and server-side validation

### Admin Features
- **Dashboard Analytics**: Total registrations, check-ins, breakdown by type
- **Registration Management**: View, filter, and search all registrations
- **Status Updates**: Update candidate status (new, reviewing, shortlisted, rejected, hired)
- **Check-in System**: Mark candidates as checked-in with timestamp
- **Email Communication**: Send custom emails to candidates
- **Communication History**: Track all emails sent to candidates
- **Audit Logs**: Complete audit trail of all admin actions
- **QR Scanner**: Scan QR codes for quick check-in
- **Admin Management**: Create and manage admin users with roles

### Role-Based Access Control
- **Director**: Full access, manage admins, view all data
- **Admin**: Manage registrations, send emails, update status
- **HR**: View registrations, send emails, manage candidates
- **Developer**: View registrations, technical support
- **Executive**: View analytics and reports

### Security Features
- **Row-Level Security (RLS)**: Database-level access control
- **Input Validation**: Sanitization and validation of all inputs
- **Rate Limiting**: Prevent email spam and abuse
- **Audit Logging**: Track all admin actions
- **Secure File Storage**: Private storage bucket with access control
- **Environment Variables**: Secure credential management

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API Routes, Server Components
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Email**: Nodemailer with Gmail
- **QR Codes**: qrcode library
- **Form Handling**: React Hook Form, Zod validation

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── registrations/          # Registration submission API
│   │   ├── admin/
│   │   │   ├── registrations/      # Admin registration management
│   │   │   ├── send-email/         # Email sending API
│   │   │   ├── setup/              # Admin setup API
│   │   │   └── verify/             # QR verification API
│   │   └── upload/                 # File upload API
│   ├── auth/
│   │   ├── login/                  # Admin login page
│   │   └── setup/                  # Admin setup page
│   ├── admin/                       # Admin dashboard
│   ├── register/[type]/             # Registration form pages
│   ├── success/[uid]/               # Success page with ID card
│   ├── page.tsx                     # Home page
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
├── components/
│   ├── registration-form.tsx        # Registration form component
│   ├── admin-row-actions.tsx        # Admin table actions
│   ├── site-header.tsx              # Header component
│   ├── site-footer.tsx              # Footer component
│   └── ui/                          # shadcn/ui components
├── lib/
│   ├── supabase/                    # Supabase client setup
│   ├── admin.ts                     # Admin utilities
│   ├── email.ts                     # Email configuration
│   ├── emailTemplates.ts            # Email HTML templates
│   ├── validation.ts                # Input validation
│   ├── utils.ts                     # Utility functions
│   └── rate-limit.ts                # Rate limiting
├── scripts/
│   └── 00-fresh-start.sql           # Database migration
├── middleware.ts                    # Next.js middleware
└── public/                          # Static assets
\`\`\`

## Getting Started

### Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone <repo-url>
   cd royals-portal
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase and Gmail credentials
   \`\`\`

4. **Run database migration**
   - Go to Supabase SQL Editor
   - Copy contents of `scripts/00-fresh-start.sql`
   - Execute the script

5. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Create admin user**
   - Visit http://localhost:3000/auth/setup
   - Enter email, password, and setup code (123456)
   - Click "Create Admin"

7. **Login to admin panel**
   - Visit http://localhost:3000/auth/login
   - Use your admin credentials

### Deployment to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Add environment variables**
   - Go to Settings → Environment Variables
   - Add all required variables (see DEPLOYMENT_GUIDE.md)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

5. **Set up admin**
   - Visit `https://your-domain.com/auth/setup`
   - Create your first admin user

## API Endpoints

### Public Endpoints
- `POST /api/registrations` - Submit registration
- `GET /api/registrations?uid=...` - Get registration details

### Admin Endpoints (Requires Authentication)
- `GET /api/admin/registrations` - List all registrations
- `PATCH /api/admin/registrations` - Update registration
- `POST /api/admin/send-email` - Send email to candidate
- `POST /api/admin/setup` - Create admin user
- `GET /api/admin/verify` - Verify QR code

## Database Schema

### registrations
- `id` (UUID) - Primary key
- `uid` (TEXT) - Unique registration ID
- `type` (TEXT) - Registration type (internship, job, inquiry)
- `name`, `email`, `phone` - Candidate info
- `college`, `degree`, `graduation_year` - Education
- `experience_years` - Work experience
- `skills` (ARRAY) - Technical skills
- `photo_url`, `resume_url` - File URLs
- `status` (TEXT) - Current status
- `checked_in` (BOOLEAN) - Check-in status
- `created_at`, `updated_at` - Timestamps

### admins
- `id` (UUID) - Primary key
- `email` (TEXT) - Admin email
- `role` (TEXT) - Admin role
- `active` (BOOLEAN) - Active status
- `created_at`, `updated_at` - Timestamps

### communication_logs
- `id` (UUID) - Primary key
- `registration_id` (UUID) - Reference to registration
- `admin_email` (TEXT) - Admin who sent email
- `subject`, `message` (TEXT) - Email content
- `status` (TEXT) - Send status
- `sent_at` - Timestamp

### audit_logs
- `id` (UUID) - Primary key
- `registration_uid` (TEXT) - Registration reference
- `admin_email` (TEXT) - Admin who performed action
- `action` (TEXT) - Action performed
- `details` (JSONB) - Action details
- `created_at` - Timestamp

## Configuration

### Email Setup
1. Enable 2FA on Gmail account
2. Generate app password at https://myaccount.google.com/apppasswords
3. Set `EMAIL_USER` and `EMAIL_PASS` in environment variables

### File Upload Limits
- Photo: 5MB (JPG/PNG)
- Resume: 10MB (PDF)

### Admin Setup Code
- Default: `123456`
- Change via `ADMIN_SETUP_CODE` environment variable

## Troubleshooting

### Registration Submission Fails
- Check browser console for error messages
- Verify all required fields are filled
- Check file sizes and types
- Ensure Supabase storage bucket exists

### Email Not Sending
- Verify Gmail app password is correct
- Check EMAIL_USER and EMAIL_PASS in environment variables
- Ensure 2FA is enabled on Gmail
- Check spam folder

### Admin Login Issues
- Verify admin email exists in database
- Check admin is marked as active
- Try resetting password via Supabase dashboard

### File Upload Issues
- Verify storage bucket is created and private
- Check file size limits
- Ensure file types are correct
- Check browser console for CORS errors

## Performance Optimization

- Server-side rendering for fast initial load
- Image optimization with Next.js Image component
- Database indexing on frequently queried columns
- Rate limiting to prevent abuse
- Efficient database queries with proper pagination

## Security Best Practices

- Never commit `.env` files
- Use strong admin passwords
- Enable 2FA on Gmail account
- Regularly review audit logs
- Keep dependencies updated
- Use HTTPS in production
- Enable RLS on all database tables
- Regularly backup database

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check DEPLOYMENT_GUIDE.md for setup help
2. Review error logs in Vercel dashboard
3. Check Supabase logs for database errors
4. Review browser console for client-side errors

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ by Royals Webtech**
# royals-portal
