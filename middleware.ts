import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🔹 Função para validar a sessão do usuário via Supabase
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const rotasProtegidas = ["/dashboard", "/dashboard/clientes", "/dashboard/fornecedores"];

  if (!rotasProtegidas.some((rota) => pathname.startsWith(rota))) {
    return NextResponse.next();
  }

  // 🔹 Cria um Supabase Client no Middleware
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${req.cookies.get("sb-access-token")?.value}` },
      },
    }
  );

  // 🔹 Obtém o usuário autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔹 Se não houver usuário, redireciona para login
  if (!user) {
    console.log("❌ Usuário não autenticado. Redirecionando...");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

// 🔹 Configuração para proteger todas as rotas do dashboard
export const config = {
  matcher: ["/dashboard/:path*", "/clientes/:path*", "/fornecedores/:path*", "/vendas/:path*"],
};