import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    content: v.string(),
    charts: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    return await ctx.db.insert("reports", {
      projectId: args.projectId,
      tenantId: project.tenantId,
      content: args.content,
      charts: args.charts,
    });
  },
});

export const getByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();
  },
});
export const update = mutation({
  args: {
    reportId: v.id("reports"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    if (!report) throw new Error("Report not found");

    await ctx.db.patch(args.reportId, {
      content: args.content,
    });
  },
});
