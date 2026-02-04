import type { Metadata, Viewport, ReactNode } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Menu3D – Menus interactifs en 3D & AR",
  description: "Créez des menus digitaux avec visualisation 3D et réalité augmentée pour votre restaurant.",
  themeColor: "#1a1a1a",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
          async
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
