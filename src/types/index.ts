export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  hero_image_url: string | null;
  primary_color: string;
  accent_color: string;
  font_display: string;
  font_body: string;
  template: "classic" | "modern" | "boutique" | "casual";
  address: string | null;
  phone: string | null;
  email: string | null;
  hours: string | null;
  plan: "free" | "starter" | "premium" | "pro";
  subscription_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  icon: string | null;
  display_order: number;
  created_at: string;
}

export interface Dish {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  model_3d_url: string | null;
  model_ar_ios_url: string | null;
  has_ar: boolean;
  tags: string[];
  allergens: string[];
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
