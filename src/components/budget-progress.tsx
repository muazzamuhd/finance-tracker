"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Budget } from "./dashboard";
import { formatCurrency, formatNumberWithCommas } from "@/lib/utils";

interface BudgetProgressProps {
  spent: number;
  budget: Budget;
  updateBudget: (budget: Budget) => void;
  showEdit?: boolean;
}

export default function BudgetProgress({
  spent,
  budget,
  updateBudget,
  showEdit = false,
}: BudgetProgressProps) {
  const [isEditing, setIsEditing] = useState(showEdit);
  const [newLimit, setNewLimit] = useState(budget.limit.toString());
  const [displayValue, setDisplayValue] = useState(
    formatNumberWithCommas(budget.limit)
  );
  const [newPeriod, setNewPeriod] = useState<"daily" | "weekly" | "monthly">(
    budget.period
  );

  const percentage = (spent / budget.limit) * 100;
  const remaining = budget.limit - spent;

  useEffect(() => {
    setDisplayValue(formatNumberWithCommas(newLimit));
  }, [newLimit]);

  const getProgressColor = () => {
    if (percentage >= 100) return "bg-destructive";
    if (percentage >= 90) return "bg-amber-500";
    if (percentage >= 75) return "bg-amber-400";
    return "bg-primary"; // Using the light blue primary color
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-numeric characters for the actual value
    const rawValue = e.target.value.replace(/[^\d.]/g, "");
    setNewLimit(rawValue);
  };

  const handleSave = () => {
    updateBudget({
      limit: Number.parseFloat(newLimit) || 0,
      period: newPeriod,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}{" "}
            Budget
          </h3>
          {!isEditing ? (
            <div className="flex items-center gap-2">
              <p className="text-2xl font-medium">
                {formatCurrency(budget.limit)}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  setNewLimit(budget.limit.toString());
                  setDisplayValue(formatNumberWithCommas(budget.limit));
                  setNewPeriod(budget.period);
                  setIsEditing(true);
                }}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <div className="flex items-center min-w-[150px]">
                <span className="mr-1">₦</span>
                <Input
                  type="text"
                  value={displayValue}
                  onChange={handleInputChange}
                  className="h-8"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={newPeriod}
                  onValueChange={(value: "daily" | "weekly" | "monthly") =>
                    setNewPeriod(value)
                  }
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleSave} className="h-8">
                  <Save className="h-3 w-3 mr-1" /> Save
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="text-right">
          <h3 className="text-sm font-medium text-muted-foreground">Spent</h3>
          <p className="text-2xl font-medium">{formatCurrency(spent)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} rounded-full transition-all duration-500 ease-in-out`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span
            className={percentage >= 100 ? "text-destructive font-medium" : ""}
          >
            {percentage.toFixed(0)}% used
          </span>
          <span className={remaining < 0 ? "text-destructive font-medium" : ""}>
            {formatCurrency(remaining)} remaining
          </span>
        </div>
      </div>
    </div>
  );
}
