"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Filters {
  title: string;
  society: string;
  date: string;
  status: string;
}

const COLORS = [
  "#6A0572",
  "#FF8C00",
  "#00BFFF",
  "#22C55E",
  "#EF4444",
  "#8B5CF6",
  "#E9D416",
];

export default function DonutChart({ filters }: { filters: Filters }) {
  const [data, setData] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [total, setTotal] = useState(0);

  const fetchApplicationsByDay = async () => {
    try {
      const query = new URLSearchParams({
        title: filters.title || "",
        society: filters.society || "",
        date: filters.date || "",
        status: filters.status || "",
      });

      const res = await fetch(`/api/posts/by-day?${query.toString()}`);
      const result = await res.json();

      const chartData = result.data.map(
        (item: { name: string; value: number }, i: number) => ({
          ...item,
          color: COLORS[i % COLORS.length],
        })
      );

      setData(chartData);
      setTotal(result.total);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  };

  useEffect(() => {
    fetchApplicationsByDay();
  }, [filters]);

  // Calcul du pourcentage
  const getPercentage = (value: number) =>
    total > 0 ? ((value / total) * 100).toFixed(1) : "0";

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Activité de candidature par jour
      </h3>

      {/* Layout : Donut à gauche / légende à droite */}
      <div className="flex items-center justify-between">
        {/* Donut */}
        <div className="relative w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Total au centre */}
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-gray-900">
            {total}
          </div>
        </div>

        {/* Légende à droite */}
        <div className="w-1/2 flex flex-col gap-3 pl-6">
          {data.map(
            (item) =>
              item.value > 0 && (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-sm text-gray-700">
                    {item.name} - {item.value}
                    <span className="font-medium text-gray-600">
                      {" (" + getPercentage(item.value) + "%)"}
                    </span>
                  </span>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
