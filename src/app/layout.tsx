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
    <html lang="en" className={outfit.variable} data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://unpkg.com" />
        <link rel="preload" href="https://unpkg.com/boxicons@2.1.4/fonts/boxicons.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="https://fonts.gstatic.com/s/materialsymbolsoutlined/v192/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsI.woff2" as="font" type="font/woff2" crossOrigin="" />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('aks-theme');
                if (!theme) {
                  theme = 'dark';
                  localStorage.setItem('aks-theme', 'dark');
                }
                document.documentElement.setAttribute('data-theme', theme);
                
                var l1 = document.createElement('link'); l1.rel = 'stylesheet'; l1.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'; document.head.appendChild(l1);
                var l2 = document.createElement('link'); l2.rel = 'stylesheet'; l2.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap'; document.head.appendChild(l2);
              } catch (e) {}
            })();
          `
        }} />
        <noscript>
          <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
        </noscript>
      </head>
      <body className={outfit.className}>
        <SmoothScroller>
          {children}
        </SmoothScroller>
      </body >
    </html >
  );
}
