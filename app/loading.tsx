export default function Loading() {
  return (
    <main className="deels-loading-shell" aria-busy="true" aria-label="Deels загружается">
      <div className="deels-loading-title" />
      <section className="deels-loading-grid" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="deels-loading-card-wrap" key={index}>
            <div className="deels-loading-card" />
            <div className="deels-loading-line" />
            <div className="deels-loading-line short" />
          </div>
        ))}
      </section>
    </main>
  );
}
