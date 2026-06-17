import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Toutes les routes sauf les assets statiques, l'API et les images.
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|opengraph-image|api/).*)",
  ],
};
