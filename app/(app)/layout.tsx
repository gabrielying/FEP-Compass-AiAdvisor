import { Sidebar } from '@/components/shell/Sidebar';
import { Topbar } from '@/components/shell/Topbar';
import { BottomBar } from '@/components/shell/BottomBar';
import { NoticesUiProvider } from '@/lib/notices-ui-context';
import { NoticeOverlay } from '@/components/notices/NoticeOverlay';
import { QuickCheckOverlay } from '@/components/notices/QuickCheckOverlay';
import { TermPopover } from '@/components/notices/TermPopover';

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <NoticesUiProvider>
      <div className="shell">
        <Sidebar />
        <div className="main">
          <Topbar />
          <main id="views">{children}</main>
          <BottomBar />
        </div>
      </div>
      <NoticeOverlay />
      <QuickCheckOverlay />
      <TermPopover />
    </NoticesUiProvider>
  );
}
