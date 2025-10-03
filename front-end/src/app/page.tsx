"use client";
import { useEffect, useState } from "react";
import DonutChart from "./components/DonutChart";
import ApplicationTrends from "./components/LineChart";

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

  const truncateText = (text: string, maxLength: number) =>
    text && text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const getSiteName = (url: string) => {
    try {
      let domain = new URL(url).hostname;
      domain = domain.replace(/^www\./, "");
      return (
        domain.split(".")[0].charAt(0).toUpperCase() +
        domain.split(".")[0].slice(1)
      );
    } catch {
      return "Inconnu";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-display text-[#333]">
      <main className="p-6 max-w-7xl mx-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total candidatures */}
          <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-200 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">
              Total candidatures
            </p>
            <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4 relative">
              <span className="text-4xl font-extrabold text-purple-700">
                {stats.total}
              </span>
              <div
                className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin-slow"
                style={{
                  borderColor: "#6A0572 transparent #6A0572 transparent",
                  animation: "spin 2s linear infinite",
                }}
              ></div>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {stats.total} Candidatures
            </p>
          </div>

          {/* En attente */}
          <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-200 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">En attente</p>
            <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center mb-4 relative">
              <span className="text-4xl font-extrabold text-yellow-500">
                {stats.enAttente}
              </span>
              <div
                className="absolute inset-0 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin-slow"
                style={{
                  borderColor: "#FF8C00 transparent #FF8C00 transparent",
                  animation: "spin 2.5s linear infinite reverse",
                }}
              ></div>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {stats.enAttente} En attente
            </p>
          </div>

          {/* Acceptées */}
          <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-200 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Acceptées</p>
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4 relative">
              <span className="text-4xl font-extrabold text-green-600">
                {stats.accepte}
              </span>
              <div
                className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin-slow"
                style={{
                  borderColor: "#22C55E transparent #22C55E transparent",
                  animation: "spin 3s linear infinite",
                }}
              ></div>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {stats.accepte} Acceptées
            </p>
          </div>

          {/* Refusées */}
          <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-200 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Refusées</p>
            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4 relative">
              <span className="text-4xl font-extrabold text-red-600">
                {stats.refuse}
              </span>
              <div
                className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin-slow"
                style={{
                  borderColor: "#EF4444 transparent #EF4444 transparent",
                  animation: "spin 3.5s linear infinite reverse",
                }}
              ></div>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {stats.refuse} Refusées
            </p>
          </div>
        </div>
        {/* 📊 Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DonutChart />
          <ApplicationTrends />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Filters */}
          <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-200">
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Titre"
                value={filters.title}
                onChange={(e) =>
                  setFilters({ ...filters, title: e.target.value })
                }
                className="rounded-xl bg-gray-100 border border-gray-300 px-3 py-2 text-sm w-full md:w-48"
              />
              <input
                type="text"
                placeholder="Entreprise"
                value={filters.society}
                onChange={(e) =>
                  setFilters({ ...filters, society: e.target.value })
                }
                className="rounded-xl bg-gray-100 border border-gray-300 px-3 py-2 text-sm w-full md:w-48"
              />
              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
                className="rounded-xl bg-gray-100 border border-gray-300 px-3 py-2 text-sm"
              />
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="rounded-xl bg-gray-100 border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Statut</option>
                <option value="en attente">En attente</option>
                <option value="accepté">Accepté</option>
                <option value="refusé">Refusé</option>
              </select>
            </div>
            <div>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-xl bg-gray-100 border border-gray-300 px-3 py-2 text-sm"
              >
                <option value={10}>10 lignes</option>
                <option value={20}>20 lignes</option>
                <option value={50}>50 lignes</option>
                <option value={100}>100 lignes</option>
              </select>
            </div>
          </div>

          {/* Data table */}
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left font-semibold text-gray-600">
                  Titre
                </th>
                <th className="py-3 px-6 text-left font-semibold text-gray-600">
                  Entreprise
                </th>
                <th className="py-3 px-6 text-left font-semibold text-gray-600">
                  Date
                </th>
                <th className="py-3 px-6 text-left font-semibold text-gray-600">
                  Site
                </th>
                <th className="py-3 px-6 text-left font-semibold text-gray-600">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-6">{truncateText(offer.title, 30)}</td>
                  <td className="py-3 px-6">
                    {truncateText(offer.society, 20)}
                  </td>
                  <td className="py-3 px-6 text-gray-500">
                    {new Date(offer.creationDate).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-3 px-6 text-purple-600">
                    <a
                      href={offer.url}
                      target="_blank"
                      className="hover:underline"
                    >
                      {getSiteName(offer.url)}
                    </a>
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatutBadge(
                        offer.status
                      )}`}
                    >
                      {offer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 text-sm text-gray-600">
            <span>
              Page {page} / {totalPages} – {offers.length} affichées sur{" "}
              {stats.total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
              >
                ◀
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
