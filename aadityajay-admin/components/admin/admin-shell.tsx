'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  FileText,
  Video,
  Trophy,
  Image as ImageIcon,
  Megaphone,
  Inbox,
  ScrollText,
  LogOut,
  Menu,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Articles', href: '/admin/articles', icon: FileText },
  { label: 'Videos', href: '/admin/videos', icon: Video },
  { label: 'Achievements', href: '/admin/achievements', icon: Trophy },
  { label: 'Hero', href: '/admin/hero', icon: ImageIcon },
  { label: 'Ticker', href: '/admin/ticker', icon: Megaphone },
  { label: 'Inquiries', href: '/admin/inquiries', icon: Inbox },
  { label: 'Audit Log', href: '/admin/audit', icon: ScrollText },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map((item) => {
        const active = isActive(item.href, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all',
              active
                ? 'bg-primary/15 text-primary border border-primary/25'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent'
            )}
          >
            <Icon className={cn('w-4 h-4 flex-shrink-0', active && 'text-primary')} />
            <span className="font-medium">{item.label}</span>
            {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary" />}
          </Link>
        );
      })}
    </nav>
  );

  const BrandBlock = () => (
    <div className="px-5 py-5 border-b border-border">
      <Link href="/admin" className="block group">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
          Control Panel
        </p>
        <h1 className="font-display text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
          Aaditya Ajay
        </h1>
      </Link>
    </div>
  );

  const UserBlock = () => (
    <div className="px-4 py-4 border-t border-border">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">
            {profile?.display_name || 'Admin'}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {profile?.email}
          </p>
        </div>
        <span
          className={cn(
            'text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border',
            profile?.role === 'OWNER'
              ? 'bg-primary/15 text-primary border-primary/30'
              : 'bg-secondary text-muted-foreground border-border'
          )}
        >
          {profile?.role ?? '—'}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          await signOut();
          router.replace('/login');
        }}
        className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background bg-grain">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-card/40 backdrop-blur border-r border-border z-30">
        <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col">
          <BrandBlock />
          <div className="flex-1 py-4">
            <NavLinks />
          </div>
          <UserBlock />
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-card border-r border-border">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col h-full">
                <BrandBlock />
                <div className="flex-1 overflow-y-auto scrollbar-thin py-4">
                  <NavLinks onClick={() => setMobileOpen(false)} />
                </div>
                <UserBlock />
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/admin" className="font-display text-lg font-bold">
            Aaditya Ajay
          </Link>
          <div className="w-10" />
        </div>
      </header>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
