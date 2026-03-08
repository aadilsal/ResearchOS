"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();

  if (isLoaded && !isSignedIn) {
    redirect("/");
  }

  return (
    <div className="dark h-screen flex bg-background overflow-hidden">
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-64 flex-1 overflow-y-auto">
        <div className="pt-10 px-6 max-w-7xl mx-auto pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}
