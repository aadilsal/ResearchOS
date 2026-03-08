import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(), // From auth provider
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

  tenants: defineTable({
    name: v.string(),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
    ownerId: v.string(),
    credits: v.number(), // Added for credit tracking
  }),

  usageLogs: defineTable({
    tenantId: v.id("tenants"),
    projectId: v.id("projects"),
    type: v.union(v.literal("research_start"), v.literal("extra_search"), v.literal("premium_analysis")),
    amount: v.number(),
    timestamp: v.number(),
  }).index("by_tenant", ["tenantId"]),

  tenantMembers: defineTable({
    userId: v.id("users"),
    tenantId: v.id("tenants"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member"), v.literal("viewer")),
  }).index("by_tenant", ["tenantId"])
    .index("by_user", ["userId"]),

  projects: defineTable({
    tenantId: v.id("tenants"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("idle"),
      v.literal("planning"),
      v.literal("researching"),
      v.literal("reading"),
      v.literal("analyzing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    objective: v.string(),
    error: v.optional(v.string()),
    citationStyle: v.optional(v.union(v.literal("APA"), v.literal("MLA"), v.literal("Chicago"), v.literal("IEEE"), v.literal("Harvard"))),
    citationCount: v.optional(v.number()),
    researchDepth: v.optional(v.union(v.literal("brief"), v.literal("standard"), v.literal("comprehensive"))),
  }).index("by_tenant", ["tenantId"]),

  tasks: defineTable({
    projectId: v.id("projects"),
    type: v.string(), // planner, search, reader, analyzer, reporter
    status: v.union(v.literal("pending"), v.literal("running"), v.literal("completed"), v.literal("failed")),
    input: v.any(),
    output: v.optional(v.any()),
    error: v.optional(v.string()),
  }).index("by_project", ["projectId"]),

  reports: defineTable({
    projectId: v.id("projects"),
    tenantId: v.id("tenants"),
    content: v.string(), // Markdown
    charts: v.optional(v.any()), 
    metadata: v.optional(v.any()),
  }).index("by_project", ["projectId"])
    .index("by_tenant", ["tenantId"]),
});
