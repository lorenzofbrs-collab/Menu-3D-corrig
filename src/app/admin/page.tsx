import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase";
import type { Restaurant, Dish, Category } from "@/types";
import AdminDashboard from "@/components/admin/AdminDashboard";

/**
 * Demo : sans authentification complète, on charge directement
 * le restaurant "la-brasserie-demo".
 * En production vous ajouterez Supabase Auth middleware.
 */
export default async function AdminPage() {
  const db = supabaseServer();

  const { data: restaurant } = await db
    .from("restaurants")
    .select("*")
    .eq("slug", "la-brasserie-demo")
    .single<Restaurant>();

  if (!restaurant) redirect("/");

  const { data: categories } = await db
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("display_order");

  const { data: dishes } = await db
    .from("dishes")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("display_order");

  return (
    <AdminDashboard
      restaurant={restaurant}
      categories={(categories ?? []) as Category[]}
      dishes={(dishes ?? []) as Dish[]}
    />
  );
}
