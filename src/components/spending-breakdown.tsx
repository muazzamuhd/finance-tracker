"use client";

import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import type { Expense } from "./dashboard";

interface SpendingBreakdownProps {
  expenses: Expense[];
}

export default function SpendingBreakdown({
  expenses,
}: SpendingBreakdownProps) {
  // const COLORS = [
  //   "#4dabf7",
  //   "#339af0",
  //   "#228be6",
  //   "#1c7ed6",
  //   "#1971c2",
  //   "#1864ab",
  //   "#0c8599",
  //   "#099268",
  //   "#2b8a3e",
  //   "#5c940d",
  //   "#e67700",
  // ];
  const COLORS = [
    "#FF6384", // Red
    "#36A2EB", // Blue
    "#4BC0C0", // Teal
    "#FFCE56", // Yellow
    "#9966FF", // Purple
    "#2ecc71", // Green
    "#f39c12", // Orange
    "#e74c3c", // Strong Red
    "#1abc9c", // Aqua
    "#8e44ad", // Deep Purple
    "#c0392b", // Dark Red
  ];

  const data = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((expense) => {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">
          Add expenses to see your spending breakdown
        </p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const customTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as { name: string; value: number };
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p>{formatCurrency(data.value)}</p>
          <p className="text-muted-foreground text-sm">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#4dabf7"
            dataKey="value"
            nameKey="name"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie> */}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
            nameKey="name"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={customTooltip} />
          <Legend
            formatter={(value, entry, index) => {
              const item = data[index];
              const percentage = ((item.value / total) * 100).toFixed(1);
              return `${value} (${percentage}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
