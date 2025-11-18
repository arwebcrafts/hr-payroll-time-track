import type { Metadata } from 'next';
import './globals.css';

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
