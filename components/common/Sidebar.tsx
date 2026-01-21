'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { logout } from '@/app/actions/auth.actions';

type NavItem = {
  label: string;
  href: string;
};

const mainNavigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Team',
    href: '/team',
  },
  {
    label: 'Activities',
    href: '/activities',
  },
];

const adminNavigationItems: NavItem[] = [
  {
    label: 'Admin',
    href: '/admin',
  },
];

type SidebarProps = {
  userRole?: string;
};

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const isAdmin = userRole === 'admin';

  async function handleLogout() {
    await logout();
  }

  return (
    <aside className="w-60 border-r bg-card h-screen flex flex-col">
      {/* App branding */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-semibold">Teamboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Internal Dashboard</p>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {mainNavigationItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-foreground/70 hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Admin section - only visible to admins */}
        {isAdmin && (
          <div className="mt-6 pt-6 border-t">
            <div className="space-y-1">
              {adminNavigationItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-accent text-accent-foreground font-semibold'
                        : 'text-foreground/70 hover:bg-accent/50 hover:text-accent-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Footer with logout button */}
      <div className="p-4 border-t">
        <form action={handleLogout}>
          <button
            type="submit"
            className="w-full px-3 py-2 rounded-md text-sm font-semibold border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
