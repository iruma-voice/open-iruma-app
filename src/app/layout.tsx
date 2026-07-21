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

const getBaseUrl = () => {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV === 'development') return 'http://localhost:3000';
  return 'https://open-iruma-app.vercel.app';
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "いるまオープン議会",
    template: "%s | いるまオープン議会",
  },
  description: "入間市の地域課題と議論をわかりやすく",
  manifest: "/manifest.json",
  openGraph: {
    title: "いるまオープン議会",
    description: "入間市議会の議論を、市民の手に。3分要約 × 議論の変遷 × 生の議事録",
    siteName: "いるまオープン議会（非公式）",
    type: "website",
    locale: "ja_JP",
    images: [{ url: "/images/ogp/top.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "いるまオープン議会",
    description: "入間市議会の議論を、市民の手に。",
    images: ["/images/ogp/top.png"],
  },
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
