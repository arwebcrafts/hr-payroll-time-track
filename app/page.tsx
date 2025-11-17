import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Receipt,
  Zap,
  Globe,
  Shield,
  TrendingUp,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
              D
            </div>
            <span className="text-xl font-bold">Das Program</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm font-medium hover:text-primary">
              Docs
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary">
              Blog
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/en/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/en/auth/signup">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Proposal & Invoice Generator
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Create Professional
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {' '}
                Proposals & Invoices
              </span>{' '}
              in Minutes
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              The all-in-one platform for freelancers and agencies. Generate AI-powered proposals,
              send invoices, track time, and get paid faster.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/en/auth/signup">
                <Button size="lg" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline">
                  See How It Works
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </div>

          {/* Hero Image/Demo */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="rounded-lg border-8 border-white bg-white shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-sm">
                <div className="text-center">
                  <FileText className="mx-auto h-20 w-20 text-gray-400 mb-4" />
                  <p className="text-gray-500">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Everything You Need to Run Your Business</h2>
            <p className="text-lg text-muted-foreground">
              All the tools you need in one powerful platform
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: 'AI Proposal Generation',
                description:
                  'Generate professional, persuasive proposals in seconds with Claude AI. Choose tone, industry, and language.',
              },
              {
                icon: Receipt,
                title: 'Smart Invoicing',
                description:
                  'Create beautiful invoices with automatic calculations, tax support, and multiple payment options.',
              },
              {
                icon: Clock,
                title: 'Time Tracking',
                description:
                  'Track billable hours with an integrated timer. Automatically convert time entries to invoices.',
              },
              {
                icon: Users,
                title: 'Client Management',
                description:
                  'Organize all your clients in one place. Track proposals, invoices, and communication history.',
              },
              {
                icon: Globe,
                title: 'Multi-Language',
                description:
                  'Automatic language detection (English & German). Send documents in your client\'s preferred language.',
              },
              {
                icon: Zap,
                title: 'Instant Payments',
                description:
                  'Integrate Stripe and PayPal. Get paid faster with embedded payment buttons in invoices.',
              },
              {
                icon: TrendingUp,
                title: 'Analytics & Reports',
                description:
                  'Track revenue, proposal win rates, payment times, and business growth with beautiful charts.',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description:
                  'Bank-level security with encrypted data. Your business information is always protected.',
              },
              {
                icon: FileText,
                title: 'Professional Templates',
                description:
                  '6 proposal templates and 4 invoice templates. Customize colors, fonts, and branding.',
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
            <p className="text-lg text-muted-foreground">Get started in 3 simple steps</p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Add Your Clients',
                  description: 'Import or manually add your client information in seconds.',
                },
                {
                  step: '2',
                  title: 'Create Documents',
                  description:
                    'Use AI to generate proposals or create invoices with our smart builder.',
                },
                {
                  step: '3',
                  title: 'Send & Get Paid',
                  description:
                    'Send via email, track opens, and get paid with integrated payment options.',
                },
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                    {step.step}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-12 text-3xl font-bold">Trusted by Freelancers & Agencies Worldwide</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="text-4xl font-bold text-primary">10,000+</div>
                <p className="text-muted-foreground">Documents Created</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">$5M+</div>
                <p className="text-muted-foreground">Invoiced Amount</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">95%</div>
                <p className="text-muted-foreground">Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Transform Your Business?</h2>
          <p className="mb-8 text-lg text-primary-foreground/90">
            Join thousands of freelancers and agencies using Das Program
          </p>
          <Link href="/en/auth/signup">
            <Button size="lg" variant="secondary" className="gap-2">
              Start Your Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-primary-foreground/80">
            14-day free trial • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
                  D
                </div>
                <span className="text-lg font-bold">Das Program</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered proposal and invoice generator for modern businesses.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features" className="text-muted-foreground hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-muted-foreground hover:text-primary">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:support@dasprogram.com" className="text-muted-foreground hover:text-primary">
                    support@dasprogram.com
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Das Program. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
