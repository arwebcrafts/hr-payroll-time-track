#!/bin/bash

# Railway Database Setup Script
# This script sets up the database tables on Railway

echo "🚀 Setting up Das Program database on Railway..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable not set"
  echo "Please make sure Railway MySQL is connected to your service"
  exit 1
fi

echo "✅ DATABASE_URL found"
echo ""

# Run Prisma DB Push to create tables
echo "📊 Creating database tables..."
npx prisma db push --skip-generate

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Database setup complete!"
  echo ""
  echo "📋 Created tables:"
  echo "   - users"
  echo "   - clients"
  echo "   - proposals"
  echo "   - invoices"
  echo "   - time_entries"
  echo "   - services"
  echo "   - email_logs"
  echo "   - payment_transactions"
  echo "   - follow_up_schedules"
  echo ""
  echo "🎉 Your database is ready!"
  echo ""
  echo "Next steps:"
  echo "1. Start your application"
  echo "2. Visit your Railway URL"
  echo "3. Sign up to create your first account"
else
  echo ""
  echo "❌ Database setup failed"
  echo "Please check your DATABASE_URL and try again"
  exit 1
fi
