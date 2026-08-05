import type { Metadata, Viewport } from "next";
import { Poppins, Lato } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
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
  themeColor: "#1B4D3E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg-main text-text-main pb-24 md:pb-32 font-poppins">
        <ThemeProvider>
          {/* Contenedor principal de la app (Responsive) */}
          <main className="flex-1 w-full max-w-full md:max-w-3xl lg:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
            {children}
          </main>

          {/* Navegación inferior persistente para móviles y dock en desktop */}
          <BottomNavigation />
        </ThemeProvider>
      </body>
    </html>
  );
}
