import { Inter, Sora } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap", weight: ["600", "700"] });

export const metadata = {
  title: { default: "Dhaka Pulse | Events happening in Dhaka", template: "%s | Dhaka Pulse" },
  description: "Discover concerts, meetups, food walks, workshops and festivals across Dhaka. Create and manage your own events.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <Navbar />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
