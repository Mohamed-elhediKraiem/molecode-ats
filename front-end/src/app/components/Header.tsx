"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Nouvelle candidature", href: "/new" },
  ];

  if (!isSignedIn) return null;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-white px-6 shadow-md border-b border-gray-100">
      {/* --- Logo + titre --- */}
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="MoleCode Logo"
          width={50}
          height={50}
          className="rounded-md"
        />
        <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">
          MoleCode <span className="text-purple-700">ATS</span>
        </h1>
      </div>

      {/* --- Navigation principale --- */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors ${
                isActive
                  ? "text-purple-700 font-semibold border-b-2 border-purple-700 pb-1"
                  : "text-gray-600 hover:text-purple-700"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* --- Zone utilisateur (avatar Clerk) --- */}
      <div className="flex items-center">
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
