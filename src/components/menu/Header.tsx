"use client";
import type { Restaurant } from "@/types";

export default function Header({ restaurant }: { restaurant: Restaurant }) {
  return (
    <header
      className="sticky top-0 z-40 w-full safe-top"
      style={{
        background: "rgba(250,249,247,0.82)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {restaurant.logo_url ? (
            <img src={restaurant.logo_url} alt={restaurant.name} className="h-7 w-7 object-contain" />
          ) : (
            <span className="text-xl">🍽️</span>
          )}
          <span
            className="text-base font-semibold truncate"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
          >
            {restaurant.name}
          </span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[2.5px]" style={{ color: "var(--color-accent)" }}>
          Menu
        </span>
      </div>
    </header>
  );
}
