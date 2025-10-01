import type { Metadata } from "next";
import { Jost} from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nike Store",
  description: "An e-commerce store for Nike products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jost.className}  `}
      >
        {children}
      </body>
    </html>
  );
}
