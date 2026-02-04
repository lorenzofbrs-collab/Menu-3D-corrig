"use client";
import Link from "next/link";
import type { Dish } from "@/types";

interface Props { dish: Dish; slug: string; }

export default function DishCard({ dish, slug }: Props) {
  return (
    <Link
      href={`/${slug}/dish/${dish.id}`}
      className="flex gap-3.5 rounded-xl overflow-hidden transition-all duration-200 active:scale-[0.97]"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
    >
      {/* Miniature */}
      <div className="relative flex-shrink-0 w-28" style={{ minHeight: 112 }}>
        {dish.image_url ? (
          <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--color-surface-alt)" }}>
            <span className="text-3xl">🍽️</span>
          </div>
        )}
        {dish.model_3d_url && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-white text-[9px] font-bold uppercase tracking-wide" style={{ background: "var(--color-3d)" }}>
            3D
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center py-3 pr-2 flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <h3 className="text-base font-semibold truncate" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            {dish.name}
          </h3>
          <span className="text-sm font-bold flex-shrink-0" style={{ color: "var(--color-accent)" }}>
            {dish.price.toFixed(2)} €
          </span>
        </div>

        {dish.description && (
          <p className="text-xs leading-relaxed mb-1.5 line-clamp-2" style={{ color: "var(--color-text-muted)" }}>
            {dish.description}
          </p>
        )}

        <div className="flex items-center flex-wrap gap-1.5">
          {dish.tags.slice(0, 2).map((t) => (
            <span key={t} className="px-2 py-0.25 rounded-full text-[9px] font-medium" style={{ background: "var(--color-surface-alt)", color: "var(--color-text-muted)" }}>
              {t}
            </span>
          ))}
          {dish.has_ar && (
            <span className="px-2 py-0.25 rounded-full text-[9px] font-bold text-white" style={{ background: "var(--color-ar)" }}>
              📱 AR
            </span>
          )}
        </div>
      </div>

      {/* Chevron */}
      <div className="flex-shrink-0 flex items-center pr-3" style={{ color: "var(--color-border)" }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 3l5 5-5 5" />
        </svg>
      </div>
    </Link>
  );
}
