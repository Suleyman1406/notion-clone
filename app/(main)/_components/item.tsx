"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LucideIcon,
  PlusIcon,
} from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

interface IItemProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  level?: number;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  id?: Id<"documents">;
  documentIcon?: string;
  onExpand?: () => void;
}

export const Item = ({
  icon: Icon,
  onClick,
  label,
  id,
  active,
  expanded,
  isSearch,
  onExpand,
  level = 0,
  documentIcon,
}: IItemProps) => {
  const ChevronIcon = expanded ? ChevronDownIcon : ChevronRightIcon;
  const createDocument = useMutation(api.documents.create);
  const router = useRouter();

  const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand && onExpand();
  };

  const handleCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;
    const createDocPromise = createDocument({
      title: "Untitled",
      parentDocument: id,
    }).then(() => {
      if (!expanded && onExpand) onExpand();
      router.push(`/documents/${id}`);
    });

    toast.promise(createDocPromise, {
      loading: "Creating a new note...",
      success: "Note created!",
      error: "Something went wrong while creating a note.",
    });
  };

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: `${(level + 1) * 12}px` }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          onClick={handleExpand}
          className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div>{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] mr-2 to-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-sm">⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <div
            onClick={handleCreate}
            role="button"
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <PlusIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level = 0 }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: `${(level + 1) * 12}px`,
      }}
      className="w-full flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4 " />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
