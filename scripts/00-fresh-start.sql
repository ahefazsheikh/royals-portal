-- Fresh start: Drop all existing tables and recreate from scratch
DROP TABLE IF EXISTS communication_logs CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS admin_allowlist CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;

-- Create registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college TEXT,
  degree TEXT,
  graduation_year INTEGER,
  experience_years INTEGER,
  skills TEXT[],
  portfolio_url TEXT,
  github_url TEXT,
  photo_url TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'pending',
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  admin_note TEXT,
  referred_by TEXT,
  source TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email, phone)
);

-- Create admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create communication logs table
CREATE TABLE communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  admin_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_uid TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for registrations (public read, authenticated write)
CREATE POLICY "registrations_public_read" ON registrations
  FOR SELECT USING (true);

CREATE POLICY "registrations_insert" ON registrations
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for admins (authenticated only)
CREATE POLICY "admins_authenticated_read" ON admins
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admins_authenticated_write" ON admins
  FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for communication logs
CREATE POLICY "communication_logs_read" ON communication_logs
  FOR SELECT USING (true);

CREATE POLICY "communication_logs_insert" ON communication_logs
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for audit logs
CREATE POLICY "audit_logs_read" ON audit_logs
  FOR SELECT USING (true);

CREATE POLICY "audit_logs_insert" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_phone ON registrations(phone);
CREATE INDEX idx_registrations_uid ON registrations(uid);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_communication_logs_registration_id ON communication_logs(registration_id);
CREATE INDEX idx_audit_logs_registration_uid ON audit_logs(registration_uid);
