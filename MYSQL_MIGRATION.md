# MySQL Migration Guide

This guide explains how to migrate the Das Program application from Supabase (PostgreSQL) to MySQL with Prisma and NextAuth.js.

## 🎯 Overview

The migration involves:
1. ✅ **Database Schema** - Converted to Prisma schema (DONE)
2. ✅ **Package Dependencies** - Updated package.json (DONE)
3. ✅ **Prisma Client** - Created database connection (DONE)
4. ✅ **Authentication** - NextAuth.js setup (DONE)
5. ⚠️ **API Routes** - Need manual conversion (~15 files)
6. ⚠️ **Server Components** - Need manual conversion (~10 files)
7. ⚠️ **Client Components** - Need manual conversion (~8 files)
8. ⚠️ **File Upload** - Need local storage implementation

---

## 📋 Prerequisites

### 1. MySQL Database Setup

**Option A: Local MySQL**
```bash
# Install MySQL (Ubuntu/Debian)
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation

# Create database
mysql -u root -p
CREATE DATABASE das_program CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'das_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON das_program.* TO 'das_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Option B: PlanetScale** (Recommended for Production)
- Go to [planetscale.com](https://planetscale.com)
- Create free account
- Create new database
- Get connection string

**Option C: AWS RDS / DigitalOcean / Other**
- Create MySQL 8.0+ database
- Note connection details

### 2. Environment Variables

Create `.env` file (NOT `.env.local` for Prisma):

```env
# Database
DATABASE_URL="mysql://das_user:your_password@localhost:3306/das_program"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI (Optional)
ANTHROPIC_API_KEY="sk-ant-..."

# Email (Optional)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Payments (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

NEXT_PUBLIC_PAYPAL_CLIENT_ID="..."
PAYPAL_CLIENT_SECRET="..."
```

### 3. Install Dependencies

```bash
npm install
# This will automatically run: prisma generate
```

If you get Prisma engine errors:
```bash
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
npm install
```

### 4. Sync Database Schema

```bash
# Push schema to MySQL (creates all tables)
npm run db:push

# Or use migrations for production
npx prisma migrate dev --name init
```

### 5. View Database

```bash
# Open Prisma Studio (GUI for database)
npm run db:studio
```

---

## 🔧 Code Migration Steps

### Step 1: Update Imports

**OLD (Supabase):**
```typescript
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

**NEW (Prisma + NextAuth):**
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const session = await getServerSession(authOptions);
const user = session?.user;
```

### Step 2: Convert Database Queries

#### **SELECT Queries**

**OLD:**
```typescript
const { data: clients } = await supabase
  .from('clients')
  .select('*')
  .eq('user_id', user.id);
```

**NEW:**
```typescript
const clients = await prisma.client.findMany({
  where: { userId: user.id }
});
```

#### **SELECT with Relations**

**OLD:**
```typescript
const { data: proposal } = await supabase
  .from('proposals')
  .select(`
    *,
    client:clients(name, email),
    user:users(business_name)
  `)
  .eq('id', proposalId)
  .single();
```

**NEW:**
```typescript
const proposal = await prisma.proposal.findUnique({
  where: { id: proposalId },
  include: {
    client: {
      select: { name: true, email: true }
    },
    user: {
      select: { businessName: true }
    }
  }
});
```

#### **INSERT**

**OLD:**
```typescript
const { data, error } = await supabase
  .from('clients')
  .insert({
    user_id: user.id,
    name: 'John Doe',
    email: 'john@example.com'
  })
  .select()
  .single();
```

**NEW:**
```typescript
const client = await prisma.client.create({
  data: {
    userId: user.id,
    name: 'John Doe',
    email: 'john@example.com'
  }
});
```

#### **UPDATE**

**OLD:**
```typescript
const { error } = await supabase
  .from('clients')
  .update({ name: 'Jane Doe' })
  .eq('id', clientId)
  .eq('user_id', user.id);
```

**NEW:**
```typescript
await prisma.client.update({
  where: {
    id: clientId,
    userId: user.id
  },
  data: { name: 'Jane Doe' }
});
```

#### **DELETE**

**OLD:**
```typescript
const { error } = await supabase
  .from('clients')
  .delete()
  .eq('id', clientId)
  .eq('user_id', user.id);
```

**NEW:**
```typescript
await prisma.client.delete({
  where: {
    id: clientId,
    userId: user.id
  }
});
```

### Step 3: Update Authentication

#### **Server Components / API Routes**

**OLD:**
```typescript
const supabase = await createClient();
const { data: { user }, error } = await supabase.auth.getUser();

if (error || !user) {
  redirect('/auth/login');
}
```

**NEW:**
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

const session = await getServerSession(authOptions);

if (!session || !session.user) {
  redirect('/auth/login');
}

const user = session.user;
```

#### **Client Components**

**OLD:**
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();
```

**NEW:**
```typescript
import { useSession } from 'next-auth/react';

const { data: session, status } = useSession();
const user = session?.user;

if (status === 'loading') return <div>Loading...</div>;
if (status === 'unauthenticated') router.push('/auth/login');
```

#### **Provider Setup** (Required)

Wrap your app in `app/[locale]/layout.tsx`:

```typescript
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

### Step 4: Update Auth Pages

#### **Login Page** (`app/[locale]/auth/login/page.tsx`)

**OLD:**
```typescript
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

**NEW:**
```typescript
import { signIn } from 'next-auth/react';

const result = await signIn('credentials', {
  redirect: false,
  email,
  password,
});

if (result?.error) {
  setError('Invalid credentials');
} else {
  router.push('/dashboard');
}
```

#### **Signup Page** (`app/[locale]/auth/signup/page.tsx`)

**OLD:**
```typescript
const { error } = await supabase.auth.signUp({
  email,
  password,
});
```

**NEW:**
```typescript
import bcrypt from 'bcryptjs';

// Create API route: /api/auth/signup
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, name })
});

// In API route:
const hashedPassword = await bcrypt.hash(password, 10);

const user = await prisma.user.create({
  data: {
    email,
    password: hashedPassword,
    name
  }
});
```

#### **Logout**

**OLD:**
```typescript
await supabase.auth.signOut();
```

**NEW:**
```typescript
import { signOut } from 'next-auth/react';

await signOut({ callbackUrl: '/auth/login' });
```

### Step 5: File Upload (Logo Upload in Onboarding)

**OLD (Supabase Storage):**
```typescript
const { data, error } = await supabase.storage
  .from('logos')
  .upload(`${user.id}/logo.png`, file);
```

**NEW (Local File System with Multer):**

Create API route: `/api/upload/logo/route.ts`

```typescript
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save to public/uploads folder
  const path = join(process.cwd(), 'public', 'uploads', 'logos', file.name);
  await writeFile(path, buffer);

  const url = `/uploads/logos/${file.name}`;
  return NextResponse.json({ url });
}
```

**Alternative: Use AWS S3 or Cloudinary for production**

---

## 📝 Files to Convert

### High Priority (Core Functionality)

1. **Auth Pages**
   - `app/[locale]/auth/login/page.tsx` - ⚠️ Convert signIn
   - `app/[locale]/auth/signup/page.tsx` - ⚠️ Convert signUp
   - `app/[locale]/auth/callback/route.ts` - ❌ Delete (not needed)

2. **Dashboard & Protected Pages**
   - `app/[locale]/(dashboard)/layout.tsx` - ⚠️ Add SessionProvider
   - `app/[locale]/(dashboard)/dashboard/page.tsx` - ⚠️ Convert queries
   - `app/[locale]/(dashboard)/clients/page.tsx` - ⚠️ Convert queries
   - `app/[locale]/(dashboard)/clients/new/page.tsx` - ⚠️ Convert insert
   - `app/[locale]/(dashboard)/clients/[id]/edit/page.tsx` - ⚠️ Convert update
   - `app/[locale]/(dashboard)/proposals/page.tsx` - ⚠️ Convert queries
   - `app/[locale]/(dashboard)/proposals/new/page.tsx` - ⚠️ Convert insert
   - `app/[locale]/(dashboard)/invoices/page.tsx` - ⚠️ Convert queries
   - `app/[locale]/(dashboard)/invoices/new/page.tsx` - ⚠️ Convert insert
   - `app/[locale]/(dashboard)/settings/page.tsx` - ⚠️ Convert queries
   - `app/[locale]/onboarding/page.tsx` - ⚠️ Convert queries + file upload

3. **API Routes**
   - `app/api/proposals/generate/route.ts` - ⚠️ Convert auth + queries
   - `app/api/proposals/[id]/pdf/route.ts` - ⚠️ Convert auth + queries
   - `app/api/proposals/[id]/send/route.ts` - ⚠️ Convert auth + queries
   - `app/api/invoices/[id]/pdf/route.ts` - ⚠️ Convert auth + queries
   - `app/api/invoices/[id]/send/route.ts` - ⚠️ Convert auth + queries

### Medium Priority (Can Be Added Later)

4. **Time Tracking** (currently placeholders)
5. **Services** (currently placeholders)
6. **Reports** (currently placeholders)

### Low Priority

7. **Delete Unnecessary Files**
   - `lib/supabase/client.ts` - ❌ Delete
   - `lib/supabase/server.ts` - ❌ Delete
   - `supabase-schema.sql` - ❌ Can delete after migration

---

## 🚀 Quick Start After Setup

1. **Install & Setup:**
```bash
npm install
echo "DATABASE_URL='mysql://user:pass@localhost:3306/das_program'" > .env
npm run db:push
```

2. **Create First User (via Prisma Studio):**
```bash
npm run db:studio
```
- Navigate to `User` table
- Click "Add record"
- Enter email and hashed password (generate with bcryptjs)

3. **Start Development:**
```bash
npm run dev
```

4. **Test Authentication:**
- Go to http://localhost:3000/auth/login
- Sign in with created user
- Should redirect to dashboard

---

## 🔍 Common Issues & Solutions

### Issue: Prisma Engine Download Fails

```bash
# Solution:
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
npm install
```

### Issue: MySQL Connection Error

```
Error: P1001: Can't reach database server
```

**Solution:**
- Check MySQL is running: `sudo systemctl status mysql`
- Check connection string in `.env`
- Test connection: `mysql -u das_user -p das_program`

### Issue: Session Not Persisting

**Solution:**
- Ensure `NEXTAUTH_SECRET` is set in `.env`
- Clear browser cookies
- Check `SessionProvider` is wrapping app

### Issue: File Upload Not Working

**Solution:**
- Create directory: `mkdir -p public/uploads/logos`
- Check file permissions: `chmod 755 public/uploads`
- Ensure Next.js serves public folder

---

## 📊 Migration Progress Checklist

- [x] Prisma schema created
- [x] Package.json updated
- [x] Prisma client setup
- [x] NextAuth configuration
- [x] Auth API routes created
- [ ] Convert auth pages (login, signup)
- [ ] Add SessionProvider to layout
- [ ] Convert dashboard page
- [ ] Convert clients pages (list, new, edit)
- [ ] Convert proposals pages
- [ ] Convert invoices pages
- [ ] Convert settings page
- [ ] Convert onboarding page
- [ ] Implement file upload
- [ ] Convert PDF generation APIs
- [ ] Convert email sending APIs
- [ ] Test all features
- [ ] Update README
- [ ] Deploy to production

---

## 📚 Additional Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth.js Docs**: https://next-auth.js.org
- **MySQL Docs**: https://dev.mysql.com/doc
- **PlanetScale**: https://planetscale.com
- **Prisma Studio**: Built-in database GUI

---

## 💡 Pro Tips

1. **Use Transactions** for complex operations:
```typescript
await prisma.$transaction(async (tx) => {
  const proposal = await tx.proposal.create({...});
  await tx.emailLog.create({...});
});
```

2. **Optimize Queries** with select/include:
```typescript
// Only select needed fields
const clients = await prisma.client.findMany({
  select: { id: true, name: true, email: true }
});
```

3. **Use Prisma Studio** for quick database inspection:
```bash
npm run db:studio
```

4. **Enable Query Logging** in development:
```typescript
// In lib/prisma.ts
log: ['query', 'error', 'warn']
```

5. **Use Middleware** for automatic timestamps:
```typescript
prisma.$use(async (params, next) => {
  if (params.action === 'update') {
    params.args.data.updatedAt = new Date();
  }
  return next(params);
});
```

---

## 🎯 Next Steps

1. Start with auth pages (login/signup)
2. Convert one page at a time
3. Test each page before moving to next
4. Use Prisma Studio to verify data
5. Deploy when all features work

Good luck with your migration! 🚀
