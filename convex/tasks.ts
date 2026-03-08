import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    type: v.string(),
    input: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      projectId: args.projectId,
      type: args.type,
      status: "pending",
      input: args.input,
    });
  },
});

export const updateStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(v.literal("pending"), v.literal("running"), v.literal("completed"), v.literal("failed")),
    output: v.optional(v.any()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, {
      status: args.status,
      output: args.output,
      error: args.error,
    });
  },
});

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});
