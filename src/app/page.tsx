// "use client";
// import Dashboard from "@/components/dashboard";
// import { Toaster } from "sonner";

// import { auth } from "@/auth";
// import { redirect } from "next/navigation";

// export default async function Home() {
//   const session = await auth();

//   if (!session) {
//     redirect("/auth/signin");
//   }

//   return (
//     <main className="min-h-screen bg-background">
//       <Dashboard />
//       <Toaster position="top-right" richColors />
//     </main>
//   );
// }
// src/app/page.tsx

import { auth } from "@/auth";
import Dashboard from "@/components/dashboard";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <main className="min-h-screen bg-background">
      <Dashboard />
    </main>
  );
}
