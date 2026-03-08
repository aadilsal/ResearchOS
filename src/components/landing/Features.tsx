"use client";

import { motion } from "framer-motion";
import { Brain, Globe, FileText, BarChart3, Shield, Users } from "lucide-react";

const features = [
  {
    title: "Autonomous Planning",
    description: "Our Planner Agent breaks complex objectives into actionable research tasks automatically.",
    icon: Brain,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Deep Web Research",
    description: "Search agents crawl the web, retrieve PDFs, and navigate complex data sources in real-time.",
    icon: Globe,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Document Synthesis",
    description: "Reader agents process thousands of pages to extract key facts, figures, and insights.",
    icon: FileText,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Advanced Analytics",
    description: "Analysis agents perform trend detection, clustering, and ranking on extracted data.",
    icon: BarChart3,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Multi-Tenant Security",
    description: "Enterprise-grade data isolation ensures your research remains private and secure.",
    icon: Shield,
    color: "bg-red-500/10 text-red-500",
  },
  {
    title: "Team Collaboration",
    description: "Collaborate on research projects with shared workspaces and role-based access.",
    icon: Users,
    color: "bg-cyan-500/10 text-cyan-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-black/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 underline-offset-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Agent Orchestration</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need for high-velocity research, powered by specialized AI agents working in harmony.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
