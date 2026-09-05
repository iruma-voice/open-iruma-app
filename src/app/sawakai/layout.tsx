import { Noto_Sans_JP } from 'next/font/google';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'], // Noto Sans JPの場合はlatinサブセットを指定
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

export default function SawakaiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={notoSansJP.className}>
      {children}
    </div>
  );
}
