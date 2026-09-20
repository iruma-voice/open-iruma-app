import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ArrowLeft, Megaphone } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

// News List Page
export default function NewsPage() {
  const dataPath = path.join(process.cwd(), 'src/data/news_data.json');
  let newsList = [];
  try {
    if (fs.existsSync(dataPath)) {
      newsList = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
  } catch (e) {
    console.error('Failed to load news_data.json');
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">トップへ</span>
          </Link>
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-gray-900" />
            <h1 className="text-sm font-bold text-gray-900 tracking-wider">更新履歴・お知らせ</h1>
          </div>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {newsList.length === 0 ? (
            <p className="text-gray-500 text-center py-10">お知らせが見つかりません</p>
          ) : (
            newsList.map((item: any) => (
              <article key={item.id} className="bg-white border border-gray-200 border-l-[4px] border-l-gray-900 rounded-sm hover:shadow-md transition-shadow group">
                <Link href={`/news/${item.id}`} className="block p-5 sm:p-6">
                  <div className="flex flex-col gap-2">
                    <time className="text-xs font-mono font-medium text-gray-500">{item.date.replace(/-/g, '.')}</time>
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors leading-tight">
                      {item.title}
                    </h2>
                    
                    {/* Preview (First 100 characters of content) */}
                    <div className="text-gray-600 text-sm line-clamp-2 mt-1 leading-relaxed opacity-80">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          h1: () => <></>,
                          h2: () => <></>,
                          h3: () => <></>,
                          h4: () => <></>,
                        }}
                      >
                        {item.content.substring(0, 150) + '...'}
                      </ReactMarkdown>
                    </div>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
