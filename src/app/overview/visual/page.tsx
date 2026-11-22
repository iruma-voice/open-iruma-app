import { Metadata } from 'next';
import OverviewVisualClient from '../../../components/OverviewVisualClient';
import visualData from '../../../data/overview_visual_data.json';

export const metadata: Metadata = {
  title: '開示資料とQ&Aで見る入間市のいま（市民有志による非公式まとめ）',
  description:
    '入間市の財政・大型建て替え・施設廃止・教育子育て・料金改定の現在地を、情報公開請求資料（引用）とQ&A形式で1分で把握できる市民有志の非公式まとめページです。',
  openGraph: {
    title: '開示資料とQ&Aで見る入間市のいま | いるまオープン議会（非公式）',
    description:
      '入間市の財政・大型建て替え・施設廃止・教育子育て・料金改定の現在地を情報公開請求資料（引用）と図解で把握。',
    images: [{ url: '/images/ogp/issues-top.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '開示資料とQ&Aで見る入間市のいま | いるまオープン議会（非公式）',
    description:
      '入間市の現在地を情報公開請求資料（引用）とQ&A比較で1分で把握（市民有志による非公式まとめ）。',
    images: ['/images/ogp/issues-top.png'],
  },
};

export default function OverviewVisualPage() {
  return <OverviewVisualClient data={visualData} />;
}
