"use client";
import { useState, useMemo } from "react";
import type { Restaurant, Category, Dish } from "@/types";
import Header        from "@/components/menu/Header";
import Hero          from "@/components/menu/Hero";
import SearchBar     from "@/components/menu/SearchBar";
import CategoryFilter from "@/components/menu/CategoryFilter";
import DishCard      from "@/components/menu/DishCard";
import Footer        from "@/components/menu/Footer";

interface Props {
  restaurant: Restaurant;
  categories: Category[];
  dishes: Dish[];
}

export default function MenuPage({ restaurant, categories, dishes }: Props) {
  const [query, setQuery]           = useState("");
  const [activeCategory, setActive] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return dishes.filter((d) => {
      const matchQ =
        !q ||
        d.name.toLowerCase().includes(q) ||
        (d.description ?? "").toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q));
      const matchC = !activeCategory || d.category_id === activeCategory;
      return matchQ && matchC;
    });
  }, [dishes, query, activeCategory]);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--color-bg)" }}>
      <Header restaurant={restaurant} />

      <Hero restaurant={restaurant}>
        <SearchBar value={query} onChange={setQuery} />
      </Hero>

      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onChange={setActive}
      />

      {/* Grille de plats */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-5">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-3">🔍</p>
            <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>
              Aucun plat ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((dish, i) => (
              <div
                key={dish.id}
                className="anim-fadeUp"
                style={{ animationDelay: `${Math.min(i * 55, 350)}ms` }}
              >
                <DishCard dish={dish} slug={restaurant.slug} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer restaurant={restaurant} />
    </div>
  );
}
