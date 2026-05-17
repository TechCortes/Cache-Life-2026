// Verify Afterglow access password and mint a short-lived signed session token.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

const toBase64Url = (bytes: Uint8Array): string => {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const importKey = async (secret: string): Promise<CryptoKey> =>
  crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

const sign = async (data: string, secret: string): Promise<string> => {
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toBase64Url(new Uint8Array(sig));
};

// Constant-time string compare to avoid timing attacks
const safeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const password = Deno.env.get("AFTERGLOW_ACCESS_PASSWORD");
  const secret = Deno.env.get("AFTERGLOW_SESSION_SECRET");
  if (!password || !secret) {
    return new Response(JSON.stringify({ error: "Server not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const submitted = typeof body.password === "string" ? body.password : "";
  if (!submitted || submitted.length > 200 || !safeEqual(submitted, password)) {
    return new Response(JSON.stringify({ error: "Invalid password" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = toBase64Url(encoder.encode(JSON.stringify({ exp, scope: "afterglow" })));
  const signature = await sign(payload, secret);
  const token = `${payload}.${signature}`;

  return new Response(JSON.stringify({ token, exp }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
