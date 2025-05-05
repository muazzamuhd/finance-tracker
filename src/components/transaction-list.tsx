"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Expense } from "./dashboard";
import { formatCurrency } from "@/lib/utils";

interface TransactionListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  compact?: boolean;
}

export default function TransactionList({
  expenses,
  onDelete,
  compact = false,
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      expense.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: "bg-green-100 text-green-800",
      transport: "bg-blue-100 text-blue-800",
      shopping: "bg-purple-100 text-purple-800",
      bills: "bg-amber-100 text-amber-800",
      entertainment: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    };

    return colors[category.toLowerCase()] || colors.other;
  };

  return (
    <div className="space-y-4">
      {!compact && (
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="bills">Bills</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {filteredExpenses.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Category
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-sm">
                    Amount
                  </th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-muted/30">
                    <td className="py-3 px-4 text-sm">
                      {format(new Date(expense.date), "MMM d, yyyy")}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {expense.description || (
                        <span className="text-muted-foreground italic">
                          No description
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          expense.category
                        )}`}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(expense.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          {expenses.length === 0 ? (
            <p>No expenses yet. Add your first expense to get started.</p>
          ) : (
            <p>No expenses match your search criteria.</p>
          )}
        </div>
      )}
    </div>
  );
}
