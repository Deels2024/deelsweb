import type { Metadata } from "next";
import Link from "next/link";

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
          <Link className="deels-state-button" href="/challenges">
            Смотреть челленджи
          </Link>
          <Link className="deels-state-button secondary" href="/">
            На главную
          </Link>
        </div>
      </section>
    </main>
  );
}
