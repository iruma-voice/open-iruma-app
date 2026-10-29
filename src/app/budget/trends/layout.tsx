import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '入間市の財政推移データ',
  description: '入間市の歳入・歳出・基金残高・市債残高・経常収支比率の長期トレンドを可視化したダッシュボードです。',
  openGraph: {
    title: '入間市の財政推移データ | いるまオープン議会',
    description: '入間市の歳入・歳出・基金残高・市債残高・経常収支比率の長期トレンドを可視化したダッシュボードです。',
    images: [{ url: '/images/ogp/budget-trends.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '入間市の財政推移データ | いるまオープン議会',
    description: '入間市の財政推移データをグラフでわかりやすく可視化。',
    images: ['/images/ogp/budget-trends.png'],
  },
};

export default function BudgetTrendsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

