"use client";

interface KpiCardProps {
  title: string;
  value: number;
  color: string;
  bgColor: string;
  spinSpeed?: string;
}

export default function KpiCard({
  title,
  value,
  color,
  bgColor,
  spinSpeed = "2s",
}: KpiCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-200 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02] duration-300">
      <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 relative`}
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-4xl font-extrabold" style={{ color: color }}>
          {value}
        </span>
        <div
          className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin-slow"
          style={{
            borderColor: `${color} transparent ${color} transparent`,
            animation: `spin ${spinSpeed} linear`,
          }}
        ></div>
      </div>
      <p className="text-lg font-bold text-gray-900">
        {value} {title.toLowerCase()}
      </p>
    </div>
  );
}
