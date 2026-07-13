import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";
import { formatPhone } from "@/lib/utils";

/**
 * Generated 1200x630 social share card (og:image), served at /api/og and
 * referenced by seo.ts defaultShareImage when a client sets no ogImage.
 * Lives under /api so the i18n middleware does not try to localize it.
 * Branded from siteConfig, no external assets, so it stays self-contained.
 */
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export function GET() {
  const { colors } = siteConfig.branding;
  const primary = colors.primary;
  const accent = colors.accent;
  const phone = formatPhone(siteConfig.primaryPhone);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: primary,
          color: "#FFFFFF",
          padding: "76px 84px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 27,
            letterSpacing: 5,
            fontWeight: 600,
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: 99, background: accent }} />
          <div style={{ color: "#FFE7E0" }}>24/7 EMERGENCY RESPONSE</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 82, fontWeight: 800, lineHeight: 1.04 }}>
            Water Damage Restoration
          </div>
          <div style={{ fontSize: 82, fontWeight: 800, lineHeight: 1.04 }}>
            in Kent, WA
          </div>
          <div style={{ width: 132, height: 8, background: accent, marginTop: 28 }} />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 36,
          }}
        >
          <div style={{ fontWeight: 700 }}>{siteConfig.name}</div>
          <div style={{ fontWeight: 700, letterSpacing: 1 }}>{phone}</div>
        </div>
      </div>
    ),
    size
  );
}
