export async function onRequestPost({ request, env }) {
  if (!env.GROQ_API_KEY) return new Response("Не настроен секрет GROQ_API_KEY в Cloudflare Pages.", { status: 500 });
  try {
    const payload = await request.json();
    const messages = Array.isArray(payload.messages) ? payload.messages.slice(-30) : [];
    if (!messages.length) return new Response("Нет сообщений.", { status: 400 });
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        temperature: 0.85,
        max_tokens: 700,
        messages
      })
    });
    const body = await response.text();
    return new Response(body, {
      status: response.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });
  } catch (error) {
    return new Response("Ошибка сервера: " + error.message, { status: 500 });
  }
}
