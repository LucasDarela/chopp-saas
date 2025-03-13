import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  // Se o usuário não estiver autenticado e tentar acessar o Dashboard, redireciona para login
  if (!user && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return res;
}

// Aplicar o middleware apenas nas rotas protegidas
export const config = {
  matcher: ["/dashboard/:path*"], // Protege todas as páginas dentro de /dashboard
};