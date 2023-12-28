"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { MenuIcon } from "lucide-react";
import { Title } from "./title";

interface INavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({ onResetWidth, isCollapsed }: INavbarProps) => {
  const params = useParams();
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });

  if (!document) {
    return (
      <nav className="bg-background dark:bg-[#1f1f1f] flex items-center gap-x-4 px-3 py-2 w-full">
        <Title.Skeleton />
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1f1f1f] flex items-center gap-x-4 px-3 py-2 w-full">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="w-6 h-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
        </div>
      </nav>
    </>
  );
};
