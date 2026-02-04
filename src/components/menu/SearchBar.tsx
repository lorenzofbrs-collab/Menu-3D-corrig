"use client";
import { useRef } from "react";

interface Props { value: string; onChange: (v: string) => void; }

export default function SearchBar({ value, onChange }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Icône lupe */}
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{ color: "rgba(255,255,255,0.5)" }}
        viewBox="0 0 20 20" fill="currentColor"
      >
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l3.317 3.317a1 1 0 01-1.414 1.414l-3.318-3.317A6 6 0 012 8z" clipRule="evenodd" />
      </svg>

      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un plat…"
        autoComplete="off"
        className="w-full pl-10 pr-9 py-3 rounded-full text-sm outline-none transition-all"
        style={{
          background: "rgba(255,255,255,0.11)",
          border: "1.5px solid rgba(255,255,255,0.22)",
          color: "#fff",
        }}
        onFocus={(e)  => { e.target.style.borderColor = "var(--color-accent)"; e.target.style.background = "rgba(255,255,255,0.17)"; }}
        onBlur={(e)   => { e.target.style.borderColor = "rgba(255,255,255,0.22)"; e.target.style.background = "rgba(255,255,255,0.11)"; }}
      />

      {value && (
        <button
          onClick={() => { onChange(""); ref.current?.focus(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-sm transition-opacity hover:opacity-70"
          style={{ color: "rgba(255,255,255,0.6)" }}
          aria-label="Effacer"
        >
          ✕
        </button>
      )}
    </div>
  );
}
