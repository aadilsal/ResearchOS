import { mutation, query } from "convex/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    tenantId: v.id("tenants"),
    title: v.string(),
    description: v.optional(v.string()),
    objective: v.string(),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      tenantId: args.tenantId,
      title: args.title,
      description: args.description,
      objective: args.objective,
      status: "idle",
    });
    return projectId;
  },
});

export const listByTenant = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;

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
