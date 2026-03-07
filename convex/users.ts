import { mutation, query, queryWithAuth } from "convex/server";
import { v } from "convex/values";

/**
 * Syncs user data from an external auth provider (Clerk).
 */
export const store = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
      });
      return existing._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      tokenIdentifier: args.tokenIdentifier,
      imageUrl: args.imageUrl,
    });

    // Automatically create a personal tenant for the new user
    const tenantId = await ctx.db.insert("tenants", {
      name: `${args.name || 'My'} Workspace`,
      plan: "free",
      ownerId: args.tokenIdentifier,
    });

    // Add user as owner of the tenant
    await ctx.db.insert("tenantMembers", {
      userId,
      tenantId,
      role: "owner",
    });

    return userId;
  },
});

export const me = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (!user) return null;

    // Get tenants the user is a member of
    const memberships = await ctx.db
      .query("tenantMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const tenants = await Promise.all(
      memberships.map((m) => ctx.db.get(m.tenantId))
    );

    return {
      ...user,
      tenants: tenants.filter((t) => !!t),
    };
  },
});
