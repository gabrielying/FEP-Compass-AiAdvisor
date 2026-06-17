'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from './BrandMark';
import { NAV_ITEMS } from './nav-items';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        <BrandMark />
        <div>
          <div className="brand-name">
            FEP <span>Compass</span>
          </div>
          <div className="brand-sub">Malaysia&apos;s FX Policy Advisor</div>
        </div>
      </div>

      <nav className="side-nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`side-link${pathname.startsWith(item.href) ? ' active' : ''}`}
          >
            <i className={`ti ${item.icon}`} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="side-foot">
        <div className="side-foot-badge">
          <i className="ti ti-shield-check" /> Notices N1–N7 · effective 1 Oct 2025
        </div>
        <p>
          Educational guidance only — not legal advice. Verify complex cases with the FEP Authority — official source
          linked in <Link href="/settings">Settings</Link>.
        </p>
        <form action="/auth/sign-out" method="post">
          <button type="submit" className="side-link" style={{ width: '100%', border: 'none', background: 'none' }}>
            <i className="ti ti-logout" />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
