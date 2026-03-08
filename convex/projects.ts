import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { verifyTenant } from "./utils";

export const create = mutation({
  args: {
    tenantId: v.id("tenants"),
    title: v.string(),
    description: v.optional(v.string()),
    objective: v.string(),
    tokenIdentifier: v.string(),
    citationStyle: v.optional(v.union(v.literal("APA"), v.literal("MLA"), v.literal("Chicago"), v.literal("IEEE"), v.literal("Harvard"))),
    citationCount: v.optional(v.number()),
    researchDepth: v.optional(v.union(v.literal("brief"), v.literal("standard"), v.literal("comprehensive"))),
  },
  handler: async (ctx, args) => {
    await verifyTenant(ctx, args.tokenIdentifier, args.tenantId);
    const projectId = await ctx.db.insert("projects", {
      tenantId: args.tenantId,
      title: args.title,
      description: args.description,
      objective: args.objective,
      citationStyle: args.citationStyle || "APA",
      citationCount: args.citationCount || 5,
      researchDepth: args.researchDepth || "standard",
      status: "idle",
    });
    return projectId;
  },
});

export const updateStatus = mutation({
  args: {
    projectId: v.id("projects"),
    status: v.union(
      v.literal("idle"),
      v.literal("planning"),
      v.literal("researching"),
      v.literal("reading"),
      v.literal("analyzing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, { 
      status: args.status,
      error: args.error,
    });
  },
});

export const listByTenant = query({
  args: { 
    tenantId: v.id("tenants"),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    await verifyTenant(ctx, args.tokenIdentifier, args.tenantId);
    return await ctx.db
      .query("projects")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .order("desc")
      .collect();
  },
});

export const remove = mutation({
  args: {
    projectId: v.id("projects"),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return;
    
    await verifyTenant(ctx, args.tokenIdentifier, project.tenantId);
    
    // Delete associated tasks
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }
    
    // Delete associated reports
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    for (const report of reports) {
      await ctx.db.delete(report._id);
    }

    await ctx.db.delete(args.projectId);
  },
});

export const get = query({
  args: { 
    projectId: v.id("projects"),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;

    // Verify multi-tenant access
    await verifyTenant(ctx, args.tokenIdentifier, project.tenantId);

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const reports = await ctx.db
      .query("reports")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    return {
      ...project,
      tasks,
      reports,
    };
  },
});
