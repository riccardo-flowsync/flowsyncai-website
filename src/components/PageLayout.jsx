// Shell for the legal pages: title, date, one readable column. Language comes from the navbar switch.
export default function PageLayout({ title, updated, children }) {
  return (
    <article className="page min-h-[80svh] pb-24 pt-32 sm:pt-36">
      <div className="max-w-[68ch]">
        <h1 className="t-h2">{title}</h1>
        <p className="mt-4 text-sm text-faint">{updated}</p>
        <div className="mt-12 space-y-12">{children}</div>
      </div>
    </article>
  );
}

// One titled block. Bullets and links inside are styled here, so the copy stays plain <p>, <ul> and <a>.
export function PageSection({ title, children }) {
  return (
    <section>
      <h2 className="t-h3">{title}</h2>
      <div className="mt-3 space-y-4 leading-7 text-muted [&_a]:link [&_a]:text-fg [&_a]:decoration-faint [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
