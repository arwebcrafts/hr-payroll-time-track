import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Navigation } from '@/components/navigation';

// Force dynamic rendering for authenticated routes
export const dynamic = 'force-dynamic';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="flex h-screen">
      <Navigation />
      <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  );
}
