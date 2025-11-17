import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="flex h-screen">
      <Navigation />
      <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  );
}
