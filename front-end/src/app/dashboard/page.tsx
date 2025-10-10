"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import DonutChart from "../components/DonutChart";
import ApplicationTrends from "../components/LineChart";
import KpiCard from "../components/KpiCard";
import OffersTable from "../components/OffersTable";
import FiltersPanel from "../components/FiltersPanel";
import { BarChart3 } from "lucide-react";

const getStatutBadge = (status: string) => {
  switch (status) {
    case "accepté":
      return "bg-green-100 text-green-700 border border-green-300";
    case "refusé":
      return "bg-red-100 text-red-700 border border-red-300";
    case "en attente":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
};

export default function Home() {
  const [offers, setOffers] = useState<any[]>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    enAttente: 0,
    accepte: 0,
    refuse: 0,
  });
  const [filters, setFilters] = useState({
    title: "",
    society: "",
    date: "",
    status: "",
  });

  // ✅ Récupération de l'utilisateur connecté
  const { user } = useUser();

  // --- Récupération des offres ---
  const fetchOffers = async (page: number, limit: number, filters: any) => {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      title: filters.title || "",
      society: filters.society || "",
      date: filters.date || "",
      status: filters.status || "",
    });

    const res = await fetch(`/api/posts?${query.toString()}`);
    const result = await res.json();
    setOffers(result.data);
    setTotalPages(result.meta.totalPages);
  };

  // --- Récupération des stats ---
  const fetchStats = async (filters: any) => {
    const query = new URLSearchParams({
      title: filters.title || "",
      society: filters.society || "",
      date: filters.date || "",
      status: filters.status || "",
    });

    const res = await fetch(`/api/posts/stats?${query.toString()}`);
    const result = await res.json();
    setStats(result);
  };

  // ⚡ Rechargement auto quand filtres changent
  useEffect(() => {
    fetchOffers(page, limit, filters);
    fetchStats(filters);
  }, [
    page,
    limit,
    filters.title,
    filters.society,
    filters.date,
    filters.status,
  ]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-display text-[#333]">
      <main className="max-w-[100rem] mx-auto p-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Filtres latéraux */}
        <aside className="hidden lg:block sticky top-6 h-fit">
          <FiltersPanel filters={filters} onFilterChange={setFilters} />
        </aside>

        {/* Contenu principal */}
        <section className="flex flex-col gap-8">
          {/* ✅ Titre avec avatar utilisateur */}
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-gray-900 -mb-8">
            <BarChart3 className="w-8 h-8 text-[#6A0572]" />

            <span className="flex items-center gap-3">
              Dashboard de{" "}
              <span className="text-[#6A0572]">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName ?? ""}`
                  : user?.username ?? "Utilisateur"}
              </span>
              {/* Avatar utilisateur Clerk */}
              {user?.imageUrl && (
                <Image
                  src={user.imageUrl}
                  alt={`${user.firstName ?? "User"}'s avatar`}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              )}
            </span>
          </h1>

          {/* KPI Cards */}
          <h2 className="text-2xl font-extrabold text-gray-900 border-l-4 border-[#6A0572] pl-3">
            Indicateurs clés
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="Total candidatures"
              value={stats.total}
              color="#6A0572"
              bgColor="#F3E8FF"
              spinSpeed="2s"
            />
            <KpiCard
              title="En attente"
              value={stats.enAttente}
              color="#FF8C00"
              bgColor="#FFF7E6"
              spinSpeed="2s"
            />
            <KpiCard
              title="Acceptées"
              value={stats.accepte}
              color="#22C55E"
              bgColor="#DCFCE7"
              spinSpeed="2s"
            />
            <KpiCard
              title="Refusées"
              value={stats.refuse}
              color="#EF4444"
              bgColor="#FEE2E2"
              spinSpeed="2s"
            />
          </div>

          {/* Graphiques */}
          <h2 className="text-2xl font-extrabold text-gray-900 border-l-4 border-[#6A0572] pl-3">
            Analyse des candidatures
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DonutChart filters={filters} />
            <ApplicationTrends filters={filters} />
          </div>

          {/* Tableau */}
          <h2 className="text-2xl font-extrabold text-gray-900 border-l-4 border-[#6A0572] pl-3">
            Détail des candidatures
          </h2>
          <OffersTable filters={filters} limit={limit} setLimit={setLimit} />
        </section>
      </main>
    </div>
  );
}
