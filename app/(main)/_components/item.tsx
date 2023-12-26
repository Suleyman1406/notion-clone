"use client";

import { ChevronDownIcon, ChevronRightIcon, LucideIcon } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

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

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${(level + 1) * 12}px` : "12px" }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
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
    </div>
  );
};
