import Image from "next/image";
export function BrandLogo({ white = false, signature = false, className = "" }: { white?: boolean; signature?: boolean; className?: string }) {
  return <Image src={`/brand/${signature ? "Signature" : "Wordmark"}-${white ? "White" : "Navy"}.svg`} alt={signature ? "" : "Elisha Creatives"} width={signature ? 600 : 1800} height={signature ? 600 : 800} className={className} priority={!signature} />;
}
