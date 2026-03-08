import React from "react";
import { CheckCircle2, Circle, Loader2, Brain, Search, BookOpen, FileText } from "lucide-react";

export type AgentType = "planner" | "searcher" | "reader" | "analyzer";

export interface AgentStep {
  type: AgentType;
  label: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
}

interface AgentTimelineProps {
  steps: AgentStep[];
}

const iconMap = {
  planner: Brain,
  searcher: Search,
  reader: BookOpen,
  analyzer: FileText,
};

export function AgentTimeline({ steps }: AgentTimelineProps) {
  return (
    <div className="space-y-6">
      {steps.map((step, idx) => {
        const Icon = iconMap[step.type];
        const isLast = idx === steps.length - 1;
        
        const statusConfig = {
          pending: { color: "text-muted-foreground", bg: "bg-muted/50", icon: Circle },
          running: { color: "text-primary", bg: "bg-primary/10 animate-pulse", icon: Loader2 },
          completed: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
          failed: { color: "text-destructive", bg: "bg-destructive/10", icon: Circle },
        };

        const config = statusConfig[step.status];
        const StatusIcon = step.status === "running" ? Loader2 : config.icon;

        return (
          <div key={step.type} className="relative flex gap-4">
            {!isLast && (
              <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-white/5" />
            )}
            
            <div className={`z-10 w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 ${config.bg} ${config.color}`}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="pt-1 flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-sm tracking-tight">{step.label}</h4>
                {step.status !== "pending" && (
                  <StatusIcon className={`w-4 h-4 ${step.status === "running" ? "animate-spin" : ""}`} />
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.status === "running" ? "Agent is currently working..." : step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
