# Database Setup Guide

## Quick Setup (Local or Railway)

### Step 1: Verify DATABASE_URL

Make sure you have your MySQL connection string in your `.env` file:

```bash
# Local MySQL
DATABASE_URL="mysql://username:password@localhost:3306/das_program"

# Or Railway MySQL (get from Railway dashboard)
DATABASE_URL="mysql://root:password@containers-us-west-xxx.railway.app:3306/railway"
```

### Step 2: Create Database Tables

Run this command to create all tables in your MySQL database:

```bash
npx prisma db push
```

This will:
- ✅ Create all 9 tables in your database
- ✅ Set up relationships and indexes
- ✅ Apply the schema without migrations

**Expected Output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": MySQL database "das_program" at "localhost:3306"

The database is now in sync with your Prisma schema. Done in XXXms

✔ Generated Prisma Client (v5.22.0)
```

### Step 3: Verify Tables Created

Check that tables were created:

```bash
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can see all your tables:

- ✅ users
- ✅ clients
- ✅ proposals
- ✅ invoices
- ✅ time_entries
- ✅ services
- ✅ email_logs
- ✅ payment_transactions
- ✅ follow_up_schedules

## Railway-Specific Instructions

### Option A: Using Railway CLI (Recommended)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Link your project**:
   ```bash
   railway link
   ```

4. **Run migrations on Railway**:
   ```bash
   railway run npx prisma db push
   ```

### Option B: Using Railway Dashboard

1. Go to your Railway project
2. Click on your service
3. Go to "Settings" → "Deploy"
4. Temporarily change "Start Command" to:
   ```bash
   npx prisma db push && npm run start
   ```
5. Wait for deployment to complete (creates tables)
6. Change start command back to:
   ```bash
   npm run start
   ```
7. Redeploy

## Troubleshooting

### Error: "Can't reach database server"

**Check:**
- Is MySQL running?
- Is DATABASE_URL correct?
- Can you connect to the database?

**Test connection:**
```bash
mysql -h localhost -u username -p
```

### Error: "Database does not exist"

**Create database first:**
```bash
mysql -u root -p
CREATE DATABASE das_program;
exit;
```

Then run `npx prisma db push` again.

### Error: "Access denied for user"

**Check credentials:**
- Username is correct
- Password is correct
- User has CREATE permissions

**Grant permissions:**
```sql
GRANT ALL PRIVILEGES ON das_program.* TO 'username'@'localhost';
FLUSH PRIVILEGES;
```

### Error: "Prisma Client not generated"

**Regenerate client:**
```bash
npx prisma generate
```

## Alternative: Using Migrations (Production Recommended)

For production deployments, you can use Prisma migrations instead:

```bash
# Initialize migrations
npx prisma migrate dev --name init

# Apply to production
npx prisma migrate deploy
```

## Verify Setup

After creating tables, test your application:

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Visit**: http://localhost:3000

3. **Create an account**: Click "Sign Up"

4. **Check database**: You should see the new user in `prisma studio`

## Production Checklist

- [ ] DATABASE_URL is set in environment variables
- [ ] Tables created successfully (`npx prisma db push`)
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] Can create a test user account
- [ ] Can login with test account
- [ ] Dashboard loads without errors

## Database Schema Overview

Your application has 9 tables:

1. **users** - User accounts and business info
2. **clients** - Customer/client records
3. **proposals** - Proposal documents
4. **invoices** - Invoice documents
5. **time_entries** - Time tracking records
6. **services** - Service catalog
7. **email_logs** - Email sending history
8. **payment_transactions** - Payment records (Stripe/PayPal)
9. **follow_up_schedules** - Automated follow-up emails

All tables use UUID primary keys and have proper foreign key relationships.

## Next Steps

After database setup:

1. Build the application: `npm run build`
2. Start production server: `npm run start`
3. Create your first user account
4. Complete business profile setup
5. Start creating clients and proposals!

## Support

For Railway-specific database issues, see: https://docs.railway.app/databases/mysql
For Prisma issues, see: https://www.prisma.io/docs
