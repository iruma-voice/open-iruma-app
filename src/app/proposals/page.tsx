import { Metadata } from 'next';
import ProposalDashboard from '../../components/ProposalDashboard';

export const metadata: Metadata = {
  title: 'みんなの「一般質問」アイデアボード | 入間オープン議会',
  description: '「これ、議会で聞いてほしい！」という課題をシェアし、みんなで「いいね」を集めるアイデアボードです。',
  openGraph: {
    title: 'みんなの「一般質問」アイデアボード | 入間オープン議会',
    description: '市政への課題をシェアして、みんなで「いいね」を集めましょう。',
    type: 'website',
    url: 'https://open-iruma.example.com/proposals',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'みんなの「一般質問」アイデアボード | 入間オープン議会',
    description: '市政への課題をシェアして、みんなで「いいね」を集めましょう。',
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
