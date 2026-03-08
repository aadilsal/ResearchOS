"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { runResearchJob } from "../src/lib/agents/orchestrator";
import { Id } from "./_generated/dataModel";

export const startResearch = action({
  args: {
    projectId: v.id("projects"),
    objective: v.string(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    // 0. Get project and tenant info
    const project = await ctx.runQuery(api.projects.get, { 
      projectId: args.projectId,
      tokenIdentifier: args.tokenIdentifier
    });
    if (!project) throw new Error("Project not found");

    // 0.a Verify multi-tenant access
    const hasAccess = await ctx.runQuery(api.users.verifyAccess, {
      tokenIdentifier: args.tokenIdentifier,
      tenantId: project.tenantId,
    });

    if (!hasAccess) throw new Error("Unauthorized access to this project");

    // 1. Deduct credits (10 per research job)
    await ctx.runMutation(api.billing.deductCredits, {
      tenantId: project.tenantId,
      projectId: args.projectId,
      amount: 10,
      type: "research_start",
    });

    // 2. Update project status to 'planning'
    await ctx.runMutation(api.projects.updateStatus, {
      projectId: args.projectId,
      status: "planning",
    });

    try {
      // 2. Run the research orchestrator with callbacks for real-time updates
      const result = await runResearchJob(
        args.objective, 
        args.projectId, 
        project.citationStyle || "APA",
        project.citationCount || 5,
        (project.researchDepth as "brief" | "standard" | "comprehensive") || "standard",
        {
          updateProject: async (status: "idle" | "planning" | "researching" | "reading" | "analyzing" | "completed" | "failed", error?: string) => {
          await ctx.runMutation(api.projects.updateStatus, {
            projectId: args.projectId,
            status,
            error,
          });
        },
        createTask: async (type: string, input: { query: string }) => {
          return await ctx.runMutation(api.tasks.create, {
            projectId: args.projectId,
            type,
            input,
          });
        },
        updateTask: async (taskId: string, status: "pending" | "running" | "completed" | "failed", output?: { results: unknown[] }) => {
          await ctx.runMutation(api.tasks.updateStatus, {
            taskId: taskId as Id<"tasks">,
            status,
            output,
          });
        },
      });

      // 3. Save the final report
      await ctx.runMutation(api.reports.create, {
        projectId: args.projectId,
        content: result.report,
      });

      // 4. Mark project as completed
      await ctx.runMutation(api.projects.updateStatus, {
        projectId: args.projectId,
        status: "completed",
      });

    } catch (error) {
      console.error("Research job failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Internal orchestrator error";
      await ctx.runMutation(api.projects.updateStatus, {
        projectId: args.projectId,
        status: "failed",
        error: errorMessage,
      });
    }
  },
});
