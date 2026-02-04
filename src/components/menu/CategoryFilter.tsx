"use client";
import type { Category } from "@/types";

interface Props {
  categories: Category[];
  active: string | null;
  onChange: (id: string | null) => void;
}

export default function CategoryFilter({ categories, active, onChange }: Props) {
  if (!categories.length) return null;

  return (
    <div className="w-full overflow-x-auto" style={{ borderBottom: "1px solid var(--color-border)" }}>
      <div className="flex gap-2 px-4 py-3 w-max">
        <Pill active={active === null} onClick={() => onChange(null)}>Tous</Pill>
        {categories.map((c) => (
          <Pill key={c.id} active={active === c.id} onClick={() => onChange(active === c.id ? null : c.id)}>
            {c.icon && <span className="text-base mr-1">{c.icon}</span>}
            {c.name}
          </Pill>
        ))}
      </div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200"
      style={{
        background: active ? "var(--color-primary)" : "var(--color-surface-alt)",
        color: active ? "#fff" : "var(--color-text-muted)",
      }}
    >
      {children}
    </button>
  );
}
