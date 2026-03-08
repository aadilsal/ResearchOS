"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8">
          <Sparkles className="w-3 h-3" />
          <span>The Next Generation of AI Research</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
          Autonomous Research <br />
          <span className="text-primary">at Massive Scale.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Unleash a swarm of specialized AI agents to plan, search, analyze, and synthesize 
          complex research objectives into production-grade reports in minutes.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="h-12 px-8 rounded-full text-base font-semibold group">
            Start Free Research
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-base font-semibold border-white/30 text-white bg-white/5 hover:bg-white/10 transition-all shadow-lg hover:shadow-white/5">
            View Sample Reports
          </Button>
        </div>
      </motion.div>

      {/* Floating UI Elements / Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="mt-20 w-full max-w-5xl rounded-3xl border border-white/10 bg-black/40 backdrop-blur-3xl p-4 shadow-2xl relative"
      >
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/30 rounded-full blur-3xl -z-10" />
        <div className="flex items-center justify-between mb-4 px-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-md text-[10px] text-muted-foreground border border-white/10">
            research-orchestrator.v1.2
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px]">
          <div className="col-span-1 border border-white/5 rounded-xl p-4 space-y-4 bg-white/5">
             <div className="h-4 w-2/3 bg-white/10 rounded animate-pulse" />
             <div className="space-y-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center"><Zap className="w-2 h-2 text-primary" /></div>
                    <div className="h-2 w-full bg-white/5 rounded" />
                  </div>
                ))}
             </div>
          </div>
          <div className="col-span-2 border border-white/5 rounded-xl p-6 bg-white/5 flex flex-col items-center justify-center text-center">
             <Search className="w-12 h-12 text-primary/40 mb-4" />
             <div className="h-6 w-1/2 bg-white/10 rounded mb-4" />
             <div className="space-y-2 w-full max-w-md">
                <div className="h-2 w-full bg-white/5 rounded" />
                <div className="h-2 w-5/6 bg-white/5 rounded mx-auto" />
                <div className="h-2 w-4/6 bg-white/5 rounded mx-auto" />
             </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
