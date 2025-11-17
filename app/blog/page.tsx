import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Rss } from 'lucide-react';

export default function BlogPage() {
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
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Rss className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Blog</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold">Tips, Updates & Insights</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Articles and resources for freelancers, agencies, and consultants
          </p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Rss className="mb-6 h-20 w-20 text-muted-foreground" />
              <h3 className="mb-2 text-2xl font-semibold">Blog Coming Soon</h3>
              <p className="mb-6 text-center text-muted-foreground max-w-md">
                We're working on great content for you including tips on winning proposals, getting
                paid faster, and growing your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/en/auth/signup">
                  <Button>Start Free Trial</Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline">Explore Features</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Topics Preview */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-2xl font-bold text-center">
              Topics We'll Cover
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: 'Proposal Writing Tips',
                  description: 'Learn how to write proposals that win more clients',
                },
                {
                  title: 'Invoice Best Practices',
                  description: 'Get paid faster with professional invoicing strategies',
                },
                {
                  title: 'Time Management',
                  description: 'Track your time effectively and maximize billable hours',
                },
                {
                  title: 'Client Relationships',
                  description: 'Build long-term relationships that drive referrals',
                },
                {
                  title: 'Pricing Strategies',
                  description: 'How to price your services for maximum profitability',
                },
                {
                  title: 'Business Growth',
                  description: 'Scale your freelance business or agency successfully',
                },
              ].map((topic, i) => (
                <Card key={i} className="p-6">
                  <h3 className="mb-2 font-semibold">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Das Program. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
