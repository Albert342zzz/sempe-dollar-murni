import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/Chat/ChatWidget";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-terracotta focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Lewati ke konten
      </a>
      <Header />
      <main id="konten" className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
