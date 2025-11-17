import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sparkles,
  FileText,
  Receipt,
  Clock,
  Users,
  Globe,
  Zap,
  TrendingUp,
  Shield,
  Mail,
  CreditCard,
  BarChart,
  ArrowRight,
  Check,
} from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple Nav */}
      <nav className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
              D
            </div>
            <span className="text-xl font-bold">Das Program</span>
          </Link>
          <Link href="/en/auth/signup">
            <Button>Get Started Free</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold">
            Everything You Need to <span className="text-primary">Scale Your Business</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            From AI-powered proposals to automated invoicing, we've built every feature you need to
            run your freelance business or agency efficiently.
          </p>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* AI Proposals */}
          <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
                <Sparkles className="h-4 w-4" />
                AI-Powered
              </div>
              <h2 className="mb-4 text-3xl font-bold">Generate Winning Proposals in Seconds</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Our AI analyzes your project details and creates professional, persuasive proposals
                tailored to your industry and client needs.
              </p>
              <ul className="space-y-3">
                {[
                  'Choose from 6 professional templates',
                  'Select tone: Professional, Friendly, Technical, or Creative',
                  'Multi-language support (English & German)',
                  'Customizable sections and branding',
                  'Real-time editing and preview',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-6">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-20 w-20 text-purple-600" />
              </div>
            </Card>
          </div>

          {/* Invoicing */}
          <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:items-center">
            <Card className="p-6 lg:order-2">
              <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                <Receipt className="h-20 w-20 text-green-600" />
              </div>
            </Card>
            <div className="lg:order-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                <Receipt className="h-4 w-4" />
                Smart Invoicing
              </div>
              <h2 className="mb-4 text-3xl font-bold">Get Paid Faster with Smart Invoices</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Create professional invoices in minutes with automatic calculations, tax support,
                and integrated payment options.
              </p>
              <ul className="space-y-3">
                {[
                  'Automatic tax calculations and multi-currency support',
                  'Stripe & PayPal integration',
                  'Recurring invoices and subscriptions',
                  'Payment reminders and overdue tracking',
                  'Partial payment support',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Time Tracking */}
          <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                <Clock className="h-4 w-4" />
                Time Tracking
              </div>
              <h2 className="mb-4 text-3xl font-bold">Track Every Billable Hour</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Integrated time tracking that automatically converts your hours into invoices.
              </p>
              <ul className="space-y-3">
                {[
                  'One-click timer with project assignment',
                  'Manual time entry for flexibility',
                  'Billable vs non-billable hours',
                  'Automatic invoice generation from time logs',
                  'Detailed timesheet reports',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-6">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                <Clock className="h-20 w-20 text-blue-600" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* All Features Grid */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Complete Feature Set</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need in one powerful platform
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Users, title: 'Client Management', desc: 'Organize all client information in one place' },
              { icon: Mail, title: 'Email Automation', desc: 'Send and track proposals & invoices' },
              { icon: CreditCard, title: 'Payment Processing', desc: 'Stripe & PayPal integration' },
              { icon: BarChart, title: 'Analytics & Reports', desc: 'Track revenue and business metrics' },
              { icon: Globe, title: 'Multi-Language', desc: 'English & German with auto-detection' },
              { icon: Shield, title: 'Bank-Level Security', desc: 'Encrypted data and secure storage' },
              { icon: Zap, title: 'Instant Updates', desc: 'Real-time status tracking' },
              { icon: TrendingUp, title: 'Growth Insights', desc: 'Business performance analytics' },
              { icon: FileText, title: 'Template Library', desc: '10+ professional templates' },
            ].map((feature, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Try all features free for 14 days. No credit card required.
          </p>
          <Link href="/en/auth/signup">
            <Button size="lg" className="gap-2">
              Start Your Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Das Program. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
