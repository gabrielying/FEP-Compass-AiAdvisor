'use client';

import { useEffect, useRef, useState } from 'react';
import type { NoticeSection } from '@/lib/fep-data';
import { linkTerms } from '@/lib/link-terms';

function AccordionItem({ section, focusRef }: { section: NoticeSection; focusRef?: string }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusRef && section.ref === focusRef) {
      const t = setTimeout(() => {
        setOpen(true);
        itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
      return () => clearTimeout(t);
    }
  }, [focusRef, section.ref]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.style.maxHeight = open ? `${body.scrollHeight}px` : '0';
  }, [open]);

  return (
    <div className={`prov${open ? ' open' : ''}`} ref={itemRef}>
      <button type="button" className="prov-head" onClick={() => setOpen((o) => !o)}>
        <span className="prov-ref">{section.ref}</span>
        <span className="prov-title">{section.title}</span>
        <i className="ti ti-chevron-down prov-chev" />
      </button>
      <div className="prov-body" ref={bodyRef}>
        <div className="prov-body-inner">{linkTerms(section.body)}</div>
      </div>
    </div>
  );
}

export function Accordion({ list, focusRef }: { list: NoticeSection[]; focusRef?: string }) {
  return (
    <>
      {list.map((s) => (
        <AccordionItem key={s.ref} section={s} focusRef={focusRef} />
      ))}
    </>
  );
}
