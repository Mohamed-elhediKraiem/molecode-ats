"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Offer {
  id: string;
  title: string;
  society: string;
  creationDate: string;
  url: string;
  status: string;
}

interface Filters {
  title: string;
  society: string;
  date: string;
  status: string;
}

interface OffersTableProps {
  filters: Filters;
  limit: number;
  setLimit: (value: number) => void;
}

const getStatutBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "accepté":
      return "bg-green-100 text-green-700 border border-green-300";
    case "refusé":
    case "refus":
      return "bg-red-100 text-red-700 border border-red-300";
    case "en attente":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
};

export default function OffersTable({
  filters,
  limit,
  setLimit,
}: OffersTableProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // --- Récupération des offres depuis l'API ---
  const fetchOffers = async () => {
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
    fetchOffers();
  }, [page, limit, filters]);

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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
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
          <AnimatePresence>
            {offers.length > 0 ? (
              offers.map((offer) => (
                <motion.tr
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition"
                >
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
                </motion.tr>
              ))
            ) : (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 italic"
                >
                  Aucune candidature trouvée avec ces filtres.
                </td>
              </motion.tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 text-sm text-gray-600 gap-3">
        <span>
          Page {page} / {totalPages} — {offers.length} affichées sur {total}
        </span>
        <div className="flex items-center gap-3">
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
    </div>
  );
}
