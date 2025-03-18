import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-02-01" as any,
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Erro ao validar Webhook:", err);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_email; // Obtém o email do usuário

    // 🔹 Busca o usuário pelo email
    const { data: user, error } = await supabase
      .from("user")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      console.error("Usuário não encontrado para email:", email);
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const planoId = session.metadata?.plano_id;
    const dataExpiracao = new Date();
    dataExpiracao.setMonth(dataExpiracao.getMonth() + 1); // Assinatura válida por 1 mês

    // 🔹 Atualiza a assinatura do usuário no Supabase
    const { error: updateError } = await supabase
      .from("user")
      .update({
        plano_id: planoId,
        status_assinatura: "ativo",
        data_expiracao: dataExpiracao.toISOString(),
      })
      .eq("email", email);

    if (updateError) {
      console.error("Erro ao atualizar usuário no Supabase:", updateError);
      return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
    }

    console.log(`Usuário ${email} atualizado com sucesso!`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}