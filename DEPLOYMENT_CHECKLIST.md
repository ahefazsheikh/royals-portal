# Deployment Checklist - Royal Sports Portal

## Pre-Deployment (Local Testing)

### Code Setup
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Create `.env.local` file
- [ ] Fill in all environment variables
- [ ] Run `npm run dev`
- [ ] Verify no console errors

### Local Testing
- [ ] Visit http://localhost:3000
- [ ] Home page loads correctly
- [ ] Navigation works
- [ ] Register as internship candidate
- [ ] Upload photo and resume
- [ ] Receive confirmation email
- [ ] Success page displays with ID card
- [ ] QR code is visible
- [ ] Print ID card works

### Admin Testing (Local)
- [ ] Visit http://localhost:3000/auth/setup
- [ ] Create admin user
- [ ] Login at http://localhost:3000/auth/login
- [ ] Dashboard loads
- [ ] See test registration
- [ ] Update registration status
- [ ] Send email to candidate
- [ ] Check-in candidate
- [ ] View audit logs

## Supabase Setup

### Database
- [ ] Create Supabase project
- [ ] Go to SQL Editor
- [ ] Copy `scripts/00-fresh-start.sql`
- [ ] Execute SQL script
- [ ] Verify tables created:
  - [ ] registrations
  - [ ] admins
  - [ ] communication_logs
  - [ ] audit_logs
- [ ] Verify indexes created
- [ ] Verify RLS policies enabled

### Storage
- [ ] Go to Storage section
- [ ] Create bucket named `uploads`
- [ ] Set bucket to Private
- [ ] Add RLS policy for public read
- [ ] Add RLS policy for authenticated write

### API Keys
- [ ] Copy Project URL
- [ ] Copy anon public key
- [ ] Copy service_role secret key
- [ ] Store securely

## Email Setup

### Gmail Configuration
- [ ] Enable 2FA on Gmail account
- [ ] Go to https://myaccount.google.com/apppasswords
- [ ] Generate app password
- [ ] Copy 16-character password
- [ ] Store securely

### Email Testing
- [ ] Send test email from admin
- [ ] Verify email arrives
- [ ] Check email formatting
- [ ] Verify links work
- [ ] Check spam folder

## Vercel Deployment

### Project Setup
- [ ] Push code to GitHub
- [ ] Go to https://vercel.com
- [ ] Click "New Project"
- [ ] Select GitHub repository
- [ ] Click "Import"

### Environment Variables
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Add `EMAIL_USER`
- [ ] Add `EMAIL_PASS`
- [ ] Add `NEXT_PUBLIC_SITE_URL`
- [ ] Add `ADMIN_SETUP_CODE`
- [ ] Verify all variables set
- [ ] Set environment to Production

### Deployment
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Verify deployment successful
- [ ] Check deployment logs for errors
- [ ] Note deployment URL

## Post-Deployment Testing

### Website Access
- [ ] Visit deployed URL
- [ ] Home page loads
- [ ] Navigation works
- [ ] No console errors
- [ ] Mobile view works

### Registration Testing
- [ ] Register as internship candidate
- [ ] Upload files
- [ ] Receive confirmation email
- [ ] Success page displays
- [ ] ID card visible
- [ ] QR code works

### Admin Testing
- [ ] Visit /auth/setup
- [ ] Create admin user
- [ ] Login at /auth/login
- [ ] Dashboard loads
- [ ] See registrations
- [ ] Update status
- [ ] Send email
- [ ] Check-in candidate

### Email Testing
- [ ] Confirmation email received
- [ ] Admin email received
- [ ] Email formatting correct
- [ ] Links work
- [ ] No spam folder issues

### File Upload Testing
- [ ] Upload photo (JPG)
- [ ] Upload photo (PNG)
- [ ] Upload resume (PDF)
- [ ] Verify files stored
- [ ] Verify file access

### Mobile Testing
- [ ] Test on iPhone
- [ ] Test on Android
- [ ] Test on tablet
- [ ] Forms responsive
- [ ] Tables responsive
- [ ] Navigation works

## Security Verification

### Access Control
- [ ] Admin login required for dashboard
- [ ] Non-admin cannot access admin panel
- [ ] Role-based access working
- [ ] Audit logs recording actions

### Data Protection
- [ ] Duplicate prevention working
- [ ] Input validation working
- [ ] File type validation working
- [ ] File size validation working

### Rate Limiting
- [ ] Email rate limiting active
- [ ] Cannot send 50+ emails/hour
- [ ] Rate limit error message clear

## Performance Verification

### Page Load Times
- [ ] Home page < 2 seconds
- [ ] Registration form < 2 seconds
- [ ] Admin dashboard < 3 seconds
- [ ] Success page < 2 seconds

### Database Performance
- [ ] Queries complete quickly
- [ ] No timeout errors
- [ ] Pagination working
- [ ] Search working

### File Upload Performance
- [ ] Photo upload < 5 seconds
- [ ] Resume upload < 10 seconds
- [ ] No upload errors

## Monitoring Setup

### Vercel Monitoring
- [ ] Enable analytics
- [ ] Set up error tracking
- [ ] Configure alerts
- [ ] Monitor deployment logs

### Supabase Monitoring
- [ ] Check database logs
- [ ] Monitor storage usage
- [ ] Check API usage
- [ ] Set up alerts

### Email Monitoring
- [ ] Monitor Gmail account
- [ ] Check email delivery
- [ ] Review bounce rates
- [ ] Monitor spam reports

## Documentation

### User Documentation
- [ ] README.md complete
- [ ] DEPLOYMENT_GUIDE.md complete
- [ ] QUICK_START.md complete
- [ ] FEATURES.md complete

### Admin Documentation
- [ ] Admin guide created
- [ ] Troubleshooting guide created
- [ ] FAQ document created
- [ ] Support contact info provided

## Final Checks

### Code Quality
- [ ] No console errors
- [ ] No console warnings
- [ ] No TypeScript errors
- [ ] No linting errors

### Functionality
- [ ] All features working
- [ ] All forms submitting
- [ ] All emails sending
- [ ] All files uploading

### User Experience
- [ ] Forms are intuitive
- [ ] Error messages clear
- [ ] Success messages clear
- [ ] Navigation logical

### Security
- [ ] No sensitive data exposed
- [ ] All credentials secure
- [ ] HTTPS enforced
- [ ] RLS policies active

## Go-Live Checklist

- [ ] All tests passed
- [ ] All documentation complete
- [ ] All monitoring configured
- [ ] Team trained
- [ ] Support plan in place
- [ ] Backup plan ready
- [ ] Rollback plan ready

## Post-Launch

### Day 1
- [ ] Monitor for errors
- [ ] Check email delivery
- [ ] Verify registrations
- [ ] Test admin functions
- [ ] Monitor performance

### Week 1
- [ ] Review analytics
- [ ] Check user feedback
- [ ] Monitor error logs
- [ ] Verify all features
- [ ] Performance review

### Month 1
- [ ] Full system review
- [ ] Security audit
- [ ] Performance optimization
- [ ] User feedback analysis
- [ ] Plan improvements

## Support Contacts

- **Technical Issues**: Check logs in Vercel dashboard
- **Database Issues**: Check Supabase dashboard
- **Email Issues**: Check Gmail account
- **Deployment Issues**: Review DEPLOYMENT_GUIDE.md

## Success Criteria

✅ Website deployed and accessible
✅ All features working
✅ Emails sending
✅ Files uploading
✅ Admin panel functional
✅ Mobile responsive
✅ No errors in logs
✅ Performance acceptable
✅ Security verified
✅ Documentation complete

---

**When all items are checked, your portal is ready for production use!**

**Deployment Date**: _______________
**Deployed By**: _______________
**Verified By**: _______________
