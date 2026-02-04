"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import type { Restaurant, Category, Dish } from "@/types";
import { supabaseBrowser } from "@/lib/supabase";

interface Props {
  restaurant: Restaurant;
  categories: Category[];
  dishes: Dish[];
}

export default function AdminDashboard({ restaurant, categories, dishes: initDishes }: Props) {
  const [dishes, setDishes]       = useState<Dish[]>(initDishes);
  const [editing, setEditing]     = useState<Dish | null>(null);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null);

  /* ── Stats ─────────────────────────────────────────────── */
  const stats = useMemo(() => ({
    total:   dishes.length,
    visible: dishes.filter((d) => d.is_visible).length,
    with3d:  dishes.filter((d) => !!d.model_3d_url).length,
    withAr:  dishes.filter((d) => d.has_ar).length,
  }), [dishes]);

  /* ── Toast helper ──────────────────────────────────────── */
  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2600);
  };

  /* ── Sauvegarder ───────────────────────────────────────── */
  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const { error } = await supabaseBrowser()
      .from("dishes")
      .update({
        name: editing.name,
        description: editing.description,
        price: editing.price,
        category_id: editing.category_id,
        tags: editing.tags,
        is_visible: editing.is_visible,
      })
      .eq("id", editing.id);

    if (!error) {
      setDishes((p) => p.map((d) => (d.id === editing.id ? editing : d)));
      showToast("✓ Plat mis à jour");
      setEditing(null);
    } else {
      showToast("✗ Erreur lors de la sauvegarde", false);
    }
    setSaving(false);
  };

  /* ── Toggle visibilité ─────────────────────────────────── */
  const toggleVis = async (dish: Dish) => {
    const next = !dish.is_visible;
    await supabaseBrowser().from("dishes").update({ is_visible: next }).eq("id", dish.id);
    setDishes((p) => p.map((d) => (d.id === dish.id ? { ...d, is_visible: next } : d)));
    showToast(next ? "👁️ Plat rendu visible" : "🙈 Plat masqué");
  };

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-bg)" }}>

      {/* ── Toast ───────────────────────────────────────── */}
      {toast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg anim-scaleIn"
          style={{ background: toast.ok ? "#16a34a" : "#dc2626" }}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Header ──────────────────────────────────────── */}
      <header className="sticky top-0 z-40 safe-top" style={{ background: "var(--color-primary)" }}>
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>{restaurant.name}</p>
            <p className="text-white/40 text-[9px] uppercase tracking-[2px]">Dashboard</p>
          </div>
          <Link
            href={`/${restaurant.slug}`}
            target="_blank"
            className="text-[11px] px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.65)" }}
          >
            Voir le menu →
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* ── Stats ────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Plats",    value: stats.total,   color: "var(--color-primary)" },
            { label: "Visibles", value: stats.visible, color: "#16a34a" },
            { label: "En 3D",   value: stats.with3d,  color: "var(--color-3d)" },
            { label: "AR",       value: stats.withAr,  color: "var(--color-ar)" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[9px] uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Liste des plats ──────────────────────────── */}
        <div>
          <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Vos plats
          </h2>

          <div className="space-y-2">
            {dishes.map((dish) => {
              const isEditing = editing?.id === dish.id;
              return (
                <div
                  key={dish.id}
                  className="rounded-xl overflow-hidden"
                  style={{ background: "var(--color-surface)", border: `1px solid ${isEditing ? "var(--color-accent)" : "var(--color-border)"}` }}
                >
                  {/* Ligne principale */}
                  <div className="flex items-center gap-3 p-3">
                    <button onClick={() => toggleVis(dish)} className="text-lg flex-shrink-0 transition-opacity hover:opacity-65" title={dish.is_visible ? "Masquer" : "Afficher"}>
                      {dish.is_visible ? "👁️" : "🙈"}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>{dish.name}</p>
                        <span className="text-sm font-bold flex-shrink-0" style={{ color: "var(--color-accent)" }}>{dish.price.toFixed(2)} €</span>
                      </div>
                      <div className="flex gap-1.5 mt-0.5 flex-wrap">
                        {dish.model_3d_url && <span className="text-[9px] px-1.5 py-0.25 rounded font-bold" style={{ background: "#dbeafe", color: "#1d4ed8" }}>3D</span>}
                        {dish.has_ar        && <span className="text-[9px] px-1.5 py-0.25 rounded font-bold" style={{ background: "#ede9fe", color: "#6d28d9" }}>AR</span>}
                        {!dish.is_visible   && <span className="text-[9px] px-1.5 py-0.25 rounded font-bold" style={{ background: "#f3f4f6", color: "#6b7280" }}>Masqué</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => setEditing(isEditing ? null : { ...dish })}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors flex-shrink-0"
                      style={{ background: isEditing ? "var(--color-accent)" : "var(--color-surface-alt)", color: isEditing ? "#fff" : "var(--color-text-muted)" }}
                    >
                      {isEditing ? "Annuler" : "✏️"}
                    </button>
                  </div>

                  {/* Formulaire inline */}
                  {isEditing && editing && (
                    <div className="border-t px-3 py-4 space-y-3" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}>
                      {/* Nom */}
                      <Field label="Nom du plat">
                        <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                      </Field>

                      {/* Prix + Catégorie côte à côte */}
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Prix (€)">
                          <input type="number" step="0.01" value={editing.price} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })} />
                        </Field>
                        <Field label="Catégorie">
                          <select value={editing.category_id ?? ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}>
                            <option value="">— Aucune —</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                          </select>
                        </Field>
                      </div>

                      {/* Description */}
                      <Field label="Description">
                        <textarea rows={2} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                      </Field>

                      {/* Checkbox visible */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editing.is_visible}
                          onChange={(e) => setEditing({ ...editing, is_visible: e.target.checked })}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: "var(--color-accent)" }}
                        />
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Visible sur le menu</span>
                      </label>

                      {/* Bouton sauvegarder */}
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all disabled:opacity-55"
                        style={{ background: "var(--color-accent)" }}
                      >
                        {saving ? "Sauvegarde…" : "💾 Enregistrer"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info 3D (lecture seule) */}
        <div className="rounded-xl p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--color-text)" }}>🔒 Modèles 3D & AR</p>
          <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
            Les fichiers 3D sont gérés par l'admin de la plateforme. Contactez-nous pour ajouter des modèles.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Composant champ générique ─────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactElement }) {
  const inputStyle = {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
  };

  return (
    <div>
      <label className="block text-[9px] uppercase tracking-wide font-semibold mb-1" style={{ color: "var(--color-text-muted)" }}>{label}</label>
      {React.cloneElement(children, {
        className: "w-full px-3 py-2 rounded-lg text-sm outline-none resize-none",
        style: inputStyle,
      })}
    </div>
  );
}
