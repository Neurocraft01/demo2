import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import SmoothScroller from "@/components/SmoothScroller";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "AKS - Premium Digital Agency",
  description: "Transforming digital presence with top-tier web development and software solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      </head>
      <body className={outfit.className}>
        <SmoothScroller>
          {children}
        </SmoothScroller>
      </body >
    </html >
  );
}
