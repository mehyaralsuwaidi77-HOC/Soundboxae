import Header from "./Header";
import Footer from "./Footer";
import AIChat from "@/components/AIChat";
import FloatingTabs from "@/components/ui/FloatingTabs";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingTabs />
      <AIChat />
    </>
  );
}
