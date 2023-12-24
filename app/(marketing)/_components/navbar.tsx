"use client";

import { useScrolledTop } from "@/hooks/use-scrolled-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export const Navbar = () => {
  const isScrolled = useScrolledTop();

  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-full p-6",
        isScrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        Login
      </div>
    </div>
  );
};
