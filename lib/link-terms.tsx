import { Fragment } from 'react';
import { GLOSSARY } from './fep-data';

const TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
const TERM_RE = new RegExp('\\b(' + TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'g');

/** Splits body text on glossary terms and wraps matches in clickable `<button class="term">` chips. */
export function linkTerms(text: string): React.ReactNode[] {
  const parts = text.split(TERM_RE);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <button key={i} type="button" className="term" data-term={part}>
        {part}
      </button>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
