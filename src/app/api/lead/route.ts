import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site";

const LeadSchema = z.object({
  name: z.string().min(2).max(200),
  phone: z.string().min(7).max(40),
  email: z.union([z.email(), z.literal("")]).optional(),
  service: z.string().max(120).optional(),
  message: z.string().max(5000).optional(),
  consentSms: z.boolean().optional(),
  locale: z.enum(["en", "es"]).default("en"),
  source: z.string().max(500).optional(),
  elapsedMs: z.number().optional(),
  /** Honeypot: any value means bot. */
  company: z.string().optional(),
});

export async function POST(request: Request) {
  let parsed: z.infer<typeof LeadSchema>;
  try {
    parsed = LeadSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Spam heuristics: honeypot filled or superhuman fill speed.
  // Respond 200 so bots don't learn they were filtered.
  if (parsed.company || (parsed.elapsedMs !== undefined && parsed.elapsedMs < 2500)) {
    return NextResponse.json({ ok: true });
  }

  const lines = [
    `New service request: ${siteConfig.name}`,
    ``,
    `Name:     ${parsed.name}`,
    `Phone:    ${parsed.phone}`,
    `Email:    ${parsed.email || "-"}`,
    `Service:  ${parsed.service || "-"}`,
    `SMS ok:   ${parsed.consentSms ? "yes" : "no"}`,
    `Language: ${parsed.locale === "es" ? "Spanish" : "English"}`,
    `Page:     ${parsed.source || "-"}`,
    ``,
    `Message:`,
    parsed.message || "-",
    ``,
    `Respond fast: water damage leads go to whoever answers first.`,
  ];

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;

  if (apiKey && from) {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: `${siteConfig.name} Website <${from}>`,
        to: [...siteConfig.integrations.leadEmails],
        ...(process.env.LEAD_BCC_EMAIL ? { bcc: [process.env.LEAD_BCC_EMAIL] } : {}),
        ...(parsed.email ? { replyTo: parsed.email } : {}),
        subject: `New lead: ${parsed.name}${parsed.service ? ` (${parsed.service})` : ""}`,
        text: lines.join("\n"),
      });
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error("[lead] email delivery failed:", e);
      return NextResponse.json({ ok: false }, { status: 502 });
    }
  } else {
    console.warn("[lead] RESEND_API_KEY/LEAD_FROM_EMAIL not set, lead logged only:", parsed);
  }

  // Optional CRM/webhook fan-out: never blocks the lead on failure.
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: siteConfig.id,
          business: siteConfig.name,
          name: parsed.name,
          phone: parsed.phone,
          email: parsed.email || null,
          service: parsed.service || null,
          message: parsed.message || null,
          consentSms: Boolean(parsed.consentSms),
          locale: parsed.locale,
          source: parsed.source || null,
          receivedAt: new Date().toISOString(),
        }),
      });
    } catch (e) {
      console.error("[lead] webhook delivery failed (lead still emailed):", e);
    }
  }

  return NextResponse.json({ ok: true });
}
