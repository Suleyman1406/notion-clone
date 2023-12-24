"use client";

import { useScrolledTop } from "@/hooks/use-scrolled-top";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "./logo";

export const Navbar = () => {
  const isScrolled = useScrolledTop();

  return (
    <div
      className={cn(
        "z-50 bg-background dark:bg-[#1f1f1f] fixed top-0 flex items-center w-full p-6",
        isScrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        <Button>Login</Button>
        <ThemeToggle />
      </div>
    </div>
  );
};
