import { Metadata } from 'next';
import OverviewClient from '../../components/OverviewClient';
import overviewData from '../../data/overview_data.json';

export const metadata: Metadata = {
  title: '文章でじっくり読む入間市のいま（市民有志による非公式まとめ）',
  description:
    '入間市の財政・大型建て替え・施設廃止・子育て教育・料金改定の現在地を、議事録と開示公文書の一次ファクトで両面から2分で俯瞰できる市民有志の非公式レポートページです。',
  openGraph: {
    title: '文章でじっくり読む入間市のいま | いるまオープン議会（非公式）',
    description:
      '入間市の財政・大型建て替え・施設廃止・子育て教育・料金改定の現在地を、議事録と開示公文書の一次ファクトで両面から俯瞰する市民有志の非公式まとめ。',
    images: [{ url: '/images/ogp/issues-top.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '文章でじっくり読む入間市のいま | いるまオープン議会（非公式）',
    description:
      '入間市の財政・大型建て替え・施設廃止・子育て教育・料金改定の現在地を2分で俯瞰する市民有志の非公式まとめ。',
    images: ['/images/ogp/issues-top.png'],
  },
};

export default function OverviewPage() {
  return <OverviewClient data={overviewData} />;
}
