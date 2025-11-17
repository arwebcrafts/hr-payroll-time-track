import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Book, Code, Zap, Rocket, Shield } from 'lucide-react';

export default function DocsPage() {
  const sections = [
    {
      icon: Rocket,
      title: 'Quick Start Guide',
      description: 'Get up and running in under 10 minutes with our step-by-step guide.',
      available: true,
      link: '/en/auth/signup',
    },
    {
      icon: FileText,
      title: 'Creating Proposals',
      description: 'Learn how to create winning proposals with AI assistance.',
      available: false,
    },
    {
      icon: Book,
      title: 'Managing Invoices',
      description: 'Master invoice creation, sending, and payment tracking.',
      available: false,
    },
    {
      icon: Code,
      title: 'API Reference',
      description: 'Integrate Das Program with your existing tools and workflows.',
      available: false,
    },
    {
      icon: Zap,
      title: 'Best Practices',
      description: 'Tips and tricks to maximize your productivity and efficiency.',
      available: false,
    },
    {
      icon: Shield,
      title: 'Security Guide',
      description: 'Learn about our security measures and how to keep your data safe.',
      available: false,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
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
          <h1 className="mb-4 text-4xl font-bold">Documentation</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Everything you need to get started and succeed with Das Program
          </p>
        </div>
      </section>

      {/* Documentation Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <section.icon className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">{section.title}</h3>
                <p className="mb-4 text-muted-foreground">{section.description}</p>
                {section.available ? (
                  <Link href={section.link || '#'} className="text-primary hover:underline">
                    Get Started →
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">Coming soon</span>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold text-center">Getting Started</h2>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-3 text-lg font-semibold">1. Create Your Account</h3>
                <p className="text-muted-foreground">
                  Sign up for free and complete the onboarding wizard to set up your business
                  profile.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="mb-3 text-lg font-semibold">2. Add Your First Client</h3>
                <p className="text-muted-foreground">
                  Navigate to the Clients section and add your first client with their contact
                  information.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="mb-3 text-lg font-semibold">3. Create a Proposal or Invoice</h3>
                <p className="text-muted-foreground">
                  Use our intuitive builder to create professional proposals and invoices in
                  minutes.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="mb-3 text-lg font-semibold">4. Send and Track</h3>
                <p className="text-muted-foreground">
                  Send documents to your clients and track views, approvals, and payments in
                  real-time.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'How do I reset my password?',
                  a: 'Click "Forgot Password" on the login page and follow the email instructions.',
                },
                {
                  q: 'Can I customize proposal templates?',
                  a: 'Yes, you can customize colors, fonts, and branding in the settings.',
                },
                {
                  q: 'How do I export my data?',
                  a: 'Go to Settings → Account → Export Data to download all your information.',
                },
                {
                  q: 'Is my data secure?',
                  a: 'Yes, we use bank-level encryption and industry-standard security practices.',
                },
              ].map((faq, i) => (
                <Card key={i} className="p-6">
                  <h3 className="mb-2 text-lg font-semibold">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-lg">Try Das Program free for 14 days</p>
          <Link href="/en/auth/signup">
            <Button size="lg" variant="secondary">
              Start Free Trial
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
