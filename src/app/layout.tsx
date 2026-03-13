import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Chatbot from "@/components/chat/Chatbot";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "AKS - Premium Digital Agency",
  description: "Transforming digital presence with top-tier web development and software solutions.",
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
  verification: {
    google: "pFeIDKiii4cNwDjvG03uGep45TWXhTAQ2OmiBLbVphk",
  },
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
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F6N1V9MJXY"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F6N1V9MJXY');
          `
        }} />

        {/* Theme init — must run before paint to avoid flash */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('aks-theme');if(!t){t='dark';localStorage.setItem('aks-theme','dark')}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`
        }} />
        {/* Load external icon stylesheets non-blocking via JS after DOM is ready */}
        <script dangerouslySetInnerHTML={{
          __html: `window.addEventListener('load',function(){var a=['https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css','https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap'];a.forEach(function(h){var l=document.createElement('link');l.rel='stylesheet';l.href=h;document.head.appendChild(l)});
          // Tracker
          fetch('/api/track', { method: 'POST', keepalive: true }).catch(()=>{});
          });`
        }} />
        <noscript>
          <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
        </noscript>
      </head>
      <body className={outfit.className}>
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
