import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        { name: '5 proposals per month', included: true },
        { name: '10 invoices per month', included: true },
        { name: 'Basic templates', included: true },
        { name: 'Email support', included: true },
        { name: 'AI proposal generation', included: false },
        { name: 'Payment processing', included: false },
        { name: 'Time tracking', included: false },
        { name: 'Analytics & reports', included: false },
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$29',
      period: 'per month',
      description: 'For freelancers and solopreneurs',
      features: [
        { name: 'Unlimited proposals', included: true },
        { name: 'Unlimited invoices', included: true },
        { name: 'All professional templates', included: true },
        { name: 'AI proposal generation', included: true },
        { name: 'Payment processing (Stripe & PayPal)', included: true },
        { name: 'Time tracking', included: true },
        { name: 'Email automation', included: true },
        { name: 'Basic analytics', included: true },
      ],
      cta: 'Start 14-Day Trial',
      popular: true,
    },
    {
      name: 'Business',
      price: '$79',
      period: 'per month',
      description: 'For growing agencies and teams',
      features: [
        { name: 'Everything in Professional', included: true },
        { name: 'Team collaboration (5 users)', included: true },
        { name: 'Advanced analytics & reports', included: true },
        { name: 'White-label branding', included: true },
        { name: 'Priority support', included: true },
        { name: 'Custom templates', included: true },
        { name: 'API access', included: true },
        { name: 'Dedicated account manager', included: true },
      ],
      cta: 'Start 14-Day Trial',
      popular: false,
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
          <Link href="/en/auth/login">
            <Button variant="ghost">Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Start free, upgrade as you grow. All plans include 14-day free trial.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground"> / {plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/en/auth/signup" className="block">
                    <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span
                          className={feature.included ? '' : 'text-muted-foreground line-through'}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-6">
            {[
              {
                q: 'Can I change plans anytime?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.',
              },
              {
                q: 'Is there a long-term contract?',
                a: 'No, all plans are month-to-month. Cancel anytime with no penalties or fees.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your payment.',
              },
              {
                q: 'What happens after the free trial?',
                a: 'After 14 days, you\'ll be charged for the plan you selected. You can cancel before the trial ends.',
              },
            ].map((faq, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
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
            Start your 14-day free trial today. No credit card required.
          </p>
          <Link href="/en/auth/signup">
            <Button size="lg" className="gap-2">
              Start Free Trial
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
