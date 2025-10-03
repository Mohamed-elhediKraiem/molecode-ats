"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", applications: 60 },
  { month: "Feb", applications: 75 },
  { month: "Mar", applications: 40 },
  { month: "Apr", applications: 85 },
  { month: "May", applications: 50 },
  { month: "Jun", applications: 90 },
];

export default function ApplicationTrends() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
        Application Trends
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#6A0572"
              strokeWidth={3}
              dot={{ r: 5, fill: "#6A0572" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
