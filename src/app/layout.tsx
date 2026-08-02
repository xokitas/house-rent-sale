import type { Metadata, Viewport } from "next";
import { Poppins, Lato } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import DesktopHeader from "@/components/DesktopHeader";
import { ThemeProvider } from "@/components/ThemeProvider";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
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
    <html lang="es" className={`${poppins.variable} ${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg-main text-text-main pb-16 md:pb-0 font-poppins">
        <ThemeProvider>
          {/* Cabecera persistente para pantallas medianas/grandes */}
          <DesktopHeader />

          {/* Contenedor principal de la app */}
          <main className="flex-1 w-full max-w-xl mx-auto px-4 py-4 md:py-6">
            {children}
          </main>

          {/* Navegación inferior persistente para móviles */}
          <BottomNavigation />
        </ThemeProvider>
      </body>
    </html>
  );
}
