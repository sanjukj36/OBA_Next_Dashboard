import type { Metadata } from "next";
import "./globals.css";
import React, { Suspense } from "react";
import { Alexandria, Russo_One } from "next/font/google";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { twMerge } from "tailwind-merge";
import ChatBot from "@/components/chat-bot";
import { AlertTableContextProvider } from "@/components/dashboard/alerts-list/alert-list-table-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/provider/auth-provider";
import QueryProvider from "@/provider/query-provider";
import { CancelOnRouteChange } from "@/components/cancel-on-route-change";

const alexandria = Alexandria({
  weight: ["100", "200", "300", "400", "600", "700"], // Add weights you need
  subsets: ["latin"],
  display: "swap",
  variable: "--font-alexandria"
});

const russoOne = Russo_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-russo-one"
});

const dDin = localFont({
  src: [
    { path: "../public/fonts/D-DIN.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/D-DIN-Bold.otf", weight: "700", style: "normal" },
    { path: "../public/fonts/D-DIN-Italic.otf", weight: "400", style: "italic" }
  ],
  variable: "--font-d-din"
});

export const metadata: Metadata = {
  title: "OBA | UAT",
  description: "Onboard solution"
  // viewport: "width=device-width, initial-scale=1.0" // ✅ add here
};

export default function RootLayout({
  children,

}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={twMerge(
          dDin.variable,
          russoOne.variable,
          alexandria.variable,

          "min-h-svh bg-black antialiased"
        )}
      >
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <AuthProvider>
                <AlertTableContextProvider>
                  {children}
                  <Toaster />
                  <ChatBot />
                  <Suspense>
                    <CancelOnRouteChange />
                  </Suspense>
                </AlertTableContextProvider>
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
