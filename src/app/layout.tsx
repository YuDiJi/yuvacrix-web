import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/store/provider";
import ReduxPersistProvider from "@/providers/ReduxPersistProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "YuvaCrix",
  description: "Modern Cricket Scoring & Tournament Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${barlow.variable} scroll-smooth`}
    >
      <body
        className="
          min-h-screen
          bg-(--color-bg-base)
          text-(--color-text-body)
          antialiased
        "
      >
        <ReduxProvider>
          <ReduxPersistProvider>{children}</ReduxPersistProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
