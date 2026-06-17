import { OnboardingCard } from '@/components/notices/OnboardingCard';
import { NoticeSearch } from '@/components/notices/NoticeSearch';
import { Glossary } from '@/components/notices/Glossary';

export default function NoticesPage() {
  return (
    <section className="view active" aria-label="FEP Notices">
      <div className="page">
        <header className="page-head">
          <h1>FEP Notices — Educational Hub</h1>
          <p className="page-sub">
            Malaysia&apos;s Foreign Exchange Policy (FEP) Notices 1–7, broken down into plain-language provisions.
          </p>
        </header>

        <OnboardingCard />
        <NoticeSearch />
        <Glossary />
      </div>
    </section>
  );
}
