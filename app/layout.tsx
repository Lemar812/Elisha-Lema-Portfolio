import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { brand, siteUrl } from "@/lib/site";
import "./globals.css";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: { default: "Elisha Creatives — Design & Web Development", template: "%s | Elisha Creatives" },
  description: brand.description,
  openGraph: { type: "website", siteName: brand.name, title: brand.name + " — Design & Web Development", description: brand.description, ...(siteUrl ? { images: [{ url: "/brand/social-preview.png", width: 1200, height: 630, alt: brand.name }] } : {}) },
  twitter: { card: "summary_large_image", title: brand.name, description: brand.description, ...(siteUrl ? { images: ["/brand/social-preview.png"] } : {}) },
  icons: { icon: "/brand/Signature-Navy.svg", apple: "/brand/apple-icon.png" },
};
export const viewport: Viewport = { themeColor: "#0b0c10", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const identity = { "@context": "https://schema.org", "@type": "ProfessionalService", name: brand.name, description: brand.description,
    ...(siteUrl ? { url: siteUrl, logo: siteUrl + "/brand/Wordmark-Navy.svg" } : {}),
    email: "elishalema12@gmail.com", telephone: "+255674175613", areaServed: "Tanzania",
    founder: { "@type": "Person", name: "Elisha Lema" }, sameAs: ["https://www.instagram.com/elishacreatives/", "https://github.com/Lemar812"] };
  return <html lang="en" className={geist.variable}><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(identity).replace(/</g, "\\u003c") }} />{children}</body></html>;
}
