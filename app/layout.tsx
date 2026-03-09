"use client";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css"; // Ajusta la ruta si es necesario
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuth = pathname?.startsWith("/auth");
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {!isDashboard && !isAuth && <Navbar />}
          <main className="min-h-screen flex flex-col ">
            {children}
          </main> 
          {!isDashboard && !isAuth && <Footer />}
        </ThemeProvider>
      </body>
    </html>
  );
}