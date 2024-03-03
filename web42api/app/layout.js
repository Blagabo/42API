import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./context/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "API 42",
  description: "API 42 Network",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Providers>
        <body className={`${inter.className} antialiased`}>
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  );
}
