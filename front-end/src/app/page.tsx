"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [offers, setOffers] = useState<any[]>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filtres
  const [filters, setFilters] = useState({
    title: "",
    society: "",
    date: "",
    status: "",
  });

  // Fonction de récupération des données avec filtres
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
    setTotal(result.meta.total);
  };

  useEffect(() => {
    fetchOffers(page, limit, filters);
  }, [
    page,
    limit,
    filters.title,
    filters.society,
    filters.date,
    filters.status,
  ]);
  const getSiteName = (url: string) => {
    try {
      let domain = new URL(url).hostname;
      domain = domain.replace(/^www\./, "");
      const name = domain.split(".")[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
      return "Inconnu";
    }
  };

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case "accepté":
        return "bg-green-600 text-white";
      case "refusé":
        return "bg-red-600 text-white";
      default:
        return "bg-yellow-500 text-black";
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-6 ml-12">MoleCode - ATS</h1>

      {/* Sélecteur du nombre d’éléments */}
      <div className="ml-12 mb-4 flex items-center gap-4">
        <label className="text-gray-700 text-xl">Afficher :</label>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="bg-white border border-gray-400 rounded px-2 py-1 text-xl text-gray-900"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="ml-12 w-[70%] overflow-hidden rounded-lg shadow-lg border border-gray-300">
        <table className="min-w-full divide-y divide-gray-300 table-fixed">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xl font-semibold text-gray-700 w-[220px]">
                Titre du poste
              </th>
              <th className="px-4 py-3 text-left text-xl font-semibold text-gray-700 w-[160px]">
                Entreprise
              </th>
              <th className="px-4 py-3 text-left text-xl font-semibold text-gray-700 w-[120px]">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xl font-semibold text-gray-700 w-[140px]">
                Site
              </th>
              <th className="px-4 py-3 text-left text-xl font-semibold text-gray-700 w-[120px]">
                Statut
              </th>
            </tr>
            {/* Ligne des filtres */}
            <tr className="bg-gray-100">
              <th className="px-2 py-2">
                <input
                  type="text"
                  placeholder="Filtrer titre"
                  value={filters.title}
                  onChange={(e) =>
                    setFilters({ ...filters, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </th>
              <th className="px-2 py-2">
                <input
                  type="text"
                  placeholder="Filtrer entreprise"
                  value={filters.society}
                  onChange={(e) =>
                    setFilters({ ...filters, society: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </th>
              <th className="px-2 py-2">
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) =>
                    setFilters({ ...filters, date: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </th>
              <th></th>
              <th className="px-2 py-2">
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="">Tous</option>
                  <option value="en attente">En attente</option>
                  <option value="accepté">Accepté</option>
                  <option value="refusé">Refusé</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {offers.map((offer) => (
              <tr
                key={offer.id}
                className="hover:bg-gray-100 transition-colors"
              >
                <td className="px-4 py-3 text-xl" title={offer.title}>
                  {truncateText(offer.title, 25)}
                </td>
                <td
                  className="px-4 py-3 text-xl text-gray-700"
                  title={offer.society}
                >
                  {truncateText(offer.society, 20)}
                </td>
                <td className="px-4 py-3 text-xl text-gray-500 whitespace-nowrap">
                  {new Date(offer.creationDate).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3 text-xl truncate" title={offer.url}>
                  <a
                    href={offer.url}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-400 underline"
                  >
                    {getSiteName(offer.url)}
                  </a>
                </td>
                <td className="px-4 py-3 text-xl">
                  <span
                    className={`rounded px-2 py-1 text-xl font-semibold ${getStatutStyle(
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
      </div>

      {/* Pagination */}
      <div className="ml-12 mt-4 flex items-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          ⬅️ Précédent
        </button>
        <span className="text-gray-700 text-lg">
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Suivant ➡️
        </button>
      </div>

      <p className="ml-12 mt-3 text-gray-600 text-xl">
        Affichage de {offers.length} sur {total} candidatures
      </p>
    </div>
  );
}
