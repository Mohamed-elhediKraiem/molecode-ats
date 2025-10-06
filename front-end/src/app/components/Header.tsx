"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Nouvelle candidature", href: "/new" },
  ];

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

      {/* --- Navigation --- */}
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

      {/* --- Avatar utilisateur --- 
      <div className="flex items-center gap-4">
        <Image
          src="/avatar.png"
          alt="Utilisateur MoleCode"
          width={36}
          height={36}
          className="rounded-full border-2 border-purple-600 cursor-pointer hover:scale-110 transition-transform"
        />
      </div>
      */}
    </header>
  );
}
