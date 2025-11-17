import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
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

      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground">Last updated: January 2025</p>

          <h2 className="mt-8 text-2xl font-semibold">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you create an account, use our
            services, or communicate with us. This includes:
          </p>
          <ul>
            <li>Account information (name, email address, password)</li>
            <li>Business information (company name, address, tax details)</li>
            <li>Client data you enter into the platform</li>
            <li>Proposals, invoices, and other documents you create</li>
            <li>Payment information (processed securely by Stripe and PayPal)</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Generate AI-powered proposal content</li>
            <li>Analyze usage patterns to improve our platform</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold">3. Data Security</h2>
          <p>
            We take data security seriously and implement industry-standard security measures:
          </p>
          <ul>
            <li>All data is encrypted in transit using SSL/TLS</li>
            <li>Passwords are hashed using bcrypt</li>
            <li>Database access is protected with row-level security</li>
            <li>Regular security audits and updates</li>
            <li>Secure data centers with 24/7 monitoring</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold">4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share your information with:</p>
          <ul>
            <li>Service providers (Supabase, Stripe, PayPal, Anthropic) to operate our service</li>
            <li>Professional advisors when legally required</li>
            <li>Law enforcement when required by law</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold">6. Cookies</h2>
          <p>
            We use cookies and similar technologies to provide and improve our services, analyze
            usage, and remember your preferences. You can control cookies through your browser
            settings.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">7. Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed to
            provide services. You can delete your account at any time from the settings page.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">8. International Data Transfers</h2>
          <p>
            Your data may be transferred to and processed in countries other than your own. We
            ensure appropriate safeguards are in place.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">9. Children's Privacy</h2>
          <p>
            Our services are not directed to children under 13. We do not knowingly collect
            information from children under 13.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">10. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of significant
            changes via email or through our platform.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">11. Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at:
            <br />
            Email: privacy@dasprogram.com
          </p>
        </div>
      </div>

      <footer className="border-t bg-gray-50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Das Program. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
