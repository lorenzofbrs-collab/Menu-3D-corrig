import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase";
import type { Restaurant } from "@/types";
import ThemeProvider from "@/components/ThemeProvider";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { data } = await supabaseServer()
    .from("restaurants")
    .select("name")
    .eq("slug", slug)
    .single();
  return {
    title: data?.name ?? "Menu",
    description: `Découvrez le menu de ${data?.name ?? "notre restaurant"} en 3D et en réalité augmentée.`,
  };
}

export default async function RestaurantLayout({ children, params }: Props) {
  const { slug } = await params;
  const { data: restaurant } = await supabaseServer()
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("subscription_active", true)
    .single<Restaurant>();

  if (!restaurant) notFound();

  return <ThemeProvider restaurant={restaurant}>{children}</ThemeProvider>;
}
