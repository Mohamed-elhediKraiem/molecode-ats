"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  // 🔁 Si l'utilisateur est déjà connecté → redirection automatique
  useEffect(() => {
    if (isSignedIn) router.push("/dashboard");
  }, [isSignedIn]);

  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-center">
      <Image
        src="/logo.png"
        alt="MoleCode Logo"
        width={500}
        height={500}
        className="rounded-md mb-10"
      />
      <h1 className="text-4xl font-bold mb-4">
        Bienvenue sur MoleCode <span className="text-purple-700">ATS</span> 👋
      </h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Gérez toutes vos candidatures simplement. Connectez-vous pour accéder à
        votre espace personnel.
      </p>

      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          Se connecter
        </Link>
        <Link
          href="/sign-up"
          className="px-6 py-3 border border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition"
        >
          S’inscrire
        </Link>
      </div>
    </main>
  );
}
