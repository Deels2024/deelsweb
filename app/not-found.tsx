import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Страница не найдена — Deels",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="deels-state-page">
      <section className="deels-state-card">
        <div className="deels-state-mark">D</div>
        <h1>Такой страницы нет</h1>
        <p>Возможно, челлендж завершён, ссылка изменилась или контент больше недоступен.</p>
        <div className="deels-state-actions">
          <a className="deels-state-button" href="/challenges">
            Смотреть челленджи
          </a>
          <a className="deels-state-button secondary" href="/">
            На главную
          </a>
        </div>
      </section>
    </main>
  );
}
