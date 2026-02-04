import { supabaseServer } from "@/lib/supabase";
import type { Restaurant, Category, Dish } from "@/types";
import MenuPage from "@/components/menu/MenuPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function RestaurantMenu({ params }: Props) {
  const { slug } = await params;
  const db = supabaseServer();

  const { data: restaurant } = await db
    .from("restaurants").select("*").eq("slug", slug).single<Restaurant>();

  const { data: categories } = await db
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurant!.id)
    .order("display_order", { ascending: true });

  const { data: dishes } = await db
    .from("dishes")
    .select("*")
    .eq("restaurant_id", restaurant!.id)
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  return (
    <MenuPage
      restaurant={restaurant!}
      categories={(categories ?? []) as Category[]}
      dishes={(dishes ?? []) as Dish[]}
    />
  );
}
