# Railway Deployment Guide - Das Program SaaS

This guide will help you deploy your Das Program application to Railway with MySQL database.

## Prerequisites

- Railway account (sign up at https://railway.app)
- Git repository pushed to GitHub/GitLab
- Domain name (optional, Railway provides a free domain)

## Step 1: Create a New Project on Railway

1. Go to https://railway.app and log in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository: `arwebcrafts/hr-payroll-time-track`
5. Railway will detect it's a Next.js app automatically

## Step 2: Add MySQL Database

1. In your Railway project, click "New" → "Database" → "Add MySQL"
2. Railway will automatically create a MySQL database
3. The database will be automatically linked to your application
4. Railway will set the `DATABASE_URL` environment variable automatically

## Step 3: Configure Environment Variables

In your Railway project settings, go to "Variables" and add the following:

### Required Variables

```bash
# Authentication (Required)
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=your-generated-secret-here

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
NODE_ENV=production

# Database (Automatically set by Railway)
# DATABASE_URL is automatically configured when you add MySQL database
```

### Optional Variables (Recommended)

```bash
# AI Proposal Generation (Optional but recommended)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Email Sending (Required for sending proposals/invoices)
RESEND_API_KEY=re_your-key-here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### Generate NEXTAUTH_SECRET

Run this command locally to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in Railway.

## Step 4: Configure Build Settings

Railway should auto-detect these, but verify in Settings → Deploy:

### Build Command
```bash
prisma generate && next build
```

### Start Command
```bash
npm run start
```

### Install Command (default)
```bash
npm install
```

## Step 5: Run Database Migrations

After your first deployment, you need to initialize the database schema.

### Option A: Using Railway CLI (Recommended)

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Link your project:
   ```bash
   railway link
   ```

4. Run migrations:
   ```bash
   railway run npx prisma db push
   ```

### Option B: Using Railway Dashboard

1. Go to your project in Railway
2. Click on your service
3. Go to "Settings" → "Deploy"
4. Under "Custom Start Command", temporarily change it to:
   ```bash
   npx prisma db push && npm run start
   ```
5. Wait for deployment to complete (this will create all tables)
6. After successful deployment, change the start command back to:
   ```bash
   npm run start
   ```

## Step 6: Verify Deployment

1. Visit your Railway app URL (shown in the deployment logs)
2. You should see the login page
3. Create a new account by clicking "Sign Up"
4. After signup, you'll be redirected to the onboarding page
5. Complete your business profile
6. Start using the application!

## Step 7: Set Up Custom Domain (Optional)

1. In Railway project, click on your service
2. Go to "Settings" → "Domains"
3. Click "Generate Domain" for a free Railway domain, or
4. Click "Custom Domain" to add your own domain
5. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` environment variables with your custom domain
6. Redeploy the application

## Environment Variables Summary

Here's a complete list of all environment variables:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | MySQL connection string (auto-set by Railway) | `mysql://user:pass@host:3306/db` |
| `NEXTAUTH_URL` | Yes | Your app's public URL | `https://your-app.railway.app` |
| `NEXTAUTH_SECRET` | Yes | Random secret for JWT signing | Generate with `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL for emails | `https://your-app.railway.app` |
| `NODE_ENV` | Yes | Environment mode | `production` |
| `ANTHROPIC_API_KEY` | No | For AI proposal generation | `sk-ant-xxx` |
| `RESEND_API_KEY` | No | For sending emails | `re_xxx` |
| `RESEND_FROM_EMAIL` | No | From email address | `noreply@yourdomain.com` |

## Troubleshooting

### Issue: "Database connection failed"

**Solution:**
- Ensure MySQL database is created and linked to your service
- Check that `DATABASE_URL` is set correctly
- Verify database is running in Railway dashboard

### Issue: "Prisma Client not generated"

**Solution:**
- Ensure build command includes `prisma generate`
- Correct build command: `prisma generate && next build`
- Check build logs for errors

### Issue: "NextAuth error - no secret"

**Solution:**
- Generate a secret: `openssl rand -base64 32`
- Add it to Railway as `NEXTAUTH_SECRET`
- Redeploy the application

### Issue: "Database tables don't exist"

**Solution:**
- Run migrations using Railway CLI:
  ```bash
  railway run npx prisma db push
  ```
- Or temporarily change start command to run migrations on deploy

### Issue: "Email sending not working"

**Solution:**
- Add `RESEND_API_KEY` environment variable
- Add `RESEND_FROM_EMAIL` environment variable
- Verify domain is configured in Resend dashboard
- If no API key is set, app will show a warning but won't fail

### Issue: "AI proposal generation returns template"

**Solution:**
- Add `ANTHROPIC_API_KEY` environment variable
- Get key from https://console.anthropic.com
- Without this key, app uses a template fallback (still functional)

## Database Management

### View Database
```bash
railway run npx prisma studio
```

This opens Prisma Studio to view/edit your production database.

### Backup Database
```bash
railway run mysqldump das_program > backup.sql
```

### Reset Database (DANGER - deletes all data)
```bash
railway run npx prisma migrate reset
```

## Monitoring and Logs

1. **View Logs**: In Railway dashboard, click on your service → "Logs"
2. **Metrics**: Click "Metrics" to see CPU, memory, and network usage
3. **Deployments**: Click "Deployments" to see deployment history

## Performance Optimization

### 1. Enable Connection Pooling

For production, consider using PlanetScale or a connection pooler:

```env
# Example with connection pooling
DATABASE_URL="mysql://user:pass@host:3306/db?connection_limit=10&pool_timeout=20"
```

### 2. Add Database Indexes

The Prisma schema already includes optimized indexes for:
- User queries by ID and email
- Client queries by userId
- Proposal/Invoice queries by userId and status
- Time entries by userId and date

### 3. Enable Caching (Future Enhancement)

Consider adding Redis for session caching in high-traffic scenarios.

## Scaling

Railway automatically scales your application. For additional scaling:

1. Go to Settings → Resources
2. Adjust CPU and RAM allocation
3. Monitor performance in Metrics tab

## Security Checklist

- [x] `NEXTAUTH_SECRET` is a strong random string (32+ characters)
- [x] All environment variables are set in Railway (not committed to Git)
- [x] Database credentials are managed by Railway (not exposed)
- [x] HTTPS is enabled by default on Railway
- [x] API keys have proper restrictions configured in their respective dashboards
- [ ] Set up custom domain with SSL (optional)
- [ ] Configure CORS if you add a separate frontend
- [ ] Enable Railway's built-in DDoS protection

## Post-Deployment Checklist

After successful deployment:

1. Test user registration and login
2. Complete business profile setup
3. Create a test client
4. Create a test proposal
5. Generate a proposal PDF
6. Test email sending (if RESEND_API_KEY is configured)
7. Create a test invoice
8. Verify all dashboard metrics display correctly
9. Test time tracking functionality
10. Verify settings page works

## Support

If you encounter issues:

1. Check Railway build and deployment logs
2. Review environment variables configuration
3. Verify database connection using Prisma Studio
4. Check application logs for errors
5. Refer to MYSQL_MIGRATION.md for database-specific issues

## Updating Your Application

When you push changes to your GitHub repository:

1. Railway will automatically detect the changes
2. Trigger a new deployment
3. Run the build process
4. Deploy the new version
5. Your app will have zero downtime during deployment

## Additional Resources

- Railway Documentation: https://docs.railway.app
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- NextAuth.js Documentation: https://next-auth.js.org

---

**Deployment Summary:**

Your Das Program application is now ready for Railway deployment! The application:

- ✅ Uses MySQL database (managed by Railway)
- ✅ Implements NextAuth.js for authentication
- ✅ Has all Supabase dependencies removed
- ✅ Includes proper error handling and fallbacks
- ✅ Is production-ready with environment-based configuration
- ✅ Supports AI proposal generation (optional)
- ✅ Supports email sending (optional)
- ✅ Has optimized database queries with indexes
- ✅ Uses Prisma ORM for type-safe database access

**Estimated Deployment Time:** 10-15 minutes

Good luck with your deployment! 🚀
