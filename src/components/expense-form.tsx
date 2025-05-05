"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumberWithCommas } from "@/lib/utils";
import {
  Car,
  Film,
  GraduationCap,
  Home,
  Lightbulb,
  MoreHorizontal,
  Receipt,
  ShoppingBag,
  Stethoscope,
  Utensils,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import type { Expense } from "./dashboard";

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, "id">) => void;
  onCancel: () => void;
}

export default function ExpenseForm({ onSubmit, onCancel }: ExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-numeric characters for the actual value
    const rawValue = e.target.value.replace(/[^\d.]/g, "");
    setAmount(rawValue);
    setDisplayAmount(formatNumberWithCommas(rawValue));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category) return;

    onSubmit({
      amount: Number.parseFloat(amount),
      category,
      description,
      date: new Date().toISOString(),
    });
  };

  const categoryOptions = [
    {
      value: "Food",
      label: "Food",
      icon: <Utensils className="h-4 w-4 mr-2" />,
    },
    {
      value: "Transport",
      label: "Transport",
      icon: <Car className="h-4 w-4 mr-2" />,
    },
    {
      value: "Shopping",
      label: "Shopping",
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
    },
    {
      value: "Bills",
      label: "Bills",
      icon: <Receipt className="h-4 w-4 mr-2" />,
    },
    {
      value: "Entertainment",
      label: "Entertainment",
      icon: <Film className="h-4 w-4 mr-2" />,
    },
    {
      value: "Education",
      label: "Education",
      icon: <GraduationCap className="h-4 w-4 mr-2" />,
    },
    {
      value: "Data Recharge",
      label: "Data Recharge",
      icon: <Wifi className="h-4 w-4 mr-2" />,
    },
    {
      value: "Housing",
      label: "Housing",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      value: "Healthcare",
      label: "Healthcare",
      icon: <Stethoscope className="h-4 w-4 mr-2" />,
    },
    {
      value: "Utilities",
      label: "Utilities",
      icon: <Lightbulb className="h-4 w-4 mr-2" />,
    },
    {
      value: "Other",
      label: "Other",
      icon: <MoreHorizontal className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (₦)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">₦</span>
          <Input
            id="amount"
            type="text"
            placeholder="0.00"
            value={displayAmount}
            onChange={handleAmountChange}
            className="pl-8"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger id="category" className="">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  {option.icon}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          placeholder="What was this expense for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Expense</Button>
      </div>
    </form>
  );
}
