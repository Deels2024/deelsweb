"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="deels-state-page">
      <section className="deels-state-card" role="alert">
        <div className="deels-state-mark">!</div>
        <h1>Что-то пошло не так</h1>
        <p>Не удалось загрузить этот экран. Попробуйте ещё раз — ваши действия не потеряны.</p>
        <div className="deels-state-actions">
          <button type="button" className="deels-state-button" onClick={() => reset()}>
            Повторить
          </button>
          <Link className="deels-state-button secondary" href="/">
            На главную
          </Link>
        </div>
      </section>
    </main>
  );
}
