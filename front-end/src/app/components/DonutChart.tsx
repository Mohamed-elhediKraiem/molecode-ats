"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Applied", value: 50, color: "#6A0572" }, // violet
  { name: "Interviewing", value: 30, color: "#FF8C00" }, // orange
  { name: "Scheduled", value: 10, color: "#00BFFF" }, // bleu clair
  { name: "Rejected", value: 8, color: "#EF4444" }, // rouge
  { name: "Offers", value: 2, color: "#22C55E" }, // vert
];

export default function DonutChart() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Application Status Breakdown
      </h3>

      {/* Layout en 2 colonnes */}
      <div className="flex items-center justify-between">
        {/* Donut Chart */}
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
          {/* Valeur totale au centre */}
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-gray-900">
            120
          </div>
        </div>

        {/* Légende */}
        <div className="w-1/2 flex flex-col gap-3 pl-6">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-sm text-gray-700">
                {item.name} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
