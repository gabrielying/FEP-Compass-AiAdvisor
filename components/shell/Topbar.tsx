import { BrandMark } from './BrandMark';

export function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-row">
        <div className="brand brand-sm">
          <BrandMark />
          <div className="brand-name">
            FEP <span>Compass</span>
          </div>
        </div>
        <div className="topbar-badge">N1–N7 · Oct 2025</div>
      </div>
      <p className="topbar-disclaimer">
        Educational guidance only — not legal advice. Verify complex cases with the FEP Authority.
      </p>
    </header>
  );
}
