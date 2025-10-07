import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";

// Police Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "MoleCode - ATS",
  description: "L'application de suivi de mes candidatures",
  icons: {
    icon: "/logo.png",
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
        <Header />

        {/* Contenu principal */}
        <main className="p-6">{children}</main>

        {/* Toaster global (notifications) */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              borderRadius: "12px",
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
