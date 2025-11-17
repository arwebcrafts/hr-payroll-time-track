# 🚀 Setup Guide for Das Program

This guide will walk you through setting up Das Program from scratch in under 30 minutes.

## Step 1: Prerequisites (5 minutes)

Make sure you have:

- ✅ **Node.js 20+** installed ([nodejs.org](https://nodejs.org))
- ✅ **npm** (comes with Node.js)
- ✅ A **code editor** (VS Code recommended)
- ✅ **Git** installed

## Step 2: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd das-program

# Install dependencies
npm install
```

## Step 3: Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Project name:** das-program
   - **Database password:** (save this securely)
   - **Region:** Choose closest to you
4. Wait for project to be created (~2 minutes)

5. Get your credentials:
   - Click "Settings" → "API"
   - Copy **Project URL**
   - Copy **anon public** key
   - Copy **service_role** key (keep this secret!)

## Step 4: Set Up Database (3 minutes)

1. In Supabase, click "SQL Editor"
2. Click "New Query"
3. Copy the ENTIRE contents of `supabase-schema.sql`
4. Paste into the editor
5. Click "Run" (this will take ~30 seconds)
6. You should see "Success. No rows returned"

✅ **Your database is now set up with all 9 tables!**

## Step 5: Configure Environment Variables (5 minutes)

1. In your project folder, create `.env.local`:

```bash
cp .env.example .env.local
```

2. Open `.env.local` and fill in:

```bash
# From Supabase (Step 3)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Leave these empty for now (optional)
ANTHROPIC_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
PAYPAL_CLIENT_SECRET=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_WEBHOOK_ID=

# App config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

3. **Save the file**

## Step 6: Run the App (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see the login page! 🎉

## Step 7: Create Your First Account (2 minutes)

1. Click "Sign up"
2. Enter your email and password
3. Check your email for verification link
4. Click the verification link
5. You'll be redirected to the dashboard!

## Step 8: Test the App (5 minutes)

### Add a Test Client

1. Click "Clients" in sidebar
2. Click "Add Client"
3. Fill in:
   - Name: Test Client
   - Company: Test Company Inc.
   - Email: client@test.com
   - Phone: +1234567890
4. Click "Save"

### View Dashboard

1. Click "Dashboard"
2. You should see:
   - 0 Proposals
   - 0 Invoices
   - 1 Client
   - Quick action buttons

✅ **Your app is working!**

---

## Next Steps

### For Development:

1. **Add Anthropic API Key** (for AI proposals):
   - Get key from [console.anthropic.com](https://console.anthropic.com)
   - Add to `.env.local` as `ANTHROPIC_API_KEY`

2. **Add Stripe Keys** (for payments):
   - Get keys from [dashboard.stripe.com](https://dashboard.stripe.com)
   - Add to `.env.local`

3. **Add Resend API Key** (for emails):
   - Get key from [resend.com](https://resend.com)
   - Add to `.env.local`

### Start Building Features:

Follow the README.md for detailed instructions on building:
- AI Proposal Generator
- Invoice Generator
- Payment Integration
- Email Automation
- etc.

---

## Troubleshooting

### Problem: "Invalid API key" error

**Solution:** Double-check your `.env.local` file has the correct Supabase keys.

### Problem: Database tables not created

**Solution:**
1. Go to Supabase SQL Editor
2. Run the schema again
3. Make sure there are no errors in the output

### Problem: Can't log in after signup

**Solution:**
1. Check your email for verification link
2. If using Gmail, check spam folder
3. In Supabase, go to Authentication → Users
4. Find your user and manually verify if needed

### Problem: Styles not loading

**Solution:**
```bash
# Clear Next.js cache and restart
rm -rf .next
npm run dev
```

### Problem: Port 3000 already in use

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001
```

---

## 🎓 Learning Resources

- **Next.js 14:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **Shadcn UI:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

---

## 🆘 Getting Help

If you're stuck:

1. Check the README.md for detailed feature guides
2. Read error messages carefully
3. Check browser console for errors (F12)
4. Check terminal for server errors
5. Google the error message
6. Ask on Stack Overflow or Reddit r/nextjs

---

## ✅ Setup Complete!

You now have:
- ✅ Working Next.js 14 app
- ✅ Supabase database with 9 tables
- ✅ Authentication system
- ✅ Dashboard and client management
- ✅ Full TypeScript typing
- ✅ Internationalization (English + German)
- ✅ Professional UI with Shadcn

**Time to start building amazing features!** 🚀

---

**Next:** Read the README.md to learn how to build the AI proposal generator, invoice system, and more!
