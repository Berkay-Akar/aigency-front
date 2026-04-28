import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aigencys — Product Images to Campaign Creative",
  description:
    "AI-powered creative production platform for brands. Transform product photos into editorial-quality campaign assets in seconds. No studio required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const antiFouc = `(function(){try{var s=JSON.parse(localStorage.getItem('aigencys-app')||'{}');var t=s.theme;if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add('dark');}})();`;

  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFouc }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
