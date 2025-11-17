'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Users,
  Clock,
  Briefcase,
  BarChart,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'proposals', href: '/proposals', icon: FileText },
  { key: 'invoices', href: '/invoices', icon: Receipt },
  { key: 'clients', href: '/clients', icon: Users },
  { key: 'timeTracking', href: '/time-tracking', icon: Clock },
  { key: 'services', href: '/services', icon: Briefcase },
  { key: 'reports', href: '/reports', icon: BarChart },
  { key: 'settings', href: '/settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <nav className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">Das Program</h1>
        <p className="text-sm text-muted-foreground">Proposal & Invoice Generator</p>
      </div>

      <div className="flex-1 space-y-1 px-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.includes(item.href);

          return (
            <Link key={item.key} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{t(item.key)}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>{t('logout')}</span>
        </Button>
      </div>
    </nav>
  );
}
