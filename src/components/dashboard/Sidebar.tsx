"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Folder, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard" || pathname.startsWith("/dashboard/project"),
    },
    {
      label: "Projects",
      icon: Folder,
      href: "/dashboard/projects",
      active: pathname === "/dashboard/projects",
    },
    {
      label: "Profile",
      icon: User,
      href: "/dashboard/profile",
      active: pathname === "/dashboard/profile",
    },
  ];

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-black/20 border-r border-white/5 backdrop-blur-xl">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center mr-3">
            <span className="text-primary font-bold text-lg">R</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            ResearchOS
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                route.active ? "text-white bg-white/10 shadow-sm" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.active ? "text-primary" : "text-zinc-400")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-6 py-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          <div className="space-y-1">
            <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-2 w-12 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
