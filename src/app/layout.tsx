import type { Metadata } from "next";
import { Inter, Space_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import "../styles/retro-theme.css";

const inter = Inter({ subsets: ["latin"] });

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: "Coverage Rider Policy Admin",
  description: "A comprehensive policy administration system for life insurance and annuity products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://res.cloudinary.com/dqql2wlbt/image/upload/v1741110204/solvrays-grayscale_kqvimw.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} ${spaceMono.variable} ${dmSans.variable}`}>{children}</body>
    </html>
  );
}
