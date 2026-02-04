"use client";
import { useEffect } from "react";
import type { Restaurant } from "@/types";

interface Props {
  restaurant: Restaurant;
  children: React.ReactNode;
}

export default function ThemeProvider({ restaurant, children }: Props) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", restaurant.primary_color);
    root.style.setProperty("--color-accent", restaurant.accent_color);
  }, [restaurant.primary_color, restaurant.accent_color]);

  return <>{children}</>;
}
