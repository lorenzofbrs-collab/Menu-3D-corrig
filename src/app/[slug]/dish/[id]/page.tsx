import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase";
import type { Restaurant, Dish } from "@/types";
import DishDetailPage from "@/components/menu/DishDetailPage";

interface Props { params: Promise<{ slug: string; id: string }>; }

export default async function DishRoute({ params }: Props) {
  const { slug, id } = await params;
  const db = supabaseServer();

  const { data: restaurant } = await db
    .from("restaurants").select("*").eq("slug", slug).single<Restaurant>();
  if (!restaurant) notFound();

  const { data: dish } = await db
    .from("dishes").select("*")
    .eq("id", id)
    .eq("restaurant_id", restaurant.id)
    .eq("is_visible", true)
    .single<Dish>();
  if (!dish) notFound();

  return <DishDetailPage dish={dish} restaurant={restaurant} />;
}
