// supabase/functions/analisar/index.ts
// Proxy seguro para a API da Anthropic (Claude) com suporte a imagem.
// Deploy:  supabase functions deploy analisar --no-verify-jwt
// Segredo: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const key = Deno.env.get("ANTHROPIC_API_KEY");
    if (!key) throw new Error("ANTHROPIC_API_KEY não configurada no Supabase.");
    const { prompt, image, media_type } = await req.json();

    const content: unknown[] = [];
    if (image) {
      content.push({
        type: "image",
        source: { type: "base64", media_type: media_type || "image/jpeg", data: image },
      });
    }
    content.push({
      type: "text",
      text: prompt || "Você é engenheiro eletricista e de manutenção predial. Analise a imagem com foco técnico: identifique o sistema (elétrico, SPDA, hidrossanitário, civil), aponte não conformidades, riscos e a norma aplicável (NBR/NR/ITs), e sugira providências. Seja objetivo e em português do Brasil.",
    });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        messages: [{ role: "user", content }],
      }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data?.error?.message || ("HTTP " + r.status));
    const texto = (data.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n");
    return new Response(JSON.stringify({ ok: true, texto }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, erro: e.message }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
