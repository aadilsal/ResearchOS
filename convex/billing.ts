import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getBalance = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    const tenant = await ctx.db.get(args.tenantId);
    return tenant?.credits ?? 0;
  },
});

export const getLogs = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("usageLogs")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .order("desc")
      .take(10);
  },
});

export const deductCredits = mutation({
  args: {
    tenantId: v.id("tenants"),
    projectId: v.id("projects"),
    amount: v.number(),
    type: v.union(v.literal("research_start"), v.literal("extra_search"), v.literal("premium_analysis")),
  },
  handler: async (ctx, args) => {
    const tenant = await ctx.db.get(args.tenantId);
    if (!tenant) throw new Error("Tenant not found");
    
    // We log the usage for analytics, but for now, we don't block the user (Free Beta)
    // await ctx.db.patch(args.tenantId, {
    //   credits: tenant.credits - args.amount,
    // });

    await ctx.db.insert("usageLogs", {
      tenantId: args.tenantId,
      projectId: args.projectId,
      amount: args.amount,
      type: args.type,
      timestamp: Date.now(),
    });
  },
});
