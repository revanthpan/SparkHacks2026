"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { TrustScoreBreakdown } from "@/types";

type TrustScoreChartProps = {
  breakdown: TrustScoreBreakdown;
};

export function TrustScoreChart({ breakdown }: TrustScoreChartProps) {
  const data = [
    { name: "Shipping", score: breakdown.shippingScore },
    { name: "Reputation", score: breakdown.reputationScore },
    { name: "Driver", score: breakdown.driverScore },
  ];

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, left: -20, right: 0, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: "rgba(15, 23, 42, 0.08)" }}
            formatter={(value: number) => [`${value}`, "Score"]}
          />
          <Bar dataKey="score" fill="#0f172a" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
