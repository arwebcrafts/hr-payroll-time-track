# Das Program - AI-Powered Proposal & Invoice Generator

A comprehensive SaaS application for freelancers, agencies, and consultants to create professional proposals and invoices with AI assistance, time tracking, client management, and integrated payment processing.

## 🎯 Features

### ✅ Completed Features

- **Multi-language Support**: English and German with IP-based auto-detection
- **Authentication System**: Email/password authentication with Supabase
- **Dashboard**: Real-time metrics and quick actions
- **Client Management**: Full CRUD for client data
- **Responsive Navigation**: Sidebar navigation with routing
- **Database Schema**: Complete 9-table schema with RLS policies
- **TypeScript**: Fully typed with strict mode
- **UI Components**: Shadcn UI component library integrated

### 🚧 To Be Implemented

#### High Priority
1. **AI Proposal Generator** (Using Anthropic Claude API)
2. **Invoice Generator** with PDF export
3. **Payment Integration** (Stripe + PayPal)
4. **Time Tracking** with timer functionality
5. **PDF Generation** for proposals and invoices
6. **Email Automation** with Resend

#### Medium Priority
7. **Proposal Templates** (6 professional designs)
8. **Invoice Templates** (4 professional designs)
9. **Reports & Analytics Dashboard**
10. **Settings Pages** (Business, Invoice, Payment, Email)

#### Nice to Have
11. **Services Catalog**
12. **Dark Mode** support
13. **Global Search** (Cmd+K)
14. **Automated Follow-ups**
15. **Onboarding Wizard**

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- A Supabase account (free tier works)
- API keys for:
  - Anthropic Claude API
  - Stripe (optional for payments)
  - PayPal (optional for payments)
  - Resend (optional for emails)

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up Supabase:**

- Go to [supabase.com](https://supabase.com) and create a new project
- Copy your project URL and anon key
- In the Supabase SQL Editor, run the entire `supabase-schema.sql` file
- This will create all 9 tables with Row Level Security policies

3. **Configure environment variables:**

Create `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Resend (Email)
RESEND_API_KEY=re_your-key-here
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-secret
PAYPAL_WEBHOOK_ID=your-webhook-id

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📂 Project Structure

```
das-program/
├── app/
│   ├── [locale]/              # Internationalized routes
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── clients/       # Client management
│   │   │   ├── proposals/     # Proposal management (TO BUILD)
│   │   │   ├── invoices/      # Invoice management (TO BUILD)
│   │   │   ├── time-tracking/ # Time tracking (TO BUILD)
│   │   │   ├── services/      # Services catalog (TO BUILD)
│   │   │   ├── reports/       # Reports & analytics (TO BUILD)
│   │   │   └── settings/      # Settings pages (TO BUILD)
│   │   ├── auth/              # Authentication pages
│   │   │   ├── login/         # Login page ✅
│   │   │   ├── signup/        # Signup page ✅
│   │   │   └── callback/      # Auth callback ✅
│   │   ├── layout.tsx         # Root layout with i18n ✅
│   │   └── page.tsx           # Home page (redirects) ✅
│   └── globals.css            # Global styles ✅
├── components/
│   ├── ui/                    # Shadcn UI components ✅
│   ├── navigation.tsx         # Main sidebar navigation ✅
│   ├── email-templates/       # Email templates (TO BUILD)
│   └── pdf-templates/         # PDF templates (TO BUILD)
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser Supabase client ✅
│   │   └── server.ts          # Server Supabase client ✅
│   ├── anthropic/             # Claude API integration (TO BUILD)
│   ├── stripe/                # Stripe integration (TO BUILD)
│   ├── paypal/                # PayPal integration (TO BUILD)
│   ├── resend/                # Email integration (TO BUILD)
│   └── utils.ts               # Utility functions ✅
├── types/
│   └── database.ts            # TypeScript database types ✅
├── messages/
│   ├── en.json                # English translations ✅
│   └── de.json                # German translations ✅
├── public/                    # Static assets
├── supabase-schema.sql        # Complete database schema ✅
├── middleware.ts              # i18n + IP detection ✅
├── i18n.ts                    # i18n configuration ✅
├── next.config.js             # Next.js config ✅
├── tailwind.config.ts         # Tailwind config ✅
├── tsconfig.json              # TypeScript config ✅
└── package.json               # Dependencies ✅
```

---

## 🗄️ Database Schema

The application uses 9 main tables:

1. **users** - User profiles and business information
2. **clients** - Client contact and company details
3. **proposals** - Proposals with AI-generated content
4. **invoices** - Invoices with payment tracking
5. **time_entries** - Time tracking records
6. **services** - Reusable service catalog
7. **email_logs** - Email delivery tracking
8. **payment_transactions** - Payment history
9. **follow_up_schedules** - Automated email reminders

All tables have Row Level Security (RLS) enabled for data isolation.

Run `supabase-schema.sql` in your Supabase SQL Editor to create everything.

---

## 🔨 Building Remaining Features

### 1. AI Proposal Generator

**Location:** `app/[locale]/(dashboard)/proposals/`

**Key Files to Create:**
- `new/page.tsx` - Multi-step wizard
- `[id]/page.tsx` - View/edit proposal
- `[id]/edit/page.tsx` - Edit mode

**Implementation Steps:**

1. **Create the multi-step wizard:**
   - Step 1: Template selection (6 templates)
   - Step 2: Client selection
   - Step 3: Project details form
   - Step 4: AI settings (tone, language, industry)
   - Step 5: Generate with Claude API & preview

2. **Integrate Anthropic Claude API:**

```typescript
// lib/anthropic/client.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateProposal(params: {
  title: string;
  description: string;
  deliverables: string[];
  tone: string;
  industry: string;
  language: string;
}) {
  const prompt = `You are an expert ${params.industry} business proposal writer...`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 3000,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  return message.content;
}
```

3. **Create API route:**

```typescript
// app/api/proposals/generate/route.ts
import { generateProposal } from '@/lib/anthropic/client';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const content = await generateProposal(body);

  // Save to database
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('proposals')
    .insert({...});

  return Response.json({ data });
}
```

### 2. Invoice Generator

**Location:** `app/[locale]/(dashboard)/invoices/`

**Key Components:**
- Invoice line items table
- Tax calculation
- Payment method selection
- Stripe/PayPal integration

**Example Invoice Creation:**

```typescript
// app/[locale]/(dashboard)/invoices/new/page.tsx
'use client';

export default function NewInvoicePage() {
  const [items, setItems] = useState([
    { description: '', quantity: 1, price: 0, tax: 0 }
  ]);

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) =>
      sum + (item.quantity * item.price), 0);
    const tax = subtotal * (taxRate / 100);
    return subtotal + tax;
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Client selection */}
      {/* Invoice details */}
      {/* Line items table */}
      {/* Payment method */}
      {/* Generate & send */}
    </form>
  );
}
```

### 3. Payment Integration (Stripe)

**Setup:**

```typescript
// lib/stripe/client.ts
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
```

```typescript
// app/api/invoices/[id]/create-payment/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request, { params }) {
  const invoice = await getInvoice(params.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: invoice.total_amount * 100, // cents
    currency: invoice.currency.toLowerCase(),
    metadata: { invoice_id: invoice.id },
  });

  return Response.json({ clientSecret: paymentIntent.client_secret });
}
```

**Webhook handler:**

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')!;
  const body = await request.text();

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // Update invoice status
    const supabase = await createClient();
    await supabase
      .from('invoices')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('id', paymentIntent.metadata.invoice_id);
  }

  return Response.json({ received: true });
}
```

### 4. PDF Generation

**Setup @react-pdf/renderer:**

```typescript
// components/pdf-templates/invoice-pdf.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { fontSize: 24, marginBottom: 20 },
  table: { display: 'flex', width: '100%' },
  // ... more styles
});

export const InvoicePDF = ({ invoice, user, client }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>{user.business_name}</Text>
      </View>

      <View style={styles.clientInfo}>
        <Text>Bill To:</Text>
        <Text>{client.name}</Text>
        <Text>{client.email}</Text>
      </View>

      <View style={styles.table}>
        {/* Line items */}
      </View>

      <View style={styles.total}>
        <Text>Total: ${invoice.total_amount}</Text>
      </View>
    </Page>
  </Document>
);
```

**Generate and download:**

```typescript
// app/api/invoices/[id]/pdf/route.ts
import { renderToBuffer } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/pdf-templates/invoice-pdf';

export async function GET(request: Request, { params }) {
  const invoice = await getInvoice(params.id);
  const pdfBuffer = await renderToBuffer(
    <InvoicePDF invoice={invoice} />
  );

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${invoice.invoice_number}.pdf"`,
    },
  });
}
```

### 5. Email Automation (Resend)

**Setup:**

```typescript
// lib/resend/client.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
```

**Email template (React Email):**

```typescript
// components/email-templates/invoice-email.tsx
export const InvoiceEmail = ({ client, invoice }) => (
  <html>
    <body>
      <h1>Invoice from {invoice.business_name}</h1>
      <p>Hi {client.name},</p>
      <p>Please find your invoice attached.</p>
      <p><strong>Amount Due: ${invoice.total_amount}</strong></p>
      <p>Due Date: {invoice.due_date}</p>
      <a href={`${process.env.NEXT_PUBLIC_APP_URL}/view/invoice/${invoice.share_token}`}>
        View Invoice
      </a>
    </body>
  </html>
);
```

**Send email:**

```typescript
// app/api/invoices/[id]/send/route.ts
import { resend } from '@/lib/resend/client';
import { InvoiceEmail } from '@/components/email-templates/invoice-email';

export async function POST(request: Request, { params }) {
  const invoice = await getInvoice(params.id);

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: invoice.client.email,
    subject: `Invoice ${invoice.invoice_number}`,
    react: InvoiceEmail({ invoice }),
  });

  // Log email sent
  await supabase.from('email_logs').insert({
    user_id: invoice.user_id,
    document_type: 'invoice',
    document_id: invoice.id,
    recipient_email: invoice.client.email,
    resend_email_id: data?.id,
    status: 'sent',
    sent_at: new Date().toISOString(),
  });

  return Response.json({ success: true });
}
```

### 6. Time Tracking

**Key Features:**
- Start/stop timer (store in localStorage or state)
- Manual time entry form
- List of time entries with filters
- Export to invoice

```typescript
// app/[locale]/(dashboard)/time-tracking/page.tsx
'use client';

export default function TimeTrackingPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime());
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const handleStart = () => {
    setStartTime(new Date());
    setIsRunning(true);
  };

  const handleStop = async () => {
    setIsRunning(false);

    // Save to database
    const hours = elapsedTime / (1000 * 60 * 60);
    await supabase.from('time_entries').insert({
      user_id: user.id,
      hours,
      date: new Date().toISOString(),
      start_time: startTime,
      end_time: new Date(),
      // ...
    });

    setElapsedTime(0);
    setStartTime(null);
  };

  return (
    <div>
      <h1>Time Tracking</h1>

      <div className="timer">
        <div>{formatTime(elapsedTime)}</div>
        {!isRunning ? (
          <Button onClick={handleStart}>Start Timer</Button>
        ) : (
          <Button onClick={handleStop}>Stop Timer</Button>
        )}
      </div>

      {/* Manual entry form */}
      {/* Time entries list */}
    </div>
  );
}
```

---

## 🎨 UI/UX Guidelines

### Design System

- **Primary Color:** Blue (#3B82F6) - trust and professionalism
- **Secondary Color:** Purple (#8B5CF6) - creativity
- **Success:** Green (#10B981)
- **Warning:** Yellow (#F59E0B)
- **Error:** Red (#EF4444)

### Component Usage

All components use Shadcn UI. To add new components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add form
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
# etc.
```

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Use Tailwind's responsive classes: `md:grid-cols-2 lg:grid-cols-3`

---

## 🌐 Internationalization

All UI text must be translated. Add new translations to:

- `messages/en.json`
- `messages/de.json`

Usage in components:

```typescript
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('dashboard');

  return <h1>{t('title')}</h1>;
}
```

For AI-generated content, pass the user's locale to the Claude API:

```typescript
const message = await anthropic.messages.create({
  // ...
  system: `Write in ${locale === 'de' ? 'German' : 'English'} language.`
});
```

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Format code
npm run format

# Type check
npx tsc --noEmit
```

---

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Important Vercel Settings

- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Node Version:** 20.x

### Post-Deployment

1. Set up Stripe webhooks pointing to: `https://yourdomain.com/api/webhooks/stripe`
2. Set up PayPal webhooks: `https://yourdomain.com/api/webhooks/paypal`
3. Configure Resend domain for email sending
4. Test auth flows and payment processing

---

## 📊 Database Migrations

If you need to modify the schema:

1. Update `supabase-schema.sql`
2. Run in Supabase SQL Editor
3. Update TypeScript types in `types/database.ts`
4. Test locally before deploying

---

## 🔐 Security Best Practices

- ✅ All database tables have RLS enabled
- ✅ Environment variables for API keys
- ✅ HTTPS only in production
- ✅ Secure session management with Supabase
- ⚠️ Validate all user inputs
- ⚠️ Sanitize data before displaying
- ⚠️ Rate limit API endpoints
- ⚠️ Implement CSRF protection

---

## 📈 Monitoring & Analytics

Consider adding:

- **Error Tracking:** Sentry
- **Analytics:** Vercel Analytics or Plausible
- **Performance:** Vercel Speed Insights
- **Logs:** Vercel Logs or Logtail

---

## 🤝 Contributing

This is a comprehensive boilerplate. To extend:

1. Follow existing patterns
2. Add translations for new features
3. Update this README
4. Test thoroughly
5. Commit with clear messages

---

## 📝 License

MIT License - feel free to use for commercial projects.

---

## 🆘 Support

For issues or questions:

1. Check Supabase docs: https://supabase.com/docs
2. Check Next.js docs: https://nextjs.org/docs
3. Check Shadcn UI: https://ui.shadcn.com
4. Check Anthropic docs: https://docs.anthropic.com

---

## 🎯 Roadmap

### Phase 1 (Foundation) ✅
- [x] Project setup
- [x] Authentication
- [x] Database schema
- [x] Basic UI components
- [x] Dashboard
- [x] Client management

### Phase 2 (Core Features) 🚧
- [ ] AI Proposal Generator
- [ ] Invoice Generator
- [ ] PDF Generation
- [ ] Payment Integration (Stripe)
- [ ] Email Automation

### Phase 3 (Advanced Features)
- [ ] Time Tracking
- [ ] Reports & Analytics
- [ ] Multi-currency support
- [ ] Recurring invoices
- [ ] Team collaboration

### Phase 4 (Polish)
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] API for integrations
- [ ] Advanced reporting
- [ ] White-label option

---

## 💡 Tips for Development

1. **Start with one feature at a time** - Don't try to build everything at once
2. **Test with real data** - Create sample clients, proposals, invoices
3. **Use the database schema** - It's comprehensive and well-designed
4. **Follow TypeScript strictly** - It will save you debugging time
5. **Mobile-first** - Test on mobile devices frequently
6. **Internationalize early** - Add translations as you build features

---

## 🏁 Getting Started Checklist

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Create Supabase project
- [ ] Run database schema
- [ ] Set up `.env.local` with all keys
- [ ] Run dev server (`npm run dev`)
- [ ] Create test account
- [ ] Add test client
- [ ] Explore dashboard
- [ ] Start building proposals feature!

---

**Built with ❤️ using Next.js, Supabase, and Claude AI**
