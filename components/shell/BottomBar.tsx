'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from './nav-items';

export function BottomBar() {
  const pathname = usePathname();

  return (
    <nav className="bottombar" aria-label="Primary mobile">
      {NAV_ITEMS.map((item) => (
        <Link key={item.href} href={item.href} className={`bb-tab${pathname.startsWith(item.href) ? ' active' : ''}`}>
          <i className={`ti ${item.icon}`} />
          <span>{item.shortLabel}</span>
        </Link>
      ))}
    </nav>
  );
}
