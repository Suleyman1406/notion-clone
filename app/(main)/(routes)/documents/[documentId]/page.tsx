"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Toolbar } from "@/components/toolbar";

interface IDocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params: { documentId } }: IDocumentIdPageProps) => {
  const document = useQuery(api.documents.getById, { documentId });

  if (document === null) {
    return <div>Not found</div>;
  }

  if (!document) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pb-40 ">
      <div className="h-[35vh]" />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
