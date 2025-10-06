"use client";
import { useEffect, useState } from "react";
import DonutChart from "./components/DonutChart";
import ApplicationTrends from "./components/LineChart";
import KpiCard from "./components/KpiCard";
import OffersTable from "./components/OffersTable";
import FiltersPanel from "./components/FiltersPanel";
import { BarChart3, Briefcase } from "lucide-react";

// ---- Styles utilitaires ---- //
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

  // Stats globales
  const [stats, setStats] = useState({
    total: 0,
    enAttente: 0,
    accepte: 0,
    refuse: 0,
  });

  // Filtres
  const [filters, setFilters] = useState({
    title: "",
    society: "",
    date: "",
    status: "",
  });

  // Récupération des offres (avec pagination + filtres)
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

  // Récupération des stats (avec filtres)
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

  // ⚡ Recharge offres + stats quand filtres changent
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

  const handleFilterChange = (updatedFilters: any) => {
    setFilters(updatedFilters);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-display text-[#333]">
      <main className="max-w-[100rem] mx-auto p-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Panneau de filtres latéral */}
        <aside className="hidden lg:block sticky top-6 h-fit">
          <FiltersPanel filters={filters} onFilterChange={setFilters} />
        </aside>

        {/* Contenu principal */}
        <section className="flex flex-col gap-8">
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-gray-900">
            <BarChart3 className="w-8 h-8 text-[#6A0572]" />
            <span>Dashboard : Suivi des candidatures</span>
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
              spinSpeed="2.5s"
            />
            <KpiCard
              title="Acceptées"
              value={stats.accepte}
              color="#22C55E"
              bgColor="#DCFCE7"
              spinSpeed="3s"
            />
            <KpiCard
              title="Refusées"
              value={stats.refuse}
              color="#EF4444"
              bgColor="#FEE2E2"
              spinSpeed="3.5s"
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
