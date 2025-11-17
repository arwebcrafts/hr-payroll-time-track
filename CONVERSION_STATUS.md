# MySQL Conversion Status

## ✅ COMPLETED (7 files)

### Authentication & Core Infrastructure
1. ✅ `app/[locale]/auth/login/page.tsx` - **CONVERTED** to NextAuth signIn()
2. ✅ `app/[locale]/auth/signup/page.tsx` - **CONVERTED** to use signup API
3. ✅ `app/api/auth/signup/route.ts` - **CREATED** for user registration
4. ✅ `app/api/auth/[...nextauth]/route.ts` - **CREATED** NextAuth handler
5. ✅ `app/[locale]/layout.tsx` - **UPDATED** with SessionProvider
6. ✅ `components/SessionProvider.tsx` - **CREATED** client wrapper
7. ✅ `app/[locale]/(dashboard)/dashboard/page.tsx` - **CONVERTED** to Prisma

---

## ⚠️ TODO: 16 Files Still Need Conversion

### Priority 1: Client Pages (3 files) - CRITICAL

**File:** `app/[locale]/(dashboard)/clients/page.tsx`
**Changes Needed:**
```typescript
// OLD:
import { createClient } from '@/lib/supabase/server';
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
const { data: clients } = await supabase.from('clients').select('*').eq('user_id', user!.id);

// NEW:
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const session = await getServerSession(authOptions);
if (!session) redirect('/auth/login');

const clients = await prisma.client.findMany({
  where: { userId: session.user.id },
  orderBy: { createdAt: 'desc' }
});
```

---

**File:** `app/[locale]/(dashboard)/clients/new/page.tsx`
**Changes Needed:**
```typescript
// OLD (client component):
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();
const { data, error } = await supabase.from('clients').insert({...});

// NEW:
import { useSession } from 'next-auth/react';
const { data: session } = useSession();

// Use API route instead:
const response = await fetch('/api/clients', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});

// CREATE: app/api/clients/route.ts
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  const client = await prisma.client.create({
    data: {
      userId: session.user.id,
      name: body.name,
      email: body.email,
      // ... other fields
    }
  });

  return NextResponse.json(client);
}
```

---

**File:** `app/[locale]/(dashboard)/clients/[id]/edit/page.tsx`
**Changes Needed:**
```typescript
// Similar to above, but use PUT method and prisma.client.update()
```

---

### Priority 2: Proposal Pages (2 files)

**File:** `app/[locale]/(dashboard)/proposals/page.tsx`
**Pattern:**
```typescript
const proposals = await prisma.proposal.findMany({
  where: { userId: session.user.id },
  include: {
    client: {
      select: { name: true, company: true }
    }
  },
  orderBy: { createdAt: 'desc' }
});
```

**File:** `app/[locale]/(dashboard)/proposals/new/page.tsx`
- Create API route: `app/api/proposals/route.ts`
- Use fetch() to call it from client component

---

### Priority 3: Invoice Pages (2 files)

**File:** `app/[locale]/(dashboard)/invoices/page.tsx`
**File:** `app/[locale]/(dashboard)/invoices/new/page.tsx`
- Same pattern as proposals

---

### Priority 4: Settings Page (1 file)

**File:** `app/[locale]/(dashboard)/settings/page.tsx`
```typescript
const user = await prisma.user.findUnique({
  where: { id: session.user.id }
});

// For update:
await prisma.user.update({
  where: { id: session.user.id },
  data: { businessName, businessEmail, ... }
});
```

---

### Priority 5: Onboarding Page (1 file)

**File:** `app/[locale]/onboarding/page.tsx`
- Convert to use Prisma for user updates
- File upload needs separate implementation (see below)

---

### Priority 6: API Routes (5 files)

**File:** `app/api/proposals/generate/route.ts`
```typescript
// OLD:
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

// NEW:
const session = await getServerSession(authOptions);
if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
```

**Files to convert:**
1. `app/api/proposals/[id]/pdf/route.ts`
2. `app/api/proposals/[id]/send/route.ts`
3. `app/api/invoices/[id]/pdf/route.ts`
4. `app/api/invoices/[id]/send/route.ts`

**Pattern for all:**
- Replace auth check (shown above)
- Replace database queries:
  ```typescript
  // OLD:
  const { data: proposal } = await supabase.from('proposals').select('*, client(*), user(*)').eq('id', id).single();

  // NEW:
  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      client: true,
      user: true
    }
  });
  ```

---

### Priority 7: Delete Old Files (2 files)

```bash
rm -rf lib/supabase
rm app/[locale]/auth/callback/route.ts
```

---

## 🔧 Quick Conversion Patterns

### Server Components (List Pages)

```typescript
// BEFORE:
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: items } = await supabase.from('table').select('*').eq('user_id', user.id);

  return <div>{items.map(...)}</div>;
}

// AFTER:
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  const items = await prisma.table.findMany({
    where: { userId: session.user.id }
  });

  return <div>{items.map(...)}</div>;
}
```

### Client Components (Form Pages)

```typescript
// BEFORE:
'use client';
import { createClient } from '@/lib/supabase/client';

export default function Page() {
  const handleSubmit = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('table').insert({...});
  };
}

// AFTER:
'use client';
import { useSession } from 'next-auth/react';

export default function Page() {
  const { data: session } = useSession();

  const handleSubmit = async () => {
    const response = await fetch('/api/resource', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  };
}

// CREATE API ROUTE: app/api/resource/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const item = await prisma.table.create({
    data: { userId: session.user.id, ...body }
  });

  return NextResponse.json(item);
}
```

### API Routes

```typescript
// BEFORE:
import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabase.from('table').select('*').eq('user_id', user.id);
  return NextResponse.json(data);
}

// AFTER:
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await prisma.table.findMany({
    where: { userId: session.user.id }
  });

  return NextResponse.json(data);
}
```

---

## 📝 Field Name Mapping (PostgreSQL → MySQL)

Due to Prisma camelCase convention:

| Supabase (snake_case) | Prisma (camelCase) |
|---|---|
| `user_id` | `userId` |
| `business_name` | `businessName` |
| `created_at` | `createdAt` |
| `updated_at` | `updatedAt` |
| `proposal_number` | `proposalNumber` |
| `invoice_number` | `invoiceNumber` |
| `line_items` | `lineItems` |
| `total_amount` | `totalAmount` |
| `tax_rate` | `taxRate` |
| `tax_amount` | `taxAmount` |
| `discount_amount` | `discount` |
| `payment_terms` | `paymentTerms` |
| `issue_date` | `issueDate` |
| `due_date` | `dueDate` |
| `amount_paid` | `amountPaid` |

**IMPORTANT:** When querying in Prisma, use camelCase. When accessing data, it returns camelCase.

---

## 🚀 Conversion Workflow

1. **Convert one file at a time**
2. **Test after each conversion**
3. **Use this checklist to track progress**
4. **Refer to MYSQL_MIGRATION.md for detailed examples**

---

## ✅ Verification Checklist

After converting all files:

- [ ] Login works
- [ ] Signup works
- [ ] Dashboard loads
- [ ] Can create clients
- [ ] Can list clients
- [ ] Can edit clients
- [ ] Can create proposals
- [ ] Can list proposals
- [ ] Can download proposal PDFs
- [ ] Can create invoices
- [ ] Can list invoices
- [ ] Can download invoice PDFs
- [ ] Settings page works
- [ ] Onboarding works
- [ ] No Supabase imports remain

---

## 🎯 Estimated Time Remaining

- **Quick conversion (copy-paste patterns):** 2-3 hours
- **With testing each page:** 4-5 hours
- **Production-ready with edge cases:** 6-8 hours

---

## 💡 Pro Tips

1. **Start with server components** (list pages) - they're easier
2. **Then client components** (form pages) - need API routes
3. **Then API routes** - straightforward pattern replacement
4. **Test incrementally** - don't convert everything before testing
5. **Use Prisma Studio** - `npm run db:studio` to verify data

---

## 📚 Resources

- **MYSQL_MIGRATION.md** - Comprehensive migration guide
- **prisma/schema.prisma** - Database schema reference
- **This file** - Quick conversion patterns

---

**Status:** 7/23 files converted (30% complete)
**Next:** Convert client pages, then proposals, then invoices
