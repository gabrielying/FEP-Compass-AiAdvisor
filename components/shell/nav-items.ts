export interface NavItem {
  href: string;
  icon: string;
  label: string;
  shortLabel: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/notices', icon: 'ti-books', label: 'FEP Notices', shortLabel: 'Notices' },
  { href: '/dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard', shortLabel: 'Dashboard' },
  { href: '/tools', icon: 'ti-sparkles', label: 'Smart Tools', shortLabel: 'Tools' },
  { href: '/advisor', icon: 'ti-message-dots', label: 'AI Advisor', shortLabel: 'Advisor' },
  { href: '/settings', icon: 'ti-settings', label: 'Settings', shortLabel: 'More' },
];
