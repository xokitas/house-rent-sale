import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import DesktopHeader from "@/components/DesktopHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tu Casita - Encuentra tu lugar en Camagüey",
  description: "La forma más sencilla de encontrar propiedades y alojamientos en Camagüey, Cuba.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tu Casita",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E67AD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 pb-16 md:pb-0">
        {/* Cabecera persistente para pantallas medianas/grandes */}
        <DesktopHeader />

        {/* Contenedor principal de la app */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {children}
        </main>

        {/* Navegación inferior persistente para móviles */}
        <BottomNavigation />
      </body>
    </html>
  );
}
