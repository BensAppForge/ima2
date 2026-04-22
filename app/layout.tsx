import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { KeyProvider } from "@/components/key-provider";
import { ToastProvider } from "@/components/ui/toast";
import { TopNav } from "@/components/top-nav";
import { KeyGate } from "@/components/key-gate";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ima2 — Image 2 showcase",
  description:
    "Internal BYOK playground for OpenAI's Image 2 (gpt-image-2) model.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <KeyProvider>
          <ToastProvider>
            <TopNav />
            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-6">
              <KeyGate>{children}</KeyGate>
            </main>
          </ToastProvider>
        </KeyProvider>
      </body>
    </html>
  );
}
