import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "../components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "いるまオープン議会",
  description: "入間市の地域課題と議論をわかりやすく",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "オープン議会",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-100 flex justify-center min-h-screen pb-20 text-gray-800 text-base`}>
        <div className="w-full max-w-md bg-white min-h-screen shadow-lg relative">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
