"use client";
import { useConvexAuth } from "convex/react";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
import { SignInButton } from "@clerk/clerk-react";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
        <span className="underline">Danotion</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Danotion is the connected workspace where <br /> better work happens.
      </h3>
      {isLoading && (
        <div className="flex w-full items-center justify-center h-10">
          <Spinner size="lg" />
        </div>
      )}
      {!isLoading && isAuthenticated && (
        <Button asChild>
          <Link href="/documents">
            Enter Danotion
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
      {!isLoading && !isAuthenticated && (
        <SignInButton mode="modal">
          <Button>
            Get Danotion Free
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};
