"use client";
import type { Restaurant } from "@/types";

interface Props {
  restaurant: Restaurant;
  children: React.ReactNode; // SearchBar
}

export default function Hero({ restaurant, children }: Props) {
  const bg = restaurant.hero_image_url
    ? `linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.72) 100%), url(${restaurant.hero_image_url}) center/cover`
    : "var(--color-primary)";

  return (
    <section className="relative w-full" style={{ background: bg, color: "#fff" }}>
      <div className="max-w-2xl mx-auto px-4 pt-9 pb-10 text-center">
        {restaurant.logo_url ? (
          <img src={restaurant.logo_url} alt={restaurant.name} className="mx-auto h-16 w-16 object-contain mb-3 drop-shadow-lg" />
        ) : (
          <span className="text-5xl block mb-3">🍽️</span>
        )}

        <h1 className="text-3xl font-semibold mb-1 drop-shadow" style={{ fontFamily: "var(--font-display)" }}>
          {restaurant.name}
        </h1>
        <p className="text-[11px] font-semibold uppercase tracking-[3px] mb-5" style={{ color: "var(--color-accent)" }}>
          Découvrez notre carte
        </p>

        {children}
      </div>

      {/* Transition douce vers le fond clair */}
      <div className="absolute bottom-0 left-0 right-0 h-5" style={{ background: "var(--color-bg)" }} />
    </section>
  );
}
