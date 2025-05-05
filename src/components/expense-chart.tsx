"use client";

import { useState, useMemo } from "react";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
} from "date-fns";
import type { Expense } from "./dashboard";
import { formatCurrency } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Import directly from recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface ExpenseChartProps {
  expenses: Expense[];
  interactive?: boolean;
}

export default function ExpenseChart({
  expenses,
  interactive = false,
}: ExpenseChartProps) {
  const [chartType, setChartType] = useState<"bar" | "pie" | "line" | "area">(
    "bar"
  );
  const [timeRange, setTimeRange] = useState<
    "7days" | "30days" | "month" | "custom"
  >("30days");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    expenses.forEach((expense) => uniqueCategories.add(expense.category));
    return Array.from(uniqueCategories);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const matchesCategory =
        categoryFilter === "all" || expense.category === categoryFilter;

      let startDate: Date;
      let endDate = new Date();

      if (timeRange === "custom") {
        startDate = dateRange.from;
        endDate = dateRange.to;
      } else if (timeRange === "7days") {
        startDate = subDays(endDate, 7);
      } else if (timeRange === "30days") {
        startDate = subDays(endDate, 30);
      } else {
        startDate = startOfMonth(endDate);
        endDate = endOfMonth(endDate);
      }

      const matchesDate = expenseDate >= startDate && expenseDate <= endDate;

      return matchesCategory && matchesDate;
    });
  }, [expenses, categoryFilter, timeRange, dateRange]);

  const chartData = useMemo(() => {
    let startDate: Date;
    let endDate = new Date();

    if (timeRange === "custom") {
      startDate = dateRange.from;
      endDate = dateRange.to;
    } else if (timeRange === "7days") {
      startDate = subDays(endDate, 7);
    } else if (timeRange === "30days") {
      startDate = subDays(endDate, 30);
    } else {
      startDate = startOfMonth(endDate);
      endDate = endOfMonth(endDate);
    }

    if (chartType === "pie") {
      const categoryTotals: Record<string, number> = {};

      filteredExpenses.forEach((expense) => {
        categoryTotals[expense.category] =
          (categoryTotals[expense.category] || 0) + expense.amount;
      });

      return Object.entries(categoryTotals)
        .map(([category, amount]) => ({
          category,
          amount,
        }))
        .sort((a, b) => b.amount - a.amount);
    } else {
      const days = eachDayOfInterval({ start: startDate, end: endDate });

      return days.map((day) => {
        const dayExpenses = filteredExpenses.filter((expense) =>
          isSameDay(parseISO(expense.date), day)
        );

        const total = dayExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );

        return {
          date: format(day, "MMM dd"),
          amount: total,
          // Add individual category amounts for stacked charts
          ...categories.reduce((acc, category) => {
            acc[category] = dayExpenses
              .filter((expense) => expense.category === category)
              .reduce((sum, expense) => sum + expense.amount, 0);
            return acc;
          }, {} as Record<string, number>),
        };
      });
    }
  }, [filteredExpenses, chartType, timeRange, dateRange, categories]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A569BD",
    "#5DADE2",
    "#27AE60",
    "#F1C40F",
    "#E74C3C",
  ];

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          angle={-45}
          textAnchor="end"
          height={60}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickFormatter={(value) =>
            formatCurrency(value, { notation: "compact" })
          }
          width={60}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), "Amount"]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        {categoryFilter === "all" ? (
          <Bar
            dataKey="amount"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        ) : (
          <Bar
            dataKey="amount"
            name={categoryFilter}
            fill={COLORS[categories.indexOf(categoryFilter) % COLORS.length]}
            radius={[4, 4, 0, 0]}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          angle={-45}
          textAnchor="end"
          height={60}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickFormatter={(value) =>
            formatCurrency(value, { notation: "compact" })
          }
          width={60}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), "Amount"]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        {categoryFilter === "all" ? (
          <Line
            type="monotone"
            dataKey="amount"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ) : (
          <Line
            type="monotone"
            dataKey="amount"
            name={categoryFilter}
            stroke={COLORS[categories.indexOf(categoryFilter) % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );

  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          angle={-45}
          textAnchor="end"
          height={60}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickFormatter={(value) =>
            formatCurrency(value, { notation: "compact" })
          }
          width={60}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), "Amount"]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        {categoryFilter === "all" ? (
          <Area
            type="monotone"
            dataKey="amount"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary) / 0.2)"
          />
        ) : (
          <Area
            type="monotone"
            dataKey="amount"
            name={categoryFilter}
            stroke={COLORS[categories.indexOf(categoryFilter) % COLORS.length]}
            fill={`${
              COLORS[categories.indexOf(categoryFilter) % COLORS.length]
            }33`}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="amount"
          nameKey="category"
          label={({ category, percent }) =>
            `${category}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="space-y-4">
      {interactive && (
        <div className="flex flex-wrap gap-3 justify-between">
          <div className="flex flex-wrap gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {timeRange === "custom" ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to });
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <Select
                value={timeRange}
                onValueChange={(
                  value: "7days" | "30days" | "month" | "custom"
                ) => setTimeRange(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <Select
            value={chartType}
            onValueChange={(value: "bar" | "pie" | "line" | "area") =>
              setChartType(value)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {filteredExpenses.length > 0 ? (
        <>
          {chartType === "bar" && renderBarChart()}
          {chartType === "line" && renderLineChart()}
          {chartType === "area" && renderAreaChart()}
          {chartType === "pie" && renderPieChart()}
        </>
      ) : (
        <div className="h-[300px] flex items-center justify-center border rounded-lg">
          <p className="text-muted-foreground">
            No expenses match your criteria
          </p>
        </div>
      )}
    </div>
  );
}
