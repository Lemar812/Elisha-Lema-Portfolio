import DesktopHome from "@/studio/components/os/DesktopHome";
import type { Metadata } from "next";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return <DesktopHome />;
}
