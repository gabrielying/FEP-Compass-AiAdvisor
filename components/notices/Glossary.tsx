import { GLOSSARY } from '@/lib/fep-data';

export function Glossary() {
  return (
    <section className="card glossary-card">
      <div className="card-head">
        <h2>
          <i className="ti ti-vocabulary" /> Key Terms Glossary
        </h2>
        <span className="card-hint">Tap a term for its FEP definition</span>
      </div>
      <div id="glossary" className="glossary">
        {Object.keys(GLOSSARY).map((term) => (
          <button key={term} type="button" className="term" data-term={term}>
            {term}
          </button>
        ))}
      </div>
    </section>
  );
}
