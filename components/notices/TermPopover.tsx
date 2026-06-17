'use client';

import { useEffect, useRef, useState } from 'react';
import { GLOSSARY } from '@/lib/fep-data';

export function TermPopover() {
  const [term, setTerm] = useState<string | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number; maxWidth: number }>({ left: 0, top: 0, maxWidth: 320 });
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const t = target.closest<HTMLElement>('.term');
      if (!t) {
        if (!target.closest('.term-pop')) setTerm(null);
        return;
      }
      const key = t.dataset.term;
      if (!key) return;
      const def = GLOSSARY[key] ?? GLOSSARY[Object.keys(GLOSSARY).find((k) => k.toLowerCase() === key.toLowerCase()) ?? ''];
      if (!def) return;
      const r = t.getBoundingClientRect();
      const pw = Math.min(320, window.innerWidth - 24);
      const x = Math.min(Math.max(12, r.left), window.innerWidth - pw - 12);
      let y = r.bottom + 8;
      const popHeight = popRef.current?.offsetHeight ?? 0;
      if (y + popHeight > window.innerHeight - 12) y = r.top - popHeight - 8;
      setPos({ left: x, top: Math.max(12, y), maxWidth: pw });
      setTerm(key);
    }
    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') setTerm(null);
    }
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeydown);
    };
  }, []);

  const def = term ? GLOSSARY[term] ?? GLOSSARY[Object.keys(GLOSSARY).find((k) => k.toLowerCase() === term.toLowerCase()) ?? ''] : null;

  return (
    <div
      ref={popRef}
      id="term-pop"
      className={`term-pop${term ? '' : ' hidden'}`}
      role="tooltip"
      style={{ left: pos.left, top: pos.top, maxWidth: pos.maxWidth }}
    >
      <div className="term-pop-name">{term}</div>
      <div className="term-pop-def">{def}</div>
    </div>
  );
}
