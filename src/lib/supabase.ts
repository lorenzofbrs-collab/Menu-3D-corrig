import { createBrowserClient, createServerClient } from "@supabase/ssr";

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let _b: ReturnType<typeof createBrowserClient> | null = null;

export function supabaseBrowser() {
  if (!_b) _b = createBrowserClient(URL, ANON);
  return _b;
}

export function supabaseServer() {
  return createServerClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
