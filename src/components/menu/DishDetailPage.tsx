"use client";
import { useState, lazy, Suspense } from "react";
import Link from "next/link";
import type { Restaurant, Dish } from "@/types";
import ARViewer from "@/components/3d/ARViewer";

const Model3DViewer = lazy(() => import("@/components/3d/Model3DViewer"));

interface Props { dish: Dish; restaurant: Restaurant; }

export default function DishDetailPage({ dish, restaurant }: Props) {
  const [show3D, setShow3D] = useState(false);
  const [showAR, setShowAR] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--color-bg)" }}>
      {/* Back nav */}
      <div className="sticky top-0 z-40 safe-top" style={{ background: "rgba(250,249,247,0.82)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <Link href={`/${restaurant.slug}`} className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-65" style={{ color: "var(--color-accent)" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 3L5 8l5 5" /></svg>
            Retour au menu
          </Link>
        </div>
      </div>

      {/* Image plat */}
      <div className="w-full" style={{ height: "min(56vw, 280px)", background: "var(--color-surface-alt)" }}>
        {dish.image_url ? (
          <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><span className="text-7xl">🍽️</span></div>
        )}
      </div>

      {/* Contenu */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
        {/* Titre + prix */}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold leading-tight" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>{dish.name}</h1>
          <span className="text-xl font-bold flex-shrink-0" style={{ color: "var(--color-accent)" }}>{dish.price.toFixed(2)} €</span>
        </div>

        {/* Tags */}
        {dish.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dish.tags.map((t) => (
              <span key={t} className="px-2.5 py-0.5 rounded-full text-[10px] font-medium" style={{ background: "var(--color-surface-alt)", color: "var(--color-text-muted)" }}>{t}</span>
            ))}
          </div>
        )}

        {/* Description */}
        {dish.description && (
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{dish.description}</p>
        )}

        {/* Allergènes */}
        {dish.allergens.length > 0 && (
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            <span className="font-semibold">⚠️ Allergènes :</span> {dish.allergens.join(", ")}
          </p>
        )}

        {/* ── Boutons 3D / AR ─────────────────────────────── */}
        {(dish.model_3d_url || dish.has_ar) && (
          <div className="space-y-3 pt-2">
            {dish.model_3d_url && (
              <button
                onClick={() => setShow3D(true)}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.96]"
                style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)", boxShadow: "0 4px 18px rgba(59,130,246,0.38)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Visualiser en 3D
              </button>
            )}
            {dish.has_ar && (
              <button
                onClick={() => setShowAR(true)}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.96]"
                style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed)", boxShadow: "0 4px 18px rgba(139,92,246,0.38)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M16 10l2 2-2 2"/></svg>
                Voir en Réalité Augmentée
              </button>
            )}
            <p className="text-center text-[11px]" style={{ color: "var(--color-text-muted)" }}>
              💡 Placez le plat virtuellement sur votre table avant de commander
            </p>
          </div>
        )}
      </div>

      {/* ── Modal 3D ────────────────────────────────────── */}
      {show3D && dish.model_3d_url && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 anim-scaleIn" onClick={() => setShow3D(false)}>
          <div className="w-full sm:max-w-lg bg-gray-950 rounded-t-2xl sm:rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-white text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>{dish.name} – Vue 3D</p>
              <button onClick={() => setShow3D(false)} className="text-white/50 hover:text-white text-xl leading-none">✕</button>
            </div>
            <div style={{ height: 340 }}>
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-gray-900"><p className="text-white/35 text-sm">Chargement…</p></div>}>
                <Model3DViewer modelUrl={dish.model_3d_url} />
              </Suspense>
            </div>
            <p className="text-center text-white/30 text-[10px] py-2.5">Glissez pour faire tourner · Pincez pour zoomer</p>
          </div>
        </div>
      )}

      {/* ── Modal AR ────────────────────────────────────── */}
      {showAR && dish.has_ar && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 anim-scaleIn" onClick={() => setShowAR(false)}>
          <div className="w-full sm:max-w-lg bg-gray-950 rounded-t-2xl sm:rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-white text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>{dish.name} – Réalité Augmentée</p>
              <button onClick={() => setShowAR(false)} className="text-white/50 hover:text-white text-xl leading-none">✕</button>
            </div>
            <ARViewer modelUrl={dish.model_3d_url ?? ""} modelArIosUrl={dish.model_ar_ios_url} dishName={dish.name} />
          </div>
        </div>
      )}
    </div>
  );
}
