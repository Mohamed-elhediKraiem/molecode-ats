import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Police Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "MoleCode - ATS",
  description: "L'application de suivi de mes candidatures",
  icons: {
    icon: "/favicon.ico", // doit être dans /public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="bg-[#F5F7FA] text-text-light font-display antialiased">
        {/* Header global */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-6 shadow-md rounded-b-xl">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl rotate-12">
              work
            </span>
            <h1 className="text-lg font-bold text-gray-900">MoleCode - ATS</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a
              className="text-primary hover:text-primary/80 transition-colors"
              href="#"
            >
              Dashboard
            </a>
            <a
              className="text-gray-600 hover:text-primary transition-colors"
              href="#"
            >
              Applications
            </a>
            <a
              className="text-gray-600 hover:text-primary transition-colors"
              href="#"
            >
              Ressources
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <img
              src="/avatar.png" // place un avatar test dans /public
              alt="User"
              className="h-9 w-9 rounded-full border-2 border-primary cursor-pointer hover:scale-110 transition-transform"
            />
          </div>
        </header>

        {/* Contenu de la page */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
