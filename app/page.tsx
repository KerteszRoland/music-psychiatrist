import { AnalyzePage } from "@/components/analyze-page";
import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Analyze Song Lyrics",
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl("/"),
  },
  twitter: {
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function Home() {
  return <AnalyzePage />;
}
