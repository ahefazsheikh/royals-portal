# Quick Start Guide - Royal Sports Portal

## 5-Minute Setup

### Step 1: Database (1 minute)
1. Open Supabase dashboard
2. Go to SQL Editor
3. Copy-paste `scripts/00-fresh-start.sql`
4. Click "Run"

### Step 2: Environment Variables (2 minutes)
In Vercel project settings, add:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-key>
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=<16-char-app-password>
NEXT_PUBLIC_SITE_URL=https://your-domain.com
ADMIN_SETUP_CODE=123456
\`\`\`

### Step 3: Deploy (1 minute)
- Push to GitHub
- Vercel auto-deploys

### Step 4: Create Admin (1 minute)
1. Visit `https://your-domain.com/auth/setup`
2. Enter email, password, code (123456)
3. Click "Create Admin"

### Step 5: Login
1. Visit `https://your-domain.com/auth/login`
2. Use your admin credentials
3. Done! 🎉

## Testing Checklist

- [ ] Register as internship candidate
- [ ] Upload photo and resume
- [ ] Receive confirmation email
- [ ] Login to admin panel
- [ ] See registration in dashboard
- [ ] Update candidate status
- [ ] Send email to candidate
- [ ] Check-in candidate

## Common Issues

| Issue | Solution |
|-------|----------|
| Email not sending | Check Gmail app password |
| File upload fails | Verify storage bucket exists |
| Admin login fails | Check admin email in database |
| Registration fails | Check all required fields |

## Next Steps

- Customize email templates in `lib/emailTemplates.ts`
- Add more admin roles in `lib/admin.ts`
- Customize registration form in `components/registration-form.tsx`
- Add more fields to registration in database schema
- Set up custom domain in Vercel

## Support

See DEPLOYMENT_GUIDE.md for detailed setup instructions.
