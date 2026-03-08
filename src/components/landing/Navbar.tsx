"use client";

import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass-dark m-4 rounded-2xl"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-primary/30">R</div>
        <span className="text-xl font-bold tracking-tight text-white">ResearchOS</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        {!isSignedIn && (
          <>
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">Process</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <>
            <Link href="/dashboard">
              <span className="text-sm font-medium hover:text-primary transition-colors px-3 py-1 cursor-pointer">Workspace</span>
            </Link>
            <UserButton />
          </>
        ) : (
          <SignInButton mode="modal">
            <Button size="sm" className="rounded-full px-6">Get Started</Button>
          </SignInButton>
        )}
      </div>
    </motion.nav>
  );
}
