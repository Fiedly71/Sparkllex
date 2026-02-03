# Database Updates Required

## 1. Add plan_status column to profiles table

```sql
-- Add plan_status column (default: active)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS plan_status TEXT DEFAULT 'active';

-- Add created_at if it doesn't exist (for renewal date calculation)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
```

## 2. Verify appointments table structure

The appointments table should have these columns:
- `id` (UUID, primary key)
- `client_id` (UUID, references profiles.id or auth.users.id)
- `service_type` (TEXT)
- `date` (DATE)
- `time` (TIME)
- `client_name` (TEXT)
- `notes` (TEXT, optional)
- `status` (TEXT: 'pendiente', 'confirmada', 'completada', 'cancelada')
- `assigned_to` (UUID, optional, references staff)
- `created_at` (TIMESTAMPTZ)

```sql
-- If appointments table doesn't exist, create it:
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    client_name TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pendiente',
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- If table exists but columns are wrong, drop and recreate or alter:
-- Option 1: Drop old table (WARNING: loses data)
-- DROP TABLE IF EXISTS appointments;
-- Then run CREATE TABLE above

-- Option 2: Rename/add columns if table exists
-- ALTER TABLE appointments RENAME COLUMN user_id TO client_id;
-- ALTER TABLE appointments RENAME COLUMN service_name TO service_type;
-- ALTER TABLE appointments RENAME COLUMN pickup_datetime TO date;
-- ALTER TABLE appointments ADD COLUMN IF NOT EXISTS time TIME;
-- ALTER TABLE appointments ADD COLUMN IF NOT EXISTS client_name TEXT;
```

## 3. Add RLS policies for appointments

```sql
-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Clients can view their own appointments
CREATE POLICY "Clients can view own appointments" ON appointments
    FOR SELECT
    USING (auth.uid() = client_id);

-- Clients can create their own appointments
CREATE POLICY "Clients can create appointments" ON appointments
    FOR INSERT
    WITH CHECK (auth.uid() = client_id);

-- Admin and staff can view all appointments
CREATE POLICY "Admin can view all appointments" ON appointments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'staff')
        )
    );

-- Admin and staff can update all appointments
CREATE POLICY "Admin can update appointments" ON appointments
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'staff')
        )
    );
```

## 4. Plan Limits (for future implementation)

Plans and their booking limits:
- **Basic**: 1 booking per month ($79/month)
- **Pro**: 3 bookings per month ($149/month)
- **Family**: Unlimited bookings ($249/month)

To implement booking limits, you can:
1. Add a `bookings_count` column to profiles
2. Add a `reset_date` column for monthly reset
3. Check count before allowing new booking
4. Reset count every month

```sql
-- Add booking tracking columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bookings_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bookings_reset_date DATE;

-- Function to check booking limit (optional)
CREATE OR REPLACE FUNCTION check_booking_limit(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_plan TEXT;
    current_count INTEGER;
    plan_limit INTEGER;
BEGIN
    SELECT plan, bookings_count INTO user_plan, current_count
    FROM profiles WHERE id = user_id;
    
    plan_limit := CASE user_plan
        WHEN 'Basic' THEN 1
        WHEN 'Pro' THEN 3
        WHEN 'Family' THEN 999  -- Unlimited
        ELSE 1
    END;
    
    RETURN current_count < plan_limit;
END;
$$ LANGUAGE plpgsql;
```

## Quick Setup Commands

Run these in Supabase SQL Editor in this order:

```sql
-- 1. Add plan_status to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_status TEXT DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- 2. Create appointments table (if not exists)
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    client_name TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pendiente',
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS and add policies
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view own" ON appointments
    FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Clients create own" ON appointments
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Admin view all" ON appointments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
    );

CREATE POLICY "Admin update all" ON appointments
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
    );
```

## Done! 🎉

After running these SQL commands in Supabase, the system will work with:
- ✅ Plan status tracking (active/inactive)
- ✅ Appointments with proper column names
- ✅ RLS policies for security
- ✅ Client access control based on plan status
