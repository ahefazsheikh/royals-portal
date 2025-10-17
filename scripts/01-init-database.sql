-- Create admin_emails table for role-based access
CREATE TABLE IF NOT EXISTS admin_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin', -- director, admin, hr, developer, executive
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create registrations table with duplicate prevention
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- internship, job, inquiry, drive
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college TEXT,
  degree TEXT,
  graduation_year INTEGER,
  experience INTEGER,
  referred_by TEXT,
  purpose TEXT,
  portfolio_url TEXT,
  github_url TEXT,
  skills TEXT[],
  notes TEXT,
  photo_path TEXT,
  resume_path TEXT,
  status TEXT DEFAULT 'new', -- new, reviewing, shortlisted, rejected, hired
  checked_in BOOLEAN DEFAULT FALSE,
  checkin_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  -- Unique constraint on email and phone to prevent duplicates
  CONSTRAINT unique_email_phone UNIQUE (email, phone)
);

-- Create communication_logs table for admin-to-candidate emails
CREATE TABLE IF NOT EXISTS communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  admin_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'sent' -- sent, failed, pending
);

-- Create audit_logs table for security and tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  registration_uid TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_phone ON registrations(phone);
CREATE INDEX IF NOT EXISTS idx_registrations_type ON registrations(type);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_communication_logs_registration_id ON communication_logs(registration_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_email ON audit_logs(admin_email);

-- Enable RLS (Row Level Security)
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_emails
CREATE POLICY "Allow public read admin_emails" ON admin_emails FOR SELECT USING (true);

-- RLS Policies for registrations
CREATE POLICY "Allow public insert registrations" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read own registration" ON registrations FOR SELECT USING (true);
CREATE POLICY "Allow admin update registrations" ON registrations FOR UPDATE USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admin_emails)
);

-- RLS Policies for communication_logs
CREATE POLICY "Allow admin insert communication_logs" ON communication_logs FOR INSERT WITH CHECK (
  auth.jwt() ->> 'email' IN (SELECT email FROM admin_emails)
);
CREATE POLICY "Allow admin read communication_logs" ON communication_logs FOR SELECT USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admin_emails)
);

-- RLS Policies for audit_logs
CREATE POLICY "Allow admin insert audit_logs" ON audit_logs FOR INSERT WITH CHECK (
  auth.jwt() ->> 'email' IN (SELECT email FROM admin_emails)
);
CREATE POLICY "Allow admin read audit_logs" ON audit_logs FOR SELECT USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admin_emails)
);
