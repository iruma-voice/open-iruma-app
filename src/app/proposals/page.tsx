import { Metadata } from 'next';
import ProposalDashboard from '../../components/ProposalDashboard';

export const metadata: Metadata = {
  title: 'みんなの「一般質問」アイデアボード',
  description: '「これ、議会で聞いてほしい！」という課題をシェアし、みんなで「いいね」を集めるアイデアボードです。',
  openGraph: {
    title: 'みんなの「一般質問」アイデアボード | いるまオープン議会',
    description: '市政への課題をシェアして、みんなで「いいね」を集めましょう。',
    type: 'website',
    images: [{ url: '/images/ogp/proposals.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'みんなの「一般質問」アイデアボード | いるまオープン議会',
    description: '市政への課題をシェアして、みんなで「いいね」を集めましょう。',
    images: ['/images/ogp/proposals.png'],
  }
};

export default function ProposalsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* ダッシュボードコンポーネントのマウント */}
        <ProposalDashboard />
      </div>
    </main>
  );
}
