import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "../ui/progress";
import { Zap, History, CreditCard } from "lucide-react";

interface UsageDashboardProps {
  tenantId: Id<"tenants">;
}

export function UsageDashboard({ tenantId }: UsageDashboardProps) {
  const credits = useQuery(api.billing.getBalance, { tenantId });
  const logs = useQuery(api.billing.getLogs, { tenantId });

  const maxCredits = 1000; // For progress bar visualization
  const percentage = credits !== undefined ? (credits / maxCredits) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="glass md:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            Credit Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight">
              {credits ?? "..."}
            </span>
            <span className="text-muted-foreground text-sm font-medium">Credits remaining</span>
          </div>
          <Progress value={percentage} className="h-2 bg-white/5" />
          <p className="text-xs text-muted-foreground">
            Basic Plan: 1,000 credits/mo quota.
          </p>
        </CardContent>
      </Card>

      <Card className="glass md:col-span-2 flex flex-col">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            Recent Terminal Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-y-auto max-h-[160px] custom-scrollbar">
          {!logs ? (
            <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">
              Loading usage history...
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground italic">
              No recent activity recorded.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {logs.map((log: { _id: string; type: string; timestamp: number; amount: number }) => (
                <div key={log._id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {log.type.replace("_", " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/5">
                    -{log.amount} Units
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
