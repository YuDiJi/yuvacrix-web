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

// export const metadata: Metadata = {
//   title: "YuvaCrix",
//   description: "Modern Cricket Scoring & Tournament Platform",
// };

export const metadata: Metadata = {
  metadataBase: new URL("https://www.yuvacrix.in"),

  title: {
    default: "YuvaCrix – Cricket Scoring App & Tournament Management",
    template: "%s | YuvaCrix",
  },

  description:
    "YuvaCrix is a cricket scoring and tournament management platform to score matches live, manage tournaments, view scorecards, track player stats and awards.",

  keywords: [
    "cricket scoring app",
    "cricket tournament management",
    "live cricket scorecard",
    "cricket app India",
    "online cricket scoring",
    "player stats cricket",
    "cricket tournament organizer",
  ],

  authors: [{ name: "YuvaCrix" }],
  creator: "YuvaCrix",
  publisher: "YuvaCrix",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "YuvaCrix",
    title: "YuvaCrix – Cricket Scoring App & Tournament Management",
    description:
      "Score cricket matches live, manage tournaments, view scorecards and track player performance with YuvaCrix.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YuvaCrix Cricket Scoring and Tournament Management",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "YuvaCrix – Cricket Scoring App & Tournament Management",
    description:
      "Score cricket matches live, manage tournaments, view scorecards and track player performance with YuvaCrix.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
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
