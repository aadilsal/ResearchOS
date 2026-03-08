import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Verifies that a user has access to a specific tenant.
 * Throws an error if access is denied.
 */
export async function verifyTenant(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  tenantId: Id<"tenants">
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  const membership = await ctx.db
    .query("tenantMembers")
    .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
    .filter((q) => q.eq(q.field("userId"), user._id))
    .unique();

  if (!membership) {
    throw new Error("Unauthorized access to this workspace");
  }

  return { user, membership };
}
