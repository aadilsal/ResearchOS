"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { motion } from "framer-motion";
import { Search, Zap, Globe, Shield, Users, BarChart3 } from "lucide-react";

export default function AboutPage() {
  const missionItems = [
    {
      icon: <Search className="w-6 h-6 text-primary" />,
      title: "Autonomous Discovery",
      description: "Our agents work 24/7 to traverse the digital landscape, identifying high-signal information that humans might miss."
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Real-time Intelligence",
      description: "In a world that moves at the speed of light, we provide real-time synthesis of market shifts and technical breakthroughs."
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "Global Context",
      description: "ResearchOS connects disparate data points across languages and regions to provide a truly global perspective."
    }
  ];

  const values = [
    { icon: <Shield />, label: "Integrity", text: "Every claim is backed by authoritative source citations." },
    { icon: <Users />, label: "Agency", text: "We empower researchers, not replace them." },
    { icon: <BarChart3 />, label: "Precision", text: "Depth and rigor are at the core of every synthesis." }
  ];

  return (
    <main className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-24">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              Our Mission
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Democratizing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Deep Intelligence.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              ResearchOS was founded on a simple premise: information is infinite, but human attention is not. We build autonomous agents that act as a force multiplier for the world&lsquo;s most ambitious researchers.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <div className="relative glass border-white/10 rounded-[2.5rem] p-8 aspect-square flex items-center justify-center overflow-hidden">
               <div className="grid grid-cols-2 gap-4 w-full h-full opacity-40">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="border border-white/5 rounded-2xl bg-white/[0.02] flex items-center justify-center">
                      <div className="w-12 h-1 h-px bg-primary/20 rotate-45" />
                    </div>
                  ))}
               </div>
               <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center">
                  <div className="w-40 h-40 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 animate-pulse">
                     <span className="text-6xl font-black text-primary/40">ROS</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Features/Mission Detail */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {missionItems.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass p-8 rounded-3xl space-y-4 group hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Core Values */}
        <div className="border-t border-white/5 pt-24">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">The Pillars of ResearchOS</h2>
            <p className="text-muted-foreground">The principles that guide every autonomous cycle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((v, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground">
                  {v.icon}
                </div>
                <h4 className="text-lg font-bold">{v.label}</h4>
                <p className="text-sm text-muted-foreground px-4">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
