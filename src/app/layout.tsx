import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Job Sourcing & Employer Outreach Platform",
  description: "Interne mobile-first Plattform für Job Sourcing, Analyse und Employer Outreach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
