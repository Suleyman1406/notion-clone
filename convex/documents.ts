import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctxt, args) => {
    const identity = await ctxt.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated.");
    }
    const userId = identity.subject;

    const document = await ctxt.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });
    return document;
  },
});

export const get = query({
  handler: async (ctxt, args) => {
    const identity = await ctxt.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated.");
    }

    const documents = await ctxt.db.query("documents").collect();
    if (!documents) {
      throw new Error("Not found.");
    }
    return documents;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctxt, args) => {
    const identity = await ctxt.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated.");
    }
    const userId = identity.subject;

    const documents = await ctxt.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const archive = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctxt, args) => {
    const identity = await ctxt.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated.");
    }
    const userId = identity.subject;

    const existingDocument = await ctxt.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not found.");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Not authorized.");
    }

    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctxt.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();
      for (const child of children) {
        await recursiveArchive(child._id);
        await ctxt.db.patch(child._id, { isArchived: true });
      }
    };

    await recursiveArchive(args.id);
    const document = await ctxt.db.patch(args.id, { isArchived: true });

    return document;
  },
});
