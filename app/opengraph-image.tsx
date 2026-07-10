import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #1a1528 0%, #2d1f4e 50%, #1a1528 100%)",
          color: "#f5f3ff",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#c4b5fd",
            marginBottom: 16,
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 30,
            lineHeight: 1.4,
            color: "#ddd6fe",
            maxWidth: 820,
          }}
        >
          {siteConfig.description}
        </div>
      </div>
    ),
    size,
  );
}
