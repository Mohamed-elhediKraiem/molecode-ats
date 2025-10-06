"use client";

interface Filters {
  title: string;
  society: string;
  date: string;
  status: string;
}

interface Props {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function FiltersPanel({ filters, onFilterChange }: Props) {
  return (
    <aside className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 h-fit sticky top-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Filtres</h3>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Titre"
          value={filters.title}
          onChange={(e) =>
            onFilterChange({ ...filters, title: e.target.value })
          }
          className="rounded-xl bg-gray-100 border border-gray-300 px-3 py-2 text-sm"
        />

        <input
          type="text"
          placeholder="Entreprise"
          value={filters.society}
          onChange={(e) =>
            onFilterChange({ ...filters, society: e.target.value })
          }
          className="rounded-xl bg-gray-100 border border-gray-300 px-3 py-2 text-sm"
        />

        <input
          type="date"
          value={filters.date}
          onChange={(e) => onFilterChange({ ...filters, date: e.target.value })}
          className="rounded-xl bg-gray-100 border border-gray-300 px-3 py-2 text-sm"
        />

        <select
          value={filters.status}
          onChange={(e) =>
            onFilterChange({ ...filters, status: e.target.value })
          }
          className="rounded-xl bg-gray-100 border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="en attente">En attente</option>
          <option value="accepté">Accepté</option>
          <option value="refusé">Refusé</option>
        </select>

        <button
          onClick={() =>
            onFilterChange({ title: "", society: "", date: "", status: "" })
          }
          className="mt-2 bg-purple-600 text-white text-sm py-2 rounded-xl hover:bg-purple-700 transition"
        >
          Réinitialiser
        </button>
      </div>
    </aside>
  );
}
