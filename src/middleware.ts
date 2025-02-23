import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 hari
            ...options,
          });
        },
        remove(name: string) {
          res.cookies.delete(name);
        },
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();
  const { pathname } = req.nextUrl;

  console.log("User data:", data);
  console.log("Error:", error);

  const publicRoutes = ["/login", "/reset-password"];

  // 🌟 Jika user belum login dan mengakses halaman private
  if (!data.user && !publicRoutes.includes(pathname)) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }
  

  // 🌟 Jika user sudah login dan mengakses halaman login
  if (data.user && pathname === "/login") {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// 🌟 Proteksi semua halaman kecuali aset statis dan public routes
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|/login|/reset-password).*)",
  ],
};