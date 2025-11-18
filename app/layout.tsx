import type { Metadata } from 'next';
import './globals.css';

// Force dynamic rendering to avoid context issues during static generation
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Das Program - Business Management SaaS',
  description: 'Professional proposal and invoice management system with AI-powered features',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
