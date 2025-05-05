// "use client";

// import { useState, useEffect } from "react";
// import {
//   Plus,
//   Bell,
//   Home,
//   Utensils,
//   Car,
//   ShoppingBag,
//   Receipt,
//   Film,
//   GraduationCap,
//   Wifi,
//   Stethoscope,
//   Lightbulb,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import ExpenseForm from "./expense-form";
// import BudgetProgress from "./budget-progress";
// import TransactionList from "./transaction-list";
// import ExpenseChart from "./expense-chart";
// import SpendingBreakdown from "./spending-breakdown";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "sonner";
// import { Drawer } from "vaul";
// import MobileNav from "./mobile-nav";
// import NotificationCenter from "./notification-center";
// import { formatCurrency } from "@/lib/utils";

// export type Expense = {
//   id: string;
//   amount: number;
//   category: string;
//   description: string;
//   date: string;
// };

// export type Budget = {
//   limit: number;
//   period: "daily" | "weekly" | "monthly";
// };

// export type Notification = {
//   id: string;
//   title: string;
//   message: string;
//   type: "info" | "warning" | "critical";
//   date: string;
//   read: boolean;
// };

// export default function Dashboard() {
//   const [expenses, setExpenses] = useState<Expense[]>(() => {
//     if (typeof window !== "undefined") {
//       const saved = localStorage.getItem("expenses");
//       return saved ? JSON.parse(saved) : [];
//     }
//     return [];
//   });

//   const [budget, setBudget] = useState<Budget>(() => {
//     if (typeof window !== "undefined") {
//       const saved = localStorage.getItem("budget");
//       return saved ? JSON.parse(saved) : { limit: 100000, period: "monthly" };
//     }
//     return { limit: 100000, period: "monthly" };
//   });

//   const [notifications, setNotifications] = useState<Notification[]>(() => {
//     if (typeof window !== "undefined") {
//       const saved = localStorage.getItem("notifications");
//       return saved ? JSON.parse(saved) : [];
//     }
//     return [];
//   });

//   const [showExpenseForm, setShowExpenseForm] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [activeTab, setActiveTab] = useState("dashboard");

//   useEffect(() => {
//     localStorage.setItem("expenses", JSON.stringify(expenses));
//   }, [expenses]);

//   useEffect(() => {
//     localStorage.setItem("budget", JSON.stringify(budget));
//   }, [budget]);

//   useEffect(() => {
//     localStorage.setItem("notifications", JSON.stringify(notifications));
//   }, [notifications]);

//   const addNotification = (
//     notification: Omit<Notification, "id" | "date" | "read">
//   ) => {
//     const newNotification = {
//       ...notification,
//       id: crypto.randomUUID(),
//       date: new Date().toISOString(),
//       read: false,
//     };

//     setNotifications((prev) => [newNotification, ...prev]);

//     // Also show as toast
//     toast[
//       notification.type === "critical"
//         ? "error"
//         : notification.type === "warning"
//         ? "warning"
//         : "info"
//     ](notification.title, { description: notification.message });
//   };

//   const markNotificationAsRead = (id: string) => {
//     setNotifications((prev) =>
//       prev.map((notification) =>
//         notification.id === id ? { ...notification, read: true } : notification
//       )
//     );
//   };

//   const markAllNotificationsAsRead = () => {
//     setNotifications((prev) =>
//       prev.map((notification) => ({ ...notification, read: true }))
//     );
//   };

//   const deleteNotification = (id: string) => {
//     setNotifications((prev) =>
//       prev.filter((notification) => notification.id !== id)
//     );
//   };

//   const addExpense = (expense: Omit<Expense, "id">) => {
//     const newExpense = {
//       ...expense,
//       id: crypto.randomUUID(),
//     };

//     setExpenses((prev) => [newExpense, ...prev]);
//     setShowExpenseForm(false);

//     // Calculate current spending percentage
//     const totalSpent = calculateTotalSpent();
//     const newTotal = totalSpent + expense.amount;
//     const spendingPercentage = (newTotal / budget.limit) * 100;

//     // Show notifications based on spending percentage
//     if (spendingPercentage >= 100) {
//       addNotification({
//         title: "Budget Exceeded!",
//         message: `You've exceeded your ${
//           budget.period
//         } budget of ${formatCurrency(budget.limit)}`,
//         type: "critical",
//       });
//     } else if (spendingPercentage >= 90) {
//       addNotification({
//         title: "Budget Alert",
//         message: `You've used ${spendingPercentage.toFixed(0)}% of your ${
//           budget.period
//         } budget`,
//         type: "critical",
//       });
//     } else if (spendingPercentage >= 75) {
//       addNotification({
//         title: "Budget Warning",
//         message: `You've used ${spendingPercentage.toFixed(0)}% of your ${
//           budget.period
//         } budget`,
//         type: "warning",
//       });
//     } else if (spendingPercentage >= 50) {
//       addNotification({
//         title: "Budget Update",
//         message: `You've used ${spendingPercentage.toFixed(0)}% of your ${
//           budget.period
//         } budget`,
//         type: "info",
//       });
//     }

//     // Category-specific notifications
//     const categoryTotal =
//       expenses
//         .filter((e) => e.category === expense.category)
//         .reduce((sum, e) => sum + e.amount, 0) + expense.amount;

//     if (categoryTotal > budget.limit * 0.4) {
//       addNotification({
//         title: `High ${expense.category} Spending`,
//         message: `Your ${expense.category} expenses are ${formatCurrency(
//           categoryTotal
//         )} this ${budget.period}`,
//         type: "warning",
//       });
//     }
//   };

//   const deleteExpense = (id: string) => {
//     setExpenses((prev) => prev.filter((expense) => expense.id !== id));
//   };

//   const calculateTotalSpent = () => {
//     return expenses.reduce((total, expense) => total + expense.amount, 0);
//   };

//   const updateBudget = (newBudget: Budget) => {
//     setBudget(newBudget);

//     // Notify about budget change
//     addNotification({
//       title: "Budget Updated",
//       message: `Your ${newBudget.period} budget is now ${formatCurrency(
//         newBudget.limit
//       )}`,
//       type: "info",
//     });

//     // Check if already over new budget
//     const totalSpent = calculateTotalSpent();
//     const spendingPercentage = (totalSpent / newBudget.limit) * 100;

//     if (spendingPercentage >= 100) {
//       addNotification({
//         title: "Budget Already Exceeded",
//         message: `Your spending of ${formatCurrency(
//           totalSpent
//         )} already exceeds your new budget`,
//         type: "critical",
//       });
//     }
//   };

//   const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

//   const renderContent = () => {
//     switch (activeTab) {
//       case "dashboard":
//         return (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//               <Card className="md:col-span-2">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg font-medium">
//                     Budget Overview
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <BudgetProgress
//                     spent={calculateTotalSpent()}
//                     budget={budget}
//                     updateBudget={updateBudget}
//                   />
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg font-medium">
//                     Spending by Category
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex flex-col gap-3">
//                   {[
//                     { name: "Food", icon: <Utensils className="h-4 w-4" /> },
//                     { name: "Transport", icon: <Car className="h-4 w-4" /> },
//                     {
//                       name: "Shopping",
//                       icon: <ShoppingBag className="h-4 w-4" />,
//                     },
//                     { name: "Bills", icon: <Receipt className="h-4 w-4" /> },
//                     {
//                       name: "Entertainment",
//                       icon: <Film className="h-4 w-4" />,
//                     },
//                     {
//                       name: "Education",
//                       icon: <GraduationCap className="h-4 w-4" />,
//                     },
//                     {
//                       name: "Data Recharge",
//                       icon: <Wifi className="h-4 w-4" />,
//                     },
//                     { name: "Housing", icon: <Home className="h-4 w-4" /> },
//                     {
//                       name: "Healthcare",
//                       icon: <Stethoscope className="h-4 w-4" />,
//                     },
//                     {
//                       name: "Utilities",
//                       icon: <Lightbulb className="h-4 w-4" />,
//                     },
//                   ]
//                     .map((category) => {
//                       const categoryTotal = expenses
//                         .filter(
//                           (e) =>
//                             e.category.toLowerCase() ===
//                             category.name.toLowerCase()
//                         )
//                         .reduce((sum, e) => sum + e.amount, 0);

//                       if (categoryTotal === 0) return null;

//                       const percentage =
//                         budget.limit > 0
//                           ? (categoryTotal / budget.limit) * 100
//                           : 0;

//                       return (
//                         <div key={category.name} className="space-y-1">
//                           <div className="flex justify-between items-center text-sm">
//                             <div className="flex items-center gap-2">
//                               <span className="text-muted-foreground">
//                                 {category.icon}
//                               </span>
//                               <span>{category.name}</span>
//                             </div>
//                             <span>{formatCurrency(categoryTotal)}</span>
//                           </div>
//                           <div className="h-2 bg-muted rounded-full overflow-hidden">
//                             <div
//                               className="h-full bg-primary rounded-full"
//                               style={{
//                                 width: `${Math.min(percentage, 100)}%`,
//                                 backgroundColor: "#4dabf7",
//                               }}
//                             />
//                           </div>
//                         </div>
//                       );
//                     })
//                     .filter(Boolean)}
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//               <Card>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg font-medium">
//                     Expense Trends
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <ExpenseChart expenses={expenses} />
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg font-medium">
//                     Spending Breakdown
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <SpendingBreakdown expenses={expenses} />
//                 </CardContent>
//               </Card>
//             </div>

//             <Card>
//               <CardHeader className="pb-2 flex flex-row items-center justify-between">
//                 <CardTitle className="text-lg font-medium">
//                   Recent Transactions
//                 </CardTitle>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setActiveTab("expenses")}
//                 >
//                   View All
//                 </Button>
//               </CardHeader>
//               <CardContent>
//                 <TransactionList
//                   expenses={expenses.slice(0, 5)}
//                   onDelete={deleteExpense}
//                   compact
//                 />
//               </CardContent>
//             </Card>
//           </>
//         );

//       case "expenses":
//         return (
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg font-medium">
//                 All Transactions
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <TransactionList expenses={expenses} onDelete={deleteExpense} />
//             </CardContent>
//           </Card>
//         );

//       case "reports":
//         return (
//           <div className="space-y-6">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg font-medium">
//                   Expense Analysis
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ExpenseChart expenses={expenses} interactive />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg font-medium">
//                   Spending Breakdown
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <SpendingBreakdown expenses={expenses} />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg font-medium">
//                   Spending Insights
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {expenses.length > 0 ? (
//                   <>
//                     <div className="p-4 bg-muted/30 rounded-lg">
//                       <h3 className="font-medium mb-1">Highest Expense</h3>
//                       <p className="text-sm text-muted-foreground">
//                         Your highest expense was{" "}
//                         {formatCurrency(
//                           Math.max(...expenses.map((e) => e.amount))
//                         )}{" "}
//                         for{" "}
//                         {expenses.find(
//                           (e) =>
//                             e.amount ===
//                             Math.max(...expenses.map((e) => e.amount))
//                         )?.category || "unknown"}
//                       </p>
//                     </div>

//                     <div className="p-4 bg-muted/30 rounded-lg">
//                       <h3 className="font-medium mb-1">
//                         Most Frequent Category
//                       </h3>
//                       <p className="text-sm text-muted-foreground">
//                         You spend most frequently on{" "}
//                         {Object.entries(
//                           expenses.reduce((acc, curr) => {
//                             acc[curr.category] = (acc[curr.category] || 0) + 1;
//                             return acc;
//                           }, {} as Record<string, number>)
//                         ).sort((a, b) => b[1] - a[1])[0]?.[0] || "unknown"}
//                       </p>
//                     </div>
//                   </>
//                 ) : (
//                   <p className="text-center text-muted-foreground py-4">
//                     Add some expenses to see your spending insights
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         );

//       case "settings":
//         return (
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg font-medium">Settings</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <h3 className="text-sm font-medium mb-2">
//                   Budget Configuration
//                 </h3>
//                 <BudgetProgress
//                   spent={calculateTotalSpent()}
//                   budget={budget}
//                   updateBudget={updateBudget}
//                   showEdit
//                 />
//               </div>

//               <div className="pt-4 border-t">
//                 <h3 className="text-sm font-medium mb-2">
//                   Notification Preferences
//                 </h3>
//                 <p className="text-sm text-muted-foreground mb-4">
//                   Configure when you receive notifications about your spending
//                 </p>

//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <label htmlFor="notify-50" className="text-sm">
//                       50% of budget used
//                     </label>
//                     <input
//                       type="checkbox"
//                       id="notify-50"
//                       className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                       defaultChecked
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <label htmlFor="notify-75" className="text-sm">
//                       75% of budget used
//                     </label>
//                     <input
//                       type="checkbox"
//                       id="notify-75"
//                       className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                       defaultChecked
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <label htmlFor="notify-90" className="text-sm">
//                       90% of budget used
//                     </label>
//                     <input
//                       type="checkbox"
//                       id="notify-90"
//                       className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                       defaultChecked
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <label htmlFor="notify-100" className="text-sm">
//                       Budget exceeded
//                     </label>
//                     <input
//                       type="checkbox"
//                       id="notify-100"
//                       className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                       defaultChecked
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-4 border-t">
//                 <h3 className="text-sm font-medium mb-2">Data Management</h3>
//                 <div className="flex gap-2">
//                   <Button variant="outline" size="sm" className="text-sm">
//                     Export Data
//                   </Button>
//                   <Button variant="destructive" size="sm" className="text-sm">
//                     Clear All Data
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 max-w-5xl pb-20 md:pb-4">
//       <header className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-medium">Finance Tracker</h1>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => setShowNotifications(true)}
//             className="relative"
//           >
//             <Bell className="h-4 w-4" />
//             {unreadNotificationsCount > 0 && (
//               <span
//                 className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center"
//                 style={{ backgroundColor: "#4dabf7" }}
//               >
//                 {unreadNotificationsCount}
//               </span>
//             )}
//           </Button>
//           <Button
//             onClick={() => setShowExpenseForm(true)}
//             className="hidden md:flex"
//             style={{ backgroundColor: "#4dabf7" }}
//           >
//             <Plus className="h-4 w-4 mr-2" /> Add Expense
//           </Button>
//         </div>
//       </header>

//       <div className="hidden md:block mb-8">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="w-full justify-start">
//             <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
//             <TabsTrigger value="expenses">Expenses</TabsTrigger>
//             <TabsTrigger value="reports">Reports</TabsTrigger>
//             <TabsTrigger value="settings">Settings</TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       {renderContent()}

//       {/* Mobile Add Expense Button */}
//       <div className="fixed bottom-20 right-4 md:hidden z-10">
//         <Button
//           onClick={() => setShowExpenseForm(true)}
//           size="icon"
//           className="h-12 w-12 rounded-full shadow-lg"
//           style={{ backgroundColor: "#4dabf7" }}
//         >
//           <Plus className="h-6 w-6" />
//         </Button>
//       </div>

//       {/* Mobile Navigation */}
//       <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

//       {/* Expense Form Drawer */}
//       <Drawer.Root open={showExpenseForm} onOpenChange={setShowExpenseForm}>
//         <Drawer.Portal>
//           <Drawer.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
//           <Drawer.Content className="bg-background flex flex-col rounded-t-xl fixed bottom-0 left-0 right-0 max-h-[85vh] z-50">
//             <div className="p-4 bg-background border-b sticky top-0 z-20">
//               <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-4" />
//               <h2 className="text-xl font-medium">Add New Expense</h2>
//             </div>
//             <div className="p-4 overflow-auto">
//               <ExpenseForm
//                 onSubmit={addExpense}
//                 onCancel={() => setShowExpenseForm(false)}
//               />
//             </div>
//           </Drawer.Content>
//         </Drawer.Portal>
//       </Drawer.Root>

//       {/* Notifications Drawer */}
//       <Drawer.Root open={showNotifications} onOpenChange={setShowNotifications}>
//         <Drawer.Portal>
//           <Drawer.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
//           <Drawer.Content className="bg-background flex flex-col rounded-t-xl fixed bottom-0 left-0 right-0 max-h-[85vh] z-50">
//             <div className="p-4 bg-background border-b sticky top-0 z-20">
//               <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-4" />
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-medium">Notifications</h2>
//                 {notifications.length > 0 && (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={markAllNotificationsAsRead}
//                   >
//                     Mark all as read
//                   </Button>
//                 )}
//               </div>
//             </div>
//             <div className="p-4 overflow-auto">
//               <NotificationCenter
//                 notifications={notifications}
//                 onMarkAsRead={markNotificationAsRead}
//                 onDelete={deleteNotification}
//               />
//             </div>
//           </Drawer.Content>
//         </Drawer.Portal>
//       </Drawer.Root>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Bell,
  Home,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  GraduationCap,
  Wifi,
  Stethoscope,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseForm from "./expense-form";
import BudgetProgress from "./budget-progress";
import TransactionList from "./transaction-list";
import ExpenseChart from "./expense-chart";
import SpendingBreakdown from "./spending-breakdown";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Drawer } from "vaul";
import MobileNav from "./mobile-nav";
import NotificationCenter from "./notification-center";
import { formatCurrency } from "@/lib/utils";
import { UserNav } from "./user-nav";
import { useSession } from "next-auth/react";

export type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
};

export type Budget = {
  limit: number;
  period: "daily" | "weekly" | "monthly";
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "critical";
  date: string;
  read: boolean;
};

export default function Dashboard() {
  const { data: session } = useSession();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<Budget>({
    limit: 100000,
    period: "monthly",
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetch budget and expenses from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch budget
        const budgetRes = await fetch("/api/budget");
        if (budgetRes.ok) {
          const budgetData = await budgetRes.json();
          setBudget(budgetData);
        }

        // Fetch expenses
        const expensesRes = await fetch("/api/expenses");
        if (expensesRes.ok) {
          const expensesData = await expensesRes.json();
          setExpenses(expensesData);
        }

        // Load notifications from localStorage
        if (typeof window !== "undefined") {
          const savedNotifications = localStorage.getItem("notifications");
          if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load your data");
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  // Save notifications to localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = (
    notification: Omit<Notification, "id" | "date" | "read">
  ) => {
    const newNotification = {
      ...notification,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Also show as toast
    toast[
      notification.type === "critical"
        ? "error"
        : notification.type === "warning"
        ? "warning"
        : "info"
    ](notification.title, { description: notification.message });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const addExpense = async (expense: Omit<Expense, "id">) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error("Failed to save expense");
      }

      const savedExpense = await response.json();
      setExpenses((prev) => [savedExpense, ...prev]);
      setShowExpenseForm(false);

      // Calculate current spending percentage
      const totalSpent = calculateTotalSpent();
      const newTotal = totalSpent + expense.amount;
      const spendingPercentage = (newTotal / budget.limit) * 100;

      // Show notifications based on spending percentage
      if (spendingPercentage >= 100) {
        addNotification({
          title: "Budget Exceeded!",
          message: `You've exceeded your ${
            budget.period
          } budget of ${formatCurrency(budget.limit)}`,
          type: "critical",
        });
      } else if (spendingPercentage >= 90) {
        addNotification({
          title: "Budget Alert",
          message: `You've used ${spendingPercentage.toFixed(0)}% of your ${
            budget.period
          } budget`,
          type: "critical",
        });
      } else if (spendingPercentage >= 75) {
        addNotification({
          title: "Budget Warning",
          message: `You've used ${spendingPercentage.toFixed(0)}% of your ${
            budget.period
          } budget`,
          type: "warning",
        });
      } else if (spendingPercentage >= 50) {
        addNotification({
          title: "Budget Update",
          message: `You've used ${spendingPercentage.toFixed(0)}% of your ${
            budget.period
          } budget`,
          type: "info",
        });
      }

      // Category-specific notifications
      const categoryTotal =
        expenses
          .filter((e) => e.category === expense.category)
          .reduce((sum, e) => sum + e.amount, 0) + expense.amount;

      if (categoryTotal > budget.limit * 0.4) {
        addNotification({
          title: `High ${expense.category} Spending`,
          message: `Your ${expense.category} expenses are ${formatCurrency(
            categoryTotal
          )} this ${budget.period}`,
          type: "warning",
        });
      }

      toast.success("Expense added successfully");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const calculateTotalSpent = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const updateBudget = async (newBudget: Budget) => {
    try {
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBudget),
      });

      if (!response.ok) {
        throw new Error("Failed to update budget");
      }

      const updatedBudget = await response.json();
      setBudget(updatedBudget);

      // Notify about budget change
      addNotification({
        title: "Budget Updated",
        message: `Your ${newBudget.period} budget is now ${formatCurrency(
          newBudget.limit
        )}`,
        type: "info",
      });

      // Check if already over new budget
      const totalSpent = calculateTotalSpent();
      const spendingPercentage = (totalSpent / newBudget.limit) * 100;

      if (spendingPercentage >= 100) {
        addNotification({
          title: "Budget Already Exceeded",
          message: `Your spending of ${formatCurrency(
            totalSpent
          )} already exceeds your new budget`,
          type: "critical",
        });
      }

      toast.success("Budget updated successfully");
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget");
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Budget Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BudgetProgress
                    spent={calculateTotalSpent()}
                    budget={budget}
                    updateBudget={updateBudget}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Spending by Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {[
                    { name: "Food", icon: <Utensils className="h-4 w-4" /> },
                    { name: "Transport", icon: <Car className="h-4 w-4" /> },
                    {
                      name: "Shopping",
                      icon: <ShoppingBag className="h-4 w-4" />,
                    },
                    { name: "Bills", icon: <Receipt className="h-4 w-4" /> },
                    {
                      name: "Entertainment",
                      icon: <Film className="h-4 w-4" />,
                    },
                    {
                      name: "Education",
                      icon: <GraduationCap className="h-4 w-4" />,
                    },
                    {
                      name: "Data Recharge",
                      icon: <Wifi className="h-4 w-4" />,
                    },
                    { name: "Housing", icon: <Home className="h-4 w-4" /> },
                    {
                      name: "Healthcare",
                      icon: <Stethoscope className="h-4 w-4" />,
                    },
                    {
                      name: "Utilities",
                      icon: <Lightbulb className="h-4 w-4" />,
                    },
                  ]
                    .map((category) => {
                      const categoryTotal = expenses
                        .filter(
                          (e) =>
                            e.category.toLowerCase() ===
                            category.name.toLowerCase()
                        )
                        .reduce((sum, e) => sum + e.amount, 0);

                      if (categoryTotal === 0) return null;

                      const percentage =
                        budget.limit > 0
                          ? (categoryTotal / budget.limit) * 100
                          : 0;

                      return (
                        <div key={category.name} className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                {category.icon}
                              </span>
                              <span>{category.name}</span>
                            </div>
                            <span>{formatCurrency(categoryTotal)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${Math.min(percentage, 100)}%`,
                                backgroundColor: "#4dabf7",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })
                    .filter(Boolean)}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Expense Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ExpenseChart expenses={expenses} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Spending Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SpendingBreakdown expenses={expenses} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  Recent Transactions
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("expenses")}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <TransactionList
                  expenses={expenses.slice(0, 5)}
                  onDelete={deleteExpense}
                  compact
                />
              </CardContent>
            </Card>
          </>
        );

      case "expenses":
        return (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                All Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionList expenses={expenses} onDelete={deleteExpense} />
            </CardContent>
          </Card>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Expense Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseChart expenses={expenses} interactive />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Spending Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SpendingBreakdown expenses={expenses} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Spending Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {expenses.length > 0 ? (
                  <>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="font-medium mb-1">Highest Expense</h3>
                      <p className="text-sm text-muted-foreground">
                        Your highest expense was{" "}
                        {formatCurrency(
                          Math.max(...expenses.map((e) => e.amount))
                        )}{" "}
                        for{" "}
                        {expenses.find(
                          (e) =>
                            e.amount ===
                            Math.max(...expenses.map((e) => e.amount))
                        )?.category || "unknown"}
                      </p>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="font-medium mb-1">
                        Most Frequent Category
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You spend most frequently on{" "}
                        {Object.entries(
                          expenses.reduce((acc, curr) => {
                            acc[curr.category] = (acc[curr.category] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).sort((a, b) => b[1] - a[1])[0]?.[0] || "unknown"}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Add some expenses to see your spending insights
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "settings":
        return (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">
                  Budget Configuration
                </h3>
                <BudgetProgress
                  spent={calculateTotalSpent()}
                  budget={budget}
                  updateBudget={updateBudget}
                  showEdit
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">
                  Notification Preferences
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure when you receive notifications about your spending
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="notify-50" className="text-sm">
                      50% of budget used
                    </label>
                    <input
                      type="checkbox"
                      id="notify-50"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="notify-75" className="text-sm">
                      75% of budget used
                    </label>
                    <input
                      type="checkbox"
                      id="notify-75"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="notify-90" className="text-sm">
                      90% of budget used
                    </label>
                    <input
                      type="checkbox"
                      id="notify-90"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="notify-100" className="text-sm">
                      Budget exceeded
                    </label>
                    <input
                      type="checkbox"
                      id="notify-100"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Data Management</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-sm">
                    Export Data
                  </Button>
                  <Button variant="destructive" size="sm" className="text-sm">
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl pb-20 md:pb-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium">
          Finance Tracker
          <span className="text-sm text-primary block">By Muazzam</span>
        </h1>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowNotifications(true)}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {unreadNotificationsCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center"
                style={{ backgroundColor: "#4dabf7" }}
              >
                {unreadNotificationsCount}
              </span>
            )}
          </Button>
          <UserNav />
          <Button
            onClick={() => setShowExpenseForm(true)}
            className="hidden md:flex"
            style={{ backgroundColor: "#4dabf7" }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Expense
          </Button>
        </div>
      </header>

      <div className="hidden md:block mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {renderContent()}

      {/* Mobile Add Expense Button */}
      <div className="fixed bottom-20 right-4 md:hidden z-10">
        <Button
          onClick={() => setShowExpenseForm(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          style={{ backgroundColor: "#4dabf7" }}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Expense Form Drawer */}
      <Drawer.Root open={showExpenseForm} onOpenChange={setShowExpenseForm}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          <Drawer.Content className="bg-background flex flex-col rounded-t-xl fixed bottom-0 left-0 right-0 max-h-[85vh] z-50">
            <div className="p-4 bg-background border-b sticky top-0 z-20">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-4" />
              <h2 className="text-xl font-medium">Add New Expense</h2>
            </div>
            <div className="p-4 overflow-auto">
              <ExpenseForm
                onSubmit={addExpense}
                onCancel={() => setShowExpenseForm(false)}
              />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Notifications Drawer */}
      <Drawer.Root open={showNotifications} onOpenChange={setShowNotifications}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          <Drawer.Content className="bg-background flex flex-col rounded-t-xl fixed bottom-0 left-0 right-0 max-h-[85vh] z-50">
            <div className="p-4 bg-background border-b sticky top-0 z-20">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-4" />
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Notifications</h2>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllNotificationsAsRead}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
            </div>
            <div className="p-4 overflow-auto">
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={markNotificationAsRead}
                onDelete={deleteNotification}
              />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
