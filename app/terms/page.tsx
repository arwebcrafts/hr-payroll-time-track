import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
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
        <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
        <div className="prose prose-gray max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: January 2025</p>

          <h2 className="mt-8 text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Das Program ("the Service"), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">2. Use of Service</h2>
          <p>
            You may use our Service only for lawful purposes and in accordance with these Terms.
            You agree not to use the Service:
          </p>
          <ul>
            <li>In any way that violates any applicable law or regulation</li>
            <li>To transmit any harmful or malicious code</li>
            <li>To impersonate or attempt to impersonate another user</li>
            <li>To interfere with or disrupt the Service</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold">3. User Accounts</h2>
          <p>
            When you create an account with us, you are responsible for maintaining the
            confidentiality of your account and password. You agree to accept responsibility for
            all activities that occur under your account.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">4. Subscription and Payment Terms</h2>
          <p>
            Some aspects of the Service are provided on a subscription basis. Subscription fees are
            billed in advance on a monthly or annual basis. All payments are non-refundable except
            as required by law or as explicitly stated in our refund policy.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">5. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by Das
            Program and are protected by international copyright, trademark, and other intellectual
            property laws.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">6. User Content</h2>
          <p>
            You retain all rights to the content you create using the Service (proposals, invoices,
            etc.). By using the Service, you grant us a license to store and process your content
            solely for the purpose of providing the Service.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">7. Limitation of Liability</h2>
          <p>
            In no event shall Das Program be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use or inability to use the
            Service.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">8. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without
            prior notice, for any reason, including if you breach these Terms.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of
            significant changes via email or through the Service.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the
            jurisdiction in which Das Program operates.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            Email: legal@dasprogram.com
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
