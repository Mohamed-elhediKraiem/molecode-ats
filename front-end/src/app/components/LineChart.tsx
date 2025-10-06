"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Filters {
  title: string;
  society: string;
  date: string;
  status: string;
}

export default function ApplicationTrends({ filters }: { filters: Filters }) {
  const [data, setData] = useState<{ date: string; applications: number }[]>(
    []
  );

  const fetchApplicationsByDate = async () => {
    try {
      const query = new URLSearchParams({
        title: filters.title || "",
        society: filters.society || "",
        date: filters.date || "",
        status: filters.status || "",
      });

      const res = await fetch(`/api/posts/by-date?${query.toString()}`);
      const result = await res.json();

      const chartData = result.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
        }),
        applications: item.count,
      }));

      setData(chartData);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  };

  useEffect(() => {
    fetchApplicationsByDate();
  }, [filters]);

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
        Candidatures par jour
      </h3>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
              minTickGap={10}
            />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value) => [`${value} candidatures`, "Total"]}
              labelFormatter={(label) => `Date : ${label}`}
            />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#6A0572"
              strokeWidth={3}
              dot={{ r: 4, fill: "#6A0572" }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
