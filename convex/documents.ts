import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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

export const unarchive = mutation({
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

    let parentDocumentId;
    if (existingDocument.parentDocument) {
      const parentDocument = await ctxt.db.get(existingDocument.parentDocument);
      if (parentDocument && !parentDocument.isArchived) {
        parentDocumentId = parentDocument._id;
      }
    }

    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctxt.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (let child of children) {
        await recursiveArchive(child._id);
        await ctxt.db.patch(child._id, { isArchived: false });
      }
    };

    await recursiveArchive(args.id);
    const document = await ctxt.db.patch(args.id, {
      isArchived: false,
      parentDocument: parentDocumentId,
    });

    return document;
  },
});

export const getArchived = query({
  handler: async (ctxt) => {
    const identity = await ctxt.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated.");
    }
    const userId = identity.subject;

    const documents = await ctxt.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .collect();

    return documents;
  },
});

export const remove = mutation({
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

    const document = await ctxt.db.delete(args.id);
    return document;
  },
});

export const getSearch = query({
  handler: async (ctxt) => {
    const identity = await ctxt.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated.");
    }
    const userId = identity.subject;

    const documents = await ctxt.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctxt, args) => {
    const identity = await ctxt.auth.getUserIdentity();

    const document = await ctxt.db.get(args.documentId);

    if (!document) {
      throw new Error("Not Found");
    }

    if (document.isPublished && !document.isArchived) {
      return document;
    }
    if (!identity) {
      throw new Error("Not authenticated.");
    }

    const userId = identity.subject;

    if (document.userId !== userId) {
      throw new Error("Not authenticated.");
    }

    return document;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctxt, args) => {
    const identity = await ctxt.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated.");
    }

    const userId = identity.subject;

    const existingDocument = await ctxt.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Document not found.");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Not authorized.");
    }

    const { id, ...rest } = args;

    const document = await ctxt.db.patch(id, rest);

    return document;
  },
});
