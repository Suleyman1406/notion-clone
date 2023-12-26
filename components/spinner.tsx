import { cva, type VariantProps } from "class-variance-authority";
import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("text-muted-foreground animate-spin", {
  variants: {
    size: {
      default: "h-4 w-4",
      sm: "h-2 w-2",
      lg: "h-6 w-6",
      xl: "h-16 w-16",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const Spinner = ({ size }: VariantProps<typeof spinnerVariants>) => {
  return <LoaderIcon className={cn(spinnerVariants({ size }))} />;
};
