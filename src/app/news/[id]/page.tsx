import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ArrowLeft, Megaphone } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { notFound } from 'next/navigation';

// Fetch all news IDs for static generation
export async function generateStaticParams() {
  const dataPath = path.join(process.cwd(), 'src/data/news_data.json');
  try {
    if (fs.existsSync(dataPath)) {
      const newsList = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return newsList.map((item: any) => ({
        id: item.id,
      }));
    }
  } catch (e) {
    console.error('Failed to load news_data.json in generateStaticParams', e);
  }
  return [];
}

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const dataPath = path.join(process.cwd(), 'src/data/news_data.json');
  let newsItem = null;
  
  try {
    if (fs.existsSync(dataPath)) {
      const newsList = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      newsItem = newsList.find((item: any) => item.id === params.id);
    }
  } catch (e) {
    console.error('Failed to load news_data.json');
  }

  if (!newsItem) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/news" className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">一覧へ戻る</span>
          </Link>
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-gray-900" />
            <h1 className="text-sm font-bold text-gray-900 tracking-wider truncate max-w-[150px] sm:max-w-xs">お知らせ詳細</h1>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto bg-white border-x border-b border-gray-200 shadow-sm min-h-[calc(100vh-3.5rem)]">
        <header className="px-5 py-8 sm:px-10 border-b border-gray-100 bg-gray-50/50">
          <time className="text-sm font-mono font-medium text-gray-500 mb-3 block">{newsItem.date.replace(/-/g, '.')}</time>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight border-l-[6px] border-gray-900 pl-4 py-1">
            {newsItem.title}
          </h1>
        </header>

        <div className="px-5 py-8 sm:px-10 sm:py-12 prose prose-sm sm:prose-base prose-gray max-w-none
          prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
          prose-h2:text-xl prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:mb-6
          prose-h3:text-lg prose-h3:text-gray-800
          prose-p:leading-loose prose-p:text-gray-700
          prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4
          prose-li:text-gray-700
          prose-strong:text-gray-900 prose-strong:font-bold
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-gray-700
        ">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {newsItem.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
