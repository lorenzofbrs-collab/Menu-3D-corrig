"use client";
import type { Restaurant } from "@/types";

export default function Footer({ restaurant }: { restaurant: Restaurant }) {
  return (
    <footer className="w-full mt-8" style={{ background: "var(--color-primary)", color: "rgba(255,255,255,0.65)" }}>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        {/* Nom */}
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#fff" }}>{restaurant.name}</p>
          <p className="text-[10px] uppercase tracking-[2px] mt-0.5" style={{ color: "var(--color-accent)" }}>Restaurant</p>
        </div>

        {/* Infos pratiques – grille 2 colonnes */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          {restaurant.address && (
            <div>
              <p className="text-white font-semibold mb-0.5 uppercase tracking-wide text-[9px]">Adresse</p>
              <p className="leading-relaxed">{restaurant.address}</p>
            </div>
          )}
          {restaurant.hours && (
            <div>
              <p className="text-white font-semibold mb-0.5 uppercase tracking-wide text-[9px]">Horaires</p>
              <p className="leading-relaxed">{restaurant.hours}</p>
            </div>
          )}
          {restaurant.phone && (
            <div>
              <p className="text-white font-semibold mb-0.5 uppercase tracking-wide text-[9px]">Téléphone</p>
              <a href={`tel:${restaurant.phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">{restaurant.phone}</a>
            </div>
          )}
          {restaurant.email && (
            <div>
              <p className="text-white font-semibold mb-0.5 uppercase tracking-wide text-[9px]">Contact</p>
              <a href={`mailto:${restaurant.email}`} className="hover:text-white transition-colors break-all">{restaurant.email}</a>
            </div>
          )}
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.10)" }} />

        <p className="text-center text-[9px] tracking-wide">
          © 2025 {restaurant.name} · Propulsé par <span style={{ color: "var(--color-accent)" }}>Menu3D</span>
        </p>
      </div>
    </footer>
  );
}
