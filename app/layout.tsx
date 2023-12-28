import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner";

import { ConverClientProvider } from "@/components/providers/convex.provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConverClientProvider>
          <ThemeProvider
            enableSystem
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            storageKey="danotion-theme-1"
          >
            <Toaster richColors position="bottom-center" expand={true} />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </ConverClientProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Danotion",
  description: "The connected worskpace where better, faster work happens.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      },
    ],
  },
};
