import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

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
    <ClerkProvider
      appearance={{
        layout: {
          // ✅ Apparence générale du formulaire Clerk
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
        },
        variables: {
          colorPrimary: "#7e22ce", // équivalent à bg-purple-600
          colorText: "#1f2937", // text-gray-800
          colorBackground: "#ffffff",
          // borderRadius: "0.75rem", // arrondi xl
          fontSize: "16px",
        },
        elements: {
          // 🎨 --- Conteneur global
          rootBox: "flex justify-center items-center00 bg-[#F5F7FA] font-display",

          // 🎨 --- Carte principale (le bloc de connexion)
          card: "shadow-xl border border-gray-200 bg-white rounded-2xl p-6 sm:p-8",

          // 🎨 --- Titres et textes
          headerTitle: "text-2xl font-extrabold text-gray-900 mb-1",
          headerSubtitle: "text-gray-600 mb-4 text-base",

          // 🎨 --- Champs de formulaire
          formFieldInput:
            "border border-gray-300 rounded-lg px-3 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition text-gray-800",
          formFieldLabel: "text-gray-700 font-medium mb-1",
          formFieldInputShowPasswordButton: "text-purple-600",

          // 🎨 --- Boutons principaux
          formButtonPrimary:
            "bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 text-base font-semibold transition w-full mt-2",

          // 🎨 --- Liens
          footerActionLink:
            "text-purple-600 hover:text-purple-700 font-semibold",
          formFieldAction: "text-purple-600 hover:text-purple-700",

          // 🎨 --- Messages d’erreur / succès
          alert:
            "rounded-xl border text-sm p-3 mt-2 border-red-300 bg-red-50 text-red-700",

          // 🎨 --- Boutons sociaux
          socialButtonsIconButton:
            "border-gray-300 rounded-lg hover:bg-gray-100 transition",
        },
      }}
    >
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
    </ClerkProvider>
  );
}
